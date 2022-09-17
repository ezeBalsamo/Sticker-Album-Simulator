import StickerAlbumInputProvider from "./StickerAlbumInputProvider.js";

export default class AlbumPromptBasedProvider extends StickerAlbumInputProvider{
    withMoneyWillingToSpendDo(callback) {
        callback(Number(prompt("Before we start, how much money are you willing to spend?")));
    }

    withNumberOfPacksToPurchaseDo(callback) {
        callback(Number(prompt("How many packs do you want to purchase?")));
    }
}
