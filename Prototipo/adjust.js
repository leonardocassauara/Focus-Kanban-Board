function adjustElementSize() {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var element = document.getElementById('form');
    var elementHeight = element.offsetHeight + 25;
    var elementWidth = element.offsetWidth + 25;

    if (elementHeight > windowHeight || elementWidth > windowWidth) {
        var scaleFactor = Math.min(windowHeight / elementHeight, windowWidth / elementWidth);
        element.style.transform = 'scale(' + scaleFactor + ')';
    } else {
        element.style.transform = 'scale(1)';
    }
}

window.addEventListener('resize', adjustElementSize);
window.addEventListener('load', adjustElementSize);

adjustElementSize();