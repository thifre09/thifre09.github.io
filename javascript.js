function abrirMenu(estado) {
    let barra = document.getElementById("menu-lateral")
    let botao = document.getElementById("botao-menu-lateral")
    if (estado === true) {
        barra.style.animation = "fecharMenu 0.7s normal"
        barra.style.right = "10000000px"
        botao.style.display = "block"
        estado_barra = false
    } else if (estado === false) {
        barra.style.animation = "abrirMenu 0.7s normal"
        barra.style.right = "70%"
        botao.style.display = "none"
        estado_barra = true
        
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            const container = document.createElement('div');
            container.innerHTML = data;

            // Insere o menu no início do body
            document.body.insertAdjacentElement('afterbegin', container);

            // Personaliza o título do menu
            const pageTitle = document.body.getAttribute('data-title');
            const titleElement = document.querySelector('nav h6 a');
            if (titleElement && pageTitle) {
                titleElement.textContent = pageTitle;
            }
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));
});