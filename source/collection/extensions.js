function isIncludedIn(collection, elementToFind, comparer) {
    return collection.some(element => comparer(element, elementToFind));
}

export const differenceBetween = (collection, anotherCollection, comparer) => {
    return collection.filter(element => !isIncludedIn(anotherCollection, element, comparer));
}
