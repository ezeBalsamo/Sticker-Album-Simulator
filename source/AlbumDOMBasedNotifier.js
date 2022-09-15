import StickerAlbumNotifier from "./StickerAlbumNotifier.js";

export default class AlbumDOMBasedNotifier extends StickerAlbumNotifier {
    constructor() {
        super();
        let mainContent = document.createElement('main');
        this.generalNotificationParagraph = document.createElement('p');
        this.albumCompletionParagraph = document.createElement('p');
        this.openingPacksParagraph = document.createElement('p');
        this.openedPacksResultParagraph = document.createElement('p');
        mainContent.appendChild(this.generalNotificationParagraph);
        mainContent.appendChild(this.albumCompletionParagraph);
        mainContent.appendChild(this.openingPacksParagraph);
        mainContent.appendChild(this.openedPacksResultParagraph);
        document.body.appendChild(mainContent);
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

    updateAlbumCompletionTextWithColorTo(text, color){
        this.updateAlbumCompletionTextTo(text);
        this.albumCompletionParagraph.style.color = color;
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
        this.updateAlbumCompletionTextWithColorTo(`Congratulations, you managed to complete the album! You needed to buy ${numberOfPurchasedPacks} packs.`, 'green');
    }

    simulationHasEnded(isAlbumCompleted, remainingMoney, numberOfPurchasedPacks, completionPercentage) {
        this.generalNotificationParagraph.remove();
        this.openedPacksResultParagraph.remove();
        this.openingPacksParagraph.remove();
        super.simulationHasEnded(isAlbumCompleted, remainingMoney, numberOfPurchasedPacks, completionPercentage);
    }

    moneyHasRunOut(completionPercentage) {
        this.updateAlbumCompletionTextWithColorTo(`Oh no! You've run out of money. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`, 'red');
    }

    remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(completionPercentage) {
        this.updateAlbumCompletionTextWithColorTo(`Well, it looks like you got so many repeat stickers that now you do not have enough money to complete the album. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`, 'red');
    }
}
