import { config } from "../entities/config";

class Interface {
    #menuDiv
    #highScoreMenuItem
    #scoreMenuItem

    #healthDiv
    #scoreGameDiv

    #informationDiv

    #helpDiv

    #popupDiv

    constructor(){
        this.#menuDiv = document.getElementById("menu");

        const items = this.#menuDiv.getElementsByClassName("item");
        this.#highScoreMenuItem = items[0];
        this.#scoreMenuItem = items[1];

        this.#healthDiv = document.getElementById("health");
        this.#scoreGameDiv = document.getElementById("gameScores");

        this.#informationDiv = document.getElementById("information");

        this.#helpDiv = document.getElementById("help");

        this.#popupDiv = document.getElementById("popup");
    }

    showMenuInterface(){
        this.hideGameInterface();
        this.#menuDiv.style.visibility = "visible";
        this.setMenuScores();
    }

    hideMenuInterface(){
        this.#menuDiv.style.visibility = "hidden";
    }

    showGameInterface(){
        config.score = 0;
        config.scoreCombo = 0;
        this.hideMenuInterface();
        this.showLife();
        this.updateGameScore();
        this.#scoreGameDiv.style.visibility = "visible";
    }

    hideGameInterface(){
        this.#scoreGameDiv.style.visibility = "hidden";
    }

    async showInformation(text){
        this.#informationDiv.innerHTML = text;
        this.#informationDiv.style.visibility = "visible";
    }

    hideInformation(){
        this.#informationDiv.style.visibility = "hidden";
    }

    removeInformation(){
        this.#informationDiv.innerHTML = "";
    }

    showLife(){
        for (let i = 0; i < config.ship.heatlh; i++) {
            let img = document.createElement("IMG");
            img.src = "src/js/assets/images/heart.png";
            this.#healthDiv.appendChild(img);
        }
    }

    removeLife(){
        const images = this.#healthDiv.childNodes;
        images[images.length - 1].remove();
    }

    setMenuScores(){
        this.#scoreMenuItem.textContent = "Score : " + config.score;
        this.#highScoreMenuItem.textContent = "High score : " + config.highScore;
    }

    updateGameScore(){
        this.#scoreGameDiv.innerHTML = "Score : " + config.score + "<br>" + "combo : " + config.scoreCombo;
    }

    help(){
        this.#helpDiv.style.visibility == "hidden" ? this.#helpDiv.style.visibility = "visible" 
                                                    : this.#helpDiv.style.visibility = "hidden";
    }

    showPopup(text){
        this.#popupDiv.innerHTML = text;
        this.#popupDiv.style.visibility = "visible";
        setTimeout(() => {
            this.#popupDiv.style.visibility = "hidden";
        }, 3000);

    }
}

export { Interface };