// assets/js/aniversario.js
function displayMain() {
    const btn = document.getElementById("btn");
    btn.style.display = "none";

    const html = document.querySelector("html");
    html.style.background = "linear-gradient(45deg, pink, rgb(255, 66, 239))";

    const main = document.getElementById("main");
    main.style.display = "flex";
    main.style.flexWrap = "wrap";

    const fe = document.getElementById("fe");
    const ani = document.getElementById("ani");
    const so = document.getElementById("so");
    fe.style.animation = "descer 3s 1";
    setTimeout(() => {
        ani.style.opacity = "100%";
        ani.style.animation = "subir1 3s 1";
    }, 3000);
    setTimeout(() => {
        so.style.opacity = "100%";
        so.style.animation = "subir1 3s 1";
    }, 6000);

    // Iniciar o efeito de confete
    startConfetti();
}

function startConfetti() {
    const container = document.querySelector('.confetti-container');
    let confettiCount = 0; // Contador de confetes
    const maxConfetti = 100; // Limite máximo de confetes na tela

    function createConfetti() {
        if (confettiCount >= maxConfetti) return; // Não criar mais confetes se o limite for atingido

        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Posição horizontal aleatória
        confetti.style.left = `${Math.random() * 100}vw`;

        // Cor aleatória
        const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Duração da animação aleatória
        const duration = Math.random() * 3 + 2; // Entre 2 e 5 segundos
        confetti.style.animationDuration = `${duration}s`;

        // Tamanho aleatório
        const size = Math.random() * 10 + 5; // Entre 5px e 15px
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        container.appendChild(confetti);
        confettiCount++; // Incrementar o contador de confetes

        // Remover o confete após a animação terminar
        confetti.addEventListener('animationend', () => {
            confetti.remove();
            confettiCount--; // Decrementar o contador quando o confete for removido
        });
    }

    // Gerar confetes em intervalos regulares
    setInterval(createConfetti, 100);
}