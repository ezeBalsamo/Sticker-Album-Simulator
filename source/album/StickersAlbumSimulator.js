import PackProvider from "../packs/PackProvider.js";
import {differenceBetween} from "../collection/extensions.js";

export default class StickersAlbumSimulator {
    constructor(player, stickersProvider, packSpecification, interactionSystem) {
        this.player = player;
        this.stickersProvider = stickersProvider;
        this.packSpecification = packSpecification;
        this.interactionSystem = interactionSystem;
        this.packProvider = new PackProvider(this.packSpecification, this.stickersProvider);
        this.stickedStickers = [];
        this.purchasedPacks = [];
    }

    completionRatio() {
        return (this.stickedStickers.length) / this.stickersProvider.allStickers().length;
    }

    missingStickers() {
        return differenceBetween(this.stickersProvider.allStickers(), this.stickedStickers);
    }

    numberOfMissingStickers() {
        return this.missingStickers().length;
    }

    minimumPriceForCompleteness() {
        return this.packSpecification.minimumPriceToGet(this.numberOfMissingStickers());
    }

    isAlbumCompleted() {
        return this.numberOfMissingStickers() === 0;
    }

    runTheSimulationSpendingAtMost(remainingMoney) {
        if (this.canAlbumBeCompletedWith(remainingMoney) && !this.isAlbumCompleted()){
            this.interactionSystem.thereAreMissing(this.numberOfMissingStickers());
            this.purchasePacksAndDo(remainingMoney, packs => {
                let purchasedPacksPrice = this.moneySpentWhenPurchasing(packs);
                remainingMoney = remainingMoney - purchasedPacksPrice;
                this.interactionSystem.packsPurchased(purchasedPacksPrice, remainingMoney);

                this.interactionSystem.aboutToOpen(packs.length);
                const newStickers = this.open(packs);
                this.interactionSystem.packsOpened(newStickers.length, this.completionPercentage());
                this.runTheSimulationSpendingAtMost(remainingMoney);
            });
        }else {
            this.interactionSystem.simulationHasEnded(this.isAlbumCompleted(), this.player, remainingMoney, this.purchasedPacks.length, this.completionPercentage());
        }
    }

    startSimulation() {
        this.interactionSystem.aboutToStartSimulationFor(this.player);
        this.interactionSystem.withMoneyWillingToSpendDo(moneyWillingToSpend => {
            const minimumPriceForCompleteness = this.minimumPriceForCompleteness();
            if (moneyWillingToSpend < minimumPriceForCompleteness) {
                this.interactionSystem.moneyWillingToSpendIsBelow(minimumPriceForCompleteness);
            } else {
                this.interactionSystem.albumHasBeenGivenAway();
                this.runTheSimulationSpendingAtMost(moneyWillingToSpend);
            }
        });
    }

    canAlbumBeCompletedWith(remainingMoney) {
        return remainingMoney >= this.minimumPriceForCompleteness();
    }

    canPurchase(numberOfPacks, remainingMoney) {
        return this.packSpecification.canPurchase(numberOfPacks, remainingMoney);
    }

    purchasePacksAndDo(remainingMoney, callback) {
        this.interactionSystem.withNumberOfPacksToPurchaseDo(numberOfPacks => {
            if(this.canPurchase(numberOfPacks, remainingMoney)) {
                const packs = this.packProvider.provide(numberOfPacks);
                this.purchasedPacks.push(...packs);
                callback(packs);
            }else{
                const moneyRequired = this.packSpecification.moneyRequiredToPurchase(numberOfPacks);
                this.interactionSystem.cannotPurchase(numberOfPacks, this.packSpecification.price, moneyRequired, remainingMoney);
                this.purchasePacksAndDo(remainingMoney, callback);
            }
        })
    }

    moneySpentWhenPurchasing(packs) {
        return packs.reduce((sum, pack) => sum + pack.price, 0);
    }

    open(packs) {
        const newStickers = [];
        packs.forEach(pack => {
            const newStickersFromPack = this.newStickersAfterOpening(pack);
            newStickers.push(...newStickersFromPack);
            this.stickedStickers.push(...newStickersFromPack);
        });
        return newStickers;
    }

    newStickersAfterOpening(pack) {
        return differenceBetween(pack.stickers, this.stickedStickers);
    }

    completionPercentage() {
        return Math.floor(this.completionRatio() * 100);
    }
}
