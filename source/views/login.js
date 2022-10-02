import {paragraph} from "./elements/paragraph.js";
import {form} from "./elements/form.js";
import {label} from "./elements/label.js";
import {textInput} from "./elements/inputs.js";
import {submitButton} from "./elements/buttons.js";
import {progressSetup} from "./progressSetup.js";
import {render} from "./canvas.js";
import {album} from "./album.js";

function suggestSignUpFor(playerName, context) {
    Swal.fire({
        title: `Player named ${playerName} not found! Do you want to sign up?`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
    }).then(response => {
        if (response.isConfirmed) {
            context.registerPlayerNamed(playerName);
            Swal.fire({
                title: "You're signed up!",
                icon: 'success',
                timer: 1500
            }).then(() => {
                render(progressSetup(playerName, context));
            })
        }
    })
}

const formChildren = () => {
    return [
        label('username', 'Username'),
        textInput('username', 'username'),
        submitButton('submit', 'Submit'),
    ];
}

const handleLogin = (playerName, context) => {
    context
        .playerNamed(playerName,
            () => context.withProgressDo(playerName,
                () => render(album(playerName, context)),
                () => render(progressSetup(playerName, context))),
            () => suggestSignUpFor(playerName, context));
}

export const login = context => {
    const p = paragraph("Hello and welcome! Enter your name to continue...");
    const loginForm = form(formChildren(), formData => handleLogin(formData['username'], context));
    return [p, loginForm];
}