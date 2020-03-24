class Game {
    constructor(playersArgs) {

        // Generate Map
        this.map = new Map(playersArgs);
        this.setNbRounds(0);

        // this.init();
    }

    // GETTERS

    getMap() {
        return this.map;
    }

    getNbplayers() {
        return this.getMap().getNbPlayers();
    }

    getPlayers() {
        return this.getMap().getPlayers();
    }

    getNbRounds() {
        return this.nbRounds;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    // SETTERS

    /**
     * Modifie l'instance du joueur courrant
     * @param {Object} currentPlayer 
     */
    setCurrentPlayer(currentPlayer) {
        this.currentPlayer = currentPlayer;
    }

    /**
     * @param {Integer} val 
     */
    setNbRounds(val) {
        this.nbRounds = parseInt(val);
    }

    /**
     * @description Démarre le jeu, déclare le joueur qui commence et lance un tour de jeu
     */
    init() {

        // Le joueur qui commence est défini aléatoirement
        let randomPlayer = Tools.getRandomPlayer(this.getPlayers());
        this.setCurrentPlayer(randomPlayer);
        this.round();
    }

    /**
     * @description Tour de jeu d'un joueur, à la fin de celui-ci, appel nextPlayer() qui passe au joueur suivant
     * s'appel toute seul tant que le jeu n'est pas finis
     */
    round() {
        this.setNbRounds(this.getNbRounds()+1);
        let currentPlayer = this.getCurrentPlayer();

        // On récupère les cases diponible pour le mouvement et on les affiches sur la carte
        let boxAvailable = this.boxAvailable(currentPlayer);
        this.displayBoxAvailable(boxAvailable);

        $('#fight').hide();
       
        this.displayInfo(currentPlayer);

        // Lorsque le joueur clique sur une case
        $('td').click((e) => {
            
            // Je récupère juste le numéro de la case (Box_55) SPLIT -> 5
            // Gérer avec attr jquery
            let el = e.target;
            let id = el.id;


            // Si il n'a pas cliquer sur une case disponible alors on lui affiche un message
            if (!boxAvailable.find(e => e == id)) $('#notif').text(`On peux se déplacer seulement sur les cases verte !`);
            else {
                // On enlève le listener (Seulement pour cette instance de la fonction round())
                $('td').unbind();

                // Si la case fais partie des cases disponible

                //  --- MOUVEMENT ---

                // 1. On supprime l'instance du joueur dans l'instance dans la case (currentBox) && On supprime également le joueur sur l'IHM
                let oldBox = currentPlayer.getBox(); // Case ou se trouvais le joueur avant le mouvement
                oldBox.setPlayer(null);
                this.getMap().displayClearBox(oldBox.getId());
                
                // 2. On modifie l'instance du joueur et on lui envoie l'id de sa nouvelle case
                let currentBox = this.map.getBox(id); // Case ou se trouve le joueur après le mouvement
                currentPlayer.setBox(currentBox);

                // Ensuite on affecte à l'instance de la case le joueur.
                currentBox.setPlayer(currentPlayer);

                // On enleve les cases coloré en vert et vide boxAvailable
                //  ATTENTION ARME
                for (let i of boxAvailable) {
                    this.getMap().displayClearBox(i);
                }

                // On place le joueur sur cette case sur l'IHM
                this.getMap().displayImg(id, currentPlayer.getImg());

                //  --- END MOUVEMENT ---

                // Si le joueur est sur une arme alors il la récupère
                let weapon = currentBox.getWeapon();
                let weaponPlayer = currentPlayer.getWeapon();
                let checkFight = this.map.checkFight(currentBox.getId());

                if (weapon) {
                     // Si le joueur avait déja une arme en main alors il la dépose
                    if(weaponPlayer.getName() != "Poing") currentBox.setWeapon(weaponPlayer);
                    else currentBox.setWeapon(null);

                    currentPlayer.setWeapon(weapon);

                    let nameSplit = currentPlayer.getImg().split('_'); // On récupère le nom du personnage (poseidon, ares ..)
                    let nameImg = `${nameSplit[0]}_${currentPlayer.getWeapon().getImg()}`;

                    currentPlayer.setImg(nameImg);

                    this.getMap().displayImg(currentBox.getId(), nameImg);
                    // Changer l'image du joueur avec l'image de l'arme
                    // Déposer l'ancienne arme
                }
                
                if (checkFight != null) { // Si le joueur est à coté d'un autre joueur alors on enclenche le mode COMBAT
                    let otherPlayer = checkFight.getPlayer();

                    let indiceCurrentPlayer = this.getPlayers().indexOf(currentPlayer);
                    this.nextPlayer(indiceCurrentPlayer);

                    this.fight(otherPlayer, currentPlayer);
                } else {
                    // On change de joueur 
                    let indiceCurrentPlayer = this.getPlayers().indexOf(currentPlayer);
                    this.nextPlayer(indiceCurrentPlayer);
                    this.round();
                }
                

            }

        });
    }

    /**
     * @description Déplace un joueur d'une case à l'autre
     */
    moovePlayer(player, newCase) {
        
    }

    fight(player1, player2) {
        this.setNbRounds(this.getNbRounds()+1); // on incrémente le nombre de tour !

        let currentPlayer = this.getCurrentPlayer();
        this.displayFight(currentPlayer);

        // On remet le bouclier à zero du joueur courrant
        currentPlayer.setShield(false);

        $('#attack').click((e) => {
            $('#attack').unbind(); // On enleve les listener pour cette instance de la fonction.
            $('#shield').unbind();
            currentPlayer.attack(player2);

            // On passe la main à l'autre joueur
            this.setCurrentPlayer(player2);

            // isEnd retourne un objet, un boolean et l'instance du joueur gagnant
            let winner = this.isEnd();
            if ((typeof winner) === 'object') {
                this.displayEnd(winner);
            } else {
                console.log('fin du round fight')
                this.fight(player2, player1);
            }
        });

        $('#shield').click((e) => {
            $('#shield').unbind(); // On enleve les listener pour cette instance de la fonction.
            $('#attack').unbind();
            currentPlayer.setShield(true);
            

            // On passe la main à l'autre joueur
            this.setCurrentPlayer(player2);
            this.fight(player2, player1);
        });
        

    }

    /**
     * @todo isBorderLeft/right/top/bottom, car si le joueur est en bordure alors on ne peux pas s'avoir si on dois afficher ou non la case
     * @param {Object} currentPlayer
     * @return {Array} Array of Box instance
     */
    boxAvailable(currentPlayer) {
        let boxAvailable = [];
        let currentBoxId = currentPlayer.getBox().getId();
        let box = currentBoxId;
        let listBox = this.getMap().getBoxs();

        // On ajoute d'abord les 3 cases à DROITE
        for (let i = 0; i < 3; i++) {
            if (this.getMap().isBorderRight(currentBoxId)) break; // Si le joueur est sur une bordure droite alors on n'affiche aucune case à droite de lui
            box = box + 1;
            if (box < 0 || box > 99) break;
            else if (!listBox[box].getFree()) break;
            else if (listBox[box].getPlayer()) break;

            boxAvailable.push(box);
            if (this.getMap().isBorderRight(box)) break; // Si la case est une bordure de la carte alors on l'ajoute et ensuite on s'arrete pour ne pas dépasser
        }

        // 3Cases à gauche
        box = currentBoxId;
        for (let i = 0; i < 3; i++) {
            if (this.getMap().isBorderLeft(currentBoxId)) break; // Si le joueur est sur une bordure gauche alors on n'affiche aucune case à gauche de lui
            box = box + -1;
            if (box < 0 || box > 99) break;
            else if (!listBox[box].getFree()) break;
            else if (listBox[box].getPlayer()) break;

            boxAvailable.push(box);
            if (this.getMap().isBorderLeft(box)) break; // Si la case est une bordure de la carte alors on l'ajoute et ensuite on s'arrete pour ne pas dépasser

        }
        // 3 cases en haut
        box = currentBoxId;
        for (let i = 0; i < 3; i++) {
            box = box - 10;

            if (box < 0 || box > 99) break; // Si la case est en dehors de la map alors on s'arrete
            else if (!listBox[box].getFree()) break; // Si la cases est occupé par un mur alors on s'arrete
            else if (listBox[box].getPlayer()) break; // Si un joueur est déja sur la case alors on s'arrete

            boxAvailable.push(box);
            if (this.getMap().isBorderTop(box)) break; // Si la case est une bordure de la carte alors on l'ajoute et ensuite on s'arrete pour ne pas dépasser
        }

        // 3 cases en bas
        box = currentBoxId;
        for (let i = 0; i < 3; i++) {
            box = box + 10;
            if (box < 0 || box > 99) break;
            else if (!listBox[box].getFree()) break;
            else if (listBox[box].getPlayer()) break;

            boxAvailable.push(box);
            if (this.getMap().isBorderBottom(box)) break; // Si la case est une bordure de la carte alors on l'ajoute et ensuite on s'arrete pour ne pas dépasser

        }
        return boxAvailable;

    }

    /**
     * @description Lorsqu'un tour de jeu est finis permet de passer au joueur suivant !
     * @param {Integer} currentPlayerId
     * @param {Integer} nbPlayers 
     */
    nextPlayer(currentPlayer) {
        let nbPlayers = this.getNbplayers();
        if(currentPlayer == nbPlayers-1) {
            var nextPlayer = 0;
        } else {
            var nextPlayer = currentPlayer+1;
        }

        this.setCurrentPlayer(this.getPlayers()[nextPlayer]);
    }


    /**
     * @description Vérifie si la partie est finis et déclare le gagnant si oui
     * @return {Object} Player 
     */
    isEnd() {
        this.getPlayers().forEach(player => {
            if (player.getLife() <= 0) {
                let indicePlayer = this.getPlayers().indexOf(player);
                this.getPlayers().splice(indicePlayer, 1);
            }
        });

        // Si il ne reste qu'un seul joueur alors on le retourne en params
        if (this.getPlayers().length == 1) {
            console.log('fin de la partie,', this.getPlayers()[0]);
            return this.getPlayers()[0];
        }
    }

    // --- IHM ---

    /**
     * Modifie le background-color des cases ou le joueur peut se déplacé
     * @param {Int} boxId 
     * @param {string} img 
     */
    displayBoxAvailable(boxAvailable) {
        for (let box of boxAvailable) {
            this.getMap().displayColor(box);
        }
    }

    /**
     * Affiche les informations du joueur courrant sur l'IHM
     * @param {Object} player joueur courrant
     */
    displayInfo(player) {

        let img = player.getImg();
        let name = player.getName();
        let weaponName = player.getWeapon().getName();
        let life = player.getLife();
        let damage = player.getWeapon().getDamage();

        $('#playerName').text(name);
        $('#avatar').attr('src', `img/${img}.jpg`);
        $('#life').text(life);
        $('#weapon').text(weaponName);
        $('#damage').text(damage);

        $('#notif').text(`Tour n°${this.getNbRounds()} - ${name} doit se déplacer ! `);
    }

    /**
     * Affiche les boutons pour attaquer ou utiliser son bouclier
     * @param {Object} player joueur courrant
     */
    displayFight(player) {
        
        this.displayInfo(player);

        let name = player.getName();

        $('#notif').text(`Tour n°${this.getNbRounds()} - ${name} doit choisir entre attaquer et sortir son bouclier !` );
        $('#fight').show();
    }

    displayEnd(winner) {
        $('#notif').text(`${winner.getName()} à gagné !!` );
    }

    // --- END IHM ---

}
