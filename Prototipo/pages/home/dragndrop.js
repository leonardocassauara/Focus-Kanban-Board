const draggables = document.querySelectorAll(".card")
const droppables = document.querySelectorAll('.cards-container')


draggables.forEach(card => {
    card.addEventListener("dragstart", () => {
        card.classList.add("card-is-dragging")
    })
    card.addEventListener('dragend', () => {
        card.classList.remove("card-is-dragging")
    })
})


droppables.forEach(zone => {
    zone.addEventListener('dragover', event => {
        event.preventDefault()
        const bottomCard = insertAboveCard(zone, event.clientY)
        const currentCard = document.querySelector('.card-is-dragging')

        if (!bottomCard) {
            zone.appendChild(currentCard)
        }
        else {
            zone.insertBefore(currentCard, bottomCard)
        }
    })
})


const insertAboveCard = (zone, mouseY) => {
    const cardsInZone = zone.querySelectorAll('.card:not(.card-is-dragging)')

    let closestCard = null
    let closestOffset = Number.NEGATIVE_INFINITY

    cardsInZone.forEach(card => {
        const { top } = card.getBoundingClientRect()

        const offset = mouseY - top

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset
            closestCard = card
        }
    })

    return closestCard
}

