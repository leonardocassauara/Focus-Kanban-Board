const elements = {
    titleField: () => document.getElementById('titleField'),
    titleError: () => document.getElementById('titleError'),
    descriptionField: () => document.getElementById("descriptionField"),
    cardResp: () => document.getElementById("cardResp"),
    limitDate: () => document.getElementById("limitDateField"),
    commentField: () => document.getElementById("commentField"),
    sectorField: () => document.getElementById("sectorField"),
    saveBtn: () => document.getElementById('studioSave'),
    cancelBtn: () => document.getElementById('studioCancel'),
    deleteBtn: () => document.getElementById('studioDelete'),
}


if (!isNewCard()) {
    const uid = getCardUid()
    findCardByUid(uid)
    elements.deleteBtn().style.display = "block"
}
else {
    elements.deleteBtn().style.display = "none"
}


function findCardByUid(uid) {
    showLoading()
    cardService.getCardByUid(uid)
        .then(card => {
            hideLoading()
            if (card) {
                fillCardScreen(card)
                toggleButton()
            }
            else {
                alert("Tarefa não encontrada.")
                window.location.href = "../home/home.html"
            }
        })
        .catch(error => {
            console.log(error)
            hideLoading()
            alert("Erro ao recuperar documento.")
            window.location.href = "../home/home.html"
        })
}


function fillCardScreen(card) {
    elements.titleField().value = card.title
    if (card.description) elements.descriptionField().value = card.description
    elements.cardResp().value = card.responsable
    elements.sectorField().value = card.sector
    if (card.comment) elements.commentField().value = card.comment
    elements.limitDate().value = card.limitDate
}


function getCardUid() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('uid')
}


function isNewCard() {
    return (getCardUid()) ? false : true
}


function onChangeTitle() {
    toggleButton()
    toggleError()
}


function toggleButton() {
    const saveBtn = elements.saveBtn()
    saveBtn.disabled = isTitleValid() ? false : true
}


function isTitleValid() {
    if (elements.titleField().value) return true
    return false
}


function toggleError() {
    if (!isTitleValid()) {
        elements.titleError().innerText = 'Titulo obrigatorio.'
        elements.titleError().style.display = 'block'
    }
}


function saveCard() {
    showLoading()

    const card = createCard()

    if (isNewCard()) {
        save(card)
    }
    else {
        update(card)
    }
}


function save(card) {
    cardService.save(card)
        .then(() => {
            hideLoading()
            window.location.href = "../home/home.html"
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao salvar tarefa.")
        })
    console.log("oi")
}


function createCard() {
    return {
        title: elements.titleField().value,
        description: elements.descriptionField().value,
        column: "backlog",
        comment: elements.commentField().value,
        responsable: elements.cardResp().value,
        limitDate: elements.limitDate().value,
        sector: elements.sectorField().value,
    }
}


function returnToHome() {
    window.location.href = "../home/home.html"
}


function update(card) {
    showLoading()
    cardService.update(card)
        .then(() => {
            hideLoading()
            window.location.href = "../home/home.html"
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao atualizar tarefa.")
        })
}


function askDeleteCard() {
    const shouldRemove = confirm("Deseja deletar a tarefa?")
    if (shouldRemove) removeCard()
}


function removeCard() {
    showLoading()
    cardService.remove()
        .then(() => {
            hideLoading()
            window.location.href = "../home/home.html"
        })
        .catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro ao deletar tarefa.")
            window.location.href = "../home/home.html"
        })
}
