import * as THREE from 'three';
import { config } from './config'
import { sumVectors } from '../systems/utils';
import { Bullet } from './bullet';

const pi = Math.PI;
const clock = new THREE.Clock();

//Contient toutes les fonctions nécessaires à la manipulation du vaisseau.
//Cet objet sert aussi de manager pour les tirs (bullets). 
class Ship {
    #scene
    #loop
    #datas //données de l'objet 3d : modèle, taille du modèle, le mixer, les durées pour chaque sous animation, les timecodes dans l'animation pour chaque vaisseau, l'animation et le sens de l'animation
    #lvl = 1
    #properties = config.ship[this.#lvl] //capacités du vaisseau dépendant de son niveau
    #cameraDatas //contient le numéro de caméra et la fonction pour mettre à jour sa position 
    
    //attributs liés à la mobilité du vaisseau
    #rotation = pi / 16 //inclinaison du vaisseau dans les virages
    #move = { "left" : false, "right" : false } //J'ai choisi d'utiliser des booléens afin de fluidifier les déplacements du vaisseau (boucle d'animation plus rapide que les évènements)
    #boundaries = {"left" : config.world.size.width / 2, "right": - config.world.size.width / 2}

    //attributs liés aux capacités du vaisseau (indépendant de son niveau)
    #health = 3;
    
    //attributs liés aux attaques du vaisseau 
    #lastShotTime = 0 //temps écoulé entre deux tirs
    #animationFrameID = null //permet de synchroniser les tirs avec le rendu graphique


    constructor(scene, loop, shipDatas, cameraDatas, name){
        this.#scene = scene;
        this.#loop = loop;
        this.#datas = shipDatas;
        this.#datas.model.position.set(0, 0, this.#datas.size.z / 3);
        this.#cameraDatas = cameraDatas;
        this.#cameraDatas.updateCameraPosition(this.#cameraDatas.index, sumVectors(this.#cameraDatas.offset, this.#datas.model.position));
        this.#datas.model.name = name;
        this.#scene.add(this.#datas.model);
        this.#loop.addUpdatable(this);
    }

    tick(index){
        let cameraPosition = new THREE.Vector3().copy(this.#cameraDatas.offset);
        if(this.#move.left){
            const distFromLeftBoundary = Math.abs(this.#datas.model.position.x - this.#boundaries.left);
            //Si on est près de la limite gauche
            if(distFromLeftBoundary <= this.#properties.speed){
                //On colle le vaisseau à la frontière
                this.#datas.model.position.x = this.#boundaries.left;
            }
            else{
                this.#datas.model.position.x += this.#properties.speed;
            }
            this.#cameraDatas.updateCameraPosition(this.#cameraDatas.index, cameraPosition.add(this.#datas.model.position));
        }
        if(this.#move.right){
            cameraPosition.copy(this.#cameraDatas.offset); // On remet la position de la caméra pour éviter des effets de bords quand le vaisseau va à droite ET gauche
            const distFromRightBoundary = Math.abs(this.#datas.model.position.x - this.#boundaries.right);
            //Si on est près de la limite droite
            if(distFromRightBoundary <= this.#properties.speed){
                //On colle le vaisseau à la frontière
                this.#datas.model.position.x = this.#boundaries.right;
            }
            else{
                this.#datas.model.position.x -= this.#properties.speed;
            }
            this.#cameraDatas.updateCameraPosition(this.#cameraDatas.index, cameraPosition.add(this.#datas.model.position));
        }

        this.animate();
    }

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

    setIsShooting(val){
        //Si on tire et qu'on n'a pas encore définit une fonction à appeler selon la fréquence de tir
        if(val && !this.#animationFrameID){
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
        const currentTime = Date.now(); 
        if(currentTime - this.#lastShotTime >= this.#properties.shotFreq){
            const bulletPosition = new THREE.Vector3(this.#datas.model.position.x, 0, this.#datas.size.z / 10);
            const bullet = new Bullet(this.#scene, this.#loop, bulletPosition, this.#properties.bullet.speed, this.#properties.bullet.dammage);
            this.#lastShotTime = currentTime;
        }
        this.#animationFrameID = requestAnimationFrame(() => this.shoot());
    }

    upgrade(){
        if(this.#lvl != 3){
            this.#lvl++;
            this.#properties = config.ship[this.#lvl];
            this.#datas.reversedAnimation = true;
            this.setAnimation(this.#datas.durations.upgrade[this.#lvl]);
        } else{
            console.log("max");
        }
    }

    downgrade(){
        if(this.#lvl != 1){
            this.#lvl--;
            this.#properties = config.ship[this.#lvl];
            this.#datas.reversedAnimation = false;
            this.setAnimation(this.#datas.durations.downgrade[this.#lvl]);
        }
        else{
            console.log("dead");
        }
    }

    setAnimation(duration){
        this.#datas.animation.paused = false;
        setTimeout(() => {
            this.#datas.mixer.setTime(this.#datas.timeCodes[this.#lvl]);
            console.log("time : ", this.#datas.animation.time);
            this.#datas.animation.paused = true;
          }, duration / this.#datas.animationSpeed // Permet d'harmoniser la vitesse d'exécution de l'animation en fonction de sa durée
        );
    }

    animate(){
        const delta = clock.getDelta();
        this.#datas.reversedAnimation ? this.#datas.mixer.update(-delta * this.#datas.animationSpeed) : this.#datas.mixer.update(delta * this.#datas.animationSpeed);
    }
}

export { Ship }