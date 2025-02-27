let btn = document.getElementById("botao-css");
let estado = true;
let listaElementos;
let listaPropriedades;

function clique() {
    if (estado) {
        estado = false;
        btn.style.backgroundColor = "green";
        btn.innerText = "Ativar css";
        desativarCss();

    } else {
        estado = true;
        btn.style.backgroundColor = "red";
        btn.innerText = "Desativar css";
        ativarCss();
    }
}

function inicializarElementos() {
    listaElementos = {};

    listaElementos.container_introcao = document.getElementById("container-introducao");
    listaElementos.introducao = listaElementos.container_introcao?.firstElementChild; 
}

function inicializarPropriedades() {
    
    listaPropriedades = {
        
        container_introcao: {
            display: "flex",
            justifyContent: "center"
        },

        introducao: {
            border: "solid 3px",
            width: "70%",
            textAlign: "center",
            padding: "5px",
            fontSize: "large"
        }
    };
}

function ativarCss() {

    for (let key in listaElementos) {
        if (listaElementos[key]) {
            let propriedades = listaPropriedades[key]; 
            for (let propriedade in propriedades) {
                listaElementos[key].style[propriedade] = propriedades[propriedade];
            }
        }
    }
}

function desativarCss() {
    for (let key in listaElementos) {
        if (listaElementos[key]) {
            listaElementos[key].removeAttribute("style");
        }
    }
}

inicializarElementos();
inicializarPropriedades();
ativarCss()