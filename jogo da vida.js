let idadeText = document.getElementById("idade");
let idade = 0;
idadeText.innerText = "Idade: " + idade;

let dinheiroText = document.getElementById("dinheiro");
let dinheiro = 0;
dinheiroText.innerText = "Dinheiro " + dinheiro

let nome = document.getElementById("nome");
nome.innerText = "Escolha um nome";

let inteligencia = Math.floor(Math.random() * (85 - 40 + 1)) + 40;
let saude = Math.floor(Math.random() * (85 - 40 + 1)) + 40;
let felicidade = Math.floor(Math.random() * (85 - 40 + 1)) + 40;
let criatividade = Math.floor(Math.random() * (85 - 40 + 1)) + 40;
let reputação = Math.floor(Math.random() * (85 - 40 + 1)) + 40;

// Armazena os valores no localStorage
localStorage.setItem('inteligencia', inteligencia);
localStorage.setItem('saude', saude);
localStorage.setItem('felicidade', felicidade);
localStorage.setItem('criatividade', criatividade);
localStorage.setItem('reputacao', reputacao);
localStorage.setItem('nome', nome);
localStorage.setItem('idade', idade);
localStorage.setItem('dinheiro', dinheiro);
localStorage.setItem('idadeText', idadeText);
localStorage.setItem('dinheiroText', dinheiroText);


// Função para carregar os valores do localStorage
function carregarValores() {
    inteligencia = localStorage.getItem('inteligencia');
    saude = localStorage.getItem('saude');
    felicidade = localStorage.getItem('felicidade');
    criatividade = localStorage.getItem('criatividade');
    reputacao = localStorage.getItem('reputacao');
    nome = localStorage.getItem('nome');
    idade = localStorage.getItem('idade');
    dinheiro = localStorage.getItem('dinheiro');
    idadeText = localStorage.getItem('idadeText');
    dinheiroText = localStorage.getItem('dinheiroText');

    // Se os valores não existirem, gera novos valores aleatórios
    if (!inteligencia) {
        gerarValoresAleatorios();
    }
}

// Chama a função para carregar os valores
carregarValores();

// Cria um botão para resetar os valores
const botaoReset = document.createElement('button');
botaoReset.textContent = 'Resetar Valores';
botaoReset.onclick = function() {
  localStorage.removeItem('inteligencia');
  localStorage.removeItem('saude');
  localStorage.removeItem('felicidade');
  localStorage.removeItem('criatividade');
  localStorage.removeItem('reputacao');
  gerarValoresAleatorios();
};

// Adiciona o botão à página
document.body.appendChild(botaoReset);

//esquerda

function chooseName() {

    document.getElementById("nameInput").value = ""; 

    // Exibe o campo de input e oculta o nome atual
    document.getElementById('ChooseName').style.display = "block";
    document.getElementById('nomeDiv').style.display = "none";
}

function mudarNome() {
    // Obtém o valor do input
    let nomeInput = document.getElementById("nameInput").value;

    // Altera o texto do elemento h2
    nome.innerText = nomeInput;

    // Oculta o campo de input e exibe o nome atualizado
    document.getElementById('ChooseName').style.display = "none";
    document.getElementById('nomeDiv').style.display = "flex";
}

function envelhecer() {
    idade += 1
    idadeText.innerText = "Idade: " + idade
}

//centro

//direita

function mostrarOpcoes(categoria) {
    // Esconde todos os títulos da direita
    document.getElementById('centro-de-ações').style.display = 'none';

    // Mostra o menu correspondente à categoria clicada
    document.getElementById(`opcoes-${categoria}`).style.display = 'block';
}

function voltar() {
    // Mostra os títulos da direita novamente
    document.getElementById('centro-de-ações').style.display = 'flex';

    // Esconde todos os menus de opções
    var menus = document.querySelectorAll('.menu-opcoes');
    menus.forEach(function(menu) {
        menu.style.display = 'none';
    });
}
