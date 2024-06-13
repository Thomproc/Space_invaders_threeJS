import * as THREE from 'three';
import { config } from './config'
import { getMeshFromModel, sumVectors } from '../systems/utils';
import { Bullet } from './bullet';

const pi = Math.PI;

//Contient toutes les fonctions nécessaires à la manipulation du vaisseau.
//Cet objet sert aussi de manager pour les tirs (bullets). 
const shipBox = new THREE.Box3();
class Ship {
    #scene
    #sounds
    #IHM
    #loop
    #datas //données de l'objet 3d : modèle, taille du modèle, le mixer, les durées pour chaque sous animation, les timecodes dans l'animation pour chaque vaisseau, l'animation et le sens de l'animation

    #lvl = 1
    #properties = config.ship[this.#lvl] //capacités du vaisseau dépendant de son niveau
    #cameraDatas //contient le numéro de caméra et la fonction pour mettre à jour sa position
    #collisionDetection
    #slowFactor = 10 // Puissance du ralenti quand le vaisseau est en animation 
    
    //attributs liés à la mobilité du vaisseau
    #rotation = pi / 16 //inclinaison du vaisseau dans les virages
    #move = { "left" : false, "right" : false } //J'ai choisi d'utiliser des booléens afin de fluidifier les déplacements du vaisseau (boucle d'animation plus rapide que les évènements)
    #boundaries = {"left" : config.world.size.width / 2, "right": - config.world.size.width / 2}

    //attributs liés aux capacités du vaisseau (indépendant de son niveau)
    #health
    #invicible = false
    
    //attributs liés aux attaques du vaisseau 
    #bullets = []
    #lastShotTime = 0 //temps écoulé entre deux tirs
    #animationFrameID = null //permet de synchroniser les tirs avec le rendu graphique

