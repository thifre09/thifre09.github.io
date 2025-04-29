let playButton = document.getElementById("jogar");

playButton.addEventListener("click", () => {
    document.getElementById("menu-principal").style.display = "none";
    document.querySelector("jogo").style.display = "flex";
});