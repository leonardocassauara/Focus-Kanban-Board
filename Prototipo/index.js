firebase.auth().onAuthStateChanged(function(user) {
    if (user) window.location.href = "pages/home/home.html"
})


const elements = {
    email: () => document.getElementById('email').value,
    password: () => document.getElementById('password').value,
    recoverBtn: () => document.getElementById('recover'),
    loginBtn: () => document.getElementById('login'),
    registerBtn: () => document.getElementById('register'),
    emailInvalid: () => document.getElementById('emailInvalidEntryError'),
    emailEmpty: () => document.getElementById('emailEmptyError'),
    passwordEmpty: () => document.getElementById('passwordEmptyError'),
    loginError: () => document.getElementById('loginError'),
    recoverFeedback: () => document.getElementById('recoverPasswordFeedback'),
}


function catchLoginErrorMessage(errorMessage) {
    
    if (errorMessage.code == "auth/user-not-found") {
        return "Usuário não encontrado."
    }
    else if (errorMessage.code == "auth/invalid-login-credentials") {
        return "Credenciais inválidas."
    }
    else if (errorMessage.code == "auth/wrong-password") {
        return "Senha inválida."
    }
    else if (errorMessage.code == "auth/missing-email") {
        return "E-mail é obrigatório."
    }
    else if (errorMessage.code == "undefined") {
        return "Os campos são obrigatórios."
    }
    else if (errorMessage.code == "auth/invalid-email") {
        return "E-mail inválido."
    }
    else if (errorMessage.code == "auth/internal-error") {
        return "Senha é obrigatória."
    }

    return errorMessage.message
}


function showLoginErrorBox(errorMessage) {
    
    const loginError = elements.loginError()
    
    loginError.innerText = catchLoginErrorMessage(errorMessage);
    loginError.style.display = "block";
}


function showRecoverFeedback() {
    elements.recoverFeedback().style.display = "block";
    elements.loginError().style.display = "none";
}


function loginUser() {
    
    showLoading();
    firebase.auth().signInWithEmailAndPassword(elements.email(), elements.password()).then(res => {
        window.location.href = "pages/home/home.html";
        hideLoading();
    }).catch(err => {
        showLoginErrorBox(err);
        hideLoading();
    })
}


function recoverPassword() {
    // Firebase...
    showLoading()
    firebase.auth().sendPasswordResetEmail(elements.email()).then(() => {
        hideLoading();
        showRecoverFeedback();

    }).catch(error => {
        hideLoading();
        showLoginErrorBox(error);
    })
}


function registerUser() {
    // Firebase...

    window.location.href = "pages/register/register.html";
}
