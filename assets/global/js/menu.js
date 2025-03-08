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

/* Configurações */

estadoBarra = true;
estadoArcoIris = true;

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


