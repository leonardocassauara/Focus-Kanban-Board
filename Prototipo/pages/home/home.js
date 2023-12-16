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


findCards()


function findCards() {
    showLoading();
    firebase.firestore()
        .collection('colunas')
        .get()
        .then(snapshot => {
            hideLoading()
            let cards;
            snapshot.docs.forEach(doc => {
                cards = doc.data()
            })
            addCardsToScreen(cards)
        }).catch(error => {
            hideLoading()
            console.log(error)
            alert("Erro, tente novamente.")
        })
}


function addCardsToScreen(cards) {
    const todoField = columnsField.ulTodo()
    const doingField = columnsField.ulDoing()
    const reviewField = columnsField.ulReview()
    const doneField = columnsField.ulDone()

    cards.todo.forEach(card => {
        const li = document.createElement('li');
        li.className = "card";
        li.innerText = card
        todoField.appendChild(li)
    })

    cards.doing.forEach(card => {
        const li = document.createElement('li');
        li.className = "card";
        li.innerText = card
        doingField.appendChild(li)
    })

    cards.review.forEach(card => {
        const li = document.createElement('li');
        li.className = "card";
        li.innerText = card
        reviewField.appendChild(li)
    })

    cards.done.forEach(card => {
        const li = document.createElement('li');
        li.className = "card";
        li.innerText = card
        doneField.appendChild(li)
    })
}


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


/*
function getUserUid() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) return user.id
    })
}


function isCurrentUserFirstAcces() {
        
    return new Promise((resolve) => firebase.firestore().collection('usuarios').get().then(snapshot => {    
        let isFirstAcces = true
        snapshot.forEach(doc => {
                if (getUserUid() == doc.id) isFirstAcces = false
            })
        resolve(isFirstAcces)
        }).catch(error => {
            alert("Erro ao verificar primeiro acesso.")
        })
    )
}
*/


// Modelo Fake
/*

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
*/