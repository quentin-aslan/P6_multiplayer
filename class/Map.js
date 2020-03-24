const playerRequire = require('Player.js');
const weaponRequire = require('Weapon.js');
const boxRequire = require('Box.js');
const Tools = require('./Tools');

class Map {
    /**
     * @description Instance de la map, toutes les methods pour la générer sont présentes.
     * @param {Array} playersArgs Tableau d'objet, informations pour l'instanciation des joueurs (Name, Img)
     * @param {Int} nbBox Nombre de cases à générer
     * @param {Int} nbWall Nombre de mur (Case non libre) à générer
     */
    constructor(playersArgs, nbBox = 100, nbWall = 20, maxWeapons = 4) {

        this.setNbBox(nbBox)
        this.setNbWall(nbWall);
        this.setNbPlayers(playersArgs.length);
        this.setMaxWeapons(maxWeapons);

        this.boxs = [];
        this.players = [];
        this.prohibitedBox = [];
        // BorderBox (Utiliser lors des mouvemenets des joueurs)
        this.borderBox = {
            borderBoxLeft: [],
            borderBoxRight: [],
            borderBoxTop: [],
            borderBoxBottom: []
        };

        // Génération de la Map
        this.displayMap(this.nbBox);
        this.generateBox();
        this.generateWall();
        this.generateWeapon(this.maxWeapons);
        this.generatePlayers(playersArgs);
        this.generateBorderBox();

    }

    // SETTERS

    /**
     * @param {Array} newBoxs 
     */
    setBoxs(newBoxs) {
        if(Array.isArray(newBoxs)) {
            this.boxs = newBoxs;
        }
    }

    /**
     * @param {Integer} val 
     */
    setNbBox(val) {
        this.nbBox = parseInt(val);
    }

    /**
     * @param {integer} val 
     */
    setNbWall(val) {
        this.nbWall = parseInt(val);
    }

    /**
     * @param {Integer} val 
     */
    setNbPlayers(val) {
        this.nbPlayers = parseInt(val);
    }

    /**
     * @param {Integer} val 
     */
    setMaxWeapons(val) {
        this.maxWeapons = parseInt(val);
    }



    // GETTERS

    getBoxs() {
        return this.boxs;
    }

    /**
     * @param {Integer} boxId 
     */
    getBox(boxId) {
        
        let boxInstance = this.getBoxs()[boxId];
        if(boxInstance) return boxInstance;
        else return null;
    }

    getNbBox() {
        return this.nbBox;
    }

    getnbWall() {
        return this.nbWall;
    }

    // Retourne tableau d'objet
    getPlayers() {
        return this.players;
    }

    getNbPlayers() {
        return this.nbPlayers;
    }

    getMaxWeapons() {
        return this.maxWeapons;
    }

    getProhibitedBox() {
        return this.prohibitedBox;
    }

    getBorderBox() {
        return this.borderBox;
    }

    /**********************************
     ****** Génération de la MAP ******
     **********************************/

    /**
     * @description Génére les box de la MAP
     */
    generateBox() {
        for (let i = 0; i < this.getNbBox(); i++) {
            let box = new Box(i);
            this.getBoxs().push(box);
        }
    }

    /**
     * @description Génére les murs et les affectent à des Objets Box aléatoires.
     */
    generateWall() {
        // Nombre de mur à placé sur la carte
        for (let i = 0; i <= this.getnbWall(); i++) {
            let randomBox = Tools.getRandomBox(this.getBoxs());
            // La Box n'est pas accésible.
            randomBox.setFree(false);
            // On affiche le mur sur l'IHM
            this.displayImg(randomBox.getId(), 'arbuste');
        }
    }

