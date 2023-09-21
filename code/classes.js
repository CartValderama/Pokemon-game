class Sprite {
    constructor({
        position, 
        image, 
        frames = { max: 1, hold: 30 }, 
        sprites = [], 
        animate = false,
        scale = 1
    }) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0}        
        this.image.onload = () => {
            this.width = (this.image.width / this.frames.max) * scale
            this.height = this.image.height * scale
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1

        this.scale = scale

    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        
        c.drawImage(
            this.image,
            this.frames.val * (this.width / this.scale),
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x, 
            this.position.y,
            (this.image.width / this.frames.max)* this.scale,
            this.image.height * this.scale
        )
        c.restore

        if(this.animate) {
            if (this.frames.max > 1) {
                this.frames.elapsed++
            }
            if (this.frames.elapsed % this.frames.hold === 0) {
                if(this.frames.val < this.frames.max - 1) {
                    this.frames.val++
                } else {
                    this.frames.val = 0
                }
            }
        }
    }
}

class Monster extends Sprite {
    constructor ({         
        position, 
        image, 
        frames = { max: 1, hold: 30 }, 
        sprites = [], 
        animate = false,
        rotation = 0,  
        isEnemy = false, 
        name,
        attacks
    }) {
        super({
            position, 
            image, 
            frames, 
            sprites, 
            animate,
            rotation, 
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name  
        this.attacks = attacks
    }

    faint() {
        const instruction = "\n" +'<p style="font-size: 8px; margin-top: 80px;">'+'Right click to continue' + '<p>'
        document.querySelector('#dialogue').innerHTML = this. name + ' fainted!' + instruction

        //gsap.to(this.position, {
        //    y: this.position.y
        //})
        gsap.to(this, {
            opacity: 0
        })


        audio.battle.stop()
        audio.victory.play()
    }

    attack({ attack, recipient, renderedSprites }) {
        document.querySelector('#dialogue').style.display = 'block'
        
        // cry and simp
        const instruction = "\n" +'<p display="relative"; style="font-size: 8px; margin-top: 40px;">'+'Left click to continue' + '<p>'

        if(!this.isEnemy) {
            document.querySelector('#dialogue').innerHTML = this. name + ' used ' + attack.name + '<br><br><br><br>' + instruction
        } else if(this.isEnemy) {
            document.querySelector('#dialogue').innerHTML =  this.name + ' vomited. ' + attack.description + '<br><br>' + "(It can't move!)" + '<br><br>'  + instruction
            if(attack.name === 'Tackle') {
                document.querySelector('#dialogue').innerHTML = this.name + ' used ' + attack.name + '<br><br><br><br>' + instruction
            }
            if(attack.name === 'Fireball') {
                document.querySelector('#dialogue').innerHTML = this.name + ' used ' + attack.name + '<br><br><br><br>' + instruction
            }
        }


        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) {
            healthBar = '#myHealthBar'
        }

        recipient.health -= attack.damage

        switch(attack.name) {
            case 'Fireball':
                audio.initFireball.play()
                const fireballImage = new Image()
                fireballImage.src = './img/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 40
                    },
                    animate: true,
                    //rotation
                })
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {

                        audio.fireballHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 20,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.1
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true, 
                            duration: 0.1
                        })
                        renderedSprites.splice(1, 1)
                    }
                })

                break
            case 'Tackle':
                const tl = gsap.timeline()

                let movementDistance = 40
                if(this.isEnemy) {
                    movementDistance = -40
                }

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                })
                    .to(this.position, {
                        x: this.position.x + movementDistance * 2,
                        duration: 0.1,
                        onComplete: () => {
                            // enemy gets hit
                            audio.tackleHit.play()

                            gsap.to(healthBar, {
                                width: recipient.health + '%'
                            })

                            gsap.to(recipient.position, {
                                x: recipient.position.x + 20,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.1
                            })

                            gsap.to(recipient, {
                                opacity: 0,
                                repeat: 5,
                                yoyo: true, 
                                duration: 0.1
                            })
                        }
                    })
                    .to(this.position, {
                    x: this.position.x
                    })                
                break
            case 'Cry':
                const tl1 = gsap.timeline()
                audio.cry.play()
                let movementDistance1 = 20
                if(this.isEnemy) {
                    movementDistance1 = -20
                }
                tl1.to(this.position, {
                    y: this.position.y - movementDistance1
                })
                    .to(this.position, {
                        y: this.position.y + movementDistance1 * 2,
                        duration: 0.1,
                        repeat: 5,
                        yoyo: true,
                        onComplete: () => {
                            // enemy gets hit
                            audio.laugh.play()
                            gsap.to(healthBar, {
                                width: recipient.health + '%'
                            })

                            gsap.to(recipient.position, {
                                y: recipient.position.y + 20,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.3,
                            })
                        }
                    })
                    .to(this.position, {
                        y: this.position.y
                    })
                break
            case 'Simp':
                const tl2 = gsap.timeline()
                audio.flirt.play()
                let movementDistance2 = 20
                if(this.isEnemy) {
                    movementDistance1 = -20
                }
                tl2.to(this.position, {
                    y: this.position.y - movementDistance2
                })
                    .to(this.position, {
                        y: this.position.y + movementDistance2 * 2,
                        duration: 0.1,
                        repeat: 5,
                        yoyo: true,
                        onComplete: () => {
                            // enemy gets hit
                            gsap.to(recipient.position, {
                                x: recipient.position.x + 20,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.1,
                                onComplete: () => {
                                    audio.vomit.play()
                                }
                            })


                            gsap.to(healthBar, {
                                width: recipient.health + '%'
                            })

                            gsap.to(recipient.position, {
                                x: recipient.position.x + 20,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.1,
                                onComplete: () => {

                                }
                            })

                            gsap.to(recipient, {
                                opacity: 0,
                                repeat: 5,
                                yoyo: true,
                                duration: 0.1
                            })
                        }
                    })
                    .to(this.position, {
                        y: this.position.y
                    })
                break
        }
    }    
}

class Boundary {
    static width = 48
    static height = 48

    constructor ({position}) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

