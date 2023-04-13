import * as THREE from 'three';
import { config } from './config';

const pi = Math.PI;
const clock = new THREE.Clock();

class Environment{
    #scene
    #loop
    #models

    #gameIsWin = false

    #planet

    #nbEnemies = 100
    #enemiesDatas = []
    #enemiesFloatingInterval = 1 // => [-x, x]

    #nbStars = 2000
    #stars

    #maxRadius = 0.2
    #minRadius = 0.1
    #starRadius = Math.random() * (this.#maxRadius - this.#minRadius) + this.#minRadius
    #speed = 0 
    #acceleration = 0.02

    constructor(scene, loop, models){
        this.#scene = scene;
        this.#loop = loop;
        this.#models = models;
    
        const starGeo = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        for(let i = 0; i < this.#nbStars; i++) {
            const x = Math.random() * 4 * config.world.size.width - 2 * config.world.size.width;
            const y = Math.random() * 30 - 15;
            const z = Math.random() * config.world.size.depth - config.world.size.depth / 2;
            positions.push(x, y, z);
            colors.push(1, 1, 1);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
        const starTexture = new THREE.TextureLoader().load('src/js/assets/images/star.png');
        const starMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            size: this.#starRadius,
            map: starTexture,
            transparent: true
        });

        this.#stars = new THREE.Points(starGeo,starMaterial);
        this.#planet = this.#models.getPlanets();
        this.#planet.model.position.set(0, 0, config.world.size.depth + this.#planet.size.z);
        this.#planet.model.rotation.set(-pi / 32, 0, -pi / 8);

        this.#scene.add(this.#stars, this.#planet.model);
        this.#loop.addUpdatable(this);
    }
    

    tick(delta){
        if(this.#gameIsWin){
            this.#enemiesDatas.forEach((enemyDatas, index) => {
                const enemyModel = enemyDatas.model;
                const time = clock.getElapsedTime() + index * 5; // Permet de désynchroniser mes ennemies flottants
                enemyModel.position.y = Math.sin(time) * this.#enemiesFloatingInterval / 2;
                enemyModel.rotation.x += Math.random() / 100;
                enemyModel.rotation.y += Math.random() / 100;
                enemyModel.rotation.z += Math.random() / 100;
            });
        }

        const positions = this.#stars.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            this.#speed += this.#acceleration;
            positions[i + 2] -= this.#speed;
            if (positions[i + 2] < -config.world.size.depth / 2) {
                positions[i + 2] = config.world.size.depth;
                this.#speed = 0;
            }
        }
        this.#stars.geometry.attributes.position.needsUpdate = true;
        this.#planet.mixer.update(delta);
    }

    switchToVictory(){
        for(let i = 0; i < this.#nbEnemies; i++) {
            const enemyDatas = this.#models.getRandomEnemy();
            this.#enemiesDatas.push(enemyDatas);

            enemyDatas.model.position.set(
                Math.random() * 2 * config.world.size.width - config.world.size.width,
                Math.random() * 2 * this.#enemiesFloatingInterval - this.#enemiesFloatingInterval,
                Math.random() * (config.world.size.depth - config.world.size.depth / 5) + config.world.size.depth / 5
            );

            enemyDatas.model.rotation.set(
                Math.random() * 2 * pi - pi,
                Math.random() * 2 * pi - pi,
                Math.random() * 2 * pi - pi
            );
            this.#scene.add(enemyDatas.model);
        }
        this.#gameIsWin = true;
    }

    switchToGame(){
        while(this.#enemiesDatas.length > 0) {
            this.#scene.remove(this.#enemiesDatas[0].model);
            this.#enemiesDatas.splice(0, 1);
        }
        this.#gameIsWin = false;
    }
}

export { Environment }