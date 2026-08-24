class Patrimonio {
    dinheiro: number;
    propriedades: Propriedade[];
    investimentos: Investimento[];
    bens: Bem[];

    constructor() {
        this.dinheiro = 100_000;
        this.propriedades = [];
        this.investimentos = [];
        this.bens = [];
    }
}

class Propriedade {
    nome: string;
    valor: number;
    rendaAnual: number;

    constructor(nome: string, valor: number, rendaAnual: number) {
        this.nome = nome;
        this.valor = valor;
        this.rendaAnual = rendaAnual;
    }
}

class Investimento {
    nome: string;
    valorInvestido: number;
    valorAtual: number;
    variacao: number;
    historico: { ano: number; valor: number }[];

    constructor(nome: string, valorInvestido: number, valorAtual: number, variacao: number) {
        this.nome = nome;
        this.valorInvestido = valorInvestido;
        this.valorAtual = valorAtual;
        this.variacao = variacao;
        this.historico = [];
    }
}

class Bem {
    nome: string;
    descricao: string;
    valorManutencao: number;
    efeito: () => void;

    constructor(nome: string, descricao: string, valorManutencao: number, efeito: () => void) {
        this.nome = nome;
        this.descricao = descricao;
        this.valorManutencao = valorManutencao;
        this.efeito = efeito;
    }
}

class Pessoa {
    nome: string;
    descricao: string;
    idade: number;
    satisfacao: number;
    influencia?: number;

    constructor(nome: string, descricao: string, idade: number, satisfacao: number, influencia?: number) {
        this.nome = nome;
        this.descricao = descricao;
        this.idade = idade;
        this.satisfacao = satisfacao;
        this.influencia = influencia;
    }
}

class Acontecimento {
    nome: string;
    descricao: string;
    opcoes: Opcao[];
    condicoes: () => boolean;

    constructor(nome: string, descricao: string, opcoes: Opcao[] = [], condicoes: () => boolean = () => true) {
        this.nome = nome;
        this.descricao = descricao;
        this.opcoes = opcoes;
        this.condicoes = condicoes;
    }
}

class Opcao {
    descricao: string;
    custoAcoes: number;
    custoDinheiro: number;
    efeito: () => void;

    constructor(descricao: string, custoAcoes: number = 1, custoDinheiro: number = 0, efeito: () => void) {
        this.descricao = descricao;
        this.custoAcoes = custoAcoes;
        this.custoDinheiro = custoDinheiro;
        this.efeito = efeito;
    }
}

class Jogo {
    ano: number;
    patrimonio: Patrimonio;
    acoes: number;

    familia: Pessoa[];
    conhecidos: Pessoa[];

    constructor() {
        this.ano = 1891;
        this.patrimonio = new Patrimonio();
        this.acoes = 5;

        //mudar as idades depois
        this.familia = [
            new Pessoa("Camila", "Esposa", 44, 80, undefined),
            new Pessoa("Mário", "Filho", 15, 90, undefined),
            new Pessoa("Ruth", "Filha", 13, 85, undefined),
            new Pessoa("Raquel", "Filha", 8, 90, undefined),
            new Pessoa("Lia", "Filha", 8, 85, undefined),
            new Pessoa("Nina", "Sobrinha", 10, 80, undefined),
        ]

        this.conhecidos = []
    }

    get prestigio(): number {
        if (this.conhecidos.length <= 0) {
            return 0;
        }
        let influenciaTotal = this.conhecidos.reduce((acc, pessoa) => acc + (pessoa.influencia || 0), 0);
        let satisfacaoTotal = this.conhecidos.reduce((acc, pessoa) => acc + pessoa.satisfacao * (pessoa.influencia || 0), 0);
        return influenciaTotal > 0 ? satisfacaoTotal / influenciaTotal : 0;
    }

    get estabilidadeFamiliar(): number {
        if (this.familia.length <= 0) {
            return 0;
        }
        return this.familia.reduce((acc, pessoa) => acc + pessoa.satisfacao, 0) / this.familia.length;
    }

    proximoAno() {
        this.ano++;
        this.acoes = 5;
    }
}

let jogo = new Jogo();

