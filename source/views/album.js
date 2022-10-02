import {paragraph} from "./elements/paragraph.js";
import {label} from "./elements/label.js";
import {numericInput} from "./elements/inputs.js";
import {submitButton} from "./elements/buttons.js";
import {form} from "./elements/form.js";
import {render} from "./canvas.js";
import {progressSetup} from "./progressSetup.js";

const formChildren = () => {
    return [
        label('packs', 'Number of packs'),
        numericInput('packs', 'packs'),
        submitButton('submit', 'Submit'),
    ];
}

const cannotPurchase = (numberOfPacks, packPrice, moneyRequired, remainingMoney) => {
    Swal.fire({
        title: `You can't purchase ${numberOfPacks} packs`,
        text: `Each of them cost $${packPrice}, so you have to spend $${moneyRequired}, but you only have $${remainingMoney} left. Purchase fewer packs.`,
        icon: 'error'
    })
}

const packsPurchased = ({moneySpent, remainingMoney, newStickers}, playerName, numberOfPacks, context) => {
    Swal.fire({
        title: 'Packs purchased!',
        text: `It cost you $${moneySpent}. You have $${remainingMoney} left.`,
        icon: 'success'
    }).then(() => {
        aboutToOpen(numberOfPacks, newStickers, playerName, context);
    });
}

const aboutToOpen = (numberOfPacks, newStickers, playerName, context) => {
    Swal.fire({
        title: `Opening ${numberOfPacks} packs...`,
        icon: 'success',
        timer: 1500,
    }).then(() => packsOpened(newStickers, playerName, context));

}

function notificationDetailsWhenCouldNotBeCompletedAlbumOf(playerName, context) {
    const title = context.hasRanOutOfMoney(playerName)
        ? `${playerName}, you've run out of money!`
        : `${playerName}, you do not have enough money to complete the album!`;

    return {
        title,
        text: `At least you managed to complete ${context.completionPercentageOf(playerName)}% of your album.`,
        icon: 'error'
    }
}

const simulationHasEnded = (playerName, context) => {
    const notificationDetails = context.isCompletedAlbumOf(playerName) ? {
        title: `Congratulations ${playerName}, you managed to complete the album!`,
        text: `You needed to buy ${context.numberOfPurchasedPacksOf(playerName)} packs.`,
        icon: 'success'
    } : notificationDetailsWhenCouldNotBeCompletedAlbumOf(playerName, context);

    render([]);
    Swal.fire(notificationDetails).then(() => {
        Swal.fire({
            title: "Do you want to play again?",
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes'
        }).then(response => {
            if (response.isConfirmed) {
                context.purgeProgressOf(playerName);
                render(progressSetup(playerName, context));
            }
        })
    });
}

const packsOpened = (newStickers, playerName, context) => {
    const numberOfNewStickers = newStickers.length;
    const notificationDetails = numberOfNewStickers === 0
        ? {title: 'Oops, looks like you already had all those stickers.', icon: 'info'}
        : {
            title: `Great, you have ${numberOfNewStickers} new stickers!`,
            text: `Your album progress is ${context.completionPercentageOf(playerName)}%.`,
            icon: 'success'
        };
    Swal.fire(notificationDetails).then(() => {
        context.ifCanAlbumBeCompletedDo(playerName,
            () => render(album(playerName, context)),
            () => simulationHasEnded(playerName, context)
        )
    })
}

const handleNumberOfPacks = (playerName, numberOfPacks, context) => {
    context
        .ifCanPurchaseDo(playerName,
            numberOfPacks,
            () => {
                const packsOpeningResult = context.purchase(playerName, numberOfPacks);
                packsPurchased(packsOpeningResult, playerName, numberOfPacks, context);
            },
            (moneyRequired, packPrice, remainingMoney) => {
                cannotPurchase(numberOfPacks, packPrice, moneyRequired, remainingMoney);
            })
}

export const album = (playerName, context) => {
    const numberOfStickers = context.numberOfMissingStickersOf(playerName);
    const albumStatistics = paragraph(`You need ${numberOfStickers} stickers to complete the album.`);
    const question = paragraph("How many packs do you want to purchase?");
    const numberOfPacksForm = form(formChildren(), formData => handleNumberOfPacks(playerName, Number(formData['packs']), context));

    return [albumStatistics, question, numberOfPacksForm];
}