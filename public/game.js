const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function Player1(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;

    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.move = function(direction) {
        if (direction === 'left') this.x -= 10;
        if (direction === 'right') this.x += 10;
    };
}
//there is definitely a better way to do this
function Player2(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;

    this.draw = function() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.move = function(direction) {
        if (direction === 'left') this.x -= 10;
        if (direction === 'right') this.x += 10;
    };
}

const socket = io.connect('http://localhost:8080');

let player1 = new Player1(100, 550);
let player2 = new Player2(700, 550);
let myPlayerNumber = null;

socket.on('playerNumber', (number) => {
    myPlayerNumber = number;
    console.log("You are player", myPlayerNumber);
});

document.addEventListener('keydown', (event) => {
    
    if (myPlayerNumber === 1) {
        if (event.key === 'a') {
            socket.emit('move', { direction: 'left' });
        }
        if (event.key === 'd') {
            socket.emit('move', { direction: 'right' });
        }
    }

    if (myPlayerNumber === 2) {
        if (event.key === 'a') {
            socket.emit('move', { direction: 'left' });
        }
        if (event.key === 'd') {
            socket.emit('move', { direction: 'right' });
        }
    }
});


socket.on('move', (data) => {
    if (data.playerNumber === 1) {
        player1.move(data.direction);
    } else if (data.playerNumber === 2) {
        player2.move(data.direction);
    }
});

socket.on('wait', (data) => {
    console.log("wait");
    console.log(data);
})



function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player1.draw();
    player2.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
