import Pack from "./Pack.js";

export default class PackProvider {
    constructor(packSpecification, stickersProvider) {
        this.packSpecification = packSpecification;
        this.stickersProvider = stickersProvider;
    }

    pack() {
        const stickers = this.stickersProvider.provideDifferentStickersUpTo(this.packSpecification.numberOfStickers);
        return new Pack(stickers, this.packSpecification.price);
    }

    provide(numberOfPacks) {
        const packs = [];
        for (let i = 0; i < numberOfPacks; i++) {
            packs.push(this.pack());
        }
        return packs;
    }
}
