export const differenceBetween = (collection, anotherCollection) => {
    return collection.filter(element => !anotherCollection.includes(element));
}
