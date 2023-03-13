const PI = Math.PI;

class Environment{
    #scene
    #loop
    #datas

    #rotationSpeed = 0.0003

    constructor(scene, loop, envDatas){
        this.#scene = scene;
        this.#loop = loop;
        this.#datas = envDatas;

        this.#datas.model.position.z += this.#datas.size.z / 3;
        this.#datas.model.rotation.z = PI / 2;
        this.#scene.add(this.#datas.model);
        this.#loop.addUpdatable(this);
    }

    tick(index){
        this.#datas.model.rotation.x -= this.#rotationSpeed;
    }
}

export { Environment }