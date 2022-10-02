export default class ApplicationContext {
    constructor(rootSystem) {
        this.rootSystem = rootSystem;
    }

    playerNamed(playerName, ifFound, ifNone) {
        return this.rootSystem.playerSystem().playerNamed(playerName, ifFound, ifNone);
    }

    registerPlayerNamed(playerName){
        return this.rootSystem.playerSystem().registerPlayerNamed(playerName);
    }

    withProgressDo(playerName, found, notFound){
        return this.rootSystem.albumCompletionSystem().withProgressDo(playerName, found, notFound);
    }

    ifMoneyIsEnoughDo(moneyWillingToSpend, enough, notEnough){
        return this.rootSystem.albumCompletionSystem().ifMoneyIsEnoughDo(moneyWillingToSpend, enough, notEnough);
    }

    startAlbumCompletionFor(playerName, money){
        return this.rootSystem.albumCompletionSystem().startAlbumCompletionFor(playerName, money);
    }

    numberOfMissingStickersOf(playerName){
        return this.rootSystem.albumCompletionSystem().numberOfMissingStickersOf(playerName);
    }

    ifCanPurchaseDo(playerName, numberOfPacks, canPurchase, cannotPurchase){
        return this.rootSystem.albumCompletionSystem().ifCanPurchaseDo(playerName, numberOfPacks, canPurchase, cannotPurchase);
    }

    purchase(playerName, numberOfPacks){
        return this.rootSystem.albumCompletionSystem().purchase(playerName, numberOfPacks);
    }

    completionPercentageOf(playerName){
        return this.rootSystem.albumCompletionSystem().completionPercentageOf(playerName);
    }

    ifCanAlbumBeCompletedDo(playerName, canBeCompleted, cannotBeCompleted){
        return this.rootSystem.albumCompletionSystem().ifCanAlbumBeCompletedDo(playerName, canBeCompleted, cannotBeCompleted);
    }

    isCompletedAlbumOf(playerName){
        return this.rootSystem.albumCompletionSystem().isCompletedAlbumOf(playerName);
    }

    numberOfPurchasedPacksOf(playerName){
        return this.rootSystem.albumCompletionSystem().numberOfPurchasedPacksOf(playerName);
    }

    hasRanOutOfMoney(playerName){
        return this.rootSystem.albumCompletionSystem().hasRanOutOfMoney(playerName);
    }

    purgeProgressOf(playerName){
        return this.rootSystem.albumCompletionSystem().purgeProgressOf(playerName);
    }
}