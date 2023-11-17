//ditz1

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let players = {}; // Stores player data


io.on('connection', (socket) => {
    // Assign player number
    console.log("ws connection started: " + socket);

    let playerNumber = Object.keys(players).length + 1;
    
    if (playerNumber > 2) playerNumber = null; // Limit to 2 players
   
    players[socket.id] = { playerNumber };

    // Inform the player of their number
    socket.emit('playerNumber', playerNumber);
     
    
    socket.on('move', (data) => {
        
        data.playerNumber = players[socket.id].playerNumber;
        
        if ((Object.keys(players).length) > 1) {
            io.emit('move', data); // Emit to all clients
        } else {
            data = "wait until the other player connects";
            io.emit("wait", data);
        }
        
    });
    
    
    socket.on('disconnect', () => {
        delete players[socket.id];
        console.log('User disconnected');
        
    });
});


server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
