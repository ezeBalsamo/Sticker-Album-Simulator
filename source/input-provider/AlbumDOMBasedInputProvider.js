import StickerAlbumInputProvider from "./StickerAlbumInputProvider.js";
import FormBuilder from "./FormBuilder.js";

export default class AlbumDOMBasedInputProvider extends StickerAlbumInputProvider {
    constructor() {
        super();
        this.mainContent = document.getElementById("game");
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
}
