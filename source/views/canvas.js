const main = document.getElementById('main');

export const render = views => {
    main.replaceChildren(...views);
}