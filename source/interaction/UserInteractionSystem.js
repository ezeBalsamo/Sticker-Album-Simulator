export default class UserInteractionSystem {

    signalSubclassResponsibilityFor(method) {
        throw new Error(`${this.constructor.name} must implement ${method.name} since is a subclass responsibility.`)
    }

    aboutToStartSimulationFor(player) {
        this.signalSubclassResponsibilityFor(this.aboutToStartSimulationFor);
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

    simulationHasEnded(isAlbumCompleted, player, remainingMoney, numberOfPurchasedPacks, completionPercentage) {
        if (isAlbumCompleted) {
            this.albumHasBeenCompleted(player, numberOfPurchasedPacks);
        } else if (remainingMoney === 0) {
            this.moneyHasRunOut(player, completionPercentage);
        } else {
            this.remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(player, completionPercentage);
        }
    }

    albumHasBeenCompleted(player, numberOfPurchasedPacks) {
        this.signalSubclassResponsibilityFor(this.albumHasBeenCompleted);
    }

    moneyHasRunOut(player, completionPercentage) {
        this.signalSubclassResponsibilityFor(this.moneyHasRunOut);
    }

    remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(player, completionPercentage) {
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
