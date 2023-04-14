class SoundManager{
    #ambienceMusic
    #gameOver

    // Sons du vaisseau
    #shipShot
    #shipTransformation
    #shipHitSound

    // Sons des boucliers
    #hitMetal

    // Sons des ennemis
    #enemyShot
    #enemyHit
    #enemyDying

    constructor(){
        this.#ambienceMusic = new Audio('src/js/assets/media/ambience.mp3');
        this.#ambienceMusic.load();
        this.#ambienceMusic.autoplay = true;
        this.#ambienceMusic.loop = true;

        this.#gameOver = new Audio('src/js/assets/media/gameOver.mp3');
        this.#gameOver.load();

        // Sons du vaisseau
        this.#shipShot = new Audio('src/js/assets/media/shipShot.mp3');
        this.#shipShot.load();

        this.#shipTransformation = new Audio('src/js/assets/media/shipTransformation.mp3');
        this.#shipTransformation.load();
        this.#shipTransformation.playbackRate = 1.85;

        // Sons des boucliers
        this.#shipHitSound = new Audio('src/js/assets/media/shipHit.mp3');
        this.#shipHitSound.load();

        // Sons des ennemis
        this.#hitMetal = new Audio('src/js/assets/media/hit_metal.mp3');
        this.#hitMetal.load();
        this.#hitMetal.volume = 0.75;
        
        this.#enemyShot = new Audio('src/js/assets/media/enemyShot.mp3');
        this.#enemyShot.load();
        this.#enemyShot.volume = 0.5;

        this.#enemyHit = new Audio('src/js/assets/media/enemyHit.mp3')
        this.#enemyHit.load();

        this.#enemyDying = new Audio('src/js/assets/media/enemyDying.mp3');
        this.#enemyDying.load();
    }

    ambienceMusic(play){
        if(play){
            this.#ambienceMusic.pause();
            this.#ambienceMusic.currentTime = 0;
            this.#ambienceMusic.play();
        }
        else {
            this.#ambienceMusic.pause();
        }
    }

    enableOrDisableAmbienceMusic(){
        this.ambienceMusic(this.#ambienceMusic.paused);
        return !this.#ambienceMusic.paused;
    }

    shipShotSound(play){
        if(play){
            this.#shipShot.pause();
            this.#shipShot.currentTime = 0;
            this.#shipShot.play();
        }
        else {
            this.#shipShot.pause();
        }
    }

    shipTransformationSound(){
        this.#shipTransformation.pause();
        this.#shipTransformation.currentTime = 0;
        this.#shipTransformation.play();
    }

    shipHitSound(){
        this.#shipHitSound.pause();
        this.#shipHitSound.currentTime = 0;
        this.#shipHitSound.play();
    }

    gameOverSound(){
        this.#gameOver.pause();
        this.#gameOver.currentTime = 0;
        this.#gameOver.play();
    }

    metalSound(){
        this.#hitMetal.pause();
        this.#hitMetal.currentTime = 0;
        this.#hitMetal.play();
    }

    enemyShotSound(play){
        if(play){
            this.#enemyShot.pause();
            this.#enemyShot.currentTime = 0;
            this.#enemyShot.play();
        }
        else {
            this.#enemyShot.pause();
        }
    }

    enemyHitSound(){
        this.#enemyHit.pause();
        this.#enemyHit.currentTime = 0;
        this.#enemyHit.play();
    }

    enemyDyingSound(){
        this.#enemyDying.pause();
        this.#enemyDying.currentTime = 0;
        this.#enemyDying.play();
    }
}

export { SoundManager }