import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

class Composer {
    #renderer
    #scene
    #camerasManager

    #composer

    constructor(renderer, scene, camerasManager){
        this.#renderer = renderer;
        this.#scene = scene;
        this.#camerasManager = camerasManager;

        this.#composer = new EffectComposer( this.#renderer );
        this.addGlitch();
    }
    
    addGlitch(){
        const renderPass = new RenderPass(this.#scene, this.#camerasManager.getCurrentCamera());
        this.#composer.addPass(renderPass);
        const glitchPass = new GlitchPass();
        this.#composer.addPass(glitchPass);
    }

    render(wild){
        this.#composer.passes[0].camera = this.#camerasManager.getCurrentCamera();
        if(wild) {
            this.#composer.passes[1].curF = 1;
        }
        this.#composer.render();
    }
}

export { Composer }