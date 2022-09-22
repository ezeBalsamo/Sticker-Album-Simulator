export default class UserInteractionSystem {

    signalSubclassResponsibilityFor(method) {
        throw new Error(`${this.constructor.name} must implement ${method.name} since is a subclass responsibility.`)
    }

    aboutToStartSimulation() {
        this.signalSubclassResponsibilityFor(this.aboutToStartSimulation);
    }

    moneyWillingToSpendIsBelow(minimumPriceForCompleteness) {
        this.signalSubclassResponsibilityFor(this.moneyWillingToSpendIsBelow);
    }

    albumHasBeenGivenAway() {
        this.signalSubclassResponsibilityFor(this.albumHasBeenGivenAway);
    }

    thereAreMissing(numberOfStickers) {
        this.signalSubclassResponsibilityFor(this.thereAreMissing);
    }

    cannotPurchase(numberOfPacks, packPrice, moneyRequired, remainingMoney) {
        this.signalSubclassResponsibilityFor(this.cannotPurchase);
    }

    packsPurchased(purchasedPacksPrice, remainingMoney) {
        this.signalSubclassResponsibilityFor(this.packsPurchased);
    }

    aboutToOpen(numberOfPacks) {
        this.signalSubclassResponsibilityFor(this.aboutToOpen);
    }

    packsOpened(numberOfNewStickers, completionPercentage) {
        if (numberOfNewStickers === 0) {
            this.openedPacksOnlyHadRepeatedStickers();
        } else {
            this.openedPacksHadNewStickers(numberOfNewStickers, completionPercentage);
        }
    }

    openedPacksOnlyHadRepeatedStickers() {
        this.signalSubclassResponsibilityFor(this.openedPacksOnlyHadRepeatedStickers);
    }

    openedPacksHadNewStickers(numberOfNewStickers, completionPercentage) {
        this.signalSubclassResponsibilityFor(this.openedPacksHadNewStickers);
    }

    simulationHasEnded(isAlbumCompleted, remainingMoney, numberOfPurchasedPacks, completionPercentage) {
        if (isAlbumCompleted) {
            this.albumHasBeenCompleted(numberOfPurchasedPacks);
        } else if (remainingMoney === 0) {
            this.moneyHasRunOut(completionPercentage);
        } else {
            this.remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(completionPercentage);
        }
    }

    albumHasBeenCompleted(numberOfPurchasedPacks) {
        this.signalSubclassResponsibilityFor(this.albumHasBeenCompleted);
    }

    moneyHasRunOut(completionPercentage) {
        this.signalSubclassResponsibilityFor(this.moneyHasRunOut);
        1
    }

    remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(completionPercentage) {
        this.signalSubclassResponsibilityFor(this.remainingMoneyNotEnoughDueToExcessOfRepeatedStickers);
    }

    descriptionThatAlbumIsCompletedUpTo(completionPercentage) {
        return `At least you managed to complete ${completionPercentage}% of your album.`;
    }

    withMoneyWillingToSpendDo(callback) {
        this.signalSubclassResponsibilityFor(this.withMoneyWillingToSpendDo);
    }

    withNumberOfPacksToPurchaseDo(callback) {
        this.signalSubclassResponsibilityFor(this.withNumberOfPacksToPurchaseDo);
    }
}
