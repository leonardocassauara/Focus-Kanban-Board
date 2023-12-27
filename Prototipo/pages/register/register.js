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



let emailsAllowed
registerService.getAllUsersAllowed()
    .then(emails => {
        hideLoading()
        emailsAllowed = emails
    })
    .catch(error => {
        hideLoading()
        console.log(error)
        alert("Erro ao recuperar e-mails permitidos.")
    })


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
    else if (errorMessage.code == "auth/weak-password") {
        return "Senha deve ter pelo menos 6 caracteres."
    }
    else if (errorMessage.code == "auth/email-already-in-use") {
        return "E-mail já em uso."
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
    else if (!matchEmail(emailsAllowed)) {
        return false
    }

    return true
}


function matchEmail(emailsAllowed) {
    const email = elements.email()
    let control = false

    emailsAllowed.forEach(emailAllowed => {
        if (emailAllowed.email == email) {
            control = true
        }
    })

    return control
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
    else if (confirmPassword != password) {
        return "As senhas são diferentes."
    }
    else if (!matchEmail(emailsAllowed)) {
        return "E-mail ainda não permitido."
    }
}


function showUserRegisterErrorBox(errorMessage) {
    const registerError = elements.registerError()
    
    registerError.innerText = errorMessage;
    registerError.style.display = "block";
}


function registerUser() {
    
    if (!validateRegisterFields()) {
        const errorMessage = getUserRegisterErrorMessage()
        showUserRegisterErrorBox(errorMessage)
    }
    else {
        if (matchEmail(emailsAllowed)) {
            showLoading()
            firebase.auth()
                .createUserWithEmailAndPassword(elements.email(), elements.password())
                .then(userCredentials => {
                    hideLoading()
                    showFeedback()
                    showLoading()
                    registerService.addUser(elements.email(), userCredentials.user.uid)
                        .then(() => {
                            hideLoading()
                        })
                        .catch(error => {
                            hideLoading()
                            console.log(error)
                            alert("Erro ao criar novo cadastro.")
                        })
                })
                .catch(error => {
                    hideLoading()
                    showFirebaseRegisterErrorBox(error)
                })
        }
    }
}