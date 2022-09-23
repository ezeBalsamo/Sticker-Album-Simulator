export default class RandomStickersProvider {
    constructor(stickers) {
        this.allStickers = stickers;
    }

    sampleSticker() {
        return this.allStickers[Math.floor(Math.random() * this.allStickers.length)];
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
