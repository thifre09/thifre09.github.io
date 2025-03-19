let textoElement = document.getElementById("input"); // Referência ao elemento textarea
let ajusteElement = document.getElementById("ajuste"); // Referência ao elemento input[type="number"]
let resultado = document.getElementById("resultado");

let criptografarbtn = document.getElementById("criptografar");
let descriptografarbtn = document.getElementById("descriptografar");

// Função para criptografar
criptografarbtn.addEventListener("click", function (event) {
    event.preventDefault();
    
    let texto = textoElement.value; // Captura o valor atual do textarea
    let ajuste = parseInt(ajusteElement.value) || 0; // Converte o ajuste para número
    let resultadoTexto = "";

    if (ajuste < 0 || ajuste > 100000) {
        alert("O valor do ajuste deve estar entre 0 e 100000.");
        return;
    }

    // Itera sobre os caracteres do texto
    for (let char of texto) {
        let valor = char.charCodeAt(0) + ajuste; // Ajusta o código do caractere
        resultadoTexto += String.fromCharCode(valor); // Converte de volta para caractere
    }

    resultado.innerHTML = resultadoTexto; // Exibe o texto criptografado
    
});

// Função para descriptografar
descriptografarbtn.addEventListener("click", function (event) {
    event.preventDefault();
    let texto = textoElement.value; // Captura o valor atual do textarea
    let ajuste = parseInt(ajusteElement.value) || 0; // Converte o ajuste para número
    let resultadoTexto = "";

    // Itera sobre os caracteres do texto
    for (let char of texto) {
        let valor = char.charCodeAt(0) - ajuste; // Reverte o código do caractere
        resultadoTexto += String.fromCharCode(valor); // Converte de volta para caractere
    }

    resultado.innerHTML = resultadoTexto; // Exibe o texto descriptografado
});
