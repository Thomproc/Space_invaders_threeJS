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
    #nbPopupCalled = 0

    #endScreenDiv
    #endScreenTitle
    #endScreenSubTitles
    #gameIsOver = false
    #gameIsWin = false

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

        this.#endScreenDiv = document.getElementById("endScreen");
        this.#endScreenTitle = document.getElementById("endScreenTitle");
        this.#endScreenSubTitles = document.getElementById("endScreenSubTitles");
    }

    showMenuInterface(){
        if(this.#gameIsOver){
            this.hideGameOver();
        }
        else if (this.#gameIsWin){
            this.hideVictory();
        }
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
        this.removeLife(true);
    }

    showEndScreen(HTML_title){
        this.hideGameInterface();

        this.#endScreenDiv.style.visibility = "visible";
        this.#endScreenTitle.innerHTML = HTML_title;
        this.#endScreenDiv.style.animationName = "none";
        this.#endScreenDiv.offsetHeight; // Force la mise à jour du layout pour que la nouvelle animation soit appliquée
        this.#endScreenDiv.style.animationName = "grow";
        
        this.#endScreenSubTitles.style.visibility = "hidden";
        this.#endScreenSubTitles.innerHTML =  "High score : " + config.highScore + "<br>" +  "Score : " + config.score + "<p> Appuyer sur <b>ENTREE</b> pour revenir au menu </p>";
        this.#endScreenDiv.addEventListener("animationend", () => {
            this.#endScreenSubTitles.style.visibility = "visible";
        });
    }

    showGameOver(){
        const HTML_title = "<b style=\"color:rgb(180, 0, 0)\">Game Over</b>";
        this.showEndScreen(HTML_title);
        this.#gameIsOver = true;
    }

    hideGameOver(){
        this.#endScreenDiv.style.visibility = "hidden";
        this.#endScreenSubTitles.style.visibility = "hidden";
        this.#gameIsOver = false;
    }

    gameIsOver(){
        return this.#gameIsOver;
    }

    showVictory(){
        const HTML_title = "<b style=\"color:rgb(255, 255, 255)\">Victoire</b>";
        this.showEndScreen(HTML_title);
        this.#gameIsWin = true;
    }

    hideVictory(){
        this.#endScreenDiv.style.visibility = "hidden";
        this.#endScreenSubTitles.style.visibility = "hidden";
        this.#gameIsWin = false;
    }

    gameIsWin(){
        return this.#gameIsWin;
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

    showPopup(text){
        this.#nbPopupCalled++;
        this.#popupDiv.innerHTML = text;
        this.#popupDiv.style.visibility = "visible";
        setTimeout(() => {
            this.#nbPopupCalled--;
            if(this.#nbPopupCalled == 0) this.#popupDiv.style.visibility = "hidden";
        }, 3000);

    }

    showLife(){
        for (let i = 0; i < config.ship.heatlh; i++) {
            let img = document.createElement("IMG");
            img.src = "src/js/assets/images/heart.png";
            img.style.width = "60px";
            this.#healthDiv.appendChild(img);
        }
    }

    removeLife(all){
        const images = this.#healthDiv.childNodes;
        if(all){
            while(images.length > 0){
                images[0].remove();    
            }
        } else {
            images[images.length - 1].remove();
        }
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
}

export { Interface };