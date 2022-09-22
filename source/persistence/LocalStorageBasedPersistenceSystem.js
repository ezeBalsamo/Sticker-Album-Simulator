export default class LocalStorageBasedPersistenceSystem {
    saveProgressOf(player, remainingMoney, purchasedPacks, stickers){
        const progress = {remainingMoney, purchasedPacks, stickers};
        localStorage.setItem(player, JSON.stringify(progress));
    }

    removeProgressOf(player){
        localStorage.removeItem(player);
    }

    progressOf(player, ifFound, ifNone){
        const progressOrNull = JSON.parse(localStorage.getItem(player));
        progressOrNull ? ifFound(progressOrNull) : ifNone();
    }
}
