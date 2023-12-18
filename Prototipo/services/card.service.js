const cardService = {
    find: () => {
        return firebase.firestore()
        .collection('kanban')
        .get()
        .then(snapshot => {
            return cards = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id,
            }))
        })
    },
    findByUid: uid => {
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
    }
}