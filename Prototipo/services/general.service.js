const generalService = {
    logout: () => {
        return firebase.auth().signOut()
    },
}