let dinheiro = 25000;
let populacao = 50000;

let saude = 50;
let alegria = 50;
let seguranca = 50;
let educacao = 50;
let fome = 10;
let economia = 50;
let desemprego = 10;
let infraestrutura = 50;
let imposto = 10

let satisfacaoPopulacao = 50;
let IndexPropostaAtual = null;

class Proposta {

    constructor(titulo, descricao, aceitarResultado = new Estatistica(), recusarResultado = new Estatistica()) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.aceitarResultado = aceitarResultado; //Estatistica
        this.recusarResultado = recusarResultado; //Estatistica
    }

    aceitar() {
        dinheiro += this.aceitarResultado.dinheiro + Math.abs(this.aceitarResultado.dinheiro * imposto / 100);
        saude += this.aceitarResultado.saude;
        alegria += this.aceitarResultado.alegria;
        seguranca += this.aceitarResultado.seguranca;
        educacao += this.aceitarResultado.educacao;
        fome += this.aceitarResultado.fome;
        economia += this.aceitarResultado.economia;
        desemprego += this.aceitarResultado.desemprego;
        infraestrutura += this.aceitarResultado.infraestrutura;
        imposto += this.aceitarResultado.imposto;
        populacao *= this.aceitarResultado.populacao;
    }

    recusar() {
        dinheiro += this.recusarResultado.dinheiro;
        saude += this.recusarResultado.saude;
        alegria += this.recusarResultado.alegria;
        seguranca += this.recusarResultado.seguranca;
        educacao += this.recusarResultado.educacao;
        fome += this.recusarResultado.fome;
        economia += this.recusarResultado.economia;
        desemprego += this.recusarResultado.desemprego;
        infraestrutura += this.recusarResultado.infraestrutura;
        imposto += this.recusarResultado.imposto;
        populacao *= this.recusarResultado.populacao;
        populacao = Math.max(1, Math.floor(populacao)); // Garante que a população não seja menor que 1
    }
}

class Estatistica {
    constructor(opcoes = {}) {
        Object.assign(this, {
            dinheiro: 0,
            saude: 0,
            alegria: 0,
            seguranca: 0,
            educacao: 0,
            fome: 0,
            economia: 0,
            desemprego: 0,
            infraestrutura: 0,
            imposto: 0,
            populacao: 1,
            noticia: ""
        }, opcoes); // opcoes sobrescreve os valores padrão
    }
}

let listaPropostas = []

function escolherProposta() {
    let randomIndex = Math.floor(Math.random() * listaPropostas.length);
    while (randomIndex === IndexPropostaAtual) {
        // Garante que a proposta escolhida seja diferente da atual
        randomIndex = Math.floor(Math.random() * listaPropostas.length);
    }
    IndexPropostaAtual = randomIndex;
}

escolherProposta();

function atualizarTela() {
    satisfacaoPopulacao = (saude + alegria + seguranca + educacao + (100 - fome) + economia + (100 - desemprego) + infraestrutura) / 8;
    document.getElementById('dinheiro').innerText = `Dinheiro: R$ ${dinheiro}`;
    document.getElementById('satisfacao').innerText = `Satisfação da População: ${satisfacaoPopulacao}%`;
    document.getElementById('populacao').innerText = `População: ${Math.floor(populacao)}`;
    document.getElementById('saude').innerText = `${formatarNumero(saude)}`;
    document.getElementById('alegria').innerText = `${formatarNumero(alegria)}`;
    document.getElementById('seguranca').innerText = `${formatarNumero(seguranca)}`;
    document.getElementById('educacao').innerText = `${formatarNumero(educacao)}`;
    document.getElementById('fome').innerText = `${fome}%`;
    document.getElementById('economia').innerText = `${formatarNumero(economia)}`;
    document.getElementById('desemprego').innerText = `${desemprego}%`;
    document.getElementById('infraestrutura').innerText = `${formatarNumero(infraestrutura)}`;
    document.getElementById('imposto').innerText = `${imposto}%`;

    document.getElementById("tituloProposta").innerText = listaPropostas[IndexPropostaAtual].titulo;
    document.getElementById("textoProposta").innerText = listaPropostas[IndexPropostaAtual].descricao;
}

function formatarNumero(numero) {
    if (numero === 100) return "Perfeito";
    if (numero >= 87.5) return "Excelente";
    if (numero >= 75) return "Muito bom";
    if (numero >= 62.5) return "Bom";
    if (numero >= 50) return "Médio";
    if (numero >= 37.5) return "Ruim";
    if (numero >= 25) return "Muito ruim";
    if (numero >= 12.5) return "Péssimo";
    if (numero >= 0) return "Condenável";
    return "Desconhecido";
}

