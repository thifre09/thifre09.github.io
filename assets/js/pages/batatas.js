let numPergunta = 1;
let respostas = [];
let perguntas = [
    "Batatas tem 48 cromossomos",
    "O nome científico da batata é Solanum tuberosum",
    "Existem mais de 4.000 variedades de batatas cultivadas em todo o mundo",
    "A batata foi o primeiro vegetal a ser cultivado no espaço",
    "As batatas são originárias das regiões andinas da América do Sul, especialmente do que é hoje o Peru e a Bolívia",
    "No Japão, há um tipo de sabão feito de amido de batata que, quando usado, cria uma espuma muito fina e cremosa, ideal para a pele sensível",
    "Elas são compostas por cerca de 80% de água e 20% de matéria seca",
    "A batata doce e a batata comum não são da mesma família de plantas, apesar de seus nomes semelhantes",
    "No século XVIII, a batata foi promovida na Europa como um alimento que poderia combater a fome generalizada devido à sua alta produtividade",
    "O maior produtor mundial de batatas é a China",
    "O recorde mundial para a maior batata já cultivada foi de 4,98 kg, colhida na Inglaterra em 2011",
    "Na Idade Média, as batatas eram consideradas uma planta tóxica em algumas regiões da Europa por causa da semelhança de suas folhas com plantas venenosas da família Solanaceae",
    "Batatas são ricas em carboidratos, vitamina C, potássio, vitamina B6, fibras, antioxidantes",
    "O genoma da batata foi completamente sequenciado em 2011",
    "A primeira fotografia colorida permanente da história, tirada por James Clerk Maxwell em 1861, foi de uma fita de tartã (xadrez) usando um processo com amido de batata",
    "No Peru, há um Banco Internacional de Batatas, com mais de 4.000 variedades preservadas",
    "No final do século XIX, a batata se tornou um dos principais pilares da economia da Irlanda",
    "O amido de batata é amplamente utilizado na indústria, incluindo a produção de papel, têxteis, cosméticos e até na fabricação de adesivos e plásticos biodegradáveis",
    "O dia 30 de maio é comemorado como o 'Dia Nacional da Batata' em vários países",
    "As batatas são o quarto alimento mais consumido no mundo",
    "Em 1972, a NASA enviou batatas desidratadas para o espaço como parte da dieta dos astronautas da missão Apollo 16. Eles relataram que o sabor da batata no espaço parecia 'um pouco como papelão'",
    "Na Rússia do século XIX, houve revoltas conhecidas como 'motins das batatas'",
    "O purê de batatas, um prato amado no mundo todo, foi popularizado pelo chef francês Antoine Carême, que serviu o prato em banquetes reais",
    "Em filmes de ficção científica, o amido de batata já foi utilizado como ingrediente para recriar texturas alienígenas e paisagens viscosas, devido à sua flexibilidade como agente espessante",
    "As batatas fritas, ou chips, foram criadas por acidente em 1853 por George Crum, um chef americano, quando um cliente se queixou de que as batatas que ele preparava eram grossas demais. Ele as cortou finíssimas, fritou e salpicou sal, criando o que conhecemos hoje",
    "Em 2016, foi feita uma campanha publicitária pela empresa Potato Parcel, que permite enviar batatas com mensagens personalizadas para qualquer pessoa. Essa tendência se tornou viral, e agora é possível encomendar batatas com mensagens escritas para ocasiões especiais",
    "Na Irlanda, há uma superstição antiga de que as batatas brotam melhor se forem plantadas de cabeça para baixo, uma prática que alguns agricultores ainda seguem, mesmo que cientificamente não faça diferença no crescimento",
    "Nos EUA, existe um hotel construído em forma de batata gigante na cidade de Boise, Idaho. Ele acomoda até duas pessoas e tem uma decoração temática de batatas!",
    "Em As Viagens de Gulliver, de Jonathan Swift, há uma passagem onde o protagonista menciona a “batata voadora”, uma invenção fictícia que supostamente permite a levitação. Isso foi inspirado nas lendas da época sobre o poder místico das batatas, um alimento então relativamente novo na Europa",
    "Em tempos de necessidade, fatias de batatas podem ser embebidas em óleo e usadas como velas de emergência. O amido na batata absorve o óleo, e a umidade faz com que queimem lentamente"
];

function comecarQuiz(button) {
    button.style.display = 'none'; 
    document.getElementById('quiz').style.display = 'flex';
    createPerguntasBottom();
}

function createPerguntasBottom() {
    for (let i = 1; i <= perguntas.length; i++) {
        const perguntaDiv = document.createElement('div');
        perguntaDiv.textContent = i;
        perguntaDiv.addEventListener('click', () => {
            numPergunta = i-1;
            proximaPergunta();
        });
        document.getElementById('perguntas-bottom').appendChild(perguntaDiv);
        respostas.push(null);
    }
}

function marcarRespostaVerdadeira() {
    if (numPergunta > perguntas.length) {
        document.getElementById("buttons").style.display = "none";
        document.getElementById('pergunta-texto').textContent = `Parabens! você acertou ${respostas.filter(resposta => {return resposta === true}).length}/30 curiosidades! Por incrivel que pareça, todas as curiosidades eram verdadeiras!`;
    };
    respostas[numPergunta - 1] = true;
    document.getElementById('perguntas-bottom').children[numPergunta - 1].style.backgroundColor = 'var(--green5)';
    proximaPergunta();
}

function marcarRespostaFalse() {
    if (numPergunta > perguntas.length) return;
    respostas[numPergunta - 1] = false;
    document.getElementById('perguntas-bottom').children[numPergunta - 1].style.backgroundColor = 'var(--red5)';
    proximaPergunta();
}

function proximaPergunta() {
    numPergunta++;
    document.getElementById('pergunta-texto').textContent = perguntas[numPergunta - 1];
    if (numPergunta > perguntas.length) {
        document.getElementById('pergunta-texto').textContent = "Deseja responder?";
    }
}

function enviar() {

}

