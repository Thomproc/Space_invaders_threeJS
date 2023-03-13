class LevelsManager {
    #scene
    #loop
    #entitiesManager

    #level

    constructor(scene, loop, entitiesManager){
        this.#scene = scene;
        this.#loop = loop;
        this.#entitiesManager = entitiesManager;

        this.#loop.addUpdatable(this);
    }

    gameStart(){
        this.#level = 1;
        this.#entitiesManager.createShip();
        this.#entitiesManager.createArmy(this.#level);
    }

    tick(){
        if(this.#entitiesManager.enemiesDied()){
            this.#level++;
            console.log("level up !", this.#level);
            this.#entitiesManager.createArmy(this.#level);
        }
        else if(this.#entitiesManager.shipDied()){
            this.gameOver();
        }
    }

    buildLevel(){

    }

    gameOver(){
        this.#loop.pauseResume();
        console.log("you died...");
    }
}

export { LevelsManager }