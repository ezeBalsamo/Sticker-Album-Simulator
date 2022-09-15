import StickerAlbumInputProvider from "./StickerAlbumInputProvider.js";

export default class AlbumPromptBasedProvider extends StickerAlbumInputProvider{
    moneyWillingToSpend() {
        return Number(prompt("Before we start, how much money are you willing to spend?"));
    }

    numberOfPacksToPurchase() {
        return Number(prompt("How many packs do you want to purchase?"));
    }
}
