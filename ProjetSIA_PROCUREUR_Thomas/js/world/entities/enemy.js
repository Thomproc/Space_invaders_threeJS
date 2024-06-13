import * as THREE from 'three';
import { config } from './config'
import { getMeshFromModel, sumVectors } from '../systems/utils'
import { HealthBar } from './healthBar';

const enemyBox = new THREE.Box3();

class Enemy {
    #scene
    #sounds
    #IHM
    #datas
    #meshes
    #enemyGroup = new THREE.Group()

    #type
    #healthBar
    #isDead = false
    #isDying = false

    #dyingSpeed = 50
    #rotationSpeed = 10

    constructor(scene, sounds, IHM, enemyDatas, type){
        this.#scene = scene;
        this.#sounds = sounds;
        this.#IHM = IHM;
        this.#datas = enemyDatas;
        this.#meshes = getMeshFromModel(this.#datas.model);

        this.#meshes.forEach(mesh => {
            mesh.material.emissiveIntensity = 2; // Permet de renforcer une couleur de mon material            
        });
        this.#type = type;

        this.#healthBar = new HealthBar(this.#datas.size.x, 0.1, config.enemies[this.#type].health, this.#datas.size.y / 1.2);

        this.#enemyGroup.add(this.#datas.model, this.#healthBar.getModel());
    }

    tick(delta){
        this.animate(delta);
        if(this.#isDying){
            const model = this.getModel();
            model.position.z += this.#dyingSpeed * delta;
            
            model.rotation.x += this.#rotationSpeed * delta;
            if(model.position.z > 1.5 * config.world.size.depth){
                this.delete();
            }
        }
    }

    addPoint(){
        // Création d'un canvas
        const canvas = document.createElement('canvas');
        canvas.width = 70;
        canvas.height = 50;

        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 20px Copperplate, Copperplate Gothic Light, fantasy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = config.enemies[this.#type].point + " pts";
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y);

        // Utilisation du canvas comme texture
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);


        sprite.position.y -= 2;
        this.#enemyGroup.add(sprite);
    }

    collisionWithEnemy(hitContainer, damage){
        enemyBox.setFromObject(this.#datas.model);
        if(hitContainer instanceof THREE.Box3 && enemyBox.intersectsBox(hitContainer) || hitContainer instanceof THREE.Sphere && enemyBox.intersectsSphere(hitContainer)){
            this.hit(damage);
            return true;
        }
        return false;
    }

    animate(delta){
        this.#datas.mixer.update(delta);
    }

    hit(damage){
        if(damage == "all"){
            this.#healthBar.setHealth(0);
        }
        else {
            this.#healthBar.decreaseHealth(damage);
        }
        if(this.#healthBar.getHealth() <= 0){
            this.#isDying = true;
            this.#enemyGroup.remove(this.#healthBar.getModel());
            this.extractFromParents();
            config.score += config.enemies[this.#type].point;
            config.scoreCombo += config.enemies[this.#type].point;
            this.#IHM.updateGameScore();
            this.#sounds.enemyDyingSound();
        }
        else {
            this.#sounds.enemyHitSound();
        }
    }

    extractFromParents(){
        const absolutePosition = this.getWordlPosition();
        const enemyModel = this.getModel();
        const battalion = enemyModel.parent;
        
        battalion.remove(enemyModel);
        this.#scene.add(enemyModel);
        this.setPosition(absolutePosition);
    }

    isDying(){
        return this.#isDying;
    }

    isDead(){
        return this.#isDead;
    }

//// Getters et setters
    getHealth(){
        return this.#healthBar.getHealth();
    }

    getType(){
        return this.#type;
    }

    getPoint(){
        return config.enemies[this.#type].point;
    }

    getPosition(){
        return this.#enemyGroup.position;
    }

    getWordlPosition(){
        const battalion = this.getModel().parent;
        const army = battalion.parent;
        const absolutePosition = sumVectors([this.getPosition(), battalion.position, army.position]);
        return absolutePosition;
    }

    getSize(){
        return this.#datas.size;
    }

    getModel(){
        return this.#enemyGroup;
    }

    setPosition(newPosition){
        this.#enemyGroup.position.copy(newPosition);
    }

//// Destructeur 
    delete(){
        this.#isDead = true;
        this.#scene.remove(this.getModel());
    }

}

export { Enemy }