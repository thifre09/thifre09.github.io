// carega o menu lateral e a barra de navegação
document.addEventListener('DOMContentLoaded', () => {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            // Insere o conteúdo de menu.html diretamente no início do body
            document.body.insertAdjacentHTML('afterbegin', data);

            // Personaliza o título do menu
            const pageTitle = document.body.getAttribute('data-title');
            const titleElement = document.querySelector('nav h6 a');
            if (titleElement && pageTitle) {
                titleElement.textContent = pageTitle;
            }

            // Lógica para arrastar a div#updates
            const updates = document.getElementById('updates');
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
