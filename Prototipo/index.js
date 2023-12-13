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
}


function isEmailValid() {
    const email = elements.email();
    return (email ? validateEmail(email) : email);
}


function isPasswordValid() {
    if (elements.password()) return true;
    else return false;
}


function toggleButtons() {
    const emailValidation = !isEmailValid();
    const passwordValidation = !isPasswordValid();
    elements.recoverBtn().disabled = emailValidation;
    elements.loginBtn().disabled = emailValidation || passwordValidation; 
}


function onChangeEmail() {
    toggleButtons();
    toggleEmailErrors();
}


function onChangePassword() {
    toggleButtons();
    togglePasswordError();
}


function toggleEmailErrors() {
    const email = elements.email();
    const emailEmptyError = elements.emailEmpty();
    const emailInvalidError = elements.emailInvalid();
    
    emailEmptyError.style.display = email ? "none" : "block";
    emailInvalidError.style.display = validateEmail(email) ? "none" : "block"
}


function togglePasswordError() {
    const passwordEmptyError = elements.passwordEmpty();

    passwordEmptyError.style.display = isPasswordValid() ? "none" : "block";
}


function catchLoginErrorMessage(errorMessage) {
    
    if (errorMessage.code == "auth/user-not-found") {
        return "Usuário não encontrado.*"
    }
    else if (errorMessage.code == "auth/invalid-login-credentials") {
        return "Credenciais inválidas.*"
    }

    return errorMessage.message
}


function showLoginErrorBox(errorMessage) {
    
    const loginError = elements.loginError()
    
    loginError.innerText = catchLoginErrorMessage(errorMessage);
    loginError.style.display = "block";
}


function loginUser() {
    
    firebase.auth().signInWithEmailAndPassword(elements.email(), elements.password()).then(res => {
        window.location.href = "pages/home/home.html";
    }).catch(err => {
        showLoginErrorBox(err);
    })
}


function recoverPassword() {
    // Firebase...
}


function registerUser() {
    // Firebase...

    window.location.href = "pages/register/register.html";
}
