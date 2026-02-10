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
                let draggedElement = null;
                let shiftX, shiftY;
                let startX, startY;
                let isDragging = false;
                const MOVE_THRESHOLD = 5; // pixels de movimento para considerar como arraste
                
                const moveAt = (pageX, pageY) => {
                    if (!draggedElement) return;
                    draggedElement.style.left = `${pageX - shiftX - window.scrollX}px`;
                    draggedElement.style.top = `${pageY - shiftY - window.scrollY}px`;
                };
                
                // Mouse events
                objeto.addEventListener('mousedown', (e) => {
                    // Se o clique foi em uma imagem dentro do elemento, permita o clique normal
                    if (e.target.tagName === 'IMG') {
                        return;
                    }
                    
                    draggedElement = objeto;
                    const rect = draggedElement.getBoundingClientRect();
                    shiftX = e.clientX - rect.left;
                    shiftY = e.clientY - rect.top;
                    startX = e.clientX;
                    startY = e.clientY;
                    isDragging = false;
                    
                    const onMouseMove = (e) => {
                        // Verifica se o movimento passou do threshold
                        if (!isDragging && 
                            (Math.abs(e.clientX - startX) > MOVE_THRESHOLD || 
                             Math.abs(e.clientY - startY) > MOVE_THRESHOLD)) {
                            isDragging = true;
                        }
                        
                        if (isDragging) {
                            moveAt(e.pageX, e.pageY);
                        }
                    };
                    
                    const onMouseUp = (e) => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        
                        // Se não estava arrastando, permite o clique
                        if (!isDragging && e.target.tagName === 'IMG') {
                            e.target.click();
                        }
                        
                        draggedElement = null;
                    };
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
                
                // Touch events
                objeto.addEventListener('touchstart', (e) => {
                    // Se o toque foi em uma imagem dentro do elemento
                    if (e.target.className === 'fechar') {
                        // Marca para permitir o clique se não houver movimento
                        const touch = e.touches[0];
                        startX = touch.clientX;
                        startY = touch.clientY;
                        isDragging = false;
                        
                        const onTouchMove = (e) => {
                            const touch = e.touches[0];
                            if (!isDragging && 
                                (Math.abs(touch.clientX - startX) > MOVE_THRESHOLD || 
                                 Math.abs(touch.clientY - startY) > MOVE_THRESHOLD)) {
                                isDragging = true;
                                e.preventDefault();
                            }
                        };
                        
                        const onTouchEnd = (e) => {
                            document.removeEventListener('touchmove', onTouchMove);
                            document.removeEventListener('touchend', onTouchEnd);
                            
                            // Se não estava arrastando, dispara o clique
                            if (!isDragging) {
                                e.target.click();
                            }
                        };
                        
                        document.addEventListener('touchmove', onTouchMove);
                        document.addEventListener('touchend', onTouchEnd, { once: true });
                        
                        return;
                    }
                    
                    // Caso contrário, trata como arraste
                    e.preventDefault();
                    draggedElement = objeto;
                    const touch = e.touches[0];
                    const rect = draggedElement.getBoundingClientRect();
                    shiftX = touch.clientX - rect.left;
                    shiftY = touch.clientY - rect.top;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    isDragging = false;
                    
                    const onTouchMove = (e) => {
                        const touch = e.touches[0];
                        if (!isDragging && 
                            (Math.abs(touch.clientX - startX) > MOVE_THRESHOLD || 
                             Math.abs(touch.clientY - startY) > MOVE_THRESHOLD)) {
                            isDragging = true;
                        }
                        
                        if (isDragging) {
                            moveAt(touch.pageX, touch.pageY);
                        }
                    };
                    
                    const onTouchEnd = () => {
                        document.removeEventListener('touchmove', onTouchMove);
                        document.removeEventListener('touchend', onTouchEnd);
                        draggedElement = null;
                    };
                    
                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchend', onTouchEnd, { once: true });
                }, { passive: false });
            }
            
            // Aplicar a todos os elementos
            mover(document.getElementById('updates'));
            mover(document.getElementById('notas-atualizacao'))
            mover(document.getElementById('calculadora'));
            mover(document.getElementById('bloco'));
            mover(document.getElementById('conquistasGeral'));
            mover(document.getElementById('configuracoes'));

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

