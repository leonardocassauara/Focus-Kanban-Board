const elements = {
    form: () => document.getElementById('form'),
    email: () => document.getElementById('email').value,
    password: () => document.getElementById('password').value,
    confirmPassword: () => document.getElementById('confirmPassword').value,
    registerError: () => document.getElementById('registerError'),
    registerFeedback: () => document.getElementById('registerFeedback'),
    registerBtn: () => document.getElementById('register'),
    loginBtn: () => document.getElementById('login'),
}


// Gambiarra para evitar chamadas desnecessarias ao BD
let emailAlredyInUse = false
let users
getAllUsersSigned().then(usersArray => users = usersArray)
//


function returnToLogin() {
    window.location.href = "../../index.html"
}


function showFeedback() {
    elements.registerFeedback().style.display = "block";
    elements.registerError().style.display = "none";
}


function catchRegisterErrorMessage(errorMessage) {
    
    if (errorMessage.code == "undefined") {
        return "Erro ao solicitar acesso."
    }

    return errorMessage.message
}


function showFirebaseRegisterErrorBox(errorMessage) {
    
    const registerError = elements.registerError()
    
    registerError.innerText = catchRegisterErrorMessage(errorMessage);
    registerError.style.display = "block";
}


function isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email)
}


function validateRegisterFields() {

    const password = elements.password()
    const confirmPassword = elements.confirmPassword()
    const email = elements.email()


    if (!(isEmailValid(email))) {
        return false
    }
    else if (!password) {
        return false
    }
    else if (!confirmPassword) {
        return false
    }
    else if (password.length < 6) {
        return false
    }
    else if (confirmPassword != password) {
        return false
    }
    else if (matchEmail(users)) {
        emailAlredyInUse = true
        return false
    }

    return true
}


function matchEmail(users) {
    const email = elements.email()
    let control = false

    users.forEach(user => {
        if (user.email == email) {
            control = true
        }
    })

    return control
}


function getAllUsersSigned() {
    showLoading()
    return firebase.firestore()
        .collection('users')
        .get()
        .then(snapshot => {
            hideLoading()
            const users = snapshot.docs.map(doc => doc.data())
            return users
        })
        .catch(error => {
            hideLoading()
            console.log("Barragem de segurança:" + error)
        })
}


function getUserRegisterErrorMessage() {

    const password = elements.password()
    const confirmPassword = elements.confirmPassword()
    const email = elements.email()


    if (!isEmailValid(email)) {
        return "E-mail inválido."
    }
    else if (!password) {
        return  "Senha é obrigatória."
    }
    else if (!confirmPassword) {
        return "Confirmar senha é obrigatório."
    }
    else if (password.length < 6) {
        return "Senha deve ter pelo menos 6 caracteres."
    }
    else if (emailAlredyInUse == true) {
        return "E-mail já está em uso."
    }
    else if (confirmPassword != password) {
        return "As senhas são diferentes."
    }
}


function showUserRegisterErrorBox(errorMessage) {
    const registerError = elements.registerError()
    
    registerError.innerText = errorMessage;
    registerError.style.display = "block";
}


function createUser() {
    const password = elements.password()
    const email = elements.email()

    return {
        "email": email,
        "password": password
    }
}


function sendRegisterRequest() {
    // Tratar erros e arrumar alguma forma de enviar uma solicitação ao Admin
    // Se tudo correr bem dar feedback.
 
    if(!validateRegisterFields()) {
        errorMessage = getUserRegisterErrorMessage()
        showUserRegisterErrorBox(errorMessage)
    }
    else {
        
        const userRequested = createUser()

        showLoading()
        firebase.firestore().collection("usersRequested")
            .add(userRequested)
            .then(() => {
                hideLoading()
                showFeedback()
            })
            .catch(error => {
                hideLoading()
                console.log(error)
                showFirebaseRegisterErrorBox(error)
            })
        
        
        /*
        showLoading();
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            hideLoading();
            showFeedback();
        }).catch(error => {
            hideLoading();
            showFirebaseRegisterErrorBox(error);
        }) 
        */
    }
}