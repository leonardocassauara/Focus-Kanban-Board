const columnsField = {
    ulBacklog: () => document.getElementById('ulBacklog'),
    ulDoing: () => document.getElementById('ulDoing'),
    ulReview: () => document.getElementById('ulReview'),
    ulDone: () => document.getElementById('ulDone')
}
const elements = {
    backlogBtn: () => document.getElementById('backlogNewCardBtn'),
    doingBtn: () => document.getElementById('doingNewCardBtn'),
    reviewBtn: () => document.getElementById('reviewNewCardBtn'),
    doneBtn: () => document.getElementById('doneNewCardBtn'),
}


firebase.firestore().collection('kanban').onSnapshot(snapshot => {
    const cards = snapshot.docs.map (doc => ({
        ...doc.data(),
        uid: doc.id
    }))
    addCardsToScreen(cards)
})
    

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


function findCards() {
    showLoading()
    cardService.find()
        .then(cards => {
            hideLoading()
            addCardsToScreen(cards)
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert('Erro ao recuperar tarefas')
        })
}


function isNewCard(card) {
    if (document.getElementById(card.uid) == null) return true
    
    return false
}


function isColumnChanged(card) {
    if (card.column != document.getElementById(card.id).dataset.column) return true
    return false
}


function createCard(card) {
    const li = document.createElement('li')
            
    // Drag n Drop
    li.setAttribute("draggable", "true")
    li.addEventListener("dragstart", () => {
        li.classList.add("card-is-dragging")
    })
    li.addEventListener("dragend", () => {
        li.classList.remove("card-is-dragging")
    })


    li.id = card.uid

    li.classList.add("card")
    li.innerText = card.title
    li.dataset.coluna = 'backlog'
    li.addEventListener('click', () => {
        window.location.href = "../cardStudio/cardStudio.html?uid=" + card.uid
    })


    if (card.sector == 'Projetos') li.style.background = "#2F993D"
    else if (card.sector == 'GEP') li.style.background = "#E53324"
    else if (card.sector == 'Marketing') li.style.background = "#F6A52D"
    else if (card.sector == 'Comercial') li.style.background = "#29DBE2"
    else if (card.sector == 'Adm. Financeiro') li.style.background = "#495766"
    else if (card.sector == 'Presidência') li.style.background = "#8B5FA4"

    if (card.column == 'backlog') columnsField.ulBacklog().appendChild(li)
    else if (card.column == 'doing') columnsField.ulDoing().appendChild(li)
    else if (card.column == 'review') columnsField.ulReview().appendChild(li)
    else if (card.column == 'done') columnsField.ulDone().appendChild(li)
}


function addCardsToScreen(cards) {
    cards.forEach(card => {
        
        if (isNewCard(card)) {
            createCard(card)
        }
        else {
            if (isColumnChanged(card)) {
                // Atualizar posição do card
                document.getElementById(card.uid).remove()
                createCard(card)
            }
        }  

    })  
}


function openCardStudio() {
    window.location.href = "../cardStudio/cardStudio.html"
}
