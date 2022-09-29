import FormBuilder from "./FormBuilder.js";

export default class DOMBasedInteractionSystem {
    constructor() {
        this.mainContent = document.getElementById('game');
        this.generalNotificationParagraph = document.createElement('p');
        this.albumCompletionParagraph = document.createElement('p');
        this.openingPacksParagraph = document.createElement('p');
        this.openedPacksResultParagraph = document.createElement('p');
        this.mainContent.appendChild(this.generalNotificationParagraph);
        this.mainContent.appendChild(this.openingPacksParagraph);
        this.mainContent.appendChild(this.openedPacksResultParagraph);
        this.mainContent.appendChild(this.albumCompletionParagraph);
        document.body.appendChild(this.mainContent);
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

    aboutToStartSimulationFor(player) {
        this.updateGeneralNotificationTextTo(`Hi ${player}! So, you want to complete this album... your wallet is going to suffer, you know that, right?`);
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

    packsOpened(numberOfNewStickers, completionPercentage) {
        if (numberOfNewStickers === 0) {
            this.openedPacksOnlyHadRepeatedStickers();
        } else {
            this.openedPacksHadNewStickers(numberOfNewStickers, completionPercentage);
        }
    }

    openedPacksOnlyHadRepeatedStickers() {
        this.updateOpenedPacksResultTextTo('Oops, looks like you already had all those stickers.');
    }

    openedPacksHadNewStickers(numberOfNewStickers, completionPercentage) {
        this.updateOpenedPacksResultTextTo(`Great, you have ${numberOfNewStickers} new stickers! Your album progress is ${completionPercentage}%.`);
    }

    simulationHasEnded(isAlbumCompleted, player, remainingMoney, numberOfPurchasedPacks, completionPercentage) {
        this.generalNotificationParagraph.remove();
        this.openedPacksResultParagraph.remove();
        this.openingPacksParagraph.remove();
        if (isAlbumCompleted) {
            this.albumHasBeenCompleted(player, numberOfPurchasedPacks);
        } else if (remainingMoney === 0) {
            this.moneyHasRunOut(player, completionPercentage);
        } else {
            this.remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(player, completionPercentage);
        }
    }

    descriptionThatAlbumIsCompletedUpTo(completionPercentage) {
        return `At least you managed to complete ${completionPercentage}% of your album.`;
    }

    albumHasBeenCompleted(player, numberOfPurchasedPacks) {
        this.updateAlbumCompletionTextWithColorTo(`Congratulations ${player}, you managed to complete the album! You needed to buy ${numberOfPurchasedPacks} packs.`, 'green');
    }

    moneyHasRunOut(player, completionPercentage) {
        this.updateAlbumCompletionTextWithColorTo(`${player}, I'm sorry to tell you this, but you've run out of money. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`, 'red');
    }

    remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(player, completionPercentage) {
        this.updateAlbumCompletionTextWithColorTo(`Well ${player}, it looks like you got so many repeat stickers that now you do not have enough money to complete the album. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`, 'red');
    }

    withMoneyWillingToSpendDo(callback) {
        const paragraph = document.createElement("p");
        paragraph.innerText = "Before we start, how much money are you willing to spend?";

        const form =
            new FormBuilder()
                .addNumericInputLabeled('money')
                .withDataFromSubmitDo(formData => {
                    paragraph.remove();
                    form.remove();
                    callback(Number(formData.money));
                })
                .build();

        this.mainContent
            .appendChild(paragraph)
            .appendChild(form);
    }

    withNumberOfPacksToPurchaseDo(callback) {
        const paragraph = document.createElement("p");
        paragraph.innerText = "How many packs do you want to purchase?";

        const form =
            new FormBuilder()
                .addNumericInputLabeled("packs")
                .withDataFromSubmitDo(formData => {
                    paragraph.remove();
                    form.remove();
                    callback(Number(formData.packs));
                })
                .build();

        this.mainContent
            .appendChild(paragraph)
            .appendChild(form);
    }

    withPlayerDo(callback) {
        const paragraph = document.createElement("p");
        paragraph.innerText = "Hello and welcome! Enter your name to continue...";

        const form =
            new FormBuilder()
                .addTextInputLabeled('name')
                .withDataFromSubmitDo(formData => {
                    paragraph.remove();
                    form.remove();
                    callback(formData.name);
                })
                .build();

        this.mainContent
            .appendChild(paragraph)
            .appendChild(form);
    }
}
