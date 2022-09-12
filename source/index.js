const TOTAL_NUMBER_OF_STICKERS_IN_ALBUM = 638;
const NUMBER_OF_STICKERS_PER_PACK = 5;
const PACK_PRICE = 150;
const MINIMUM_PRICE_FOR_ALBUM_COMPLETENESS = Math.ceil(TOTAL_NUMBER_OF_STICKERS_IN_ALBUM / NUMBER_OF_STICKERS_PER_PACK) * PACK_PRICE;

let completionRatioAccordingTo = (numberOfMissingStickersInTheAlbum) =>
    (TOTAL_NUMBER_OF_STICKERS_IN_ALBUM - numberOfMissingStickersInTheAlbum) / TOTAL_NUMBER_OF_STICKERS_IN_ALBUM;

let numberOfRepeatedStickersAfterOpening = (numberOfPurchasedStickers, numberOfMissingStickersInTheAlbum) => {
    // Don't trust this algorithm. It's fake :)
    let numberOfRepeatedStickers = 0;
    for (let i = 0; i < numberOfPurchasedStickers; i++) {
        let completionRatio = completionRatioAccordingTo(numberOfMissingStickersInTheAlbum);
        if (completionRatio < Math.random()) {
            numberOfMissingStickersInTheAlbum--;
        } else {
            numberOfRepeatedStickers++;
        }
    }
    return numberOfRepeatedStickers;
};

let numberOfNewStickersAfterOpening = (numberOfPacks, numberOfMissingStickersInTheAlbum) => {
    let numberOfPurchasedStickers = numberOfPacks * NUMBER_OF_STICKERS_PER_PACK;
    let numberOfRepeatedStickers = numberOfRepeatedStickersAfterOpening(numberOfPurchasedStickers, numberOfMissingStickersInTheAlbum);
    return numberOfPurchasedStickers - numberOfRepeatedStickers;
};

let completionPercentageAccordingTo = (numberOfMissingStickersInTheAlbum) =>
    Math.floor(completionRatioAccordingTo(numberOfMissingStickersInTheAlbum) * 100);

let canAlbumBeCompleted = (remainingMoney, numberOfMissingStickersInTheAlbum) => {
    let numberOfPacksToPurchaseIgnoringRepeatedStickers = Math.ceil(numberOfMissingStickersInTheAlbum / NUMBER_OF_STICKERS_PER_PACK);
    return remainingMoney >= numberOfPacksToPurchaseIgnoringRepeatedStickers * PACK_PRICE;
};

let canPurchase = (numberOfPacks, money) => {
    return money >= numberOfPacks * PACK_PRICE;
}

let buyPacks = (remainingMoney) => {
    let numberOfPacksToPurchase = Number(prompt("How many packs do you want to purchase?"));
    while (!canPurchase(numberOfPacksToPurchase, remainingMoney)) {
        alert(`You can't purchase ${numberOfPacksToPurchase} packs since you don't have enough money. Purchase less.`);
        numberOfPacksToPurchase = Number(prompt("How many packs do you want to purchase?"));
    }
    return numberOfPacksToPurchase;
}

let notifyProgress = (numberOfNewStickers, numberOfMissingStickersInTheAlbum) => {
    if (numberOfNewStickers === 0) {
        alert('Oops, looks like you already had all those stickers.')
    } else {
        let completionPercentage = completionPercentageAccordingTo(numberOfMissingStickersInTheAlbum);
        alert(`Great, you have ${numberOfNewStickers} new stickers! Your album progress is ${completionPercentage}%.`);
    }
}

let finishSimulation = (isAlbumCompleted, remainingMoney, totalNumberOfPacksPurchased, numberOfMissingStickersInTheAlbum) => {
    let completionPercentage = completionPercentageAccordingTo(numberOfMissingStickersInTheAlbum);
    if (isAlbumCompleted) {
        alert(`Congratulations, you managed to complete the album! You needed to buy ${totalNumberOfPacksPurchased} packs.`);
    } else if (remainingMoney === 0) {
        alert(`Oh no! You've run out of money.`);
        alert(`At least you managed to complete ${completionPercentage}% of your album.`);
    } else {
        alert("Well, it looks like you got so many repeat stickers that now you do not have enough money to complete the album.");
        alert(`At least you managed to complete ${completionPercentage}% of your album.`);
    }
}

let startSimulationBySpendingAtMost = (remainingMoney) => {
    let numberOfMissingStickersInTheAlbum = TOTAL_NUMBER_OF_STICKERS_IN_ALBUM;
    let isAlbumCompleted = false;
    let totalNumberOfPurchasedPacks = 0;

    alert("Well, just to be nice to you, I'm going to give you an album.");

    while (canAlbumBeCompleted(remainingMoney, numberOfMissingStickersInTheAlbum) && !isAlbumCompleted) {
        alert(`You need ${numberOfMissingStickersInTheAlbum} stickers to complete the album.`);
        let numberOfPurchasedPacks = buyPacks(remainingMoney);
        totalNumberOfPurchasedPacks += numberOfPurchasedPacks;
        let purchasedPacksPrice = numberOfPurchasedPacks * PACK_PRICE;
        remainingMoney = remainingMoney - purchasedPacksPrice;
        alert(`It cost you $${purchasedPacksPrice}. You have $${remainingMoney} left.`);

        alert("Opening Packs...");
        let numberOfNewStickers = numberOfNewStickersAfterOpening(numberOfPurchasedPacks, numberOfMissingStickersInTheAlbum);
        numberOfMissingStickersInTheAlbum = numberOfMissingStickersInTheAlbum - numberOfNewStickers;
        if (numberOfMissingStickersInTheAlbum === 0) {
            isAlbumCompleted = true;
        }

        notifyProgress(numberOfNewStickers, numberOfMissingStickersInTheAlbum);
    }

    finishSimulation(isAlbumCompleted, remainingMoney, totalNumberOfPurchasedPacks, numberOfMissingStickersInTheAlbum);
};

let startSimulation = () => {
    alert("Hi there! So, you want to complete this album... your wallet is going to suffer, you know that, right?");

    let moneyWillingToSpend = Number(prompt("Before we start, how much money are you willing to spend?"));
    if (moneyWillingToSpend < MINIMUM_PRICE_FOR_ALBUM_COMPLETENESS) {
        alert(`Say goodbye to your dreams. You need to spend $${MINIMUM_PRICE_FOR_ALBUM_COMPLETENESS}, at least.`);
    } else {
        startSimulationBySpendingAtMost(moneyWillingToSpend);
    }
};

startSimulation();
