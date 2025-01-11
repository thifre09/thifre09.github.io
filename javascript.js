// carega o menu lateral e a barra de navegação
document.addEventListener('DOMContentLoaded', () => {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            // Insere o conteúdo de menu.html diretamente no início do body
            document.body.insertAdjacentHTML('afterbegin', data);
            let visor = document.getElementById("visor");

            // Personaliza o título do menu
            const pageTitle = document.body.getAttribute('data-title');
            const titleElement = document.querySelector('nav h6 a');
            if (titleElement && pageTitle) {
                titleElement.textContent = pageTitle;
            }

            // Lógica para arrastar a div#updates
            const updates = document.getElementById('updates');
            const calculadora = document.getElementById('calculadora');
            let draggedElement = null;

            updates.addEventListener('mousedown', (e) => {
                draggedElement = updates;
                const rect = draggedElement.getBoundingClientRect();
                const shiftX = e.clientX - rect.left;
                const shiftY = e.clientY - rect.top;

                // Função para mover o painel
                const moveAt = (pageX, pageY) => {
                    draggedElement.style.left = `${pageX - shiftX - window.scrollX}px`;
                    draggedElement.style.top = `${pageY - shiftY - window.scrollY}px`;
                };

                const onMouseMove = (event) => {
                    moveAt(event.pageX, event.pageY);
                };

                // Começa a mover com o mouse
                document.addEventListener('mousemove', onMouseMove);

                // Solta o painel ao soltar o mouse
                document.addEventListener('mouseup', () => {
                    draggedElement = null;
                    document.removeEventListener('mousemove', onMouseMove);
                }, { once: true });
            });

            calculadora.addEventListener('mousedown', (e) => {
                draggedElement = calculadora;
                const rect = draggedElement.getBoundingClientRect();
                const shiftX = e.clientX - rect.left;
                const shiftY = e.clientY - rect.top;

                // Função para mover o painel
                const moveAt = (pageX, pageY) => {
                    draggedElement.style.left = `${pageX - shiftX - window.scrollX}px`;
                    draggedElement.style.top = `${pageY - shiftY - window.scrollY}px`;
                };

                const onMouseMove = (event) => {
                    moveAt(event.pageX, event.pageY);
                };

                // Começa a mover com o mouse
                document.addEventListener('mousemove', onMouseMove);

                // Solta o painel ao soltar o mouse
                document.addEventListener('mouseup', () => {
                    draggedElement = null;
                    document.removeEventListener('mousemove', onMouseMove);
                }, { once: true });
            });
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));
});

function abrirMenu(estado) {
    let barra = document.getElementById("menu-lateral");
    let botao = document.getElementById("botao-menu-lateral");
    if (estado === true) {
        barra.style.animation = "fecharMenu 0.7s normal";
        setTimeout(() => {
            barra.style.display = "none";
            botao.style.display = "block";
        }, 700); // Aguarda o tempo da animação (0.7s)
    } else if (estado === false) {
        barra.style.animation = "abrirMenu 0.7s normal";
        barra.style.display = "flex";
        botao.style.display = "none";
    }
}

function NotasAtualizacao(estado) {
    let NotasAtu = document.getElementById("updates");
    if (estado === true) {
        NotasAtu.style.display = "none";
    } else if (estado === false) {
        NotasAtu.style.display = "block";
    }
}

function calculadora(estado) {
    let calculadora = document.getElementById("calculadora");
    if (estado === true) {
        calculadora.style.display = "none";
    } else if (estado === false) {
        calculadora.style.display = "block";
    }
}

/* todo o javascript da calculadora */

let num1 = 0;
let numeroAtivo = 0;
let operador = "";
let calcularFoiUltimoUsado = false;
let virgulaAtivo = false;
let clicksVirgula = 1;



function numbers(numero) {

    if (virgulaAtivo === false) {
        numeroAtivo *= 10;
        numeroAtivo += numero;
        visor.innerText = numeroAtivo;
    } else {
        numeroAtivo += numero / 10 ** clicksVirgula;
        clicksVirgula++;
        visor.innerText = numeroAtivo.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
    }
}

function simbolos(simbolo) {
    if (operador !== "" && calcularFoiUltimoUsado === false) {
        calcular(); // Corrige a lógica repetitiva e reutiliza o cálculo.
    } else if (operador === "") {
        num1 = numeroAtivo;
    }

    numeroAtivo = 0;
    virgulaAtivo = false;
    clicksVirgula = 1;
    calcularFoiUltimoUsado = false;
    operador = simbolo;
}

function simbolosInstantaneos(simbolo) {
    if (simbolo === "**") {
        numeroAtivo **= 2;
    } else if (simbolo === "sqrt") {
        numeroAtivo = Math.sqrt(numeroAtivo);
    } else if (simbolo === "+/-") {
        numeroAtivo *= -1;
    } else if (simbolo === "1/x") {
        numeroAtivo = 1 / numeroAtivo;
    } else if (simbolo === "%") {
        numeroAtivo = (num1 / 100) * numeroAtivo;
    }

    visor.innerHTML = numeroAtivo;
}

function apagar(tipo) {
    if (tipo === "tudo") {
        num1 = 0;
        numeroAtivo = 0;
        operador = "";
        virgulaAtivo = false;
        clicksVirgula = 1;
        calcularFoiUltimoUsado = false;
        visor.innerHTML = numeroAtivo;
    } else if (tipo === "parcial") {
        numeroAtivo = 0;
        virgulaAtivo = false;
        clicksVirgula = 1;
        visor.innerHTML = numeroAtivo;
    } else if (tipo === "um") {
        if (virgulaAtivo === false) {
            numeroAtivo = Math.floor(numeroAtivo / 10);
        } else {
            numeroAtivo = Math.floor(numeroAtivo * 10 ** (clicksVirgula - 1)) / 10 ** (clicksVirgula - 1);
            clicksVirgula--;
        }

        if (numeroAtivo === 0) {
            visor.innerHTML = num1;
        } else {
            visor.innerHTML = numeroAtivo.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
        }
    }
}

function virgula() {
    virgulaAtivo = true;
    visor.innerHTML = numeroAtivo.toLocaleString("pt-BR") + ",";
}

function calcular() {
    if (operador === "+") {
        num1 += numeroAtivo;
    } else if (operador === "-") {
        num1 -= numeroAtivo;
    } else if (operador === "x") {
        num1 *= numeroAtivo;
    } else if (operador === "/") {
        if (numeroAtivo !== 0) {
            num1 /= numeroAtivo;
        } else {
            visor.innerHTML = "Erro: Divisão por zero";
            return;
        }
    }

    numeroAtivo = 0;
    virgulaAtivo = false;
    clicksVirgula = 1;
    calcularFoiUltimoUsado = true;
    visor.innerHTML = num1.toLocaleString("pt-BR");
}


/* todo o javascript da calculadora */