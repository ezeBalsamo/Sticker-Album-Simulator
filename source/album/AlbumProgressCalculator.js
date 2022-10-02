export default class AlbumProgressCalculator {
    constructor(albumCompletionSystem) {
        this.albumCompletionSystem = albumCompletionSystem;
    }

    canBeCompleted(albumProgress) {
        const numberOfMissingStickers = this.numberOfMissingStickersIn(albumProgress);
        return !this.isCompletedConsidering(numberOfMissingStickers) && this.isMoneyEnoughForPurchasing(numberOfMissingStickers, albumProgress.money);
    }

    isCompletedConsidering(numberOfMissingStickers){
        return numberOfMissingStickers === 0;
    }

    isCompleted(albumProgress) {
        return this.isCompletedConsidering(this.numberOfMissingStickersIn(albumProgress));
    }

    numberOfMissingStickersIn(albumProgress) {
        return albumProgress.numberOfMissingStickersConsidering(this.albumCompletionSystem.allStickers());
    }

    isMoneyEnoughForPurchasing(numberOfMissingStickers, money) {
        return money >= this.albumCompletionSystem.minimumPriceToGet(numberOfMissingStickers);
    }
}