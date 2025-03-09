// carega o menu lateral e a barra de navegação
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/global/menu.html')
        .then(response => response.text())
        .then(data => {

            // Insere o conteúdo de menu.html diretamente no início do body
            document.body.insertAdjacentHTML('afterbegin', data);

            let visor = document.getElementById("visor"); // Adiciona a variável visor para a calculadora

            // Personaliza o título do menu
            const pageTitle = document.body.getAttribute('data-title');
            const titleElement = document.querySelector('nav h6 a');
            if (titleElement && pageTitle) {
                titleElement.textContent = pageTitle;
            }

            // Lógica para arrastar as divs
            function mover(objeto) {
                objeto.addEventListener('mousedown', (e) => {
                    draggedElement = objeto;
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
            }
            let draggedElement = null;

            mover(document.getElementById('updates'));
            mover(document.getElementById('calculadora'))
            mover(document.getElementById('bloco'))
            mover(document.getElementById('conquistas'))
            mover(document.getElementById('configuracoes'))

            // Carrega as notas do localStorage quando a página é carregada
            const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
            const noteContainer = document.getElementById('noteContainer');
            savedNotes.forEach(noteText => {
                const note = document.createElement('div');
                note.className = 'note';
                note.innerHTML = `
                    <textarea readonly>${noteText}</textarea>
                    <button class="edit" onclick="editNote(this)">Editar</button>
                    <button class="delete" onclick="deleteNote(this)">Excluir</button>
                `;
                noteContainer.appendChild(note);
            });
        })

        .catch(error => console.error('Erro ao carregar o menu:', error)); // Exibe um erro no console caso haja algum problema ao carregar o menu

});

function abrirMenu(estado) {
    let barra = document.getElementById("menu-lateral");
    let botao = document.querySelector(".botao-menu-lateral");
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

function mudarNotasAtualizacao(divId) {
    let divs = document.querySelectorAll("div#updates > div")
    divs.forEach((div) => div.style.display = "none")
    divs[0].style.display = "block"
    divs[1].style.display = "block"
    document.getElementById(divId + "-updates").style.display = "block"

    let button = document.getElementById("dropdown-button")
    button.innerText = (divId.charAt(0).toUpperCase() + divId.slice(1)).replace("-", " ");
}

function calculadora(estado) {
    let calculadora = document.getElementById("calculadora");
    if (estado === true) {
        calculadora.style.display = "none";
    } else if (estado === false) {
        calculadora.style.display = "block";
    }
}

function blocoNotas(estado) {
    let blocoNotas = document.getElementById("bloco");
    if (estado === true) {
        blocoNotas.style.display = "none";
    } else if (estado === false) {
        blocoNotas.style.display = "block";
    }
}

function conquistas(estado) {
    let conquistas = document.getElementById("conquistas");
    if (estado === true) {
        conquistas.style.display = "none";
    } else if (estado === false) {
        conquistas.style.display = "block";
        adicionarConquistas()
    }
}

function configuracoes(estado) {
    let configuracoes = document.getElementById("configuracoes");
    if (estado === true) {
        configuracoes.style.display = "none";
    } else if (estado === false) {
        configuracoes.style.display = "block";
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



/* bloco de notas */

function addNote() {
    const noteText = document.getElementById('newNoteText').value;
    if (noteText.trim() === '') return;

    const noteContainer = document.getElementById('noteContainer');
    const note = document.createElement('div');
    note.className = 'note';

    note.innerHTML = `
        <textarea readonly>${noteText}</textarea>
        <button class="edit" onclick="editNote(this)">Editar</button>
        <button class="delete" onclick="deleteNote(this)">Excluir</button>
    `;

    noteContainer.appendChild(note);
    document.getElementById('newNoteText').value = '';

    // Salva a nova nota no localStorage
    saveNotes();
}

function editNote(button) {
    const note = button.parentElement;
    const textarea = note.querySelector('textarea');

    if (button.textContent === 'Editar') {
        textarea.removeAttribute('readonly');
        button.textContent = 'Salvar';
    } else {
        textarea.setAttribute('readonly', '');
        button.textContent = 'Editar';

        // Salva as alterações no localStorage
        saveNotes();
    }
}

function deleteNote(button) {
    const note = button.parentElement;
    note.remove();

    // Salva as alterações no localStorage
    saveNotes();
}

function saveNotes() {
    const noteContainer = document.getElementById('noteContainer');
    const notes = Array.from(noteContainer.children).map(note => note.querySelector('textarea').value);
    localStorage.setItem('notes', JSON.stringify(notes));
}

/* bloco de notas */



/* Conquistas */

class Conquista {
    constructor(img="", descricao="") {
        this.img = img;
        this.descricao = descricao;
        this.funcao;
        this.possui = false;
    }
}

let conquistasLista = [];
window.conquistasLista = conquistasLista

let img = [];
const path = "assets/images/conquistas-geral/";
for (let i = 1; i <= 9; i++) {
    img.push("conquista"+i+".png");
}
img.forEach((imageName) => {
    const imagem = new Image();
    imagem.src = path + imageName; 
    conquistasLista.push(new Conquista(imagem));
});

function adicionarConquistas() {

    const conquistasContainer = document.getElementById("conquistas-container");
    conquistasContainer.innerHTML = ""; 

    const descricao = [
        "Responda o quiz de batatas", 
        "Use o codificador 1 vez", 
        "Clique na cor secreta", 
        "Clique no botão secreto do menu principal", 
        "Clique no jogo com a menor nota", 
        "Clique no número 63", 
        "Desative o css 1 vez", 
        "Veja todo o mini curso de python",
        "Consiga todas as conquistas do Quadrado clicker"
    ];

    try { 
        descricao.forEach((d, index) => { conquistasLista[index].descricao = d }); 
    } catch(error) {
        console.error(error)
    }
    

    conquistasLista.forEach(element => {
        const div = document.createElement("div");

        const imag = document.createElement("img");
        imag.src = element.img.src;

        const div2 = document.createElement("div");
        div2.classList.add("descricao-conquista");
        div2.innerHTML = `<p>${element.descricao}</p>`;
        
        div.appendChild(imag);
        div.appendChild(div2);
        div.classList.add("conquista");
        conquistasContainer.appendChild(div);
        verificarConquistas()
        if (element.possui) {
            imag.style = "filter: grayscale(0)"
        }
    });
}

function verificarConquistas() {
    document.getElementById("footerBotaoSecreto").addEventListener("click", botaoSecreto)
    function botaoSecreto() {
        conquistasLista[3].possui = true
    }
    
}

/* Conquistas */



/* Configurações */

let estadoBarra = true;
let estadoArcoIris = true;

function desativarBarra() {
    let titulo = document.getElementById("title");
    let barra = document.getElementById("barra-main");
    let botaoMenu = document.getElementById("botao-menu-lateral-reserva");

    if (estadoBarra) {
        titulo.style.display = "none";
        barra.style.display = "none";
        botaoMenu.style.display = "block";
        estadoBarra = false;
    } else if (estadoBarra === false) {
        titulo.style.display = "block";
        barra.style.display = "flex";
        botaoMenu.style.display = "none";
        estadoBarra = true;
    }
}

function desativarArcoIris() {
    let barra = document.getElementById("barra-main");

    if (estadoArcoIris) {
        barra.style.background = "green";
        estadoArcoIris = false;
    } else if (estadoArcoIris === false) {
        barra.style.background = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, red)";
        barra.style.backgroundSize = "300% 100%";
        estadoArcoIris = true;
    }

}
/* Configurações */
