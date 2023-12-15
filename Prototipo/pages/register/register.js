firebase.auth().onAuthStateChanged(function(user) {
    if (user) window.location.href = "../home/home.html"
})


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


function returnToLogin() {
    window.location.href = "../../index.html"
}


function showFeedback() {
    elements.registerFeedback().style.display = "block";
    elements.registerError().style.display = "none";
}


function catchRegisterErrorMessage(errorMessage) {
    
    if (errorMessage.code == "auth/weak-password") {
        return "Senha deve ter pelo menos 6 caracteres."
    }
    else if (errorMessage.code == "auth/email-already-in-use") {
        return "E-mail já cadastrado."
    }
    else if (errorMessage.code == "undefined") {
        return "Os campos são obrigatórios."
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
    else if (confirmPassword != password) {
        return false
    }
    return true
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
    else if (confirmPassword != password) {
        return "As senhas são diferentes."
    }
}


function showUserRegisterErrorBox(errorMessage) {
    const registerError = elements.registerError()
    
    registerError.innerText = errorMessage;
    registerError.style.display = "block";
}


function sendRegisterRequest() {
    // Tratar erros e arrumar alguma forma de enviar uma solicitação ao Admin
    // Se tudo correr bem dar feedback.

    const password = elements.password()
    const email = elements.email()

    if(!validateRegisterFields()) {
        errorMessage = getUserRegisterErrorMessage()
        showUserRegisterErrorBox(errorMessage)
    }
    else {
        showLoading();
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            hideLoading();
            showFeedback();
        }).catch(error => {
            hideLoading();
            showFirebaseRegisterErrorBox(error);
        })
    }
}