function corrigir() {
    saude = Math.max(0, Math.min(100, saude));
    alegria = Math.max(0, Math.min(100, alegria));
    seguranca = Math.max(0, Math.min(100, seguranca));
    educacao = Math.max(0, Math.min(100, educacao));
    fome = Math.max(0, Math.min(100, fome));
    economia = Math.max(0, Math.min(100, economia));
    desemprego = Math.max(0, Math.min(100, desemprego));
    infraestrutura = Math.max(0, Math.min(100, infraestrutura));
    imposto = Math.max(0, Math.min(100, imposto));    
}
const btnPlay = document.getElementById('btn-play');
const btnTutorial = document.getElementById('btn-tutorial');
const btnCredits = document.getElementById('btn-credits');
const btnReturn = document.getElementById('btn-return');
const btnNews = document.getElementById('news');
const btnPropostas = document.getElementById('proposals');

btnPlay.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('jogo').style.display = 'flex';
});

btnTutorial.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('tutorial').style.display = 'flex';
});

btnCredits.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('creditos').style.display = 'flex';
});

btnReturn.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'flex';
    document.getElementById('creditos').style.display = 'none';
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none'
})

btnNews.addEventListener("click", () => {
    document.getElementById('propostas').style.display = 'none';
    document.getElementById('noticias').style.display = 'block';
});

btnPropostas.addEventListener("click", () => {
    document.getElementById('noticias').style.display = 'none';
    document.getElementById('propostas').style.display = 'block';
});

const btnAceitar = document.getElementById('btnAceitar');
const btnRecusar = document.getElementById('btnRecusar');

btnAceitar.addEventListener("click", () => {
    const custo = Math.abs(listaPropostas[IndexPropostaAtual].aceitarResultado.dinheiro);
    if (dinheiro >= custo) {
        listaPropostas[IndexPropostaAtual].aceitar();
        atualizarTela();
        escolherProposta();
        corrigir();
    } else {
        alert("Você não tem dinheiro suficiente para aceitar essa proposta.");
    }
});

btnRecusar.addEventListener("click", () => {
    if (dinheiro > listaPropostas[IndexPropostaAtual].recusarResultado.dinheiro) {
        listaPropostas[IndexPropostaAtual].recusar();
        atualizarTela();
        escolherProposta();
        corrigir();
    } else {
        alert("Você não tem dinheiro suficiente para recusar essa proposta.");
    }
});





























// dinheiro: 0,
// saude: 0,
// alegria: 0,
// seguranca: 0,
// educacao: 0,
// fome: 0,
// economia: 0,
// desemprego: 0,
// infraestrutura: 0,
// imposto: 0,
// populacao: 1,      multiplica
// noticia: ""    obrigatório, se não tiver, não mostra a notícia

