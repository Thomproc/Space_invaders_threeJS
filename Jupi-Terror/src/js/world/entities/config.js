const worldConfig = {
    "size" : {"width": 25, "depth": 100}
};

const shipConfig = {
    "heatlh": 3,
    "1": {
        "speed": 5, 
        "shotFreq": 1000, //fréquence de tir : 1 balle toutes les ... ms
        "bullet": {
            "damage": 1,
            "speed": 80
        },
        "expandBoxVector": { //Permet d'affiner la boite de collision
            "x": -2.1,
            "z": -4
        }
    },
    "2": {
        "speed": 10,
        "shotFreq": 500,
        "bullet": {
            "damage": 1,
            "speed": 90
        },
        "expandBoxVector": { //Permet d'affiner la boite de collision
            "x": -0.5,
            "z": -1.7
        }
    },
    "3": {
        "speed": 20,
        "shotFreq": 300,
        "bullet": {
            "damage": 2,
            "speed": 100
        },
        "expandBoxVector": { //Permet d'affiner la boite de collision
            "x": -1.6,
            "z": -4.2        
        }
    }
};

const shieldConfig = {
    "number": 3,
    "radius": 1.5,
    "rotationSpeed": 0.5
};

const enemiesConfig = {
    "observer": {
        "point": 10,
        "health": 1,
        "bulletSpeed" : 30
    },
    "kamikaze": {
        "point": 20,
        "health": 2,
        "bulletSpeed" : 60
    },
    "roller": {
        "point": 30,
        "health": 3,
        "bulletSpeed" : 80
    }
};

const levelsConfig = {
    0: { // Pas un niveau mais utile pour la présentation des ennemis dans le menu
        "enemies": {
            "structure": [
                ["observer", "kamikaze", "roller"], // Bataillon le plus au fond
            ]
        }
    },
    1: { // Armée d'ennemis pour le niveau 1
        "enemies": {
            "structure": [ // Exemple d'armée en formation triangle -> null permet de spécifier qu'il n'y a aucun enemi mais qu'on souhaite considérer l'espacement
                ["observer", null, "kamikaze",  null, "observer"], // Bataillon le plus au fond
                [null, "kamikaze", null, "kamikaze", null],
                [null, null, "observer", null, null] // Bataillon le plus en avant
            ]
        }
    },
    2: {
        "enemies": {
            "structure": [
                ["observer", "kamikaze", "kamikaze", "observer"], 
                ["kamikaze", null, null, "kamikaze"],
                ["observer", null, null, "observer"],
                ["roller", "observer", "observer", "roller"]
            ]
        }
    },
    3: {
        "enemies": {
            "structure": [
                ["roller", null, "observer", null, "roller"], 
                [null, "roller", null, "roller", null],
                ["kamikaze", null, "roller", null, "kamikaze"],
                [null, "roller", null, "roller", null],
                ["roller", null, "observer", null, "roller"]
            ]
        }
    }
};

const config = {
    "world" : worldConfig,
    "ship": shipConfig,
    "shield": shieldConfig,
    "enemies": enemiesConfig,
    "levels": levelsConfig,
    "highScore": 0,
    "score": 0,
    "scoreCombo": 0
};

export { config }