const worldConfig = {
    "size" : {"width": 15, "depth": 100}
}

const shipConfig = {
    "1": {
        "maxHealth": 30, 
        "speed": 0.1, 
        "shotFreq": 300, //fréquence de tir : 1 balle toutes les ... ms
        "bullet": {
            "dammage": 1,
            "speed": 0.7,
        }
    },
    "2": {
        "maxHealth": 60, 
        "speed": 0.3,
        "shotFreq": 200,
        "bullet": {
            "dammage": 5,
            "speed": 1,
        }
    },
    "3": {
        "maxHealth": 100,
        "speed": 0.5,
        "shotFreq": 100,
        "bullet": {
            "dammage": 10,
            "speed": 1.3
        } 
    }
}

const config = {
    "world" : worldConfig,
    "ship": shipConfig
}

export { config }