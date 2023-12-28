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


firebase.firestore()
    .collection('kanban')
    .orderBy('order')
    .onSnapshot(snapshot => {
        const cards = snapshot.docs.map (doc => ({
            ...doc.data(),
            uid: doc.id
        }))
        addCardsToScreen(cards)
    })
    

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


function isNewCard(card) {
    if (document.getElementById(card.uid) == null) return true
    
    return false
}


function isColumnChanged(card) {
    if (card.column != document.getElementById(card.uid).dataset.column) return true
    return false
}


function isDropColumnChanged(cardHTML) {
    if (cardHTML.dataset.column != cardHTML.parentNode.parentNode.id) return true
    return false
}


function updateOrderInDB(column) {
    
    updateOrderHTML(column)

    let cards = getAllCardsInColumn(column)
    cards = Array.from(cards)

    const batch = cardService.createBatch()

    cards.forEach(card => {
        cardService.addChangesToBatch(batch, card)
    })

    cardService.commitBatch(batch)
        .then(() => {
            console.log("Alterações salvas.")
        })
        .catch(error => {
            console.log(error)
            alert("Erro ao salvar linhas.")
        })
}


function saveDropChanges(cardHTML) {
    if (isDropColumnChanged(cardHTML)) {
        cardService.updateColumn(cardHTML)
        .catch(error => {
            alert("Erro ao salvar alterações no quadro.")
            console.log(error)
        })
        
        updateOrderInDB(cardHTML.dataset.column)
        cardHTML.dataset.column = cardHTML.parentNode.parentNode.id
        updateOrderInDB(cardHTML.dataset.column)  
    }
    else {
        if (isDropLineChanged(cardHTML)) {
            updateOrderInDB(cardHTML.dataset.column)
        }
    }
}


function getAllCardsInColumn(column) {
    let cards = document.querySelectorAll('li[data-column='+ column +']')
    return cards
}


function updateOrderHTML(column) {
    let cards = getAllCardsInColumn(column)

    cards = Array.from(cards)

    cards.map((card, index) => {
        card.dataset.order = index
    })
}


function isDropLineChanged(cardHTML) {
    const unUpdatedOrder = cardHTML.dataset.order
    
    updateOrderHTML(cardHTML.dataset.column)
    const updatedOrder = cardHTML.dataset.order

    if (updatedOrder != unUpdatedOrder) return true
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
        li.classList.remove("card-is-dragging");
        //updateOrder(li)
        saveDropChanges(li)
    })


    li.id = card.uid
    li.classList.add("card")
    li.innerText = card.title
    li.dataset.column = card.column
    li.dataset.order = card.order
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
    const cardsInScreen = document.querySelectorAll(".card")
    
    if (cardsInScreen.length) {
        cardsInScreen.forEach(card => {
            card.remove()
        })
    }
    
    cards.forEach(card => {
        
        if (isNewCard(card)) {
            createCard(card)
        }
        else {
            if (isColumnChanged(card)) {

                removeCardFromScreen(card)
                createCard(card)
            }
        }  
    })
}


function openCardStudio() {
    window.location.href = "../cardStudio/cardStudio.html"
}


function removeCardFromScreen(card) {
    document.getElementById(card.uid).remove()
}