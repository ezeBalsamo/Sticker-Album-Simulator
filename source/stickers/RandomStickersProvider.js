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
            let sticker = this.sampleSticker();
            if (!sampleStickers.includes(sticker)) {
                sampleStickers.push(sticker);
            }
        }
        return sampleStickers;
    }
}
