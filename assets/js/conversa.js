let playButton = document.getElementById("jogar");

playButton.addEventListener("click", () => {
    document.getElementById("menu-principal").style.display = "none";
    document.querySelector("div#jogo").style.display = "flex";
});

