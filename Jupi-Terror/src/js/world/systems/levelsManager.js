class LevelsManager {
    #scene
    #loop
    #entitiesManager

    #level
    #gameIsOn = false

    constructor(scene, loop, entitiesManager){
        this.#scene = scene;
        this.#loop = loop;
        this.#entitiesManager = entitiesManager;

        this.#loop.addUpdatable(this);
    }

    gameStart(){
        this.#level = 1;
        this.#entitiesManager.createShields();
        this.#entitiesManager.createArmy(this.#level);
        this.#entitiesManager.gameStart();
        this.#gameIsOn = true;
    }

    tick(){
        if(!this.#gameIsOn){
            return
        }
        if(this.#entitiesManager.enemiesDied()){
            this.#level++;
            this.#entitiesManager.createShields();
            this.#entitiesManager.createArmy(this.#level);
        }
        else if(this.#entitiesManager.shipDied()){
            this.gameOver();
        }
    }

    gameOver(){
        this.#gameIsOn = false;
    }
}

export { LevelsManager }