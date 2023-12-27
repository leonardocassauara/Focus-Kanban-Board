const admService = {
    getEmailsAllowed: () => {
        return firebase.firestore()
        .collection("usersAllowed")
        .get()
        .then(snapshot => {
            return snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }))
        })
    },
    addEmailAllowed: emailAllowed => {
        return firebase.firestore()
        .collection('usersAllowed')
        .add(emailAllowed)
    },
    removeEmailAllowed: docId => {
        return firebase.firestore()
        .collection("usersAllowed")
        .doc(docId)
        .delete()
    },
    getUserByUid: uid => {
        return firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(snapshot => {
            return snapshot.data()
        })
    },
    getUsers: () => {
        return firebase.firestore()
        .collection('users')
        .get()
        .then(snapshot => {
            return snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }))
        })
    },
}
