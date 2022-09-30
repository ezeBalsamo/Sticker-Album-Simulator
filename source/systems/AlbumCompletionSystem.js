import PackProvider from "../packs/PackProvider.js";
import AlbumProgress from "../album/AlbumProgress.js";
import AlbumProgressCalculator from "../album/AlbumProgressCalculator.js";

export default class AlbumCompletionSystem {
    static name = 'Album Completion System';

    constructor(stickersProvider, packSpecification) {
        this.stickersProvider = stickersProvider;
        this.packSpecification = packSpecification;
        this.packProvider = new PackProvider(this.packSpecification, this.stickersProvider);
        this.progressByPlayer = new Map();
        this.calculator = new AlbumProgressCalculator(this);
    }

    get name() {
        return this.constructor.name;
    }

    beChildOf(rootSystem) {
        this.rootSystem = rootSystem;
    }

    resolveDependencies() {
        const players = this.rootSystem.playerSystem().players;
        players.forEach(player => {
            const progressOrNull = JSON.parse(localStorage.getItem(player));
            progressOrNull && this.progressByPlayer.set(player, AlbumProgress.fromJson(progressOrNull));
        })
    }

    allStickers() {
        return this.stickersProvider.allStickers;
    }

    minimumPriceToGet(numberOfStickers) {
        return this.packSpecification.minimumPriceToGet(numberOfStickers);

    }

    ifMoneyIsEnoughDo(moneyWillingToSpend, enough, notEnough) {
        const requiredMoney = this.minimumPriceToGet(this.allStickers().length);
        return moneyWillingToSpend < requiredMoney ? notEnough(requiredMoney) : enough();
    }

    startAlbumCompletionFor(playerName, money) {
        const albumProgress = AlbumProgress.initialFor(playerName, money);
        this.progressByPlayer.set(playerName, albumProgress);
        localStorage.setItem(playerName, JSON.stringify(albumProgress));
    }

    progressOf(playerName) {
        return this.withProgressDo(playerName,
            progress => progress,
            () =>{throw new Error(`Not found album progress of ${playerName}`)});
    }

    withProgressDo(playerName, found, notFound) {
        return this.progressByPlayer.has(playerName)
            ? found(this.progressByPlayer.get(playerName))
            : notFound();
    }

    numberOfMissingStickersOf(playerName) {
        return this.progressOf(playerName).numberOfMissingStickersConsidering(this.allStickers());
    }

    ifCanPurchaseDo(playerName, numberOfPacks, canPurchase, cannotPurchase) {
        const money = this.progressOf(playerName).money;
        this.packSpecification.canPurchase(numberOfPacks, money)
            ? canPurchase()
            : cannotPurchase(this.packSpecification.moneyRequiredToPurchase(numberOfPacks), this.packSpecification.price, money);
    }

    purchase(playerName, numberOfPacks) {
        const progress = this.progressOf(playerName);
        const packs = this.packProvider.provide(numberOfPacks);
        const moneySpent = packs.reduce((sum, pack) => sum + pack.price, 0);
        const newStickers = progress.beFilledWithAllSpending(packs, moneySpent);
        this.saveProgress(progress);
        return {moneySpent, remainingMoney: progress.money, newStickers};
    }

    completionPercentageOf(playerName) {
        return this.progressOf(playerName).completionPercentageConsidering(this.allStickers());
    }

    saveProgress(progress) {
        localStorage.setItem(progress.playerName, JSON.stringify(progress));
    }

    ifCanAlbumBeCompletedDo(playerName, canBeCompleted, cannotBeCompleted) {
        return this.calculator.canBeCompleted(this.progressOf(playerName))
            ? canBeCompleted()
            : cannotBeCompleted();
    }

    isCompletedAlbumOf(playerName) {
        return this.calculator.isCompleted(this.progressOf(playerName));
    }

    numberOfPurchasedPacksOf(playerName) {
        return this.progressOf(playerName).numberOfPurchasedPacks;
    }

    hasRanOutOfMoney(playerName) {
        return this.progressOf(playerName).hasRanOutOfMoney();
    }

    purgeProgressOf(playerName){
        localStorage.removeItem(playerName);
    }
}