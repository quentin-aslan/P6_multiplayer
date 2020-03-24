class Box {
    /**
     * Instance d'une Box
     * @params {Integer} id
     * @param {Boolean} free 
     * @param {Object} weapon 
     * @param {Object} player 
     */
    constructor(id, free = true, weapon = null, player = null) {
        this.setId(id); 
        this.setFree(free);
        this.setWeapon(weapon);
        this.setPlayer(player);
    }

    // GETTERS

    getId() {
        return this.id;
    }

    getFree() {
        return this.free;
    }

    getWeapon() {
        return this.weapon;
    }

    getPlayer() {
        return this.player;
    }

    // SETTERS

    /**
     * @param {Integer} id 
     */
    setId(id) {
        this.id = parseInt(id);
        return null;
    }

    /**
     * @param {Boolean} val 
     */
    setFree(val) {
        this.free = val;
        return null;
    }

    /**
     * @param {Object} newWeapon 
     */
    setWeapon(newWeapon) {
        if(typeof newWeapon == "object") {
            this.weapon = newWeapon;
        }
        return null;
    }

    /**
     * @param {Object} newPlayer 
     */
    setPlayer(newPlayer) {
        if(typeof newPlayer == "object") {
            this.player = newPlayer;
        }
        return null;
    }
}

module.exports = Box;