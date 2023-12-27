const cardService = {
    getCardByUid: uid => {
        return firebase.firestore()
        .collection("kanban")
        .doc(uid)
        .get()
        .then(doc => {
            return doc.data()
        })
    },
    remove: () => {
        return firebase.firestore()
        .collection('kanban')
        .doc(getCardUid())
        .delete()
    },
    save: card => {
        return firebase.firestore()
        .collection('kanban')
        .add(card)
    },
    update: card => {
        return firebase.firestore()
        .collection("kanban")
        .doc(getCardUid())
        .update(card)
    },
    updateColumn: cardHTML => {
        return firebase.firestore()
        .collection("kanban")
        .doc(cardHTML.id).update({
            column: cardHTML.parentNode.parentNode.id
        })
    },
}
