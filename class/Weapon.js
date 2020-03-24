class Weapon {
    /**
     * @description Weapon instance
     * @param {String} name Weapon name
     * @param {String} img Image name
     * @param {Integer} damage Damage value
     */
    constructor(name, img, damage = 10) {
        this.setName(name);
        this.setImg(img);
        this.setDamage(damage);
    }

    // GETTERS

    getName() {
        return this.name;
    }

    getImg() {
        return this.img;
    }
    getDamage() {
        return this.damage;
    }

    // SETTERS

    setName(val) {
        if(typeof val == "string") {
            this.name = val;
        }
        return null;
    }

    setImg(val) {
        if(typeof val == "string") {
            this.img = val;
        }
        return null;
    }

    setDamage(val) {
        this.damage = parseInt(val);
        return null;
    }

}

module.exports = Weapon;