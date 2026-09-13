let btn = document.getElementById("botao-css");
let estado = true;
let estilo = document.getElementById("linkcss");

btn.style.border = "none";
btn.style.borderRadius = "15px";
btn.style.fontSize = "xx-large";
btn.style.width = "fit-content";
btn.style.position = "fixed";
btn.style.top = "100%";
btn.style.left = "50%";
btn.style.transform = "translate(-50%, -103%)";
btn.style.backgroundColor = "red";
btn.style.cursor = "pointer";
btn.style.padding = "10px";
btn.style.color = "white";
btn.style.zIndex = "2"

function clique() {
    if (estado) {
        estado = false;
        btn.style.backgroundColor = "green";
        btn.innerText = "Ativar CSS";
        estilo.href = "";
    } else {
        estado = true;
        btn.style.backgroundColor = "red";
        btn.innerText = "Desativar CSS";
        estilo.href = "assets/css/poder-do-css.css";
    }
}