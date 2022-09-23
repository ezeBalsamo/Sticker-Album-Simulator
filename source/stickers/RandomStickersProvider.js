export default class RandomStickersProvider {
    constructor(stickers) {
        this.stickers = stickers;
    }

    sampleSticker() {
        return this.allStickers()[Math.floor(Math.random() * this.stickers.length)];
    }

    allStickers() {
        return this.stickers;
    }

    provideDifferentStickersUpTo(numberOfStickers) {
        const sampleStickers = [];
        while (sampleStickers.length < numberOfStickers) {
            const sticker = this.sampleSticker();
            !sampleStickers.includes(sticker) && sampleStickers.push(sticker);
        }
        return sampleStickers;
    }
}
