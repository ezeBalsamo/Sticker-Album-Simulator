import AlbumDOMBasedNotifier from './notifier/AlbumDOMBasedNotifier.js';
import AlbumDOMBasedInputProvider from "./input-provider/AlbumDOMBasedInputProvider.js";
import {differenceBetween} from "./collection/extensions.js";
import Sticker from "./stickers/Sticker.js";
import RandomStickersProvider from "./stickers/RandomStickersProvider.js";
import Pack from "./packs/Pack.js";

class PackSpecification {
    constructor(price, numberOfStickers) {
        this.price = price;
        this.numberOfStickers = numberOfStickers;
    }

    minimumPriceToGet(requiredNumberOfStickers) {
        return Math.ceil(requiredNumberOfStickers / this.numberOfStickers) * this.price;
    }

    moneyRequiredToPurchase(numberOfPacks) {
        return numberOfPacks * this.price;
    }

    canPurchase(numberOfPacks, moneyToSpend) {
        return moneyToSpend >= this.moneyRequiredToPurchase(numberOfPacks);
    }
}

class PackProvider {
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

class StickerAlbumSimulator {
    constructor(stickersProvider, packSpecification, playerNotifier, playerInputProvider) {
        this.stickersProvider = stickersProvider;
        this.packSpecification = packSpecification;
        this.playerNotifier = playerNotifier;
        this.playerInputProvider = playerInputProvider;
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
            this.playerNotifier.thereAreMissing(this.numberOfMissingStickers());
            this.purchasePacksAndDo(remainingMoney, packs => {
                let purchasedPacksPrice = this.moneySpentWhenPurchasing(packs);
                remainingMoney = remainingMoney - purchasedPacksPrice;
                this.playerNotifier.packsPurchased(purchasedPacksPrice, remainingMoney);

                this.playerNotifier.aboutToOpen(packs.length);
                const newStickers = this.open(packs);
                this.playerNotifier.packsOpened(newStickers.length, this.completionPercentage());
                this.runTheSimulationSpendingAtMost(remainingMoney);
            });
        }else {
            this.playerNotifier.simulationHasEnded(this.isAlbumCompleted(), remainingMoney, this.purchasedPacks.length, this.completionPercentage());
        }
    }

    startSimulation() {
        this.playerNotifier.aboutToStartSimulation();
        this.playerInputProvider.withMoneyWillingToSpendDo(moneyWillingToSpend => {
            const minimumPriceForCompleteness = this.minimumPriceForCompleteness();
            if (moneyWillingToSpend < minimumPriceForCompleteness) {
                this.playerNotifier.moneyWillingToSpendIsBelow(minimumPriceForCompleteness);
            } else {
                this.playerNotifier.albumHasBeenGivenAway();
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
        this.playerInputProvider.withNumberOfPacksToPurchaseDo(numberOfPacks => {
            if(this.canPurchase(numberOfPacks, remainingMoney)) {
                const packs = this.packProvider.provide(numberOfPacks);
                this.purchasedPacks.push(...packs);
                callback(packs);
            }else{
                const moneyRequired = this.packSpecification.moneyRequiredToPurchase(numberOfPacks);
                this.playerNotifier.cannotPurchase(numberOfPacks, this.packSpecification.price, moneyRequired, remainingMoney);
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

const argentinaStickers = [
    new Sticker('Argentina Logo'),
    new Sticker('Emiliano Martinez'),
    new Sticker('Marcos Acuña'),
    new Sticker('Nahuel Molina'),
    new Sticker('Nicolás Otamendi'),
    new Sticker('Cristian Romero'),
    new Sticker('Rodrigo de Paul'),
    new Sticker('Ángel Di María'),
    new Sticker('Giovanni Lo Celso'),
    new Sticker('Leandro Paredes'),
    new Sticker('Lautaro Martinez'),
    new Sticker('Lionel Messi')
]

const brazilStickers = [
    new Sticker('Brasil Logo'),
    new Sticker('Alisson'),
    new Sticker('Alex Sandro'),
    new Sticker('Danilo'),
    new Sticker('Marquinhos'),
    new Sticker('Thiago Silva'),
    new Sticker('Casemiro'),
    new Sticker('Fred'),
    new Sticker('Lucas Paquetá'),
    new Sticker('Gabriel Jesús'),
    new Sticker('Neymar Jr'),
    new Sticker('Vinícius Jr')
]

const stickers = [...argentinaStickers, ...brazilStickers];

const stickersProvider = new RandomStickersProvider(stickers);
const packSpecification = new PackSpecification(150, 5);
const playerNotifier = new AlbumDOMBasedNotifier();
const playerInputProvider = new AlbumDOMBasedInputProvider();

const simulator = new StickerAlbumSimulator(stickersProvider, packSpecification, playerNotifier, playerInputProvider);

simulator.startSimulation();
