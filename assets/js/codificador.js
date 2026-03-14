let textoElement = document.getElementById("input"); // Referência ao elemento textarea
let ajusteElement = document.getElementById("ajuste"); // Referência ao elemento input[type="number"]
let resultado = document.getElementById("resultado");

let criptografarbtn = document.getElementById("criptografar");
let descriptografarbtn = document.getElementById("descriptografar");

const matrixCanvas = document.getElementById("matrix-bg");
const matrixContainer = document.getElementById("container");

if (matrixCanvas && matrixContainer) {
    const ctx = matrixCanvas.getContext("2d");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-<>[]{}";
    const fontSize = 16;
    let columns = 0;
    let drops = [];

    function resizeMatrixCanvas() {
        matrixCanvas.width = matrixContainer.clientWidth;
        matrixCanvas.height = matrixContainer.clientHeight;
        columns = Math.max(1, Math.floor(matrixCanvas.width / fontSize));
        drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -30));
    }

    function drawMatrixFrame() {
        if (!ctx) {
            return;
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = "#44ff6a";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(char, x, y);

            if (y > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i]++;
            }
        }
    }

    resizeMatrixCanvas();
    window.addEventListener("resize", resizeMatrixCanvas);
    setInterval(drawMatrixFrame, 45);
}

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