listaPropostas = [
    new Proposta("Trazer Hyago Kadson para a cidade.", `Nos termos do disposto no art. 215 da Constituição Federal, que assegura o pleno exercício dos direitos culturais e o acesso às fontes da cultura nacional, a Prefeitura Municipal comunica, por meio da Secretaria de Cultura e Eventos, a contratação do artista Hyago Kadson como atração principal do evento Festival Municipal de Cultura Popular, a ser realizado em praça pública com entrada gratuita.
    
    A iniciativa integra o calendário oficial de ações de valorização da cultura nordestina e tem por objetivo fortalecer os laços comunitários, fomentar a economia criativa e proporcionar entretenimento de qualidade à população local, sobretudo aos jovens e às famílias que tradicionalmente participam de eventos populares.
    
    A escolha do artista, amplamente reconhecido por seu repertório regional e apelo junto ao público, foi fundamentada em critérios de relevância cultural, projeção artística e retorno social, conforme parecer técnico emitido pela Comissão Municipal de Cultura.
    
    A ação está em consonância com o princípio da dignidade da pessoa humana e da promoção do bem-estar social, sendo esperada grande adesão popular e impacto positivo tanto econômico quanto simbólico para o município.

    Custo: 1501 reais.
    Deputado: Pedão.
    `,
        new Estatistica({dinheiro: -1501, alegria: 20, economia: 7, populacao: 1.05}),
        new Estatistica({alegria: -10, economia: -5}),
    ),

    new Proposta("Novo material de estudo para a rede de educação municipal.", `Em observância ao disposto no art. 205 da Constituição Federal e à Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996), a Prefeitura Municipal, por meio da Secretaria de Educação, anuncia a adoção de um novo conjunto de materiais didáticos-pedagógicos para uso obrigatório na rede pública de ensino fundamental.
        
        A medida visa à modernização dos recursos educacionais, à adequação às competências da Base Nacional Comum Curricular (BNCC) e à promoção de uma educação equitativa, inclusiva e de excelência. O novo material contempla recursos impressos e digitais, com linguagem acessível, conteúdo contextualizado à realidade local e apoio multidisciplinar voltado tanto ao corpo docente quanto aos estudantes.
        
        O processo de escolha e aquisição respeitou os princípios da legalidade, impessoalidade, moralidade e eficiência, sendo conduzido mediante parecer técnico-pedagógico emitido por comissão avaliadora composta por especialistas da área educacional.
        
        A iniciativa representa um avanço na política pública educacional do município, fortalecendo o processo de ensino-aprendizagem, combatendo desigualdades de acesso ao conhecimento e garantindo melhores condições para o pleno desenvolvimento intelectual e cidadão dos estudantes da rede municipal.
        
        Custo: 3500 reais.
        Vereador Dr Thiago Frutas.
        
        `,
        new Estatistica({ dinheiro: -3500, alegria: 4, educacao: 12, populacao: 1.001}),
        new Estatistica({alegria: -5, educacao: -6}),
    ),

    new Proposta("Prefeitura Lança Aplicativo de Transporteito aos Domingos", `Em consonância com os princípios da mobilidade urbana sustentável previstos na Lei Federal nº 12.587/2012 (Política Nacional de Mobilidade Urbana), e com fundamento na função social do transporte público, a Prefeitura Municipal, por meio da Secretaria de Mobilidade e Inovação, lança oficialmente o Aplicativo 'Domingo Livre', plataforma digital que garantirá transporte gratuito aos domingos para todos os cidadãos cadastrados.
        
        A iniciativa visa promover o direito de ir e vir com dignidade, reduzir a exclusão social, estimular o uso de espaços públicos de lazer, cultura e esporte, além de contribuir com a diminuição do tráfego de veículos particulares e da emissão de gases poluentes.
        
        O serviço, de caráter experimental durante os primeiros seis meses, abrangerá as principais rotas urbanas e contará com veículos acessíveis, frota monitorada por GPS e atendimento prioritário em regiões de maior vulnerabilidade social, conforme estudos técnicos realizados pelos setores competentes.

        A gratuidade será operacionalizada mediante cadastro prévio no aplicativo, disponível para dispositivos móveis com sistemas Android e iOS, e a operação seguirá normas de segurança, eficiência e acessibilidade, em consonância com os princípios da administração pública.

        Custo: 5000 reais;
        Vereador Mr. Cuca.  
        `,
        new Estatistica({ dinheiro: -5000, saude: 2, alegria: 5, economia: 4, infraestrutura: 5}),
        new Estatistica({alegria: -3}),
    ),

    new Proposta("Projeto 'Município iluminado': Iluminação LED em 100% das Comunidades até o Fim do Ano",
        `No âmbito das competências  municipais previstas no art. 30, inciso I, da Constituição Federal, e visando à promoção do bem-estar social, à segurança urbana e à eficiência energética, a Prefeitura Municipal propõe, por meio do Projeto 'Município Iluminado', a substituição integral do atual sistema de iluminação pública convencional por luminárias dotadas de tecnologia LED em 100% das comunidades locais até o encerramento do presente exercício fiscal.
    
        Tal medida objetiva a redução significativa do consumo de energia elétrica, a diminuição dos índices de criminalidade mediante a ampliação da visibilidade noturna, e o aprimoramento da qualidade de vida da população residente em regiões historicamente negligenciadas por políticas públicas de infraestrutura urbana.
        
        A execução do projeto observará os princípios da legalidade, eficiência e economicidade, sendo priorizadas as áreas com maior déficit de iluminação e maior vulnerabilidade social, conforme mapeamento técnico realizado pelas secretarias competentes.
        
        Custo: 5000.
        Vereador: Débisson Isaac.
        
        `,
        new Estatistica({dinheiro: -5000,  alegria: 5, seguranca: 4, infraestrutura: 10}),
        new Estatistica({alegria: -3, seguranca: -4, infraestrutura: -2}),


    ),

    new Proposta("Proposta para a construção de uma praça pública no Bairro Freitas", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

    Por meio da presente, propomos a construção de uma praça pública no Bairro Freitas, com o intuito de promover o bem-estar social e melhorar a qualidade de vida dos munícipes, especialmente dos idosos. O espaço atenderá à demanda de áreas para lazer, descanso e atividades de baixo impacto físico, além de fomentar a convivência comunitária.

    A implantação dessa praça contribuirá para a revitalização urbana, a inclusão social e a promoção da saúde preventiva. A obra trará, também, benefícios para a qualidade de vida geral da população, promovendo o convívio intergeracional e a valorização do patrimônio público.

    Diante do exposto, solicitamos a inclusão do projeto no planejamento do Município, com a devida previsão orçamentária.

    Custo: 2400 reais
    Vereador Dr. Giuseppe Camolle`,

        new Estatistica({dinheiro: -2400, alegria: 7, saude: 2, infraestutura: 5}),
        new Estatistica({alegria: -5, infraestutura: -5}),

    ),
    new Proposta("Proposta para a construção de um hospital público municipal", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

    Vimos por meio desta propor a construção de um hospital público municipal, com o objetivo de ampliar o atendimento médico de qualidade à população. A implantação deste equipamento de saúde visa atender à crescente demanda por serviços médicos e melhorar a eficiência dos atendimentos, especialmente nas áreas de urgência e especialidades.

    A construção do hospital proporcionará a redução das filas de espera, aumento da capacidade de atendimento e melhoria nas condições de saúde da população, promovendo o acesso a cuidados médicos adequados e dignos para todos.

    Solicitamos a inclusão deste projeto no planejamento orçamentário municipal e a análise para sua viabilização.

    Custo: 6000 reais
    Vereador Dr. Giuseppe Camolle`,
        
        new Estatistica({dinheiro: -6000, saude: 15, alegria: 7, economia: 5, desemprego: -5, infraestutura: 10, populacao: 1.03}),
        new Estatistica({saude: -5, alegria: -10, desemprego: 2}),
        
    ),



    new Proposta("Proposta para a implementação de um projeto EJA (educação de jovens e adultos)", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

    Propomos a criação de um Projeto de Educação de Jovens e Adultos (EJA), com o intuito de proporcionar educação de qualidade aos cidadãos que não tiveram a oportunidade de concluir seus estudos na idade regular. O projeto visa atender às necessidades educacionais dessa população, promovendo sua inclusão social e melhorando suas condições de empregabilidade.

    A proposta inclui a oferta de cursos de Ensino Fundamental e Médio, com metodologias adaptadas, acessíveis a todos, inclusive às pessoas com deficiência. O projeto será desenvolvido em parceria com as Secretarias Municipais de Educação e Assistência Social, com apoio de educadores qualificados.

    Solicitamos a aprovação deste projeto e sua inclusão no planejamento orçamentário do Município.

    Custo: 4000 reais.
    Vereador Dayvyd Lavaniery`,

        new Estatistica({dinheiro: -4000, alegria: 4, educacao: 7, seguranca: 3, desemprego: -2}),
        new Estatistica({alegria: -2, seguranca: -4, desemprego: 1}),

    ),

    new Proposta("proposta para o aumento da oferta de emprego de oficiais de segurança pública no município", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

    Vimos por meio desta, apresentar a proposta para o aumento da oferta de empregos para oficiais da segurança pública em nosso Município, com o objetivo de fortalecer o efetivo da Guarda Municipal e melhorar a segurança da população.

    O aumento de vagas para oficiais de segurança é fundamental para garantir uma presença maior nas ruas, aumentar a eficácia no combate à criminalidade e melhorar a resposta da segurança pública às necessidades da comunidade. A ampliação do número de oficiais permitirá maior patrulhamento, apoio a eventos públicos e uma atuação mais eficaz nas áreas de prevenção e repressão de crimes.

    A proposta inclui a contratação de profissionais qualificados, com o devido treinamento, além da promoção de ações voltadas ao bem-estar dos servidores da segurança pública. Tal medida contribuirá diretamente para a sensação de segurança da população e para a melhoria da qualidade de vida no Município.

    Solicitamos a inclusão desta proposta no planejamento orçamentário municipal e a análise das possibilidades de viabilização dessa ação, com base nas necessidades de segurança e na capacidade de gestão do Município.
    
    Custo: 3789 reais.
    Vereador Abacate da Sombrinha`,
    
    new Estatistica({dinheiro: -3700, alegria: 5, seguranca: 12, desemprego: -2}),
    new Estatistica({alegria: -7, seguranca: -8, desemprego: 2}),
    )
];

// Intervalo	    Classificação

// 100	            Perfeito
// 87.5 ≤ x < 100	Excelente
// 75 ≤ x < 87.5	Muito bom
// 62.5 ≤ x < 75	Bom
// 50 ≤ x < 62.5	Médio
// 37.5 ≤ x < 50	Ruim
// 25 ≤ x < 37.5	Muito ruim
// 12.5 ≤ x < 25	Péssimo
// 0 ≤ x < 12.5	    Condenável
// Outros valores	Desconhecido
