export default class StickerAlbumInputProvider {
    signalSubclassResponsibilityFor(method) {
        throw new Error(`${this.constructor.name} must implement ${method.name} since is a subclass responsibility.`)
    }

    moneyWillingToSpend() {
        this.signalSubclassResponsibilityFor(this.moneyWillingToSpend);
    }

    numberOfPacksToPurchase() {
        this.signalSubclassResponsibilityFor(this.numberOfPacksToPurchase);
    }
}