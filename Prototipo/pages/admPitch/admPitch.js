//  CRUD para mostrar solicitações de cadastro
//  CRUD para mostrar usuários cadastrados


const elements = {
    requestColumn: () => document.getElementById("usersRequest"),
    usersColumn: () => document.getElementById("usersAccepted"),
    ulRequest: () => document.getElementById("ulUsersRequest"),
    ulUsers: () => document.getElementById("ulUsersAccepted")
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

    requestsJSON.forEarch(request => {
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
    acceptButton.addEventListener("click", () => {
        // Adicionar usuário ao banco de dado users e fazer o registro com método do firebase
        addUserFromRequest()

        // Remover entidade do banco de dado usersRequested
        removeRequestFromDB(liElement.id)
    })
    

    const declineButton = document.createElement('button');
    declineButton.className = 'decline';
    declineButton.addEventListener("click", () => {
        // Remover entidade do banco de dado usersRequested
        removeRequestFromDB(liElement.id)
    })

    buttonContainerDiv.appendChild(declineButton);
    buttonContainerDiv.appendChild(acceptButton);


    liElement.appendChild(buttonContainerDiv);
    elements.ulRequest().appendChild(liElement)
}


function addUserFromRequest() {
    
}


function removeRequestFromDB(uid) {
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