function abrir(estado, id) {
    let element = document.getElementById(id);
    if (estado === true) {
        element.style.display = "none";
    } else if (estado === false) {
        element.style.display = "block";
    }
}

function abrirConquistas(estado) {
    verificarConquistasGeral()

    let con = document.getElementById("conquistasGeral");
    if (estado === true) {
        con.style.display = "none";
    } else if (estado === false) {
        con.style.display = "block";
        adicionarConquistasGeral();
    }
    salvarConquistasGeral();
}

// Notas da atualização

notasContainer = document.getElementById("notas-atualizacao-container");

const tipoNota = Object.freeze({
    MELHORIA: "melhoria",
    ATUALIZACAO: "atualizacao",
    CORRECAO: "correcao",
    NOVO_RECURSO: "novo_recurso"
});

class NotaAtualizacao {
    constructor(titulo, descricao, tipo) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo = tipo;
    }
}

/* Conquistas */

class ConquistaGeral {
    constructor(img = "", descricao = "", possui = false) {
        this.img = img;
        this.descricao = descricao;
        this.possui = possui;
    }
}

const conquistasLista = [];
const path = "assets/images/conquistas-geral/";

const descricoes = [
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

// Inicializa com imagens e descrições
function inicializarConquistas() {
    for (let i = 1; i <= descricoes.length; i++) {
        const img = new Image();
        img.src = `${path}conquista${i}.png`;
        conquistasLista.push(new ConquistaGeral(img, descricoes[i - 1], false));
    }
}

// Salva no localStorage
function salvarConquistasGeral() {
    const dadosParaSalvar = conquistasLista.map(c => ({
        descricao: c.descricao,
        possui: c.possui
    }));
    localStorage.setItem("ECS", JSON.stringify(dadosParaSalvar));
}

// Carrega do localStorage e aplica no array
function carregarConquistasGeral() {
    const estadoConquistasSalvas = localStorage.getItem("ECS");
    if (estadoConquistasSalvas) {
        const estado = JSON.parse(estadoConquistasSalvas);
        estado.forEach((element, index) => {
            conquistasLista[index].possui = element.possui;
        });
    }
}

// Renderiza as conquistas no HTML
function adicionarConquistasGeral() {
    const conquistasContainer = document.getElementById("conquistas-container");
    conquistasContainer.innerHTML = "";

    conquistasLista.forEach((element) => {
        const div = document.createElement("div");
        div.classList.add("conquista");

        const img = document.createElement("img");
        img.src = element.img.src;
        img.style.filter = element.possui ? "grayscale(0)" : "grayscale(100%)";

        const divDescricao = document.createElement("div");
        divDescricao.classList.add("descricao-conquista");
        divDescricao.innerHTML = `<p>${element.descricao}</p>`;

        div.appendChild(img);
        div.appendChild(divDescricao);
        conquistasContainer.appendChild(div);
    });
}

// Verifica os eventos para liberar conquistas
function verificarConquistasGeral() {
    const eventos = [
        { id: "botao", index: 0 },
        { id: "criptografar", index: 1 },
        { id: "descriptografar", index: 1 },
        { id: "corBotaoSecreto", index: 2 },
        { id: "footerBotaoSecreto", index: 3 },
        { id: "jogoBotaoSecreto", index: 4 },
        { id: "63", index: 5 },
        { id: "botao-css", index: 6 },
        { id: "pythonBotaoSecreto", index: 7 }
        // A conquista 8 provavelmente será desbloqueada de outra forma
    ];

    eventos.forEach((evento) => {
        const elemento = document.getElementById(evento.id);
        if (elemento) {
            elemento.addEventListener("click", () => {
                if (!conquistasLista[evento.index].possui) {
                    conquistasLista[evento.index].possui = true;
                    salvarConquistasGeral();
                    adicionarConquistasGeral();
                }
            });
        }
    });
}

// Inicialização completa
window.addEventListener("DOMContentLoaded", () => {
    inicializarConquistas();
    carregarConquistasGeral();
    adicionarConquistasGeral();
    verificarConquistasGeral();
});

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
