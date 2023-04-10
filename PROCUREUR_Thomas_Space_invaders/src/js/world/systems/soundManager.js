class SoundManager{
    // Player sounds
    #shipShot
    #shipTransformation
    #shipHitSound

    // Shields sounds
    #hitMetal

    // Enemy sounds
    #enemyShot
    #enemyHit
    #enemyDying


    constructor(){
        this.#shipShot = new Audio('src/js/assets/media/shipShot.mp3');
        this.#shipShot.load();

        this.#shipTransformation = new Audio('src/js/assets/media/shipTransformation.mp3');
        this.#shipTransformation.load();
        this.#shipTransformation.playbackRate = 1.85;

        this.#shipHitSound = new Audio('src/js/assets/media/shipHit.mp3');
        this.#shipHitSound.load();

        this.#hitMetal = new Audio('src/js/assets/media/hit_metal.mp3');
        this.#hitMetal.load();
        this.#hitMetal.volume = 0.75;
        
        this.#enemyShot = new Audio('src/js/assets/media/enemyShot.mp3');
        this.#enemyShot.load();
        this.#enemyShot.volume = 0.25;

        this.#enemyHit = new Audio('src/js/assets/media/enemyHit.mp3')
        this.#enemyHit.load();
        // this.#enemyHit.volume = ;

        this.#enemyDying = new Audio('src/js/assets/media/enemyDying.mp3');
        this.#enemyDying.load();
        this.#enemyDying.volume = 0.15;
    }

    shipShotSound(play){
        if(play){
            this.#shipShot.pause();
            this.#shipShot.currentTime = 0;
            this.#shipShot.play();
        }
        else {
            this.#shipShot.pause();
            this.#shipShot.currentTime = 0;
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
            this.#enemyShot.currentTime = 0;
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

// class SoundManager {
//     constructor() {
//         this.context = new AudioContext();
//         this.sounds = new Map();
//         this.loadSounds();
//     }

//     async loadSounds() {
//         const files = ['src/js/assets/media/shipShot.mp3', 'src/js/assets/media/shipTransformation.mp3', 'src/js/assets/media/shipHit.mp3', 'src/js/assets/media/hit_metal.mp3', 'src/js/assets/media/enemyShot.mp3', 'src/js/assets/media/enemyDying.mp3'];

//         for (const file of files) {
//             const response = await fetch(file);
//             const arrayBuffer = await response.arrayBuffer();
//             const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
//             this.sounds.set(file, audioBuffer);
//         }
//     }

//     playSound(file) {
//         const source = this.context.createBufferSource();
//         source.buffer = this.sounds.get(file);
//         source.connect(this.context.destination);
//         source.start();
//     }

//     shipShotSound(play){
//         if(play){
//             this.playSound('src/js/assets/media/shipShot.mp3');
//         }
//         // else {
//         //     this.#shipShot.pause();
//         // }
//     }

//     shipTransformationSound(){
//         // this.#shipTransformation.pause();
//         // this.#shipTransformation.currentTime = 0;
//         // this.#shipTransformation.play();
//     }

//     shipHitSound(){
//         // this.#hitSound.pause();
//         // this.#hitSound.currentTime = 0;
//         // this.#hitSound.play();
//     }

//     metalSound(){
//         // this.#hitMetal.pause();
//         // this.#hitMetal.currentTime = 0;
//         // this.#hitMetal.play();
//     }

//     enemyShotSound(){
//         // this.#enemyShot.pause();
//         // this.#enemyShot.currentTime = 0;
//         // this.#enemyShot.play();
//     }

//     enemyDyingSound(){
//         // this.#enemyDying.pause();
//         // this.#enemyDying.currentTime = 0;
//         // this.#enemyDying.play();
//     }
// }

// export { SoundManager }
