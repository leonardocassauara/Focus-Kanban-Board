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


const columns = {
    todo: () => document.getElementById('todo'),
    doing: () => document.getElementById('doing'),
    review: () => document.getElementById('review'),
    done: () => document.getElementById('done'),
}


const columnsField = {
    ulTodo: () => document.getElementById('ulTodo'),
    ulDoing: () => document.getElementById('ulDoing'),
    ulReview: () => document.getElementById('ulReview'),
    ulDone: () => document.getElementById('ulDone')
}


const fakeKanban = [
    [
        {title: "Estudar"},
        {title: "Relaxar"},
    ],
    [
        {title: "Trainee"},
    ],
    [
        {title: "Abordagem"},
    ],
    [
        {title: "Período"},
    ],
]

findCards()

// Simular o Backend (fake)
function findCards() {
    setTimeout(() => {
        addCardsToScreen(fakeKanban);
    }, 1000)
}


function addCardsToScreen(cards) {
    const todoField = columnsField.ulTodo()
    const doingField = columnsField.ulDoing()
    const reviewField = columnsField.ulReview()
    const doneField = columnsField.ulDone()

    let i = 0;

    cards.forEach(cards => {
        
        cards.forEach(card => {
            const li = document.createElement('li');
            li.className = "card";
            li.innerText = card.title
            
            if (i == 0) todoField.appendChild(li);
            else if (i == 1) doingField.appendChild(li);
            else if (i == 2) reviewField.appendChild(li);
            else doneField.appendChild(li);
        })
        
        i++;
    })
}