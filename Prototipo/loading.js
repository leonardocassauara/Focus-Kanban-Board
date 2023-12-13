function showLoading() {
    const loading = document.createElement("div")
    loading.classList.add("loading", "centralize");

    const loader = document.createElement("div");
    loader.className = "loader";

    loading.appendChild(loader)
    document.body.appendChild(loading)
}


function hideLoading() {
    const loadings = document.getElementsByClassName("loading");

    if (loadings.length) loadings[0].remove();
}