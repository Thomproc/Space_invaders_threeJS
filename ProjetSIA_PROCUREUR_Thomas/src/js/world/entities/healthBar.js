import * as THREE from 'three';

const pi = Math.PI;

class HealthBar {
    #datas
   
    #currentHealth;

    constructor(width, height, maxHealth, positionY){
        this.#datas = {
            "width": width,
            "height": height,
            "maxHealth": maxHealth,
            "healthBar": null,
        }
        this.#currentHealth = maxHealth;

        // Création de la barre de vie
        const healthBarGeometry = new THREE.PlaneGeometry(width, height);
        const healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0xAA0000 });
        const healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);

        // Positionnement de la barre de vie au dessus de l'ennemi
        healthBar.rotation.y = pi;
        healthBar.position.y = positionY;

        this.#datas.healthBar = healthBar;

        // Création de la barre de vie actuelle
        const healthGeometry = new THREE.PlaneGeometry(this.#datas.width * (this.#currentHealth / this.#datas.maxHealth), height);
        const healthMaterial = new THREE.MeshBasicMaterial({ color: 0x37ff00 });
        const health = new THREE.Mesh(healthGeometry, healthMaterial);

        // Positionnement de la barre de vie actuelle à l'intérieur de la barre de vie
        health.position.set(0, 0, 0.02);

        // Ajout de la barre de vie actuelle à la barre de vie
        healthBar.add(health);
    }

//// Getters et setters
    getModel(){
        return this.#datas.healthBar;
    }

    getHealth(){
        return this.#currentHealth;
    }

    setHealth(val){
        this.#currentHealth = val;
    }

    decreaseHealth(damage){
        this.#currentHealth -= damage;
        this.#datas.healthBar.children[0].scale.x = this.#currentHealth / this.#datas.maxHealth;
    }

}

export { HealthBar }