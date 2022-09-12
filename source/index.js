let differenceBetween = (collection, anotherCollection) => {
    return collection.filter(element => !anotherCollection.includes(element));
}

class Sticker{
    constructor(name) {
        this.name = name
    }
}

class Pack{
    constructor(stickers, price) {
        this.stickers = stickers;
        this.price = price;
    }
}

class PackSpecification{
    constructor(price, numberOfStickers) {
        this.price = price;
        this.numberOfStickers = numberOfStickers;
    }

    minimumPriceToGet(requiredNumberOfStickers){
        return Math.ceil(requiredNumberOfStickers / this.numberOfStickers) * this.price;
    }

    moneyRequiredToPurchase(numberOfPacks){
        return numberOfPacks * this.price;
    }

    canPurchase(numberOfPacks, moneyToSpend){
        return moneyToSpend >= this.moneyRequiredToPurchase(numberOfPacks);
    }
}

class RandomStickersProvider{
    constructor(stickers) {
        this.stickers = stickers;
    }

    sampleSticker(){
        return this.allStickers()[Math.floor(Math.random() * this.stickers.length)];
    }

    allStickers(){
        return this.stickers;
    }

    provideDifferentStickersUpTo(numberOfStickers){
        const sampleStickers = [];
        while(sampleStickers.length < numberOfStickers){
            let sticker = this.sampleSticker();
            if(!sampleStickers.includes(sticker)){
                sampleStickers.push(sticker);
            }
        }
        return sampleStickers;
    }
}

class PackProvider{
    constructor(packSpecification, stickersProvider) {
        this.packSpecification = packSpecification;
        this.stickersProvider = stickersProvider;
    }

    pack(){
        const stickers = this.stickersProvider.provideDifferentStickersUpTo(this.packSpecification.numberOfStickers);
        return new Pack(stickers, this.packSpecification.price);
    }

    provide(numberOfPacks){
        const packs = [];
        for(let i = 0; i < numberOfPacks; i++){
            packs.push(this.pack());
        }
        return packs;
    }
}

class StickerAlbumSimulator{
    constructor(stickersProvider, packSpecification, playerNotifier, playerInputProvider) {
        this.stickersProvider = stickersProvider;
        this.packSpecification = packSpecification;
        this.playerNotifier = playerNotifier;
        this.playerInputProvider = playerInputProvider;
        this.packProvider = new PackProvider(this.packSpecification, this.stickersProvider);
        this.stickedStickers = [];
        this.purchasedPacks = [];
    }

    completionRatio(){
        return (this.stickedStickers.length) / this.stickersProvider.allStickers().length;
    }

    missingStickers(){
        return differenceBetween(this.stickersProvider.allStickers(), this.stickedStickers);
    }

    numberOfMissingStickers(){
        return this.missingStickers().length;
    }

    minimumPriceForCompleteness(){
        return this.packSpecification.minimumPriceToGet(this.numberOfMissingStickers());
    }

    isAlbumCompleted(){
        return this.numberOfMissingStickers() === 0;
    }

    startSimulationBySpendingAtMost(remainingMoney){
        this.playerNotifier.albumHasBeenGivenAway();
        while(this.canAlbumBeCompletedWith(remainingMoney) && !this.isAlbumCompleted()){
            this.playerNotifier.thereAreMissing(this.numberOfMissingStickers());
            const packs = this.buyPacksSpendingAtMost(remainingMoney);
            let purchasedPacksPrice = this.moneySpentWhenPurchasing(packs);
            remainingMoney = remainingMoney - purchasedPacksPrice;
            this.playerNotifier.packsPurchased(purchasedPacksPrice, remainingMoney);

            this.playerNotifier.aboutToOpen(packs.length);
            const newStickers = this.open(packs);
            this.playerNotifier.packsOpened(newStickers.length, this.completionPercentage());
        }

        this.playerNotifier.simulationHasEnded(this.isAlbumCompleted(), remainingMoney, this.purchasedPacks.length, this.completionPercentage());
    }

