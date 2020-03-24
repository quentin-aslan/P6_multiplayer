// Crée un fichier 
$(() => {
    var socket = io();
    var IHM = new Ihm();
    var pseudoId;

    $('#game').hide();
    $('#fight').hide();
    $('#waitPlayer').hide();
    $('.errorPseudo').hide();

    let playersArgs = [];

    $('#submitPseudo').click((e) => {
        e.preventDefault();
        let pseudo = $('#pseudo').val();

        if (pseudo.length < 3) $('.errorPseudo').show();
        else {
            $('.errorPseudo').hide();
            pseudoId = pseudo;
            socket.emit('newPlayer', pseudo);
        }
    });

    socket.on('refresh', () => {
        // Lorsqu'un joueur quitte la partie alors ça fais crash le jeu
        alert("Oups, l'autre joueur est partie ...");
        window.location="/";
    });

    socket.on('startGame', () => {
        $('#beforeGame').fadeOut(200, () => {
            $('#game').fadeIn(200);
        });
    })

    socket.on('waitPlayer', (msg) => {
        $('#formPseudo').fadeOut(200, () => {
            $('#waitPlayer').fadeIn(200);
        });
    });

    socket.on('gameRun', (msg) => {
        alert('Désoler, un match est déja en cours, re-essayer sous peu !');
    });

    // ROUND
    socket.on('round', (json) => {
        let pseudoRound = json.pseudo;
        let boxAvailable = json.boxAvailable;

        console.log(`pseudo: ${pseudoRound}`);

        if(pseudoRound == pseudoId) {
            $('td').click((e) => {
                let el = e.target;
                let id = el.id;
    
                // Si il n'a pas cliquer sur une case disponible alors on lui affiche un message
                if (!boxAvailable.find(e => e == id)) $('#notif').text(`On peux se déplacer seulement sur les cases verte !`);
                else {
                    // On enlève le listener (Seulement pour cette instance de la fonction round())
                    $('td').unbind();
                    socket.emit('round_moove', id);
                }
            });
        } else {
            $('#notif').text(`Ce n'est pas votre tour !`);
        }

    });

    socket.on('fight', (pseudoRound) => {

        if(pseudoRound == pseudoId) {
            $('#attack').click((e) => {
                $('#attack').unbind(); // On enleve les listener pour cette instance de la fonction.
                $('#shield').unbind();
                socket.emit('fight_attack');
            });
    
            $('#shield').click((e) => {
                $('#shield').unbind(); // On enleve les listener pour cette instance de la fonction.
                $('#attack').unbind();
                socket.emit('fight_shield');
            });
        } else {
            $('#notif').text(`Ce n'est pas votre tour !`);
        }

    });
    

    // IHM

    socket.on('displayMap', (nbBox) => {
        IHM.displayMap(nbBox);
    });

    socket.on('displayClearBox', (boxId) => {
        IHM.displayClearBox(boxId);
    });

    socket.on('displayImg', (json) => {
        let boxId = json.boxId;
        let img = json.img;
        IHM.displayImg(boxId, img);
    });

    socket.on('displayColor', (boxId) => {
        IHM.displayColor(boxId);
    });

    socket.on('displayInfo', (player) => {
        IHM.displayInfo(player);
    });

    socket.on('displayFight', (player) => {
        IHM.displayFight(player);
    });

    socket.on('displayEnd', (name) => {
        IHM.displayEnd(name);
    });

    socket.on('displayBoxAvailable', (boxs) => {
        IHM.displayBoxAvailable(boxs);
    });

    socket.on('displayBoxAvailableClear', (boxs) => {
        IHM.displayBoxAvailableClear(boxs);
    });

});