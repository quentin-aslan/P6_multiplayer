/**
 * @description Modification de l'IHM en fonction des ordre données par le serveur (Communication via WebSocket)
 * @class IHM STATIC
 */
class Ihm {

    /**
     * @description Génére le tableau avec les box en fonction du nombre de box mis en paramétre
     * @param {Integer} nbBox
     */
    displayMap(nbBox) {
        let table = $('<table></table>');

        $('#content').append(table);
        let boxId = 0;

        let nbBoxSide = nbBox / 10; // Si c'est 100 -> 10x10 si c'est 50 -> 5x5

        for (let i = 0; i < nbBoxSide; i++) {
            let ligne = $('<tr></tr>')

            for (let j = 0; j < nbBoxSide; j++) {
                let cellule = $('<td></td>')
                cellule.attr('id', `${boxId}`);
                ligne.append(cellule);
                boxId++;
            }

            table.append(ligne);
        }
    }


    /**
     * Affiche une image en background d'une cellule du tableau qui correspondant à la boxId
     * @param {Int} boxId 
     * @param {string} img 
     */
    displayImg(boxId, img) {
        $(`#${boxId}`).css('background-image',`url("img/${img}.jpg")`);
        $(`#${boxId}`).css('background-repeat',`no-repeat`);
        $(`#${boxId}`).css('background-position', 'center');
    }

    /**
     * @param {Int} boxId
     */
    displayClearBox(boxId) {
        $(`#${boxId}`).css('background-image', '');
        $(`#${boxId}`).removeClass('boxAvailable');
    }

    displayColor(boxId) {
        $(`#${boxId}`).addClass('boxAvailable');
    }

    // GAME

    /**
     * Affiche les informations du joueur courrant sur l'IHM
     * @param {Object} player joueur courrant
     */
    displayInfo(player) {
        console.log(player);
        let img = player.img;
        let name = player.name;
        let weaponName = player.weaponName;
        let life = player.life;
        let damage = player.damage;
        let round = player.nbRounds;

        $('#playerName').text(name);
        $('#avatar').attr('src', `img/${img}.jpg`);
        $('#life').text(life);
        $('#weapon').text(weaponName);
        $('#damage').text(damage);
        $('#notif').text(`Tour n°${round} - ${name} doit se déplacer ! `);
    }

    /**
     * Affiche les boutons pour attaquer ou utiliser son bouclier
     * @param {Object} player joueur courrant
     */
    displayFight(player) {

        let name = player.name;
        let round = player.nbRounds;

        $('#notif').text(`Tour n°${round} - ${name} doit choisir entre attaquer et sortir son bouclier !`);
        $('#fight').show();
    }

    displayEnd(name) {
        alert(`${name} à gagné !!`);
        window.location="/";
        $('#notif').text(`${name} à gagné !!`);
    }

    displayBoxAvailableClear(boxAvailable) {
        console.log(boxAvailable);
        for (let box of boxAvailable) {
            this.displayClearBox(box.id);
            if(box.img) {
                this.displayImg(box.id, box.img);
            }
        }
    }

    displayBoxAvailable(boxAvailable) {
        for (let box of boxAvailable) {
            this.displayColor(box);
        }
    }
    
}