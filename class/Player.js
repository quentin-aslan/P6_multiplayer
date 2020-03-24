class Player {
    /**
     * @description Player instance
     * @param {String} name 
     * @param {String} img 
     * @param {Object} box 
     * @param {Object} weapon 
     */
    constructor(name, img, box, weapon) {
        this.setName(name);
        this.setImg(img);
        this.setBox(box);
        this.setWeapon(weapon);

        this.setLife(100);
        this.setShield(false);
    }

    // GETTERS

    getName() {
        return this.name;
    }

    getImg() {
        return this.img;
    }

    getBox() {
        return this.box;
    }

    getWeapon() {
        return this.weapon;
    }

    getLife() {
        return this.life;
    }

    getShield() {
        return this.shield;
    }

    // SETTERS

    /**
     * @param {String} val 
     */
    setName(val) {
        if(typeof val == "string") {
            this.name = val;
        }
    }

    /**
     * @param {String} val 
     */
    setImg(val) {
        if(typeof val == "string") {
            this.img = val;
        }
        return null;
    }

    /**
     * @param {Object} newBox 
     */
    setBox(newBox) {
        if(typeof newBox == "object") {
            this.box = newBox;
        }
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
     * @param {Object} val 
     */
    setLife(val) {
        val = parseInt(val);
        if(val<=0) this.life = 0;
        else if(val>=0 && val<= 100) this.life = val;
        return null;
    }

    /**
     * @param {Boolean} val 
     */
    setShield(val) {
        if((typeof val) == "boolean") this.shield = val;
        return null;
    }

    /**
     * @description Attaque un autre joueur avec son arme
     * @param {Object} player 
     */
    attack(player) {
        if(typeof player == "object") {
            let damage = this.getWeapon().getDamage();
            player.receiveDamage(damage);
        }
        return null;
    }

    /**
     * @description Reçois des damages lorsqu'un autre joueur attaque
     * @param {Integer} damage 
     */
    receiveDamage(damage) {
        damage = parseInt(damage);
        if(this.getShield()) damage = damage/2; // Si il  à un bouclier les damage sont réduit de moitier
        
        this.setLife(this.getLife()-damage);
        return null;
    }

}

module.exports = Player;