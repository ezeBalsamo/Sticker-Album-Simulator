export default class PackSpecification {
    constructor(price, numberOfStickers) {
        this.price = price;
        this.numberOfStickers = numberOfStickers;
    }

    minimumPriceToGet(requiredNumberOfStickers) {
        return Math.ceil(requiredNumberOfStickers / this.numberOfStickers) * this.price;
    }

    moneyRequiredToPurchase(numberOfPacks) {
        return numberOfPacks * this.price;
    }

    canPurchase(numberOfPacks, moneyToSpend) {
        return moneyToSpend >= this.moneyRequiredToPurchase(numberOfPacks);
    }
}
