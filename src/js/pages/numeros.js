
// Função para ir até o número especificado
function goToNumber() {
    const number = document.getElementById("search-number").value;
    const element = document.getElementById(`${number}`);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Número não encontrado!");
    }
}

// Função para gerar uma cor aleatória em formato hexadecimal
function gerarCorAleatoria() {
    const letras = '0123456789ABCDEF';
    let cor = '#';
    for (let i = 0; i < 3; i++) {  // Gerando apenas RGB e duplicando para cores mais escuras
        let valor = Math.floor(Math.random() * 128) + 64; // Limita a geração para evitar valores claros
        cor += letras[(valor >> 4) & 0xF] + letras[valor & 0xF];
    }
    return cor;
}

// Seleciona todos os elementos <h2> na página
const elementosH2 = document.querySelectorAll('h2');

// Aplica uma cor de fundo aleatória a cada elemento <h2>
elementosH2.forEach(elemento => {
    elemento.style.color = gerarCorAleatoria();
});

// Função para gerar uma cor aleatória não muito clara em formato hexadecimal
function gerarCorAleatoriaNaoClara() {
    const letras = '0123456789ABCDEF';
    let cor = '#';
    for (let i = 0; i < 3; i++) {  // Gerando apenas RGB e duplicando para cores mais escuras
        let valor = Math.floor(Math.random() * 128) + 64; // Limita a geração para evitar valores claros
        cor += letras[(valor >> 4) & 0xF] + letras[valor & 0xF];
    }
    return cor;
}

// Seleciona todas as divs que contêm os elementos <h2>
const divs = document.querySelectorAll('div');

// Aplica uma cor de borda aleatória a cada div, garantindo que não seja clara
divs.forEach(div => {
    div.style.borderColor = gerarCorAleatoriaNaoClara(); // Define a cor da borda
});