    /**
     * @description Génére les armes et les affectent à des Objets Box aléatoires.
     */
    generateWeapon() {
        // Init Weapons
        let sword = new Weapon('Epee', 'epee', 35);
        let hammer = new Weapon('Marteau', 'marteau', 30);
        let lightning = new Weapon('Eclair', 'eclair', 40);
        let spear = new Weapon('Lance', 'lance', 20);

        let weapons = [sword, hammer, lightning, spear];
        let nbWeapons = weapons.length;

        // Nombre d'arme généré[1 4[ MAX 4 arme : 0,1,2,3
        let nbWeaponGenerate = Tools.getRandomInt(this.getMaxWeapons()-2);
        nbWeaponGenerate+=2; // minimum 2 armes;

        for (let i = 0; i <= nbWeaponGenerate; i++) {
            let randomBox = Tools.getRandomBox(this.getBoxs());

            // Choix de l'arme random, et on la supprime du tableau pour pas la séléctionner plusieurs fois.
            let indiceWeaponRandom = Tools.getRandomInt(nbWeapons);
            let weapon = weapons[indiceWeaponRandom];
            weapons.splice(indiceWeaponRandom, 1);
            nbWeapons--;


            // L'arme est affécté à la box
            this.displayImg(randomBox.getId(), weapon.getImg());
            randomBox.setWeapon(weapon);
        }
    }

    // Générations des joueurs, ils doivent être placé sur une case libre et sans arme, et ne doivent pas être à coté.
    /**
     * @params {Array} Map
     * @params {Array} Nom des joueurs
     * @params {Int} Nombre de joueur (max 4)
     * */
    generatePlayers(playersArgs) {
        const defaultWeapon = new Weapon('Poing', 'poing', 10);

        // Pour chacun des joueurs, on génére une case libre aléatoire et on lui passe l'instance du joueur, de même on passe l'instance de la case au joueur.
        playersArgs.forEach(playerArgs => {
            do {
                var randomBox = Tools.getRandomBox(this.getBoxs());
                // console.log(`${playerArgs.name} - BOX : ${randomBox}`);
            } while ((this.getProhibitedBox().find(e => e == randomBox.getId())) != null); // Tant que la case choisi est dans la liste des case interdite alors on recommencE

            this.generateProhibitedBox(randomBox.getId()); // Ajout des cases interdites une fois que la case à été validé

            // Instanciation du joueur, on passe l'instance du joueur dans l'instance de la randomBox
            let imgName = `${playerArgs.img}_${defaultWeapon.getImg()}`;
            const player = new Player(playerArgs.name, imgName, randomBox, defaultWeapon);
            randomBox.setPlayer(player);
            this.players.push(player);
           
            this.displayImg(player.getBox().getId(), imgName);
        });

    }

    /**
     * @description Génére les cases interdite pour les autres joueurs, et passe en parametre l'instance du tableau, donc cette fonction ne retourne rien.
     * @param {int} currentBoxId 
     */
    generateProhibitedBox(currentBoxId) {
        let boxList = this.generateSideCase(currentBoxId);
        this.getProhibitedBox().concat(boxList);
    }

    /**
     * @description Génére les cases autour d'une autre case (Souvent la ou le joueur se trouve)
     * @todo faire en fonction de la taille du plateau /!\
     * @todo attention a la map qui sors 
     * @param {int} currentBoxId 
     */

    generateSideCase(currentBoxId) {
        let boxList = [];

        let diagonalTopLeft = currentBoxId - 11;
        boxList.push(diagonalTopLeft);
        
        let top = currentBoxId - 10;
        boxList.push(top);

        let diagonalTopRight = currentBoxId - 9;
        boxList.push(diagonalTopRight);

        let left = currentBoxId - 1;
        if(!this.isBorderLeft(left)) boxList.push(left);

        let right = currentBoxId + 1;
         boxList.push(right);

        let diagonalBottomLeft = currentBoxId + 9;
        boxList.push(diagonalBottomLeft);

        let bottom = currentBoxId + 10;
        boxList.push(bottom);

        let diagnoalBottomRight = currentBoxId + 11;
        boxList.push(diagnoalBottomRight);
        
        console.log(boxList);
        return boxList;
    }

    generateSideCaseFight(currentBoxId) {
        let boxList = [];

        let top = currentBoxId - 10;
        boxList.push(top);

        let left = currentBoxId - 1;
        if(!this.isBorderLeft(left)) boxList.push(left);

        let right = currentBoxId + 1;
         boxList.push(right);

         let bottom = currentBoxId + 10;
         boxList.push(bottom);

         return boxList;

    }

    /**
     * @description Vérifie si un joueur est présent sur les cases adjacente de la case passé en paramètre
     * @params {Int} currentBoxId
     * @return {Object} Box
     */
    checkFight(currentBoxId) {
        let boxList = this.generateSideCaseFight(currentBoxId);

        for(let box of boxList) {
            box = this.getBoxs()[box]; // On récupère l'instance de la box.
            if(box != null) {
                if(box.getPlayer() != null) {
                    return box;
                }
            }

        }

        return null;
    } 



