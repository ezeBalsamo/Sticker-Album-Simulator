export default class Sticker {

    static areEquivalents(sticker, anotherSticker){
        return sticker.name === anotherSticker.name;
    }

    constructor(name) {
        this.name = name
    }
}
