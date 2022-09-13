import StickerAlbumNotifier from "./StickerAlbumNotifier.js";

export default class AlbumDOMBasedNotifier extends StickerAlbumNotifier {
    constructor() {
        super();
        let division = document.createElement('div');
        this.generalNotificationParagraph = document.createElement('p');
        this.albumCompletionParagraph = document.createElement('p');
        this.openingPacksParagraph = document.createElement('p');
        this.openedPacksResultParagraph = document.createElement('p');
        division.appendChild(this.generalNotificationParagraph);
        division.appendChild(this.albumCompletionParagraph);
        division.appendChild(this.openingPacksParagraph);
        division.appendChild(this.openedPacksResultParagraph);
        document.body.appendChild(division);
    }

    updateGeneralNotificationTextTo(text) {
        this.generalNotificationParagraph.innerText = text;
    }

    clearGeneralNotificationText() {
        this.generalNotificationParagraph.innerText = '';
        return this;
    }

    updateAlbumCompletionTextTo(text) {
        this.albumCompletionParagraph.innerText = text;
    }

    clearPacksOpeningText() {
        this.openingPacksParagraph.innerText = '';
        this.openedPacksResultParagraph.innerText = '';
        return this;
    }

    updateOpenedPacksResultTextTo(text) {
        this.openedPacksResultParagraph.innerText = text;
    }

    updateOpeningPacksTextTo(text) {
        this.openingPacksParagraph.innerText = text;
    }

    aboutToStartSimulation() {
        this.updateGeneralNotificationTextTo("Hi there! So, you want to complete this album... your wallet is going to suffer, you know that, right?");
    }

    moneyWillingToSpendIsBelow(minimumPriceForCompleteness) {
        this.updateGeneralNotificationTextTo(`Say goodbye to your dreams. You need to spend $${minimumPriceForCompleteness}, at least.`);
    }

    albumHasBeenGivenAway() {
        this.updateGeneralNotificationTextTo("Well, just to be nice to you, I'm going to give you an album.");
    }

    thereAreMissing(numberOfStickers) {
        this.updateAlbumCompletionTextTo(`You need ${numberOfStickers} stickers to complete the album.`);
    }

    cannotPurchase(numberOfPacks, packPrice, moneyRequired, remainingMoney) {
        this
            .clearGeneralNotificationText()
            .clearPacksOpeningText()
            .updateAlbumCompletionTextTo(`You can't purchase ${numberOfPacks} packs as they cost $${packPrice} each, so you have to spend $${moneyRequired}, but you only have $${remainingMoney} left. Purchase fewer packs.`);
    }

    packsPurchased(purchasedPacksPrice, remainingMoney) {
        this
            .clearGeneralNotificationText()
            .updateAlbumCompletionTextTo(`Packs purchased! It cost you $${purchasedPacksPrice}. You have $${remainingMoney} left.`);
    }

    aboutToOpen(numberOfPacks) {
        this.updateOpeningPacksTextTo(`Opening ${numberOfPacks} packs...`);
    }

    openedPacksOnlyHadRepeatedStickers() {
        this.updateOpenedPacksResultTextTo('Oops, looks like you already had all those stickers.');
    }

    openedPacksHadNewStickers(numberOfNewStickers, completionPercentage) {
        this.updateOpenedPacksResultTextTo(`Great, you have ${numberOfNewStickers} new stickers! Your album progress is ${completionPercentage}%.`);
    }

    albumHasBeenCompleted(numberOfPurchasedPacks) {
        this.updateAlbumCompletionTextTo(`Congratulations, you managed to complete the album! You needed to buy ${numberOfPurchasedPacks} packs.`);
    }

    simulationHasEnded(isAlbumCompleted, remainingMoney, numberOfPurchasedPacks, completionPercentage) {
        this.clearPacksOpeningText();
        super.simulationHasEnded(isAlbumCompleted, remainingMoney, numberOfPurchasedPacks, completionPercentage);
    }

    moneyHasRunOut(completionPercentage) {
        this.updateAlbumCompletionTextTo(`Oh no! You've run out of money. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`);
    }

    remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(completionPercentage) {
        this.updateAlbumCompletionTextTo(`Well, it looks like you got so many repeat stickers that now you do not have enough money to complete the album. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`);
    }
}
