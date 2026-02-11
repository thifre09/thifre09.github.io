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

const relacionado = Object.freeze({
    //Geral
    BANNER_PRINCIPAL: "Banner principal",
    PAGINA_INICIAL: "Página inicial",
    GERAL: "Geral",
    // Paginas
    Batatas: "Batatas",
    Codificador: "Codificador",
    Cores: "Cores",
    CURIOSIDADES: "Curiosidades",
    REVIEW_DE_JOGOS: "Review de jogos",
    MEMES: "Memes",
    NUMEROS: "Números",
    PODER_DO_CSS: "Poder do CSS",
    PYTHON: "Python",
    QUADRADO_CLICKER: "Quadrado Clicker"
});

class NotaAtualizacao {
    constructor(titulo, descricao, tipo, relacionado = []) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo = tipo;
        this.relacionado = relacionado;
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
    new Atualizacao("Beta 2.0", "??/??/????", [
        new NotaAtualizacao("Mudanças no layout de quase todas as páginas", "O layout de quase todas as páginas do site foi completamente refeito, com um design mais moderno e responsivo.", tipoNota.MELHORIA, relacionado.GERAL),
        new NotaAtualizacao("Atualização no banner principal", "O banner principal de cada página foi padronizado, com um design mais moderno e responsivo.", tipoNota.MELHORIA, relacionado.BANNER_PRINCIPAL),
        new NotaAtualizacao("Criação de um menu lateral", "Foi criado um menu lateral no banner principal, contendo o bloco de notas, as notas de atualização e a calculadora.", tipoNota.NOVO_RECURSO, relacionado.BANNER_PRINCIPAL),
        new NotaAtualizacao("Criação de uma calculadora", "Foi criada uma calculadora simples.", tipoNota.NOVO_RECURSO, relacionado.BANNER_PRINCIPAL),
        new NotaAtualizacao("Remoção do bloco de notas e notas de atualização do menu principal", "O bloco de notas e as notas de atualização foram removidos do menu principal e adicionados à barra lateral, para melhorar a organização do site.", tipoNota.ATUALIZACAO, relacionado.BANNER_PRINCIPAL),
        new NotaAtualizacao("Atualização do Quadrado Clicker", "Foi adicionada uma opção para colocar imagens no quadrado, e algumas melhorias tiveram seus preços ajustados para melhorar o balanceamento do jogo.", tipoNota.ATUALIZACAO, relacionado.QUADRADO_CLICKER),
        new NotaAtualizacao("Atualização da página principal", "O layout da página do menu principal foi completamente refeito, com um design mais moderno e responsivo.", tipoNota.ATUALIZACAO, relacionado.PAGINA_INICIAL),
        new NotaAtualizacao("Adição de novos memes", "Adicionado 4 novos memes à aba de memes.", tipoNota.ATUALIZACAO, relacionado.MEMES),
        new NotaAtualizacao("Adição de novas curiosidades", "Adicionadas curiosidades sobre objetos à aba de curiosidades.", tipoNota.ATUALIZACAO, relacionado.CURIOSIDADES),
        new NotaAtualizacao("Atualização da seção de Review de jogos", "Adicionada a review de 1 jogo, e mudanças no sumário.", tipoNota.ATUALIZACAO, relacionado.REVIEW_DE_JOGOS),
        new NotaAtualizacao("Criação da aba Codificador", "Essa aba contém um codificador e decodificador de texto, baseado na Cifra de César.", tipoNota.NOVO_RECURSO, relacionado.Codificador),
        new NotaAtualizacao("Criação da aba Cores", "Essa aba contém uma lista de cores e suas respectivas representações hexadecimais, HSL, HWB e RGB.", tipoNota.NOVO_RECURSO, relacionado.Cores),
        new NotaAtualizacao("Correção de erros gramaticais", "Foram corrigidos diversos erros gramaticais em todo o site.", tipoNota.CORRECAO, relacionado.GERAL)
    ]),
    new Atualizacao("Beta 1.3", "??/??/????", [
        new NotaAtualizacao("Criação da aba Quadrado Clicker", "Essa aba contém um jogo de clicker, onde o objetivo é clicar em um quadrado para ganhar quadrados, e usar esses quadrados para comprar melhorias que te dão mais quadrados por clique.", tipoNota.NOVO_RECURSO, relacionado.QUADRADO_CLICKER),
        new NotaAtualizacao("Adicionado mais reviews de jogos", "Adicionado novas reviews de jogos que joguei recentemente.", tipoNota.ATUALIZACAO, relacionado.REVIEW_DE_JOGOS)
    ]),
    new Atualizacao("Beta 1.2", "??/??/????", [
        new NotaAtualizacao("Criação da aba curiosidades", "Essa aba contém curiosidades sobre diversos assuntos, divididas 4 em categorias.", tipoNota.NOVO_RECURSO, relacionado.CURIOSIDADES),
        new NotaAtualizacao("Python:Melhoria no layout", "O layout da aba de Python foi ajustado para se ajustar melhor em celulares.", tipoNota.MELHORIA, relacionado.PYTHON),
        new NotaAtualizacao("Adição de novos memes", "Adicionado 3 novos memes à aba de memes.", tipoNota.ATUALIZACAO, relacionado.MEMES)
    ]),
    new Atualizacao("Beta 1.1", "??/??/????", [
        new NotaAtualizacao("Criação da aba Batatas", "Essa aba contém um quiz sobre curiosidades aleatórias, com um botão para verificar seus acertos.", tipoNota.NOVO_RECURSO, relacionado.BATATAS),
        new NotaAtualizacao("Melhoria no banner principal", "O banner principal agora é fixo, e desce junto com o resto da página.", tipoNota.MELHORIA, relacionado.BANNER_PRINCIPAL),
        new NotaAtualizacao("Mudança no layout de algumas abas", "Algumas abas tiveram seu layout ajustado para se ajustar melhor em celulares.", tipoNota.MELHORIA, relacionado.GERAL),
    ]),
    new Atualizacao("Beta 1.0", "??/??/????", [
        new NotaAtualizacao("Pequenas mudanças no layout", "Algumas páginas tiveram seu layout ajustado para melhorar a experiência do usuário.", tipoNota.MELHORIA, relacionado.PAGINA_INICIAL),
        new NotaAtualizacao("Continuação do curso de Python", "Adicionado mais seções ao curso de Python. Tabém foi adicionado uma mesagem no final", tipoNota.ATUALIZACAO, relacionado.PYTHON),
        new NotaAtualizacao("Atualizado a seção de Review de jogos", "Adicionada mais reviews de jogos que joguei recentemente.", tipoNota.ATUALIZACAO, relacionado.REVIEW_DE_JOGOS),
        new NotaAtualizacao("Correção de bugs menores", "Foram corrigidos alguns bugs menores relacionados ao layout e funcionalidade do site.", tipoNota.CORRECAO, relacionado.GERAL)
    ]),
    new Atualizacao("Alfa 1.0", "??/??/????", [
        new NotaAtualizacao("Lançamento inicial", "Lançamento inicial do projeto com funcionalidades básicas.", tipoNota.NOVO_RECURSO, relacionado.GERAL),
        new NotaAtualizacao("Criação da aba Memes", "Essa aba contém uma lista de diversos memes aleatórios.", tipoNota.NOVO_RECURSO, relacionado.MEMES),
        new NotaAtualizacao("Criação da aba Python", "Essa aba contém um minicurso de python, cobrindo o básico até a parte de condicionais.", tipoNota.NOVO_RECURSO, relacionado.PYTHON),
        new NotaAtualizacao("Criação da aba Números", "Essa aba contém uma curiosidade de todos os números de 1 até 100.", tipoNota.NOVO_RECURSO, relacionado.NUMEROS),
        new NotaAtualizacao("Criação da aba Review de jogos", "Essa aba contém reviews de jogos, com uma breve descrição e minha opinião sobre eles.", tipoNota.NOVO_RECURSO, relacionado.REVIEW_DE_JOGOS),
        new NotaAtualizacao("Criação de um bloco de notas", "Permite criar, editar e excluir notas, com armazenamento local. Ele está localizado na banner principal.", tipoNota.NOVO_RECURSO, relacionado.BANNER_PRINCIPAL),
        new NotaAtualizacao("Criação do banner principal", "Essa banner é uma faixa que muda de cor e aparece no topo de todas as páginas, dando boas vindas ao usuário e dizendo em qual página do site ele está.", tipoNota.NOVO_RECURSO, relacionado.BANNER_PRINCIPAL)
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
            pDescricao.classList.add("descricao");
            pDescricao.textContent = nota.descricao;
            liNota.appendChild(pDescricao);

            const pRelacionado = document.createElement("p");
            pRelacionado.classList.add("relacionado");
            pRelacionado.textContent = nota.relacionado;
            liNota.appendChild(pRelacionado);

            ulNotas.appendChild(liNota);

            switch (nota.tipo) {
                case tipoNota.MELHORIA:
                    liNota.style.borderLeft = "4px solid #4CAF50"; // Verde
                    tipo.style.color = "#4CAF50";
                    tipo.style.backgroundColor = "#e8f5e9";
                    divTipo.innerHTML += `
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#4CAF50" stroke="none">
                            <path d="M3010 5104 c-41 -27 -1710 -1697 -1726 -1726 -18 -35 -18 -72 1 -108
                            31 -60 33 -60 492 -60 l419 0 -3 -42 c-27 -386 -103 -677 -263 -1003 -127
                            -260 -281 -476 -485 -680 -132 -132 -239 -220 -399 -326 -174 -116 -433 -243
                            -611 -299 -113 -36 -146 -52 -160 -80 -31 -59 -10 -138 42 -158 43 -18 145
                            -39 278 -59 150 -22 560 -25 705 -4 225 31 450 87 644 159 l100 38 41 -81 c68
                            -137 193 -300 248 -323 45 -20 92 -7 141 38 48 44 101 70 144 70 73 0 150 -48
                            183 -113 18 -35 20 -50 14 -106 -14 -122 -12 -139 21 -171 44 -45 142 -63 334
                            -64 322 -2 408 45 373 200 -18 79 -6 129 43 184 39 43 86 63 149 62 58 -2 92
                            -16 141 -62 80 -74 137 -63 225 43 103 122 178 255 224 394 23 71 25 87 15
                            117 -12 38 -52 76 -79 76 -10 0 -41 12 -69 26 -112 56 -142 189 -65 292 25 33
                            89 72 120 72 36 0 82 38 93 77 10 33 9 48 -10 103 -52 159 -169 356 -274 462
                            -33 34 -43 38 -85 38 -42 0 -54 -5 -94 -40 -54 -48 -103 -70 -154 -70 -46 0
                            -110 29 -140 61 l-21 24 50 90 c158 283 266 624 300 942 l12 112 439 3 439 3
                            29 33 c31 35 38 85 18 125 -16 31 -1698 1715 -1731 1733 -36 19 -78 18 -108
                            -2z m1118 -1674 c-261 -4 -359 -8 -375 -18 -39 -22 -52 -64 -63 -205 -16 -218
                            -52 -393 -117 -581 -55 -157 -93 -237 -112 -232 -90 26 -123 30 -276 30 -245
                            0 -345 -23 -380 -89 -17 -30 -17 -39 -5 -103 7 -38 10 -85 6 -105 -14 -73 -73
                            -129 -157 -148 -60 -14 -111 4 -173 60 -65 59 -95 68 -144 44 -79 -39 -224
                            -247 -294 -422 -63 -161 -47 -221 70 -254 102 -28 163 -120 148 -222 -5 -29
                            -17 -57 -34 -75 -48 -52 -329 -177 -527 -235 -237 -69 -407 -95 -665 -101
                            l-205 -5 115 61 c552 296 995 769 1247 1333 146 327 228 671 240 1013 6 188 3
                            202 -50 234 -30 19 -53 20 -372 20 l-340 0 705 705 705 705 703 -702 702 -703
                            -352 -5z m-852 -1248 c6 -4 17 -38 23 -77 40 -233 218 -376 450 -363 66 4 92
                            11 142 37 l62 32 23 -28 c25 -31 104 -175 104 -189 0 -5 -23 -24 -51 -43 -126
                            -86 -196 -253 -170 -408 21 -124 83 -218 196 -298 l28 -21 -41 -79 c-23 -44
                            -52 -93 -64 -108 l-23 -28 -60 28 c-55 25 -70 28 -175 28 -111 0 -118 -1 -183
                            -33 -128 -63 -216 -184 -238 -327 -6 -39 -16 -73 -23 -77 -6 -4 -56 -8 -111
                            -8 -55 0 -105 4 -111 8 -6 4 -16 40 -23 81 -16 99 -53 175 -120 242 -125 125
                            -308 156 -474 82 -56 -25 -58 -26 -72 -7 -29 39 -105 180 -105 194 1 8 21 28
                            45 43 85 54 154 165 176 282 27 147 -62 344 -186 410 -30 17 -35 24 -30 45 8
                            30 90 174 109 189 10 8 28 4 72 -16 54 -26 69 -28 174 -28 106 0 120 2 172 28
                            129 63 217 185 240 331 9 52 17 77 28 80 27 7 205 6 216 -2z"/>
                            <path d="M3118 1619 c-117 -13 -237 -99 -291 -210 -121 -246 44 -536 316 -556
                            359 -27 553 402 297 657 -88 89 -190 124 -322 109z m148 -244 c96 -63 80 -221
                            -29 -274 -55 -27 -82 -26 -137 2 -50 24 -90 88 -90 141 0 41 36 111 68 132 53
                            35 134 35 188 -1z"/>
                        </g>
                    </svg>`;
                    break;
                case tipoNota.ATUALIZACAO:
                    liNota.style.borderLeft = "4px solid #2196F3"; // Azul
                    tipo.style.color = "#2196F3";
                    tipo.style.backgroundColor = "#e3f2fd";
                    divTipo.innerHTML += `
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#2196F3" stroke="none">
                            <path d="M2265 4703 c-632 -85 -1207 -461 -1550 -1014 -201 -324 -315 -722
                            -315 -1100 l0 -129 -160 0 -160 0 -36 -33 c-46 -42 -56 -105 -26 -152 32 -48
                            750 -867 759 -865 11 2 730 826 755 865 30 47 20 111 -26 152 l-36 33 -186 0
                            -187 0 6 158 c14 382 154 701 426 972 277 276 594 414 981 427 140 4 184 2
                            288 -16 261 -44 484 -145 686 -310 l80 -65 34 40 c18 21 121 141 228 266 l194
                            228 -73 60 c-175 147 -453 307 -658 378 -127 45 -318 90 -452 107 -147 19
                            -424 18 -572 -2z"/>
                            <path d="M3970 3090 c-206 -237 -381 -442 -388 -457 -23 -43 -9 -102 32 -140
                            l36 -33 185 0 186 0 -6 -47 c-49 -368 -178 -637 -425 -884 -226 -226 -479
                            -356 -795 -411 -100 -17 -146 -19 -280 -15 -294 10 -531 86 -764 242 -81 54
                            -85 56 -102 38 -10 -10 -112 -128 -228 -263 -194 -228 -208 -246 -193 -263 26
                            -29 232 -163 332 -216 599 -315 1344 -323 1955 -21 231 114 410 245 595 437
                            275 283 449 592 544 965 31 122 66 338 66 409 l0 29 160 0 160 0 36 33 c46 41
                            56 105 26 152 -14 22 -689 801 -751 867 -4 4 -175 -186 -381 -422z"/>
                        </g>
                    </svg>
                    `;
                    break;
                case tipoNota.CORRECAO:
                    liNota.style.borderLeft = "4px solid #f44336"; // Vermelho
                    tipo.style.color = "#f44336";
                    tipo.style.backgroundColor = "#ffebee";
                    divTipo.innerHTML += `
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#f44336" stroke="none">
                            <path d="M1855 4786 c-16 -7 -38 -22 -47 -32 -24 -27 -48 -88 -48 -121 0 -15
                            39 -108 87 -205 l87 -177 -60 -63 c-83 -88 -126 -150 -179 -259 -53 -112 -83
                            -222 -92 -340 l-6 -86 -54 -23 c-82 -34 -165 -101 -218 -174 -26 -36 -49 -66
                            -52 -66 -3 0 -98 62 -210 138 l-205 137 -58 0 c-63 0 -95 -16 -134 -69 -29
                            -38 -29 -133 -1 -173 16 -21 356 -261 444 -312 11 -7 7 -28 -23 -112 -52 -145
                            -94 -324 -107 -454 -6 -60 -13 -120 -15 -132 -4 -22 -5 -22 -273 -25 -254 -3
                            -271 -4 -297 -24 -53 -39 -69 -71 -69 -134 0 -63 16 -95 69 -134 26 -20 45
                            -21 304 -26 l276 -5 13 -89 c16 -109 62 -285 104 -395 l32 -83 -231 -232
                            c-127 -127 -236 -244 -242 -259 -27 -73 0 -147 69 -194 37 -25 91 -30 138 -13
                            15 6 117 99 225 208 109 108 199 194 201 192 2 -3 25 -36 52 -75 230 -328 583
                            -554 985 -631 140 -26 352 -25 497 4 397 79 760 315 974 634 23 34 44 65 46
                            67 2 3 92 -83 201 -191 162 -161 205 -198 240 -209 111 -32 219 70 198 188 -7
                            33 -39 70 -243 274 l-235 236 35 94 c43 114 84 273 101 389 l12 85 276 5 c259
                            5 278 6 304 26 53 39 69 71 69 134 0 63 -16 95 -69 134 -26 20 -43 21 -297 24
                            -268 3 -269 3 -273 25 -2 12 -9 72 -15 132 -13 130 -55 309 -107 454 -30 84
                            -34 105 -23 112 88 51 428 291 444 312 28 40 28 135 -1 173 -39 52 -71 69
                            -133 69 -58 0 -59 0 -265 -137 -113 -76 -208 -138 -210 -138 -2 0 -25 29 -51
                            65 -56 79 -121 132 -208 170 l-64 28 -7 86 c-16 220 -103 419 -255 583 l-74
                            80 87 176 c56 115 86 188 86 210 -1 134 -159 211 -259 126 -19 -16 -61 -87
                            -112 -186 -73 -145 -83 -159 -102 -154 -163 48 -172 49 -327 49 -155 0 -163
                            -1 -327 -49 -20 -5 -29 8 -101 152 -44 88 -90 169 -103 181 -47 43 -116 54
                            -174 29z m840 -641 c181 -38 349 -168 433 -335 41 -82 71 -191 72 -257 l0 -33
                            -640 0 -640 0 0 33 c1 65 31 174 71 257 126 255 419 395 704 335z m-295 -2219
                            l0 -1273 -50 9 c-148 27 -338 112 -472 213 -585 439 -770 1333 -421 2030 53
                            105 121 212 154 245 51 48 62 49 437 50 l352 0 0 -1274z m1067 1253 c49 -24
                            119 -121 196 -274 349 -696 163 -1591 -421 -2030 -134 -101 -324 -186 -472
                            -213 l-50 -9 0 1273 0 1274 352 0 c336 0 354 -1 395 -21z"/>
                        </g>
                    </svg>
                    `;
                    break;
                case tipoNota.NOVO_RECURSO:
                    liNota.style.borderLeft = "4px solid #ff9800"; // Laranja
                    tipo.style.color = "#ff9800";
                    tipo.style.backgroundColor = "#fff3e0";
                    divTipo.innerHTML += `
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#ff9800" stroke="none">
                            <path d="M2375 4793 c-921 -80 -1711 -724 -1963 -1603 -68 -235 -87 -373 -86
                            -635 0 -249 16 -372 78 -598 206 -746 807 -1347 1553 -1553 224 -61 349 -77
                            598 -78 242 -1 343 11 559 65 621 155 1161 592 1453 1174 90 178 171 439 209
                            670 27 164 25 505 -4 675 -85 500 -304 918 -659 1261 -369 356 -836 571 -1343
                            618 -107 10 -303 12 -395 4z m490 -337 c202 -36 347 -83 524 -167 399 -191
                            708 -500 901 -901 253 -528 253 -1132 -1 -1658 -461 -957 -1602 -1358 -2558
                            -899 -400 192 -709 501 -901 901 -84 176 -129 318 -167 528 -24 133 -24 467 0
                            600 38 210 83 352 167 528 122 254 284 463 495 640 291 244 638 394 1025 441
                            107 14 408 6 515 -13z"/>
                            <path d="M2495 3666 c-37 -17 -70 -52 -84 -89 -7 -18 -11 -173 -11 -442 l0
                            -414 -429 -3 c-416 -3 -430 -4 -457 -24 -53 -39 -69 -71 -69 -134 0 -63 16
                            -95 69 -134 27 -20 41 -21 456 -24 l429 -3 3 -429 c3 -415 4 -429 24 -456 39
                            -53 71 -69 134 -69 63 0 95 16 134 69 20 27 21 41 24 456 l3 429 429 3 c415 3
                            429 4 456 24 53 39 69 71 69 134 0 63 -16 95 -69 134 -27 20 -41 21 -456 24
                            l-429 3 -3 429 c-3 415 -4 429 -24 456 -11 15 -32 37 -46 47 -34 25 -113 32
                            -153 13z"/>
                        </g>
                    </svg>
                    `;
                    break;
            }
        });
    });
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
