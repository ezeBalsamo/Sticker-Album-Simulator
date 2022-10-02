import {differenceBetween} from "../collection/extensions.js";
import Sticker from "../stickers/Sticker.js";

export default class AlbumProgress {
    constructor(playerName, money, stickers, purchasedPacks) {
        this.playerName = playerName;
        this.money = money;
        this.stickers = stickers;
        this.purchasedPacks = purchasedPacks;
    }

    static initialFor(playerName, money){
        return new this(playerName, money, [], []);
    }

    static fromJson({playerName, money, stickers, purchasedPacks}) {
        return new this(playerName, money, stickers, purchasedPacks);
    }

    numberOfMissingStickersConsidering(allStickers) {
        return this.missingStickersConsidering(allStickers).length;
    }

    missingStickersConsidering(allStickers) {
        return differenceBetween(allStickers, this.stickers, Sticker.areEquivalents);
    }

    beFilledWith(pack) {
        this.purchasedPacks.push(pack);
        const newStickers = this.newStickersAfterOpening(pack);
        this.stickers.push(...newStickers);
        return newStickers;
    }

    newStickersAfterOpening(pack) {
        return this.missingStickersConsidering(pack.stickers);
    }

    beFilledWithAllSpending(packs, moneySpent) {
        this.money -= moneySpent;
        return packs.reduce((newStickers, pack) => {
            const newStickersFormPack = this.beFilledWith(pack);
            newStickers.push(...newStickersFormPack);
            return newStickers;
        }, []);
    }

    completionPercentageConsidering(allStickers){
        return Math.floor(this.completionRatioConsidering(allStickers) * 100);
    }

    completionRatioConsidering(allStickers) {
        return (this.stickers.length) / allStickers.length;
    }

    get numberOfPurchasedPacks(){
        return this.purchasedPacks.length;
    }

    hasRanOutOfMoney(){
        return this.money === 0;
    }
}