    /**
     * @description Génére les cases qui sont en bordure de la map (Fonctions normalement dynamique PAS TESTER
     */
    generateBorderBox() {
        // On calcule toutes les box qui sont en bordure de la map
        let borderBox = this.getBorderBox();
        let sizeMap = this.getNbBox();
        let sideSize = sizeMap/10;

        // TOP
        let borderTopLeft = 0;
        let borderBoxTop = borderBox.borderBoxTop;
        for(let i = 0; i<sideSize; i++) {
            let border =  borderTopLeft + (1*i);
            borderBoxTop.push(border);
        }

        let borderBoxLeft = borderBox.borderBoxLeft;
        for(let i = 0; i<sideSize; i++) {
            let border =  borderTopLeft + (sideSize*i);
            borderBoxLeft.push(border);
        }

        let borderTopRight = sideSize-1;
        let borderBoxRight = borderBox.borderBoxRight;
        for(let i = 0; i<sideSize; i++) {
            let border =  borderTopRight + (sideSize*i);
            borderBoxRight.push(border);
        }

        // BOTTOM 
        let borderBottomLeft = sizeMap - sideSize;
        let borderBoxBottom = borderBox.borderBoxBottom
        for(let i = 0; i<sideSize; i++) {
            let border =  borderBottomLeft + (1*i);
            borderBoxBottom.push(border);
        }
    }

    isBorderLeft(boxId) {
        if(this.getBorderBox().borderBoxLeft.find(e => e == boxId)) return true;
        else return false;
    }

    isBorderRight(boxId) {
        if(this.getBorderBox().borderBoxRight.find(e => e == boxId)) return true;
        else return false;
    }

    isBorderTop(boxId) {
        if(this.getBorderBox().borderBoxTop.find(e => e == boxId)) return true;
        else return false;
    }

    isBorderBottom(boxId) {
        if(this.getBorderBox().borderBoxBottom.find(e => e == boxId)) return true;
        else return false;
    }

    /************************************
     ****** Modification sur l'IHM ******
     ************************************/

    /**
     * @description Génére le tableau avec les box en fonction du nombre de box mis en paramétre
     * @param {Integer} nbBox
     */
    displayMap() {
        // let nbBox = this.getNbBox();
        // let table = $('<table></table>');

        // $('#content').append(table);
        // let boxId = 0;

        // let nbBoxSide = nbBox / 10; // Si c'est 100 -> 10x10 si c'est 50 -> 5x5

        // for (let i = 0; i < nbBoxSide; i++) {
        //     let ligne = $('<tr></tr>')

        //     for (let j = 0; j < nbBoxSide; j++) {
        //         let cellule = $('<td></td>')
        //         cellule.attr('id', `${boxId}`);
        //         ligne.append(cellule);
        //         boxId++;
        //     }

        //     table.append(ligne);
        // }

        return null;
    }

    /**
     * Affiche une image en background d'une cellule du tableau qui correspondant à la boxId
     * @param {Int} boxId 
     * @param {string} img 
     */
    displayImg(boxId, img) {
        // this.displayClearBox(boxId);
        // $(`#${boxId}`).css('background-image',`url("img/${img}.jpg")`);
        // $(`#${boxId}`).css('background-repeat',`no-repeat`);
        // $(`#${boxId}`).css('background-position', 'center');
        return null;
    }

    displayClearBox(boxId) {
        // $(`#${boxId}`).css('background-image', '');
        // $(`#${boxId}`).removeClass('boxAvailable');


        // // Si une arme était sur la case, alors on l'affiche.
        // let box = this.getBox(boxId);
        // if(box.getWeapon()) {
        //     let img = box.getWeapon().getImg()
        //     // On ne peux pas appeler displayImg car elle va rappeler displayClearBox ... en boucle.
        //     $(`#${boxId}`).css('background-image',`url("img/${img}.jpg")`);
        //     $(`#${boxId}`).css('background-repeat',`no-repeat`);
        //     $(`#${boxId}`).css('background-position', 'center');
        // }
        return null;
        
    }

    displayColor(boxId) {
        // $(`#${boxId}`).addClass('boxAvailable');
        return null;
    }


}