const embyImage = new Image()
embyImage.src = './img/embySprite.png'

const jamieImage = new Image()
jamieImage.src = './img/draggleSprite.png'

const monsters = {
    Emby: {
        position: {
            x: 300,
            y: 380
        }, 
        image: {
            src: './img/embySprite.png'
        },
        frames: {
            max: 4,
            hold: 80
        },
        animate: true,
        name: 'Emby',
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Cry, attacks.Simp]
    },
    Jamie: {
        position: {
            x: 680,
            y: 200
        }, 
        image: {
            src: './img/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 80
        },
        animate: true,
        isEnemy: true,
        name: 'British boi',
        attacks: [attacks.Tackle]
    }
}



