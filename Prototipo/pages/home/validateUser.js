showLoading()
firebase.auth().onAuthStateChanged(user => {
    validateWebMaster(user.uid)
    hideLoading()
})


function validateWebMaster(uid) {
    return firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
            const user = doc.data()
            showAdmPitchIcon(user)
        })
        .catch(error => {
            console.log(error)
        })
}


function isWebMaster(user) { 
    if (user.adm == true) return true
    return false
}


function showAdmPitchIcon(user) {
    if (isWebMaster(user)) {
        const adm = document.getElementById("admIcon")
        adm.style.display = "block"
    }
}


function admPitch() {
    window.location.href = "../admPitch/admPitch.html"
}