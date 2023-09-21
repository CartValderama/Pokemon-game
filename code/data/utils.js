function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

let cartMessage = []
const instruction = "\n" +'<p display="relative"; style="font-size: 8px; margin-top: 40px;">'+'Move your chracter away from smol boi to close the dialogue' + '<p>'
const instruction2 = "\n" +'<p display="relative"; style="font-size: 8px; margin-top: 40px;">'+ 'Left click to continue' + '<p>'


function checkForChacracterCollision({
    characters, 
    player, 
    characterOffset = {x: 0, y: 0}
}) {

    // monitor for character collision
    for(let i = 0; i < characters.length; i++) {
        const character = characters[i]
        if(
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...character, 
                    position: {
                        x: character.position.x + characterOffset.x,
                        y: character.position.y + characterOffset.y
                    }
                }
            })
        )   {
            document.getElementById("popup-1").style.display = 'block';

            document.querySelector('#popup-1').innerHTML = '<h1 style="color: red">'+'Smol boi:' + '</h1>' + '\n'
                +  '<p style="font-size: 12px;">'+'welcome' + '</p>' + '<br>' + instruction2;

            document.querySelector('#popup-1').addEventListener('click', (e) => {            
                cartMessage.push(() => {
                document.querySelector('#popup-1').innerHTML = '<h1 style="color: red">'+'Smol boi:' + '</h1>' + '\n' +
                 '<p style="font-size: 12px;">'+ 'congrats' + '</a>' + '</p>' + '<br>' + instruction;  
                })

                if(cartMessage.length > 0) {
                    cartMessage[0]()
                    cartMessage.shift()  
                } 
            })  
        } else {
            document.getElementById("popup-1").style.display = 'none';
        }
    }   
}