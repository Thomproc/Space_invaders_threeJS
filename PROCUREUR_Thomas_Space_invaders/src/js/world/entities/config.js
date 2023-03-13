const worldConfig = {
    "size" : {"width": 20, "depth": 80}
}

const shipConfig = {
    "1": {
        "maxHealth": 30, 
        "speed": 0.1, 
        "shotFreq": 500, //fréquence de tir : 1 balle toutes les ... ms
        "bullet": {
            "damage": 1,
            "speed": 0.7,
        }
    },
    "2": {
        "maxHealth": 60, 
        "speed": 0.3,
        "shotFreq": 200,
        "bullet": {
            "damage": 5,
            "speed": 1,
        }
    },
    "3": {
        "maxHealth": 100,
        "speed": 0.5,
        "shotFreq": 100,
        "bullet": {
            "damage": 10,
            "speed": 1.3
        } 
    }
}

const enemiesConfig = {
    "observer": {
        "health": 1,
        "speed": 0.1,
        "damage": 1
    },
    "kamikaze": {
        "health": 3,
        "speed": 0.2,
        "damage": 1
    }
}

const levelsConfig = {
    1: { //Pour le niveau 1
        "enemies": {
            "structure": { // Pour cette structure, on a une armée composée de 3 bataillons
                // le bataillon du fond est composée de 7 "observer"
                // le bataillon du milieu est composée de 5 "kamikaze"
                // le bataillon de devant est composée de 3 "observer"
                "nbBattalions": 3,
                "types": ["observer", "kamikaze", "observer"],
                "nbEnemiesPerBattalion": [3, 2, 7]
            },
            "structure2": [
                ["observer", "kamikaze", "observer"]
            ]
        }
    },
    2: {
        "enemies": {
            "kamikaze": 7,
        }
    },
    3: {}
}

const config = {
    "world" : worldConfig,
    "ship": shipConfig,
    "enemies": enemiesConfig,
    "levels": levelsConfig
}

export { config }