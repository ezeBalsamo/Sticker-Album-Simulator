import {paragraph} from "./elements/paragraph.js";
import {form} from "./elements/form.js";
import {label} from "./elements/label.js";
import {numericInput} from "./elements/inputs.js";
import {submitButton} from "./elements/buttons.js";
import {render} from "./canvas.js";
import {album} from "./album.js";

const formChildren = () => {
    return [
        label('money', 'Money'),
        numericInput('money', 'money'),
        submitButton('submit', 'Submit'),
    ];
}

function moneyWillingToSpendIsBelow(requiredMoney) {
    Swal.fire({
        title: `Say goodbye to your dreams. You need to spend $${requiredMoney}, at least.`,
        icon: 'error'
    })
}

function albumHasBeenGivenAwayFor(playerName, context) {
    Swal.fire({
        title: `Excellent! And, just to be nice to you, ${playerName}, I'm going to give you an album.`,
        icon: 'success'
    }).then(() => render(album(playerName, context)));
}

const handleMoneyWillingToSpend = (playerName, money, context) => {
    context
        .ifMoneyIsEnoughDo(money,
            () => {
                context.startAlbumCompletionFor(playerName, money);
                albumHasBeenGivenAwayFor(playerName, context);
            },
            requiredMoney => moneyWillingToSpendIsBelow(requiredMoney))
}

export const progressSetup = (playerName, context) => {
    const greeting = paragraph(`Hi ${playerName}! So, you want to complete this album... your wallet is going to suffer, you know that, right?`);
    const question = paragraph("Before we start, how much money are you willing to spend?");
    const moneyForm = form(formChildren(), formData => handleMoneyWillingToSpend(playerName, Number(formData['money']), context));

    return [greeting, question, moneyForm];
}