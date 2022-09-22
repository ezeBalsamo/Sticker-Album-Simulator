import UserInteractionSystem from "./UserInteractionSystem.js";

export default class AlertBasedInteractionSystem extends UserInteractionSystem {
    aboutToStartSimulationFor(player) {
        alert(`Hi ${player}! So, you want to complete this album... your wallet is going to suffer, you know that, right?`);
    }

    moneyWillingToSpendIsBelow(minimumPriceForCompleteness) {
        alert(`Say goodbye to your dreams. You need to spend $${minimumPriceForCompleteness}, at least.`);
    }

    albumHasBeenGivenAway() {
        alert("Well, just to be nice to you, I'm going to give you an album.");
    }

    thereAreMissing(numberOfStickers) {
        alert(`You need ${numberOfStickers} stickers to complete the album.`);
    }

    cannotPurchase(numberOfPacks, packPrice, moneyRequired, remainingMoney) {
        alert(`You can't purchase ${numberOfPacks} packs as they cost $${packPrice} each, so you have to spend $${moneyRequired}, but you only have $${remainingMoney} left. Purchase fewer packs.`);
    }

    packsPurchased(purchasedPacksPrice, remainingMoney) {
        alert(`Packs purchased! It cost you $${purchasedPacksPrice}. You have $${remainingMoney} left.`);
    }

    aboutToOpen(numberOfPacks) {
        alert(`Opening ${numberOfPacks} packs...`);
    }

    openedPacksOnlyHadRepeatedStickers() {
        alert('Oops, looks like you already had all those stickers.');
    }

    openedPacksHadNewStickers(numberOfNewStickers, completionPercentage) {
        alert(`Great, you have ${numberOfNewStickers} new stickers! Your album progress is ${completionPercentage}%.`);
    }

    albumHasBeenCompleted(player, numberOfPurchasedPacks) {
        alert(`Congratulations ${player}, you managed to complete the album! You needed to buy ${numberOfPurchasedPacks} packs.`);
    }

    moneyHasRunOut(player, completionPercentage) {
        alert(`${player}, I'm sorry to tell you this, but you've run out of money. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`);
    }

    remainingMoneyNotEnoughDueToExcessOfRepeatedStickers(player, completionPercentage) {
        alert(`Well ${player}, it looks like you got so many repeat stickers that now you do not have enough money to complete the album. ${this.descriptionThatAlbumIsCompletedUpTo(completionPercentage)}`);
    }

    withMoneyWillingToSpendDo(callback) {
        callback(Number(prompt("Before we start, how much money are you willing to spend?")));
    }

    withNumberOfPacksToPurchaseDo(callback) {
        callback(Number(prompt("How many packs do you want to purchase?")));
    }
}
