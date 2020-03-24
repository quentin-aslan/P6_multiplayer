const express = require('express');
const app = express();
const port = process.env.PORT || 4005;
const server = app.listen(port, serverRun(port));
function serverRun(port) {
    console.log('Server start listener on port ' + port + '...');
}

const io = require('socket.io')(server);
//Set up EJS
const ejs = require('ejs');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// REQUIRE CLASS
const GameRequire = require('./class/GameServer');
let game;
// const playerArgs = [];
let gameRun = false;
let playerArgs = [];

/**
 * @param {String} pseudo 
 * @return {Boolean} TRUE si on débute le match FALSE si on attend un autre joueur
 */
function addPlayer(pseudo) {
    let player = {
        name: pseudo,
        img: ''
    };

    // Pour l'attribution du skin
    if(playerArgs.length == 0) {
        player.img = 'poseidon';
        playerArgs.push(player);
        return false;
    }
    else {
        player.img = 'ares';
        playerArgs.push(player);
        console.log(playerArgs);
        return true;
    }
}
// Ne pas dupliqué le io.on('connection') sous peine de bug.
io.on('connection', (socket) => {
    // VAR SESSION
    let pseudoId;

    function startGame() {
        console.log('Start game, seratelle répliqué ... ');
        gameRun = true;
        game = new GameRequire(playerArgs, io);
    }

    socket.on('newPlayer', (pseudo) => {
        if(gameRun) return socket.emit('gameRun');
        console.log('nouveau joueur !', pseudo);
        pseudoId = pseudo;
        if(addPlayer(pseudo)) {
            startGame();
            io.emit('startGame');
        }
        else socket.emit('waitPlayer');
        
    });

    socket.on('round_moove', (boxId) => {

        game.roundMoove(boxId);

    });

    socket.on('fight_attack', () => {
        game.fightAttack();
    });

    socket.on('fight_shield', () => {
        game.fightShield();
    }); 


    socket.on('disconnect', () => {
        // il faut avertir celui avec qui il faissait la partie /!\ 
        //  VERIFIER SA RECONNEXION AVEC COOKIE
        playerArgs = [];
        gameRun = false;
        io.emit('refresh');
    });

    // Pour le chat

    socket.on('chat new user', (pseudo) => {
        socket.pseudo = pseudo;
        socket.broadcast.emit('new user', pseudo);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', { pseudo: socket.pseudo, msg: msg });
    });


});