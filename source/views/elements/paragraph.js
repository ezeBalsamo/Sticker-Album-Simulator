export const paragraph = innerText => {
    const paragraph = document.createElement('p');
    paragraph.innerText = innerText;
    return paragraph;
}