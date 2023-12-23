//  CRUD para mostrar solicitações de cadastro
//  CRUD para mostrar usuários cadastrados


const elements = {
    requestColumn: () => document.getElementById("usersRequest"),
    usersColumn: () => document.getElementById("usersAccepted"),
    ulRequest: () => document.getElementById("ulUsersRequest"),
    ulUsers: () => document.getElementById("ulUsersAccepted")
}

findRequests()
findUsers()


function logout() {
    showLoading()
    firebase.auth().signOut().then(() => {
        hideLoading()
        window.location.href = "../../index.html"
    }).catch(error => {
        hideLoading()
        alert("Erro, tente novamente.")
    })
}


function findRequests() {
    showLoading()
    firebase.firestore()
        .collection("usersRequested")
        .get()
        .then(snapshot => {
            hideLoading()
            const requests = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id // Id da requisição
            }))
            addRequestsToScreen(requests)
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao recuperar solicitações de cadastro.")
        })
}


function addRequestsToScreen(requestsJSON) {
    // requestJSON.email
    // requestJSON.password
    // requestJSON.uid



    requestsJSON.forEach(request => {
        createRequestCard(request)
    })
}


function createRequestCard(request) {
    const liElement = document.createElement('il');
    liElement.id = request.uid


    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';
    titleDiv.innerText = request.email

    liElement.appendChild(titleDiv);


    const buttonContainerDiv = document.createElement('div');

    const acceptButton = document.createElement('button');
    acceptButton.className = 'accept';
    acceptButton.type = "button"
    acceptButton.innerText = "ACEITAR"
    acceptButton.addEventListener("click", () => {
        // Adicionar usuário ao banco de dado users e fazer o registro com método do firebase
        addUserInDBFromRequest(request)

        // Remover entidade do banco de dado usersRequested
    })
    

    const declineButton = document.createElement('button');
    declineButton.className = 'decline';
    declineButton.type = "button"
    declineButton.innerText = "RECUSAR"
    declineButton.addEventListener("click", () => {
        // Remover entidade do banco de dado usersRequested
        if(areSure()) removeRequestFromDB(liElement.id)
    })

    buttonContainerDiv.appendChild(acceptButton);
    buttonContainerDiv.appendChild(declineButton);


    liElement.appendChild(buttonContainerDiv);
    elements.ulRequest().appendChild(liElement)
}


function addUserInDBFromRequest(requestJSON) {
    showLoading()
    
    const newUser = {
        email: requestJSON.email
    }

    firebase.auth().createUserWithEmailAndPassword(requestJSON.email, requestJSON.password)
    .then(userCredentials => {
        
        firebase.firestore()
        .collection('users')
        .doc(userCredentials.user.uid)
        .set(newUser)
        .then(() => {
            hideLoading()
            removeRequestFromDB(requestJSON.uid)
            createUserCard(userCredentials.user)
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert('Erro ao adicionar usuário cadastrado.')
        })
    })
    .catch(error => {
        hideLoading()
        console.log(error)
        alert("Erro ao criar novo usuário.")
    })
}


function removeRequestFromDB(uid) {
    showLoading()
    firebase.firestore()
        .collection("usersRequested")
        .doc(uid)
        .delete()
        .then(() => {
            hideLoading()
            document.getElementById(uid).remove()
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao remover usuário da solicitação.")
        })
}


function findUsers() {
    showLoading()
    firebase.firestore()
        .collection('users')
        .get()
        .then(snapshot => {
            hideLoading()
            const users = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id // Id do usuário no DB e no Auth
            }))
            addUsersToScreen(users)
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
        createUserCard(user)
    })
}


function areSure() {
    return confirm("Tem certeza?")
}


function createUserCard(user) {
    const liElement = document.createElement('il');
    liElement.id = user.uid


    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';
    titleDiv.innerText = user.email

    liElement.appendChild(titleDiv);
    elements.ulUsers().appendChild(liElement)
}


/* Firebase requere que o próprio usuário exclua seu cadastro, ou que o cadastro seja excluido pelo adm na hud do firebase

    const buttonContainerDiv = document.createElement('div');


    const declineButton = document.createElement('button');
    declineButton.className = 'decline';
    declineButton.type = "button"
    declineButton.innerText = "REMOVER"
    declineButton.addEventListener("click", () => {
        // Remover entidade do banco de dado usersRequested
        if (areSure()) removeUserFromDB(liElement.id)
    })

    buttonContainerDiv.appendChild(declineButton);

    if (user.adm) declineButton.setAttribute("disabled", "true")
    liElement.appendChild(buttonContainerDiv);
    

    elements.ulUsers().appendChild(liElement)
}


function removeUserFromDB(uid) {
    console.log(uid)
    showLoading()
    firebase.firestore()
        .collection("users")
        .doc(uid)
        .delete()
        .then(() => {
            hideLoading()
            document.getElementById(uid).remove()
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao remover usuário.")
        })

}
*/