    constructor(scene, sounds, IHM, loop, shipDatas, cameraDatas, collisionDetection, name){
        this.#scene = scene;
        this.#sounds = sounds;
        this.#IHM = IHM;
        this.#loop = loop;
        this.#datas = shipDatas;

        const meshes = getMeshFromModel(this.#datas.model);
        meshes.forEach(mesh => {
            mesh.material.emissiveIntensity = 3;
        });

        this.#datas.model.position.set(0, 0, this.#datas.size.z / 3);
        this.#cameraDatas = cameraDatas;
        this.#cameraDatas.updateCameraPosition(this.#cameraDatas.index, sumVectors([this.#cameraDatas.offset, this.#datas.model.position]));
        this.#datas.model.name = name;
        this.#collisionDetection = collisionDetection;
        this.#scene.add(this.#datas.model);
    }

    tick(delta){
        let cameraPosition = new THREE.Vector3().copy(this.#cameraDatas.offset);
        const speed = this.#properties.speed * delta;
        if(this.#move.left){
            const distFromLeftBoundary = Math.abs(this.#datas.model.position.x - this.#boundaries.left);
            //Si on est près de la limite gauche
            if(distFromLeftBoundary <= speed){
                //On colle le vaisseau à la frontière
                this.#datas.model.position.x = this.#boundaries.left;
            }
            else{
                this.#datas.model.position.x += speed;
            }
            this.#cameraDatas.updateCameraPosition(this.#cameraDatas.index, cameraPosition.add(this.#datas.model.position));
        }
        if(this.#move.right){
            cameraPosition.copy(this.#cameraDatas.offset); // On remet la position de la caméra pour éviter des effets de bords quand le vaisseau va à droite ET gauche
            const distFromRightBoundary = Math.abs(this.#datas.model.position.x - this.#boundaries.right);
            //Si on est près de la limite droite
            if(distFromRightBoundary <= speed){
                //On colle le vaisseau à la frontière
                this.#datas.model.position.x = this.#boundaries.right;
            }
            else{
                this.#datas.model.position.x -= speed;
            }
            this.#cameraDatas.updateCameraPosition(this.#cameraDatas.index, cameraPosition.add(this.#datas.model.position));
        }

        // Le vaisseau s'améliore si le joueur obtient un certains nombre de points sans se faire toucher par les ennemis
        if(this.#lvl != 3 && config.scoreCombo >= config.ship[this.#lvl + 1].scoreCombo){
            this.upgrade();
        }

        
        //Mise à jour des balles
        this.#bullets.forEach((bullet, index) => {
            //Si une balle sort du monde ou si elle touche un ennemi
            if(bullet.outOfWorld()){
                this.deleteBullet(bullet, index);
            }
            else if(this.#collisionDetection(bullet)){
                this.deleteBullet(bullet, index);
            }
            else{
                if(this.isOnAnimation()){
                    bullet.tick(delta / this.#slowFactor);
                }
                else {
                    bullet.tick(delta);
                }

            }
        });
        this.animate(delta);
    }

    hit(damage){
        if(!this.#invicible){
            this.#health -= damage;
            if(this.#health > 0){
                this.#sounds.shipHitSound();
                this.downgrade();
            }
            config.scoreCombo = 0;
            this.#IHM.removeLife(false);
            this.#IHM.updateGameScore();
            this.#loop.displayGlitchEffect();
        }
    }


////Méthodes liées aux déplacements du vaisseau
    moveLeft(val){
        //Si le vaisseau change d'état : s'arrête ou se met en mouvement
        if(this.#move.left != val){
            //Si le vaisseau se met en mouvement, alors on le fait pivoter
            if(val){
                this.#datas.model.rotation.z -= this.#rotation;
            }
            //Sinon on le remet droit 
            else {
                this.#datas.model.rotation.z += this.#rotation;
            }
            this.#move.left = val;
        }
    }

    moveRight(val){
         //Si le vaisseau change d'état : s'arrête ou se met en mouvement
         if(this.#move.right != val){
            //Si le vaisseau se met en mouvement, alors on le fait pivoter
            if(val){
                this.#datas.model.rotation.z += this.#rotation;
            }
            //Sinon on le remet droit 
            else {
                this.#datas.model.rotation.z -= this.#rotation;
            }
            this.#move.right = val;
        }
    }

/////Méthodes liées aux attaques du vaisseau 
    setIsShooting(val){
        //Si on tire et que le vaisseau n'est pas en pleine animation et qu'on n'a pas encore définit une fonction à appeler selon la fréquence de tir
        if(val && !this.isOnAnimation() && !this.#animationFrameID){
            //On appelle la fonction "shoot" toutes les x ms
            this.#animationFrameID = requestAnimationFrame(() => this.shoot());
        }
        //Sinon si on arrete de tirer on supprime l'appel récurent à la fonction "shoot"
        else if(!val){
            cancelAnimationFrame(this.#animationFrameID);
            this.#animationFrameID = null;
        }
    }

    shoot(){
        if(!this.isOnAnimation()) {
            const currentTime = Date.now(); 
            if(currentTime - this.#lastShotTime >= this.#properties.shotFreq){
                this.createBullet();
                this.#sounds.shipShotSound(true);
            }
            this.#animationFrameID = requestAnimationFrame(() => this.shoot());
        }
    }

    createBullet(){
        const bulletPosition = new THREE.Vector3(this.#datas.model.position.x, 0, 1.5); //1.5 : permet de positionner la balle au bout du vaisseau
        const bullet = new Bullet(this.#scene, "player", bulletPosition, this.#properties.bullet.speed, this.#properties.bullet.damage);
        this.#bullets.push(bullet);
        this.#lastShotTime = Date.now();
    }

    deleteBullet(bullet, index){
        this.#bullets.splice(index, 1);
        this.#scene.remove(bullet.getMesh());
    }

    deleteBullets(){
        while(this.#bullets.length > 0){
            const bullet = this.#bullets[0];
            this.deleteBullet(bullet, 0);
        }
    }

/////Méthodes liées à l'animation du vaisseau
    upgrade(){
        if(this.#lvl != 3 && this.#datas.animation.paused){
            this.#lvl++;
            this.#datas.reversedAnimation = true;
            this.setAnimation(this.#datas.durations.upgrade[this.#lvl]);
        }
    }

    downgrade(){
        if(this.#lvl != 1 && this.#datas.animation.paused){   
            this.#lvl--;
            this.#datas.reversedAnimation = false;
            this.setAnimation(this.#datas.durations.downgrade[this.#lvl]);
        }
    }

    setAnimation(duration){
        this.#sounds.shipTransformationSound();
        const wasInvicible = this.#invicible;
        if (!wasInvicible) this.switchInvicibleMode();
        this.#datas.animation.paused = false;
        setTimeout(() => {
            this.#datas.mixer.setTime(this.#datas.timeCodes[this.#lvl]);
            this.#datas.animation.paused = true;
            this.#properties = config.ship[this.#lvl]; // On met à jour les capacités du vaisseau quand l'animation est terminée
            if (!wasInvicible) this.switchInvicibleMode();
          }, duration
        );
    }

    animate(delta){
        this.#datas.reversedAnimation ? this.#datas.mixer.update(-delta) : this.#datas.mixer.update(delta);
    }

    isOnAnimation(){
        return !this.#datas.animation.paused;
    }

    resetUpgrade(){
        this.#lvl = 1;
        this.#properties = config.ship[this.#lvl];
        this.#datas.animation.paused = false;
        this.#datas.mixer.setTime(this.#datas.timeCodes[this.#lvl]);
        this.#datas.mixer.update(0.01);
        this.#datas.animation.paused = true;
    }

////Getters et setters
    getHealth(){
        return this.#health;
    }

    getBox(){
        shipBox.setFromObject(this.#datas.model);
        const expandBoxVector = new THREE.Vector3(config.ship[this.#lvl].expandBoxVector.x, 0, config.ship[this.#lvl].expandBoxVector.z); //Permet d'affiner la taille de la hit box
        shipBox.expandByVector(expandBoxVector);
        shipBox.min.z = -1.5;
        return shipBox;
    }

    getSlowFactor(){
        return this.#slowFactor;
    }

    isInvicible(){
        return this.#invicible;
    }

    resetHealth(){
        this.#health = config.ship.heatlh;
    }

    switchInvicibleMode(){
        this.#invicible = !this.#invicible;
    }
}

export { Ship }