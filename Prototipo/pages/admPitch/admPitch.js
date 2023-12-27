const elements = {
    alEmailsColumn: () => document.getElementById("emailsAllowed"),
    usersColumn: () => document.getElementById("usersAccepted"),
    ulAllowed: () => document.getElementById("ulAllowed"),
    ulUsers: () => document.getElementById("ulUsersAccepted"),
    emailError: () => document.getElementById('emailError'),
    emailFeedback: () => document.getElementById("emailFeedback"),
}


showLoading()
firebase.auth().onAuthStateChanged(user => {
    hideLoading()
    validateWebMaster(user.uid)
})


findUsers()


function findEmailsAllowed(users) {
    showLoading()
    admService.getEmailsAllowed()
    .then(emailsJSON => {
        hideLoading()
        
        const filteredEmails = filterEmails(users, emailsJSON)

        addEmailsAllowedToScreen(filteredEmails) 
    })
    .catch(error => {
        hideLoading()
        console.log(error)
        alert("Erro ao recuperar usuários permitidos.")
    })
}


function filterEmails(users, allowed) {
    const usersFormat = users.map(user => user.email)
    let filteredEmails = allowed.filter (object => !usersFormat.includes(object.email))
    return filteredEmails
}


function addEmail() {
    const emailToAdd = document.getElementById("email").value;
    document.getElementById("email").value = ""


    if (isValidEmail(emailToAdd)) {
        admService.addEmailAllowed( { email: emailToAdd } )
        .then(docRef => {
            findUsers(); 
            toggleFeedbackMessage()
        })
        .catch(error => {
            console.error("Erro ao adicionar e-mail:", error);
            alert("Erro ao adicionar e-mail. Por favor, tente novamente.");
        });
    }
    else toggleErrorMessage(); // TODO: Substituir com uma caixa erro
}


function isValidEmail(email) {
    const regex = /@.*\.com/;
    return regex.test(email);
}


function addEmailsAllowedToScreen(emailsJSON) {
    
    emailsJSON.forEach(emailData => {

        if (!document.getElementById(emailData.uid)) {

            createEmailAllowed(emailData)
        }
    });
}


function createEmailAllowed(emailData) {
    const liElement = document.createElement('li');
    liElement.id = emailData.uid
            
    const div = document.createElement('div')
    div.innerText = emailData.email
    div.className = 'item-title'

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa');
    trashIcon.classList.add('fa-trash')
    trashIcon.style.cursor = 'pointer'; 
    trashIcon.onclick = () => removeEmailFromCollection(emailData.uid);

    liElement.appendChild(div)
    liElement.appendChild(trashIcon);

    elements.ulAllowed().appendChild(liElement);
}


function removeEmailFromCollection(docId) {
    if (areSure()) {
        showLoading()
        admService.removeEmailAllowed(docId)
        .then(() => {
            hideLoading()
            document.getElementById(docId).remove()
            findUsers();
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao remover usuário permitido.")
        });
    }
}


function areSure() {
    return confirm("Tem certeza que deseja remover este e-mail?");
}


function validateWebMaster(uid) {
    admService.getUserByUid(uid)
        .then(user => {
            if (!isWebMaster(user)) window.location.href = "../home/home.html"
        })
        .catch(error => {
            console.log(error)
        })
}


function isWebMaster(user) { 
    if (user.adm == true) return true
    return false
}


function logout() {
    showLoading()
    generalService.logout().then(() => {
        hideLoading()
        window.location.href = "../../index.html"
    }).catch(error => {
        hideLoading()
        console.log(error)
        alert("Erro ao deslogar.")
    })
}


function voltar() {
    window.location.href = "../home/home.html";
}


function findUsers() {
    showLoading()
    admService.getUsers()
        .then(usersJSON => {
            hideLoading()
            addUsersToScreen(usersJSON)

            findEmailsAllowed(usersJSON)
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert('Erro ao recuperar usuários.')
        })
}


function addUsersToScreen(usersJSON) {
    // usersJSON.email
    // usersJSON.adm (se tiver)

    usersJSON.forEach(user => {
        if (!document.getElementById(user.uid)) createUserCard(user)
    })

}


function createUserCard(user) {
    const liElement = document.createElement('li');
    liElement.id = user.uid
    liElement.name = user.email 


    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';
    titleDiv.innerText = user.email

    liElement.appendChild(titleDiv);
    elements.ulUsers().appendChild(liElement)
}


function toggleErrorMessage() {
    elements.emailError().style.display = "block"
    elements.emailFeedback().style.display = "none"
}


function toggleFeedbackMessage() {
    elements.emailFeedback().style.display = "block"
    elements.emailError().style.display = "none"
}