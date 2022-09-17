export default class StickerAlbumInputProvider {
    signalSubclassResponsibilityFor(method) {
        throw new Error(`${this.constructor.name} must implement ${method.name} since is a subclass responsibility.`)
    }

    withMoneyWillingToSpendDo(callback) {
        this.signalSubclassResponsibilityFor(this.withMoneyWillingToSpendDo);
    }

    withNumberOfPacksToPurchaseDo(callback) {
        this.signalSubclassResponsibilityFor(this.withNumberOfPacksToPurchaseDo);
    }
}