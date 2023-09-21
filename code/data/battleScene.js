const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battle.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let jamie
let emby
let renderedSprites 
let battleAnimationId
let queue = []

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogue').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#myHealthBar').style.width = '100%'
    document.querySelector('#myHealthBar').style.width = '100%'
    document.querySelector('#attackOption').replaceChildren()


    jamie = new Monster(monsters.Jamie)
    emby  = new Monster(monsters.Emby)
    renderedSprites = [jamie, emby]
    queue = []

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attackOption').append(button)
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            emby.attack({ 
                attack: selectedAttack,
                recipient: jamie,
                renderedSprites
            })

            if(jamie.health <= 0) {
                queue.push(() => {
                    jamie.faint()
                })
                queue.push(() => {
                    gsap.to('#battleStartAnimation', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#battleStartAnimation', {
                                opacity: 0
                            })
                            battle.initiated = false
                            audio.Map.play()
                            audio.victory.stop()
                        }
                    })
                })
            }

            let randomAttack = attacks.Tackle

            if (selectedAttack === attacks.Simp) {
                randomAttack = attacks.Disgust
            }

            queue.push(() => {
                jamie.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                })
                if(emby.health <= 0) {
                    queue.push(() => {
                        emby.faint()
                    })
                    queue.push(() => {
                        gsap.to('#battleStartAnimation', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'
                                gsap.to('#battleStartAnimation', {
                                    opacity: 0
                                })
                                battle.initiated = false
                                audio.Map.play()
                                audio.victory.stop()
                            }
                        })
                    })
                }
            })

        })
    
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type + ' (' +  selectedAttack.damage + ' damage' + ')'
            document.querySelector('#attackType').style.color = selectedAttack.color
        })

        button.addEventListener('mouseleave', (e) => {
            document.querySelector('#attackType').innerHTML = 'What will Emby do?'
            document.querySelector('#attackType').style.color = 'black'
        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}
animate()
//initBattle()
//animateBattle()

// attack
document.querySelector('#dialogue').addEventListener('click', (e) => {
    if(queue.length > 0) {
        queue[0]()
        queue.shift()
    } else {
        e.currentTarget.style.display = 'none'
    }
})