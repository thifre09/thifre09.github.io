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
            //mover(document.getElementById('bloco-notas'));
            //mover(document.getElementById('conquistas-geral'));
            //mover(document.getElementById('configuracoes'));

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
            console.log("sim")
            criarNotasAtualizacao();
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

class Atualizacao {
    constructor(nome, data, notas) {
        this.nome = nome;
        this.data = data;
        this.notas = notas;
    }
}

const atualizacoes = [
    new Atualizacao("Beta 1.0", "2024-06-01", [
        new NotaAtualizacao("Lançamento do Quadrado Clicker", "O Quadrado Clicker é um jogo de clique simples e viciante, onde o objetivo é clicar em um quadrado para ganhar pontos. Com gráficos minimalistas e uma jogabilidade fácil de entender, o Quadrado Clicker é perfeito para quem procura uma experiência casual e divertida. Desafie-se a alcançar a maior pontuação possível e descubra as conquistas escondidas ao longo do caminho!", tipoNota.NOVO_RECURSO)
    ]),
    new Atualizacao("Beta 1.1", "2024-06-15", [
        new NotaAtualizacao("Adição de conquistas", "Agora você pode desbloquear conquistas especiais ao realizar ações específicas no jogo. Explore o Quadrado Clicker e descubra todas as conquistas disponíveis!", tipoNota.NOVO_RECURSO),
        new NotaAtualizacao("Melhoria na interface do usuário", "A interface do Quadrado Clicker foi aprimorada para proporcionar uma experiência mais agradável e intuitiva. Aproveite as melhorias visuais enquanto joga!", tipoNota.MELHORIA)
    ])
];

function criarNotasAtualizacao() {
    const notasContainer = document.getElementById("notas-atualizacao-container");

    atualizacoes.forEach(atualizacao => {
        const divAtualizacao = document.createElement("div");
        divAtualizacao.classList.add("atualizacao");
        notasContainer.appendChild(divAtualizacao);

        const divVersaoData = document.createElement("div");
        divVersaoData.classList.add("versao-data");
        divAtualizacao.appendChild(divVersaoData);

        const h2titulo = document.createElement("h2");
        h2titulo.textContent = atualizacao.nome;
        divVersaoData.appendChild(h2titulo);

        const divData = document.createElement("div");
        divData.classList.add("data-container");
        
        divData.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
            </svg>`;
        divVersaoData.appendChild(divData);

        const data = document.createElement("p");
        data.classList.add("data");
        data.textContent = atualizacao.data;
        divData.appendChild(data);

        const ulNotas = document.createElement("ul");
        divAtualizacao.appendChild(ulNotas);

        atualizacao.notas.forEach(nota => {
            const liNota = document.createElement("li");
            liNota.classList.add("nota");
            
            const divTipo = document.createElement("div");
            divTipo.classList.add("tipo-nota");
            liNota.appendChild(divTipo);

            const tipo = document.createElement("h4");
            tipo.textContent = nota.tipo.replace("_", " ").toUpperCase();
            divTipo.appendChild(tipo);

            const h3tituloNota = document.createElement("h3");
            h3tituloNota.textContent = nota.titulo;
            liNota.appendChild(h3tituloNota);

            const pDescricao = document.createElement("p");
            pDescricao.textContent = nota.descricao;
            liNota.appendChild(pDescricao);

            ulNotas.appendChild(liNota);

            switch (nota.tipo) {
                case tipoNota.MELHORIA:
                    liNota.style.borderLeft = "4px solid #4CAF50"; // Verde
                    tipo.style.color = "#4CAF50";
                    tipo.style.backgroundColor = "#e8f5e9";
                    divTipo.innerHTML += "<img src='assets/images/icones-uteis/melhoria.png'>"; // Ícone de melhoria
                    break;
                case tipoNota.ATUALIZACAO:
                    liNota.style.borderLeft = "4px solid #2196F3"; // Azul
                    tipo.style.color = "#2196F3";
                    tipo.style.backgroundColor = "#e3f2fd";
                    divTipo.innerHTML += "<img src='assets/images/icones-uteis/atualizacao.png'>"; // Ícone de atualização
                    break;
                case tipoNota.CORRECAO:
                    liNota.style.borderLeft = "4px solid #f44336"; // Vermelho
                    tipo.style.color = "#f44336";
                    tipo.style.backgroundColor = "#ffebee";
                    divTipo.innerHTML += "<img src='assets/images/icones-uteis/correcao.png'>"; // Ícone de correção
                    break;
                case tipoNota.NOVO_RECURSO:
                    liNota.style.borderLeft = "4px solid #ff9800"; // Laranja
                    tipo.style.color = "#ff9800";
                    tipo.style.backgroundColor = "#fff3e0";
                    divTipo.innerHTML += "<img src='assets/images/icones-uteis/novo_recurso.png'>"; // Ícone de novo recurso
                    break;
            }
        });
    });
}
console.log("ola")

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
    if (conquistasContainer === null) {
        console.warn("adicionarConquistasGeral: 'conquistas-container' não encontrado. Chame adicionarConquistasGeral() após a injeção de 'menu.html'.");
        return;
    }
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
