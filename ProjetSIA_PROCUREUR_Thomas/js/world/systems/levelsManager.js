import { config } from "../entities/config"

class LevelsManager {
    #scene
    #loop
    #entitiesManager
    #IHM
    #levelMax = Object.keys(config.levels).length - 1

    #level
    #gameIsOn = false

    constructor(scene, loop, entitiesManager, IHM){
        this.#scene = scene;
        this.#loop = loop;
        this.#entitiesManager = entitiesManager;
        this.#IHM = IHM;

        this.#loop.addUpdatable(this);
    }

    async gameStart(){
        this.#level = 1;
        await this.transition();
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
            if(this.#level <= this.#levelMax){
                this.transition();
                this.#entitiesManager.createShields();
                this.#entitiesManager.createArmy(this.#level);
            }
            else {
                this.victory();
            }
        }
        else if(this.#entitiesManager.shipDied()){
            this.gameOver();
        }
    }

    async transition(){
        this.#IHM.showInformation("Level " + this.#level);
        setTimeout(
            () => {
                this.#IHM.hideInformation();
                this.#loop.resume();
                this.#entitiesManager.setArmyShot();
            }, 1000
        );
    }

    gameOver(){
        this.#gameIsOn = false;
    }

    victory(){
        this.#gameIsOn = false;
        this.#entitiesManager.gameWin();
    }
}

export { LevelsManager }