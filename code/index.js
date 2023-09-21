const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i +=70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i +=70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const charactersMap = []
for (let i = 0; i < characterMapData.length; i +=70) {
    charactersMap.push(characterMapData.slice(i, 70 + i))
}

console.log(charactersMap)

const boundaries = []
const offset = {
    x: -500,
    y: -490
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 11265) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 11265) {
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const characters = []
const villagerImg = new Image()
villagerImg.src = './img/villagerIdle.png'

charactersMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 11269) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
            characters.push(
                new Sprite({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    },
                    image: villagerImg,
                    frames: {
                        max: 4,
                        hold: 50
                    },
                    scale: 3, 
                    animate: true
                })
            )
        }
    })
})

console.log(characters)

const image = new Image()
image.src = './img/basemap.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - (192 / 4 ) / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    }, 
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    }, 
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    q: {
        pressed: false
    }
}

const movables = [
    background, 
    ...boundaries, 
    foreground, 
    ...battleZones, 
    ...characters
]
const renderables = [
    background, 
    ...boundaries, 
    ...battleZones,
    ...characters, 
    player, 
    foreground
]

const battle = {
    initiated: false
}

function animate () {
    const animationId = window.requestAnimationFrame(animate)

     renderables.forEach((renderable) => {
        renderable.draw()
    }) 

    let moving = true
    player.animate = false

    if(battle.initiated) return

    // activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = 
            (Math.min(
                player.position.x + player.width, 
                battleZone.position.x + battleZone.width
                ) -
                Math.max(player.position.x, battleZone.position.x)) * 
            (Math.min(
                player.position.y + player.height, 
                battleZone.position.y + battleZone.height
            ) - 
                Math.max(player.position.y, battleZone.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2
                && Math.random() < 0.05
            ) {
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId)

                audio.Map.stop()

                audio.initBattle.play()
                audio.battle.play()

                battle.initiated = true
                gsap.to('#battleStartAnimation', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true, 
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#battleStartAnimation', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // activate a new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to('#battleStartAnimation', {
                                    opacity: 0,
                                    duration: 0.4
                                })      
                            }
                        })
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed && lastKey ==='w') {
        player.animate = true
        player.image = player.sprites.up

        // monitor for character collision 
        checkForChacracterCollision({
            characters, 
            player, 
            characterOffset: {x: 0, y: 3}
        })

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving) {
            movables.forEach((movable) => {
                movable.position.y +=5
            }) 
        }

    } 
    else if (keys.a.pressed && lastKey ==='a') {
        player.animate = true
        player.image = player.sprites.left

        checkForChacracterCollision({
            characters, 
            player, 
            characterOffset: {x: 150, y: 0}
        })

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving) {
            movables.forEach((movable) => {
                movable.position.x +=5
            }) 
        }
    }
    else if (keys.s.pressed && lastKey ==='s') {
        player.animate = true
        player.image = player.sprites.down

        checkForChacracterCollision({
            characters, 
            player, 
            characterOffset: {x: 0, y: -3}
        })

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y -3
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving) {
            movables.forEach((movable) => {
                movable.position.y -=5
            }) 
        }
    }
    else if (keys.d.pressed && lastKey ==='d') {
        player.animate = true
        player.image = player.sprites.right

        checkForChacracterCollision({
            characters, 
            player, 
            characterOffset: {x: -3, y: 0}
        })

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving) {
            movables.forEach((movable) => {
                movable.position.x -=5
            }) 
        }
    }
}

let lastKey = '';
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false    
            break;
        case 'a':
            keys.a.pressed = false   
            break;
        case 's':
            keys.s.pressed = false    
            break;
        case 'd':
            keys.d.pressed = false    
            break;
    }
})

let clicked = false

addEventListener('click', ()=> {
    if(!clicked) {
        clicked = true
        audio.Map.play()
    }
})