const acontecimentos: Acontecimento[] = [
    new Acontecimento("Uma discussão", "Mário e uma de suas irmãs tiveram uma discussão.", [
            new Opcao("Conversar com os dois", 1, 0, () => {
                const mario = jogo.familia.find(p => p.nome === "Mário")!;
                const ruth = jogo.familia.find(p => p.nome === "Ruth")!;

                mario.satisfacao += 5;
                ruth.satisfacao += 5;
            }),

            new Opcao("Defender Mário", 0, 0, () => {
                const mario = jogo.familia.find(p => p.nome === "Mário")!;
                const ruth = jogo.familia.find(p => p.nome === "Ruth")!;

                mario.satisfacao += 8;
                ruth.satisfacao -= 8;
            }),

            new Opcao("Não se envolver", 0, 0, () => {
                console.log("A discussão continua.");
            })
        ],
        () => true
    ),
    new Acontecimento("Preocupação em casa", "As dificuldades financeiras começam a ser percebidas pela família.", [
            new Opcao("Esconder os problemas", 1, 0, () => {
                jogo.familia.forEach(p => p.satisfacao -= 2);
                console.log("Você tentou esconder a situação.");
            }),

            new Opcao("Conversar honestamente", 1, 0, () => {
                jogo.familia.forEach(p => p.satisfacao += 3);
                console.log("A família conversou sobre os problemas.");
            }),

            new Opcao("Gastar dinheiro para manter as aparências", 1, 1000, () => {
                jogo.familia.forEach(p => p.satisfacao += 2);
            })
        ],
        () => true
    ),
]

const investimentos: Investimento[] = [
    
]

function gerarAcontecimentoAleatorio(): Acontecimento {
    const acontecimentosDisponiveis = acontecimentos.filter(a => a.condicoes());
    if (acontecimentosDisponiveis.length === 0) {
        return new Acontecimento("Nenhum acontecimento disponível", "Não há acontecimentos disponíveis no momento.", [], () => true);
    }
    const indiceAleatorio = Math.floor(Math.random() * acontecimentosDisponiveis.length);
    return acontecimentosDisponiveis[indiceAleatorio];
}

function atualizarUI() {
    document.getElementById("ano-atual")!.textContent = jogo.ano.toString();
    document.getElementById("prestigio")!.textContent = jogo.prestigio.toFixed(2);
    document.getElementById("estabilidade-familiar")!.textContent = jogo.estabilidadeFamiliar.toFixed(2);
    document.getElementById("dinheiro")!.textContent = jogo.patrimonio.dinheiro.toLocaleString();
    atualizarAcontecimentoUI(gerarAcontecimentoAleatorio()!);

}

function atualizarAcontecimentoUI(acontecimento: Acontecimento) {
    document.getElementById("titulo-acontecimento")!.textContent = acontecimento.nome;
    document.getElementById("descricao-acontecimento")!.textContent = acontecimento.descricao;
    const opcoesContainer = document.getElementById("opcoes-acontecimento")!;
    opcoesContainer.innerHTML = "";
    for (const opcao of acontecimento.opcoes) {
        const button = document.createElement("button");
        button.innerHTML = `
        <p>${opcao.descricao}</p>
        <p>${opcao.custoAcoes}</p>
        `;
        button.addEventListener("click", () => {
            if (jogo.acoes >= opcao.custoAcoes && jogo.patrimonio.dinheiro >= opcao.custoDinheiro) {
                jogo.acoes -= opcao.custoAcoes;
                jogo.patrimonio.dinheiro -= opcao.custoDinheiro;
                atualizarUI();
                console.log(`Opção escolhida: ${opcao.descricao}`);
            }
        });
        opcoesContainer.appendChild(button);
    }
}

function atualizarFamiliaUI() {
    const familiaContainer = document.getElementById("familia")!;
    familiaContainer.innerHTML = "";
    for (const pessoa of jogo.familia) {
        const div = document.createElement("div");
        div.innerHTML = `
            <div>
                <img src="/assets/images/memes img/cavalo.jpg" alt="${pessoa.nome}" />
            </div>
            <div>
                <h3>${pessoa.nome}</h3>
                <h4>${pessoa.descricao}</h4>
            </div>
        `;
        familiaContainer.appendChild(div);
    }
}

atualizarUI();
atualizarFamiliaUI();