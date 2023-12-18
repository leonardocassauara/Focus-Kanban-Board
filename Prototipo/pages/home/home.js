const columnsField = {
    ulTodo: () => document.getElementById('ulTodo'),
    ulDoing: () => document.getElementById('ulDoing'),
    ulReview: () => document.getElementById('ulReview'),
    ulDone: () => document.getElementById('ulDone')
}
const elements = {
    todoBtn: () => document.getElementById('todoNewCardBtn'),
    doingBtn: () => document.getElementById('doingNewCardBtn'),
    reviewBtn: () => document.getElementById('reviewNewCardBtn'),
    doneBtn: () => document.getElementById('doneNewCardBtn'),
}

findCards()
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


function addCardsToScreen(cards) {
    cards.forEach(card => {
        const li = document.createElement('li')
        

        li.className = 'card'
        //li.id = card.id
        li.innerText = card.title
        li.addEventListener('click', () => {
            window.location.href = "../cardStudio/cardStudio.html?uid=" + card.uid
        })
        

        if (card.column == 'todo') columnsField.ulTodo().appendChild(li)
        else if (card.column == 'doing') columnsField.ulDoing().appendChild(li)
        else if (card.column == 'review') columnsField.ulReview().appendChild(li)
        else if (card.column == 'done') columnsField.ulDone().appendChild(li)
    }) 
}


function openCardStudio() {
    window.location.href = "../cardStudio/cardStudio.html"
}
