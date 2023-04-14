class Events {
    #container

    constructor(container){
        this.#container = container;
        // make the container able to receive key events
        this.#container.tabIndex = 1;
        this.#container.focus();
    }

    addEvent(evt, fct){
        this.#container.addEventListener(evt, fct);
    }
}   

export { Events }