    startSimulation(){
        this.playerNotifier.aboutToStartSimulation();
        const moneyWillingToSpend = this.playerInputProvider.moneyWillingToSpend();
        const minimumPriceForCompleteness = this.minimumPriceForCompleteness();
        if (moneyWillingToSpend < minimumPriceForCompleteness) {
            this.playerNotifier.moneyWillingToSpendIsBelow(minimumPriceForCompleteness);
        } else {
            this.startSimulationBySpendingAtMost(moneyWillingToSpend);
        }
    }

    canAlbumBeCompletedWith(remainingMoney) {
        return remainingMoney >= this.minimumPriceForCompleteness();
    }

    canPurchase(numberOfPacks, remainingMoney){
        return this.packSpecification.canPurchase(numberOfPacks, remainingMoney);
    }

    buyPacksSpendingAtMost(remainingMoney){
        let numberOfPacks = this.playerInputProvider.numberOfPacksToPurchase();
        while (!this.canPurchase(numberOfPacks, remainingMoney)) {
            const moneyRequired = this.packSpecification.moneyRequiredToPurchase(numberOfPacks);
            console.log("moneyRequired:"+moneyRequired);
            this.playerNotifier.cannotPurchase(numberOfPacks, this.packSpecification.price, moneyRequired, remainingMoney);
            numberOfPacks = this.playerInputProvider.numberOfPacksToPurchase();
        }
        const packs = this.packProvider.provide(numberOfPacks);
        this.purchasedPacks.push(...packs);
        return packs;
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

class StickerAlbumSimulatorAlertNotifier{
    aboutToStartSimulation(){
        alert("Hi there! So, you want to complete this album... your wallet is going to suffer, you know that, right?");
    }

    moneyWillingToSpendIsBelow(minimumPriceForCompleteness){
        alert(`Say goodbye to your dreams. You need to spend $${minimumPriceForCompleteness}, at least.`);
    }

    albumHasBeenGivenAway(){
        alert("Well, just to be nice to you, I'm going to give you an album.");
    }

    thereAreMissing(numberOfStickers){
        alert(`You need ${numberOfStickers} stickers to complete the album.`);
    }

    cannotPurchase(numberOfPacks, packPrice, moneyRequired, remainingMoney){
        alert(`You can't purchase ${numberOfPacks} packs as they cost $${packPrice} each, so you have to spend $${moneyRequired}, but you only have $${remainingMoney} left. Purchase fewer packs.`);
    }

    packsPurchased(purchasedPacksPrice, remainingMoney){
        alert(`Packs purchased! It cost you $${purchasedPacksPrice}. You have $${remainingMoney} left.`);
    }

    aboutToOpen(numberOfPacks){
        alert(`Opening ${numberOfPacks} packs...`);
    }

    packsOpened(numberOfNewStickers, completionPercentage){
        if (numberOfNewStickers === 0) {
            alert('Oops, looks like you already had all those stickers.')
        } else {
            alert(`Great, you have ${numberOfNewStickers} new stickers! Your album progress is ${completionPercentage}%.`);
        }
    }

    simulationHasEnded(isAlbumCompleted, remainingMoney, numberOfPurchasedPacks, completionPercentage){
        if (isAlbumCompleted) {
            alert(`Congratulations, you managed to complete the album! You needed to buy ${numberOfPurchasedPacks} packs.`);
        } else if (remainingMoney === 0) {
            alert(`Oh no! You've run out of money.`);
            alert(`At least you managed to complete ${completionPercentage}% of your album.`);
        } else {
            alert("Well, it looks like you got so many repeat stickers that now you do not have enough money to complete the album.");
            alert(`At least you managed to complete ${completionPercentage}% of your album.`);
        }
    }
}

class StickerAlbumSimulatorPrompter{
    moneyWillingToSpend(){
        return Number(prompt("Before we start, how much money are you willing to spend?"));
    }

    numberOfPacksToPurchase(){
        return Number(prompt("How many packs do you want to purchase?"));
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
const stickers = [...argentinaStickers, ...brazilStickers]

const stickersProvider = new RandomStickersProvider(stickers);
const packSpecification = new PackSpecification(150, 5);
const playerNotifier = new StickerAlbumSimulatorAlertNotifier();
const playerInputPrompter = new StickerAlbumSimulatorPrompter();

const simulator = new StickerAlbumSimulator(stickersProvider, packSpecification, playerNotifier, playerInputPrompter);
simulator.startSimulation();