/**
 * @class Tools
 * @description Class qui contient des methods static utiles au programme, accéssible depuis n'importe quel autre class
 */
class Tools {

    /**
     * @description Génére un nombre entre [0 et max[ (Max non inclus)
     * @param {Integer} max 
     * @return {Integer} Int Random
     */
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * @description Récupération aléatoire d'une instance d'une case LIBRE, SANS ARME, SANS JOUEUR
     * @param {Array} Array of boxs instace
     * @return {Object} BoxId
     */
    static getRandomBox(boxs) {
        do {
            var randomBoxId = this.getRandomInt(boxs.length);
        } while (boxs[randomBoxId].getFree() == false || boxs[randomBoxId].getWeapon() != null || boxs[randomBoxId].getPlayer() != null);

        return boxs[randomBoxId];
    }

    /**
     * @description Récupération aléatoire d'une instance d'un joueur
     * @param {Array} Array of player instance
     * @return {Object} Player
     */
    static getRandomPlayer(players) {
        let nbPlayers = players.length;
        let i = this.getRandomInt(nbPlayers);
        return players[i];
    }

    /**
     * @description Renvoie vrais ou faux aléatoirement
     * @return {Boolean}
     */
    static generateBoolean() {
        let nb = this.getRandomInt(2);
        if (nb == 0) return false;
        else return true;
    }

}

module.exports = Tools;