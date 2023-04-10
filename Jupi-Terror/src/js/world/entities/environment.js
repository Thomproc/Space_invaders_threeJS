import * as THREE from 'three';
import { config } from './config';

const pi = Math.PI;

class Environment{
    #scene
    #loop
    #models

    #planet

    #nbStars = 2000
    #stars

    #maxRadius = 0.2
    #minRadius = 0.1
    #starRadius = Math.random() % (this.#maxRadius - this.#minRadius) + this.#minRadius
    #speed = 0 
    #acceleration = 0.2

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
}

export { Environment }