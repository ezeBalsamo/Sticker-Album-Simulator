export default class LocalStorageBasedPersistenceSystem {
    saveProgressOf(player, remainingMoney, numberOfPurchasedPacks, stickers){
        const progress = {remainingMoney, numberOfPurchasedPacks, stickers};
        localStorage.setItem(player, JSON.stringify(progress));
    }

    removeProgressOf(player){
        localStorage.removeItem(player);
    }
}
