import Chart from "chart.js/auto";

class Patrimonio {
    dinheiro: number;
    propriedades: Propriedade[];
    investimentos: Investimento[];
    bens: Bem[];
    emprestimos: Emprestimo[];

    constructor() {
        this.dinheiro = 1_000_000;
        this.propriedades = [];
        this.investimentos = [];
        this.bens = [];
        this.emprestimos = [];
    }

    get total(): number {
        const valorInvestimentos = this.investimentos.reduce((acc, inv) => acc + inv.valorAtual * inv.acoesPossuidas, 0);
        const valorPropriedades = this.propriedades.reduce((acc, prop) => acc + (prop.comprada ? prop.valor : 0), 0);
        return this.dinheiro + valorInvestimentos + valorPropriedades;
    }

    get rendaAnualTotal(): number {
        return this.propriedades.reduce((acc, prop) => acc + (prop.comprada ? prop.rendaAnual : 0), 0);
    }
}

class Investimento {
    nome: string;
    valorAtual: number;
    variacao: number;
    tendencia: number;
    precoBase: number;
    min: number;
    max: number;
    acoesPossuidas: number;
    valorInvestido: number;
    historico: { ano: number; valor: number }[];

    constructor(nome: string, valorAtual: number, variacao: number, min: number, max: number) {
        this.nome = nome;
        this.valorAtual = valorAtual;
        this.variacao = variacao;
        this.tendencia = 0;
        this.historico = [{ ano: 1891, valor: valorAtual }];
        this.precoBase = valorAtual;
        this.min = min;
        this.max = max;
        this.acoesPossuidas = 0;
        this.valorInvestido = 0;
    }

    variarValor() {
        this.tendencia += (Math.random() - 0.5) * 0.08;
        this.tendencia *= 0.90;
        this.tendencia = Math.max(-0.2, Math.min(0.2, this.tendencia));

        const distancia = (this.precoBase - this.valorAtual) / this.precoBase;
        const retornoAoCentro = distancia * 0.05;
        const ruido = (Math.random() - 0.5) * 0.04;

        this.variacao = this.tendencia + retornoAoCentro + ruido;
        this.valorAtual *= 1 + this.variacao;
        this.valorAtual = Math.max(this.min, Math.min(this.max, this.valorAtual));

        this.historico.push({ ano: jogo.ano, valor: this.valorAtual });
        if (this.valorAtual === this.min || this.valorAtual === this.max) {
            this.tendencia *= -1;
        }

        return this.valorAtual;
    }

    gerarGrafico(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        new Chart(canvas, {
            type: "line",

            data: {
                labels: this.historico.map(h => h.ano),

                datasets: [
                    {
                        label: this.nome,
                        data: this.historico.map(h => h.valor),
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    }
                },

                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Ano"
                        }
                    },

                    y: {
                        title: {
                            display: true,
                            text: "Valor"
                        }
                    }
                }
            }
        });
    }

    gerarTabela(): HTMLTableElement {
        const table = document.createElement("table");
        table.innerHTML = `
            <caption>Histórico de ${this.nome}</caption>
            <tr>
                <th>Ano</th>
                <th>Preço</th>
                <th>Variação</th>
            </tr>
        `;

        for (let i = this.historico.length - 1; i >= 0; i--) {
            const row = document.createElement("tr");
            const anoCell = document.createElement("td");
            const precoCell = document.createElement("td");
            const variacaoCell = document.createElement("td");

            anoCell.textContent = this.historico[i].ano.toString();
            precoCell.textContent = `R$ ${this.historico[i].valor.toFixed(2)}`;
            if (i > 0) {
                const precoAnterior = this.historico[i - 1].valor;
                const variacao = ((this.historico[i].valor - precoAnterior) / precoAnterior) * 100;
                variacaoCell.textContent = `${variacao >= 0 ? "+" : ""}${variacao.toFixed(2)}%`;
                variacaoCell.classList.add(variacao >= 0 ? "variacao-positiva" : "variacao-negativa");
            } else {
                variacaoCell.textContent = "";
            }
            row.appendChild(anoCell);
            row.appendChild(precoCell);
            row.appendChild(variacaoCell);
            table.appendChild(row);
        }

        return table;
    }

    comprarAcoes(qtd: number): boolean {
        if (qtd < 1) {
            return false;
        }
        const custoTotal = qtd * this.valorAtual;
        if (jogo.patrimonio.dinheiro >= custoTotal) {
            jogo.patrimonio.dinheiro -= custoTotal;
            this.acoesPossuidas += qtd;
            this.valorInvestido += custoTotal;
            return true;
        }
        return false;
    }

    venderAcoes(qtd: number): boolean {
        if (this.acoesPossuidas < qtd) {
            return false;
        }

        const valorTotal = qtd * this.valorAtual;
        const custoMedio = this.acoesPossuidas > 0 ? this.valorInvestido / this.acoesPossuidas : 0;
        jogo.patrimonio.dinheiro += valorTotal;
        this.acoesPossuidas -= qtd;
        this.valorInvestido = Math.max(0, this.valorInvestido - (qtd * custoMedio));
        return true;
    }
}

class Propriedade {
    static investimento: Investimento = new Investimento("Propriedade", 50, 0, 1, 100);

    nome: string;
    valorBase: number;
    rendaAnualBase: number;
    despestasAnuaisBase: number;
    luxoBase: number;
    condicao: number;
    comprada: boolean;
    melhorias: { nome: string; custo: number; comprada: boolean; efeito: () => void }[];

    constructor(nome: string, valorBase: number, rendaAnualBase: number, despestasAnuaisBase: number = 0,
        condicao: number = 100, luxoBase: number = 0) {
        this.nome = nome;
        this.valorBase = valorBase;
        this.rendaAnualBase = rendaAnualBase;
        this.despestasAnuaisBase = despestasAnuaisBase;
        this.luxoBase = luxoBase;
        this.condicao = condicao;
        this.melhorias = [];
        this.comprada = false;
    }

    get rendaAnual(): number {
        return this.rendaAnualBase * (this.condicao / 100);
    }

    get despestasAnuais(): number {
        return this.despestasAnuaisBase * (this.condicao / 100);
    }

    get luxo(): number {
        return this.luxoBase * (this.condicao / 100);
    }

    get valor(): number {
        const x = (Propriedade.investimento.valorAtual - 50) / 50;
        const variacao = Math.sign(x) * Math.pow(Math.abs(x), 1.5) * 0.4;
        const influencia = Math.min(Math.max(0.6, 1 + variacao), 1.4);
        return this.valorBase * influencia * (this.condicao / 100);
    }

    get valorReforma(): number {
        const falta = (100 - this.condicao) / 100;
        return this.valorBase * Math.pow(falta, 1.3) * 0.35;
    }

    comprarPropriedade(): boolean {
        if (jogo.patrimonio.dinheiro >= this.valor && !this.comprada) {
            jogo.patrimonio.dinheiro -= this.valor;
            this.comprada = true;
            return true;
        }
        return false;
    }

    venderPropriedade(): boolean {
        if (this.comprada) {
            jogo.patrimonio.dinheiro += this.valor;
            this.comprada = false;
            return true;
        }
        return false;
    }

    proximoAno() {
        if (!this.comprada) return;
        jogo.patrimonio.dinheiro += this.rendaAnual - this.despestasAnuais;
        const diminuicaoCondicao = Math.random() * 5;
        this.condicao = Math.max(0, this.condicao - diminuicaoCondicao);
    }

    reformar() {
        this.condicao = 100;
    }
}

class Bem {
    nome: string;
    descricao: string;
    valorBase: number;
    valorManutencao: number;
    efeito: () => void;

    constructor(nome: string, descricao: string, valorBase: number, valorManutencao: number = 0, efeito: () => void) {
        this.nome = nome;
        this.descricao = descricao;
        this.valorBase = valorBase;
        this.valorManutencao = valorManutencao;
        this.efeito = efeito;
    }
}

class Banco {
    nome: string;
    descricao: string;
    taxaJuros: number;
    maximoEmprestimo: number;
    maximoParcelas: number;

    constructor(nome: string, descricao: string, taxaJuros: number, maximoEmprestimo: number, maximoParcelas: number) {
        this.nome = nome;
        this.descricao = descricao;
        this.taxaJuros = taxaJuros;
        this.maximoEmprestimo = maximoEmprestimo;
        this.maximoParcelas = maximoParcelas;
    }
}

class Emprestimo {
    valorInicial: number;
    banco: Banco;
    numeroParcerlas: number;
    parcelasRestantes: number;

    constructor(valorInicial: number, banco: Banco, numeroParcerlas: number) {
        this.valorInicial = valorInicial;
        this.banco = banco;
        this.numeroParcerlas = numeroParcerlas;
        this.parcelasRestantes = numeroParcerlas;
    }

    get valorTotal(): number {
        return this.valorInicial * (1 + this.banco.taxaJuros);
    }

    get valorParcela(): number {
        return this.valorTotal / this.numeroParcerlas;
    }

    get saldoDevedor(): number {
        return this.parcelasRestantes * this.valorParcela;
    }

    pagarParcela() {
        jogo.patrimonio.dinheiro -= this.valorParcela;
        this.parcelasRestantes--;
        if (this.parcelasRestantes <= 0) {
            const index = jogo.patrimonio.emprestimos.indexOf(this);
            if (index > -1) {
                jogo.patrimonio.emprestimos.splice(index, 1);
            }
        }
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

class Evento {
    nome: string;
    descricao: string;
    efeito: () => void;
    condicoes: () => boolean;

    constructor(nome: string, descricao: string, efeito: () => void, condicoes: () => boolean = () => true) {
        this.nome = nome;
        this.descricao = descricao;
        this.efeito = efeito;
        this.condicoes = condicoes;
    }
}

class Jogo {
    ano: number;
    patrimonio: Patrimonio;
    acoes: number;

    familia: Pessoa[];
    conhecidos: Pessoa[];

    bancos: Banco[];

    constructor() {
        this.ano = 1891;
        this.patrimonio = new Patrimonio();
        this.acoes = 5;

        //mudar os valores depois
        this.familia = [
            new Pessoa("Camila", "Esposa", 44, 80, undefined),
            new Pessoa("Mário", "Filho", 15, 90, undefined),
            new Pessoa("Ruth", "Filha", 13, 85, undefined),
            new Pessoa("Raquel", "Filha", 8, 90, undefined),
            new Pessoa("Lia", "Filha", 8, 85, undefined),
            new Pessoa("Nina", "Sobrinha", 10, 80, undefined),
        ]

        this.conhecidos = [
            new Pessoa("Noca", "Criada", 45, 70, undefined),
            new Pessoa("Dr. Gervásio", "Médico", 45, 70, undefined),
            new Pessoa("Capitão Rino", "Capitão da Marinha", 45, 70, undefined),
            new Pessoa("Paquita", "Rica", 45, 70, undefined),
            new Pessoa("Gama Torres", "Investidor", 45, 70, undefined),
            new Pessoa("Inocêncio Braga", "Homem de negócios", 45, 70, undefined),
            new Pessoa("Baronesa da Lage", "Rica", 45, 70, undefined),
            new Pessoa("Mota", "Ajudante", 45, 70, undefined),
            new Pessoa("Joaquim", "Caxeiro", 45, 70, undefined),
            new Pessoa("Lélio Braga", "Maestro", 45, 70, undefined),
        ];

        this.patrimonio.investimentos = [
            new Investimento("Café", 100, 50, 50, 250),
            new Investimento("Petróleo", 250, 0, 100, 600),
            new Investimento("Ouro", 500, 0, 300, 900),
            new Investimento("Tecnologia", 150, 0, 30, 800),
            new Investimento("Batata", 180, 0, 70, 500),
            new Investimento("Farmacêutica", 300, 0, 100, 900),
        ];

        this.patrimonio.propriedades = [
            new Propriedade("Apartamento Pequeno", 120000, 9000),
            new Propriedade("Casa", 250000, 18000),
            new Propriedade("Casa de Luxo", 800000, 48000),
            new Propriedade("Sala Comercial", 180000, 15000),
            new Propriedade("Prédio Comercial", 1200000, 90000),
            new Propriedade("Loja", 300000, 24000),
            new Propriedade("Terreno", 100000, 0),
            new Propriedade("Fazenda", 1500000, 120000),
            new Propriedade("Hotel", 2500000, 180000),
        ];

        this.patrimonio.bens = [
            new Bem("Carro", "Um carro confortável para a família.", 50000, 2000, () => { }),
            new Bem("Iate", "Um iate luxuoso para passeios no mar.", 200000, 10000, () => { }),
            new Bem("Avião", "Um avião particular para viagens rápidas.", 1000000, 50000, () => { }),
            new Bem("Casa de praia", "Uma casa de praia para férias.", 500000, 25000, () => { }),
        ];

        this.bancos = [
            new Banco("Banco do Brasileiro", "Um dos maiores bancos do país.", 0.05, 50_000, 5),
            new Banco("Santoandré", "Um banco confiável e tradicional.", 0.07, 150_000, 10),
            new Banco("BOX", "Um banco moderno e inovador.", 0.08, 500_000, 10),
            new Banco("Itaipú", "Um banco com boa reputação.", 0.09, 1_500_000, 12),
            new Banco("ComRoupaBank", "Um banco com serviços diversificados.", 0.1, 3_000_000, 20),
        ]
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
        if (this.patrimonio.dinheiro < 0) {
            this.falir();
        }
        this.ano++;
        this.acoes = 5;
        this.patrimonio.investimentos.forEach(investimento => investimento.variarValor());
        this.patrimonio.propriedades.forEach(propriedade => propriedade.proximoAno());
        Propriedade.investimento.variarValor();
        this.patrimonio.emprestimos.forEach(emprestimo => {
            emprestimo.pagarParcela();
        });
        acontecimentoAtual = gerarAcontecimentoAleatorio();
        eventoAtual = gerarEventoAleatorio();
        atualizarUI();
    }

    falir() {
        alert("Você faliu! O jogo será reiniciado.");
    }

    ganhar() {
        alert("Parabéns! Você conseguiu manter sua família e patrimônio. O jogo será reiniciado.");
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
];

let acontecimentoAtual: Acontecimento | null = null;

const eventos: Evento[] = [
    new Evento("Uma nova oportunidade", "Uma nova oportunidade de negócios se apresenta.", () => {
        console.log("Uma nova oportunidade de negócios se apresenta.");
    }),
    new Evento("Um desastre natural", "Um desastre natural afeta a região.", () => {
        console.log("Um desastre natural afeta a região.");
    })
];

let eventoAtual: Evento | null = null;

function gerarAcontecimentoAleatorio(): Acontecimento {
    const acontecimentosDisponiveis = acontecimentos.filter(a => a.condicoes());
    if (acontecimentosDisponiveis.length === 0) {
        return new Acontecimento("Nenhum acontecimento disponível", "Não há acontecimentos disponíveis no momento.", [], () => true);
    }
    const indiceAleatorio = Math.floor(Math.random() * acontecimentosDisponiveis.length);
    return acontecimentosDisponiveis[indiceAleatorio];
}

function gerarEventoAleatorio(): Evento {
    console.log("Gerando evento aleatório...");
    const eventosDisponiveis = eventos.filter(e => e.condicoes());
    if (eventosDisponiveis.length === 0) {
        return new Evento("Nenhum evento disponível", "Não há eventos disponíveis no momento.", () => {});
    }
    const indiceAleatorio = Math.floor(Math.random() * eventosDisponiveis.length);
    return eventosDisponiveis[indiceAleatorio];
}

function atualizarUI() {
    atualizarTopBarUI();
    atualizarAcontecimentoUI(acontecimentoAtual || gerarAcontecimentoAleatorio());
    atualizarPatrimonioUI();
    atualizarInvestimentosUI();
    atualizarPropriedadesUI();
    atualizarBensUI();
    atualizarEmprestimosUI();
    atualizarFamiliaUI();
    atualizarConhecidosUI();
    atualizarEventosUI(eventoAtual || gerarEventoAleatorio());
}

function atualizarTopBarUI() {
    document.getElementById("ano-atual")!.textContent = jogo.ano.toString();
    document.getElementById("prestigio")!.textContent = jogo.prestigio.toFixed(2);
    document.getElementById("estabilidade-familiar")!.textContent = jogo.estabilidadeFamiliar.toFixed(2);
    document.getElementById("acoes-restantes")!.textContent = `Ações: ${jogo.acoes}`;
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
                opcao.efeito();
                acontecimentoAtual = gerarAcontecimentoAleatorio();
                atualizarUI();
            }
        });
        opcoesContainer.appendChild(button);
    }
}

function atualizarPatrimonioUI() {
    document.getElementById("dinheiro-display")!.textContent = `R$ ${jogo.patrimonio.dinheiro.toFixed(2)}`;
    document.getElementById("patrimonio-display")!.textContent = `R$ ${jogo.patrimonio.total.toFixed(2)}`;
    document.getElementById("renda-anual-display")!.textContent = `R$ ${jogo.patrimonio.rendaAnualTotal.toFixed(2)}`;
}

function atualizarInvestimentosUI(investimentoIndex: number = 0) {
    const investimentoSelecionado = jogo.patrimonio.investimentos[investimentoIndex];
    const listaInvestimentos = document.getElementById("lista-investimentos")!;
    listaInvestimentos.innerHTML = "";
    for (const investimento of jogo.patrimonio.investimentos) {
        const div = document.createElement("div");
        div.classList.add("sidebar-item");
        if (investimento === investimentoSelecionado) {
            div.classList.add("selected-item");
        }
        const atual = investimento.valorAtual;
        let variacao = 0;
        if (investimento.historico.length > 1) {
            variacao = ((investimento.historico[investimento.historico.length - 2].valor - atual) / investimento.historico[investimento.historico.length - 2].valor) * 100;
        }
        div.innerHTML = `
            <div>
                <img src="/assets/images/memes img/cavalo.jpg" alt="${investimento.nome}" />
            </div>
            <div>
                <h3>${investimento.nome}</h3>
                <h2>R$ ${atual.toFixed(2)}</h2>
                <h4>
                    ${variacao <= 0 ? `
                        <svg viewBox="0 -960 960 960" fill="var(--green4)">
                            <path d="m280-400 200-200 200 200H280Z"/>
                        </svg>` : `
                        <svg viewBox="0 -960 960 960" fill="var(--red4)">
                            <path d="M480-360 280-560h400L480-360Z"/>
                        </svg>`}
                    ${Math.abs(variacao).toFixed(2)}%
                </h4>
            </div>
        `;
        div.addEventListener("click", () => {
            atualizarInvestimentosUI(jogo.patrimonio.investimentos.indexOf(investimento));
        });
        listaInvestimentos.appendChild(div);
    }

    const centro = document.getElementById("centro-investimentos")!;
    const atual = investimentoSelecionado.valorAtual;
    let variacao = 0;
    if (investimentoSelecionado.historico.length > 1) {
        variacao = ((investimentoSelecionado.historico[investimentoSelecionado.historico.length - 2].valor - atual) / atual) * 100;
    }
    centro.innerHTML = `
        <div>
            <div>
                <img src="/assets/images/memes img/cavalo.jpg" alt="Investimentos" />
            </div>

            <div>
                <h2>${investimentoSelecionado.nome}</h2>
                <div>
                    <div>
                        Preço atual
                        <h3>R$ ${investimentoSelecionado.valorAtual.toFixed(2)}</h3>
                    </div>
                    <div>
                        Variação
                        <h3>
                            ${variacao <= 0 ? `
                                <svg viewBox="0 -960 960 960" fill="var(--green4)">
                                    <path d="m280-400 200-200 200 200H280Z"/>
                                </svg>` : `
                                <svg viewBox="0 -960 960 960" fill="var(--red4)">
                                    <path d="M480-360 280-560h400L480-360Z"/>
                                </svg>`}
                            ${Math.abs(variacao).toFixed(2)}%
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <canvas id="grafico-investimento"></canvas>
        </div>
        <div id="tabela-investimento">

        </div>
    `;

    investimentoSelecionado.gerarGrafico("grafico-investimento");
    const tabelaInvestimento = document.getElementById("tabela-investimento")!;
    tabelaInvestimento.appendChild(investimentoSelecionado.gerarTabela());

    const direita = document.getElementById("direita-investimentos")!;
    direita.innerHTML = `
        <div>
            <h3>Ações possuídas <span>${investimentoSelecionado.acoesPossuidas}</span></h3>
            <h3>Valor investido <span>R$ ${investimentoSelecionado.valorInvestido.toFixed(2)}</span></h3>
            <h3>Valor das ações <span>R$ ${(investimentoSelecionado.acoesPossuidas * investimentoSelecionado.valorAtual).toFixed(2)}</span></h3>
            <h3>Lucro/Prejuízo <span>R$ ${(investimentoSelecionado.acoesPossuidas * investimentoSelecionado.valorAtual - investimentoSelecionado.valorInvestido).toFixed(2)}</span></h3>
            <h3>Rentabilidade <span>${investimentoSelecionado.valorInvestido > 0 ? (((investimentoSelecionado.acoesPossuidas * investimentoSelecionado.valorAtual - investimentoSelecionado.valorInvestido) / investimentoSelecionado.valorInvestido) * 100).toFixed(2) : "0"}%</span></h3>
        </div>
        <div>
            <h2>Negociar ações</h2>
            <label for="quantidade-acoes">Quantidade</label>
            <input id="quantidade-acoes" type="number" min="1" step="1" value="1">
            <p id="total-negociacao">Total: R$ ${investimentoSelecionado.valorAtual.toFixed(2)}</p>
            <p class="caixa-disponivel">Dinheiro disponível: R$ ${jogo.patrimonio.dinheiro.toFixed(2)}</p>
            <div class="acoes-negociacao">
                <button id="botao-comprar-acoes" type="button">Comprar</button>
                <button id="botao-vender-acoes" type="button">Vender</button>
            </div>
            <p id="mensagem-negociacao" role="status"></p>
        </div>
    `;

    const quantidadeAcoes = document.getElementById("quantidade-acoes") as HTMLInputElement;
    const totalNegociacao = document.getElementById("total-negociacao")!;
    const mensagemNegociacao = document.getElementById("mensagem-negociacao")!;

    quantidadeAcoes.addEventListener("input", () => {
        const quantidade = Math.max(0, Number.parseInt(quantidadeAcoes.value) || 0);
        totalNegociacao.textContent = `Total: R$ ${(quantidade * investimentoSelecionado.valorAtual).toFixed(2)}`;
    });

    const negociar = (tipo: "compra" | "venda") => {
        const quantidade = Number.parseInt(quantidadeAcoes.value);
        if (!Number.isInteger(quantidade) || quantidade < 1) {
            mensagemNegociacao.textContent = "Informe uma quantidade válida.";
            return;
        }

        const negociacaoConcluida = tipo === "compra"
            ? investimentoSelecionado.comprarAcoes(quantidade)
            : investimentoSelecionado.venderAcoes(quantidade);

        if (!negociacaoConcluida) {
            mensagemNegociacao.textContent = tipo === "compra"
                ? "Dinheiro insuficiente para essa compra."
                : "Você não possui ações suficientes para essa venda.";
            return;
        }

        atualizarInvestimentosUI(investimentoIndex);
        atualizarPatrimonioUI();
    };

    document.getElementById("botao-comprar-acoes")!.addEventListener("click", () => negociar("compra"));
    document.getElementById("botao-vender-acoes")!.addEventListener("click", () => negociar("venda"));
}

function atualizarPropriedadesUI(propriedadeIndex: number = 0) {
    const propriadedeSelecionado = jogo.patrimonio.propriedades[propriedadeIndex];
    const listaPropriedades = document.getElementById("lista-propriedades")!;
    listaPropriedades.innerHTML = "";
    for (const propriedade of jogo.patrimonio.propriedades) {
        const div = document.createElement("div");
        div.classList.add("sidebar-item");
        if (propriedade === propriadedeSelecionado) {
            div.classList.add("selected-item");
        }
        div.innerHTML = `
            <div>
                <img src="/assets/images/memes img/cavalo.jpg" alt="${propriedade.nome}" />
            </div>
            <div>
                <h3>${propriedade.nome}</h3>
                <h2>R$ ${propriedade.valor.toFixed(2)}</h2>
            </div>
        `;
        div.addEventListener("click", () => {
            atualizarPropriedadesUI(jogo.patrimonio.propriedades.indexOf(propriedade));
        });
        listaPropriedades.appendChild(div);
    }

    const centro = document.getElementById("centro-propriedades")!;
    centro.innerHTML = `
        <div>
            <div id="imagem-propriedade">
                <img src="/assets/images/memes img/cavalo.jpg" alt="${propriadedeSelecionado.nome}" />
            </div>
            <div id="informacoes-propriedade">
                <div>
                    <h3>Nome</h3>
                    <h4>${propriadedeSelecionado.nome}</h4>
                </div>
                <div>
                    <h3>Valor</h3>
                    <h4>R$ ${propriadedeSelecionado.valor.toFixed(2)}</h4>
                </div>
                <div>
                    <h3>Renda anual</h3>
                    <h4>R$ ${propriadedeSelecionado.rendaAnual.toFixed(2)}</h4>
                </div>
                <div>
                    <h3>Despesas anuais</h3>
                    <h4>R$ ${propriadedeSelecionado.despestasAnuais.toFixed(2)}</h4>
                </div>
                <div>
                    <h3>Condição</h3>
                    <h4>${propriadedeSelecionado.condicao.toFixed(2)}%</h4>
                </div>
                <div>
                    </h3>Luxo</h3>
                    <h4>${propriadedeSelecionado.luxo.toFixed(2)}%</h4>
                </div>
            </div>
        </div>
        <div>
            
        </div>
    `;

    const direita = document.getElementById("direita-propriedades")!;
    direita.innerHTML = `
        <div>
            <button id="botao-comprar-vender-propriedade">${propriadedeSelecionado.comprada ? "Vender" : "Comprar"}</button>
            <button>
                <h4>Melhorar</h4>
                <p>R$ 0,00</p>
            </button>
            <button id="botao-reformar-propriedade">
                <h4>Reformar</h4>
                <p>R$ ${propriadedeSelecionado.valorReforma.toFixed(2)}</p>
            </button>
        </div>
    `;

    const botaoComprarVender = direita.querySelector("button#botao-comprar-vender-propriedade")!;
    botaoComprarVender.addEventListener("click", () => {
        if (!propriadedeSelecionado.comprada) {
            propriadedeSelecionado.comprarPropriedade();
            atualizarPropriedadesUI(propriedadeIndex);
            atualizarPatrimonioUI();
        } else {
            propriadedeSelecionado.venderPropriedade();
            atualizarPropriedadesUI(propriedadeIndex);
            atualizarPatrimonioUI();
        }
    });

    const botaoReformar = direita.querySelector("button#botao-reformar-propriedade")!;
    botaoReformar.addEventListener("click", () => {
        propriadedeSelecionado.reformar();
        atualizarPropriedadesUI(propriedadeIndex);
        atualizarPatrimonioUI();
    });
}

function atualizarBensUI(bemIndex: number = 0) {
    const bemSelecionado = jogo.patrimonio.bens[bemIndex];
    const listaBens = document.getElementById("lista-bens")!;
    listaBens.innerHTML = "";
    for (const bem of jogo.patrimonio.bens) {
        const div = document.createElement("div");
        if (bem === bemSelecionado) {
            div.classList.add("selected-item");
        }
        div.innerHTML = `
            <div>
                <img src="/assets/images/memes img/cavalo.jpg" alt="${bem.nome}" />
            </div>
            <div>
                <h3>${bem.nome}</h3>
            </div>
        `;
        div.addEventListener("click", () => {
            atualizarBensUI(jogo.patrimonio.bens.indexOf(bem));
        });
        listaBens.appendChild(div);
    }

    const nomeBem = document.getElementById("nome-bem")!;
    const imagemBem = document.getElementById("imagem-bem")! as HTMLImageElement;
    const descricaoBem = document.getElementById("descricao-bem")!;
    const valorBem = document.getElementById("valor-bem")!;
    const emanutencaoBem = document.getElementById("manutencao-bem")!;
    nomeBem.textContent = bemSelecionado.nome;
    imagemBem.src = "/assets/images/memes img/cavalo.jpg";
    descricaoBem.textContent = bemSelecionado.descricao;
    valorBem.textContent = `Valor: R$ ${bemSelecionado.valorBase.toFixed(2)}`;
    emanutencaoBem.textContent = `Manutenção: R$ ${bemSelecionado.valorManutencao.toFixed(2)}`;
}

function atualizarEmprestimosUI(bancoIndex: number = 0) {
    const bancoSelecionado = jogo.bancos[bancoIndex];
    const emprestimoExistente = jogo.patrimonio.emprestimos.some(emprestimo => emprestimo.banco === bancoSelecionado);
    const listaBancos = document.getElementById("lista-bancos")!;
    listaBancos.innerHTML = "";
    for (const banco of jogo.bancos) {
        const div = document.createElement("div");
        div.classList.add("sidebar-item");
        if (banco === bancoSelecionado) {
            div.classList.add("selected-item");
        }
        div.innerHTML = `
            <div>
                <img src="/assets/images/memes img/cavalo.jpg" alt="${banco.nome}" />
            </div>
            <div>
                <h3>${banco.nome}</h3>
                <h2>Juros: ${parseInt(String(banco.taxaJuros * 100))}%</h2>
            </div>
        `;
        div.addEventListener("click", () => {
            atualizarEmprestimosUI(jogo.bancos.indexOf(banco));
        });
        listaBancos.appendChild(div);
    }

    const criarEmprestimo = document.getElementById("criar-emprestimo")!;
    criarEmprestimo.innerHTML = `
        <div class="emprestimo-introducao">
            <div>
                <span class="eyebrow">Proposta escolhida</span>
                <h2>${bancoSelecionado.nome}</h2>
                <p>${bancoSelecionado.descricao}</p>
            </div>
            <div class="taxa-destaque">
                <strong>${(bancoSelecionado.taxaJuros * 100).toFixed(0)}%</strong>
                <span>juros</span>
            </div>
        </div>
        <div class="limites-emprestimo">
            <div><span>Limite</span><strong>R$ ${bancoSelecionado.maximoEmprestimo.toFixed(2)}</strong></div>
            <div><span>Prazo máximo</span><strong>${bancoSelecionado.maximoParcelas} anos</strong></div>
            <div><span>Caixa atual</span><strong>R$ ${jogo.patrimonio.dinheiro.toFixed(2)}</strong></div>
        </div>
        <h3 class="titulo-simulador">Simule seu crédito</h3>
        <label for="valor-emprestimo">Valor</label>
        <input id="valor-emprestimo" type="number" min="1" max="${bancoSelecionado.maximoEmprestimo}" step="1000" value="${Math.min(10000, bancoSelecionado.maximoEmprestimo)}">
        <label for="parcelas-emprestimo">Parcelas</label>
        <input id="parcelas-emprestimo" type="number" min="1" max="${bancoSelecionado.maximoParcelas}" step="1" value="1">
        <div id="resumo-emprestimo">
            <div><span>Você recebe</span><strong id="valor-recebido"></strong></div>
            <div><span>Custo dos juros</span><strong id="custo-juros"></strong></div>
            <div><span>Total a devolver</span><strong id="total-a-pagar"></strong></div>
            <div class="parcela-destaque"><span>Valor de cada parcela</span><strong id="valor-parcela"></strong></div>
        </div>
        <button id="botao-criar-emprestimo" type="button" ${emprestimoExistente ? "disabled" : ""}>
            ${emprestimoExistente ? "Empréstimo já contratado" : "Criar empréstimo"}
        </button>
        <p id="mensagem-emprestimo" role="status">${emprestimoExistente ? "Este banco já possui um empréstimo ativo." : ""}</p>
    `;

    const valorInput = document.getElementById("valor-emprestimo") as HTMLInputElement;
    const parcelasInput = document.getElementById("parcelas-emprestimo") as HTMLInputElement;
    const mensagem = document.getElementById("mensagem-emprestimo")!;

    const atualizarResumo = () => {
        const valor = Number(valorInput.value) || 0;
        const parcelas = Number(parcelasInput.value) || 1;
        const juros = valor * bancoSelecionado.taxaJuros;
        const valorTotal = valor * (1 + bancoSelecionado.taxaJuros);
        document.getElementById("valor-recebido")!.textContent = `R$ ${valor.toFixed(2)}`;
        document.getElementById("custo-juros")!.textContent = `R$ ${juros.toFixed(2)}`;
        document.getElementById("total-a-pagar")!.textContent = `R$ ${valorTotal.toFixed(2)}`;
        document.getElementById("valor-parcela")!.textContent = `R$ ${(valorTotal / parcelas).toFixed(2)}`;
    };

    valorInput.addEventListener("input", atualizarResumo);
    parcelasInput.addEventListener("input", atualizarResumo);
    atualizarResumo();

    document.getElementById("botao-criar-emprestimo")!.addEventListener("click", () => {
        if (jogo.patrimonio.emprestimos.some(emprestimo => emprestimo.banco === bancoSelecionado)) {
            mensagem.textContent = "Você já possui um empréstimo ativo neste banco.";
            return;
        }

        const valor = Number(valorInput.value);
        const parcelas = Number(parcelasInput.value);
        if (!Number.isFinite(valor) || valor <= 0 || valor > bancoSelecionado.maximoEmprestimo) {
            mensagem.textContent = `Informe um valor entre R$ 1,00 e R$ ${bancoSelecionado.maximoEmprestimo.toFixed(2)}.`;
            return;
        }
        if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > bancoSelecionado.maximoParcelas) {
            mensagem.textContent = `Escolha entre 1 e ${bancoSelecionado.maximoParcelas} parcelas.`;
            return;
        }

        jogo.patrimonio.dinheiro += valor;
        jogo.patrimonio.emprestimos.push(new Emprestimo(valor, bancoSelecionado, parcelas));
        atualizarEmprestimosUI(bancoIndex);
        atualizarPatrimonioUI();
    });

    const informacoes = document.getElementById("informacoes-emprestimos")!;
    const totalEmDivida = jogo.patrimonio.emprestimos.reduce((total, emprestimo) => total + emprestimo.saldoDevedor, 0);
    informacoes.innerHTML = `
        <div class="resumo-dividas">
            <div><span>Contratos ativos</span><strong>${jogo.patrimonio.emprestimos.length}</strong></div>
            <div><span>Total em dívida</span><strong>R$ ${totalEmDivida.toFixed(2)}</strong></div>
        </div>
        <h2>Empréstimos ativos</h2>
        ${jogo.patrimonio.emprestimos.length === 0
            ? "<p class=\"sem-emprestimos\">Nenhum empréstimo ativo. Suas finanças estão livres de parcelas.</p>"
            : jogo.patrimonio.emprestimos.map(emprestimo => `
            <div class="emprestimo-ativo">
                <div class="emprestimo-ativo-cabecalho">
                    <h3>${emprestimo.banco.nome}</h3>
                    <span>${(emprestimo.banco.taxaJuros * 100).toFixed(0)}% juros</span>
                </div>
                <div class="emprestimo-ativo-dados">
                    <p><span>Saldo devedor</span><strong>R$ ${emprestimo.saldoDevedor.toFixed(2)}</strong></p>
                    <p><span>Parcela anual</span><strong>R$ ${emprestimo.valorParcela.toFixed(2)}</strong></p>
                    <p><span>Anos restantes</span><strong>${emprestimo.parcelasRestantes}</strong></p>
                </div>
            </div>
        `).join("")}`;
}

function obterDadosFiltroSatisfacao(satisfacao: number) {
    const satisfacaoNormalizada = Math.max(0, Math.min(100, satisfacao));
    const hue = Math.round((satisfacaoNormalizada / 100) * 120);
    const cor = `hsla(${hue}, 90%, 45%, 0.45)`;
    return { satisfacaoNormalizada, cor };
}

function atualizarFamiliaUI() {
    const familiaContainer = document.getElementById("familia")!;
    familiaContainer.innerHTML = "";
    for (const pessoa of jogo.familia) {
        const { satisfacaoNormalizada, cor } = obterDadosFiltroSatisfacao(pessoa.satisfacao);
        const div = document.createElement("div");
        div.innerHTML = `
            <div>
                <div class="imagem-com-filtro" style="--satisfacao: ${satisfacaoNormalizada}%; --cor-satisfacao: ${cor};">
                    <img src="/assets/images/memes img/cavalo.jpg" alt="${pessoa.nome}" />
                    <span class="filtro-satisfacao"></span>
                </div>
            </div>
            <div>
                <h3>${pessoa.nome}</h3>
                <h4>${pessoa.descricao}</h4>
            </div>
        `;
        familiaContainer.appendChild(div);
    }
}

function atualizarConhecidosUI() {
    const conhecidosContainer = document.getElementById("conhecidos")!;
    conhecidosContainer.innerHTML = "";
    for (const pessoa of jogo.conhecidos) {
        const { satisfacaoNormalizada, cor } = obterDadosFiltroSatisfacao(pessoa.satisfacao);
        const div = document.createElement("div");
        div.innerHTML = `
            <div>
                <div class="imagem-com-filtro" style="--satisfacao: ${satisfacaoNormalizada}%; --cor-satisfacao: ${cor};">
                    <img src="/assets/images/memes img/cavalo.jpg" alt="${pessoa.nome}" />
                    <span class="filtro-satisfacao"></span>
                </div>
            </div>
            <div>
                <h3>${pessoa.nome}</h3>
                <h4>${pessoa.descricao}</h4>
            </div>
        `;
        conhecidosContainer.appendChild(div);
    }
}

function atualizarEventosUI(evento: Evento) {
    const h3 = document.getElementById("nome-evento")!;
    const p = document.getElementById("descricao-evento")!;
    h3.textContent = evento.nome;
    p.textContent = evento.descricao;
}

function mover(objeto: HTMLElement) {
    let draggedElement: HTMLElement | null = null;
    let shiftX: number, shiftY: number;
    let isDragging = false;
    let animationFrameId: number | null = null;
    const MOVE_THRESHOLD = 5;

    // Valores de destino para a animação
    let targetX = 0;
    let targetY = 0;

    const updatePosition = () => {
        if (!draggedElement) return;

        // Aplica a posição apenas no momento em que a tela vai atualizar
        draggedElement.style.left = `${targetX}px`;
        draggedElement.style.top = `${targetY}px`;

        animationFrameId = requestAnimationFrame(updatePosition);
    };

    objeto.addEventListener('mousedown', (e: MouseEvent) => {
        if (!e) return;

        draggedElement = objeto;
        const rect = draggedElement.getBoundingClientRect();

        shiftX = e.clientX - rect.left;
        shiftY = e.clientY - rect.top;

        const startX = e.clientX;
        const startY = e.clientY;
        isDragging = false;

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging &&
                (Math.abs(e.clientX - startX) > MOVE_THRESHOLD ||
                    Math.abs(e.clientY - startY) > MOVE_THRESHOLD)) {
                isDragging = true;
                // Inicia o ciclo de animação
                animationFrameId = requestAnimationFrame(updatePosition);
            }

            if (isDragging) {
                // Em vez de mover o DOM aqui, apenas guardamos as coordenadas
                targetX = e.pageX - shiftX - window.scrollX;
                targetY = e.pageY - shiftY - window.scrollY;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (animationFrameId !== null) {
                // Para o ciclo de animação
                cancelAnimationFrame(animationFrameId);
            }
            draggedElement = null;
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

mover(document.getElementById("janela-investimentos")!);
mover(document.getElementById("janela-propriedades")!);
mover(document.getElementById("janela-bens")!);
mover(document.getElementById("janela-emprestimos")!);

document.getElementById("botao-proximo-ano")!.addEventListener("click", () => {
    jogo.proximoAno();
});

document.getElementById("botao-investimentos")!.addEventListener("click", () => {
    const janelaInvestimentos = document.getElementById("janela-investimentos")!;
    janelaInvestimentos.style.display = janelaInvestimentos.style.display === "none" ? "flex" : "none";
});

document.getElementById("close-investimentos")!.addEventListener("click", () => {
    const janelaInvestimentos = document.getElementById("janela-investimentos")!;
    janelaInvestimentos.style.display = "none";
});

document.getElementById("botao-propriedades")!.addEventListener("click", () => {
    const janelaPropriedades = document.getElementById("janela-propriedades")!;
    janelaPropriedades.style.display = janelaPropriedades.style.display === "none" ? "flex" : "none";
});

document.getElementById("close-propriedades")!.addEventListener("click", () => {
    const janelaPropriedades = document.getElementById("janela-propriedades")!;
    janelaPropriedades.style.display = "none";
});

document.getElementById("botao-bens")!.addEventListener("click", () => {
    const janelaBens = document.getElementById("janela-bens")!;
    janelaBens.style.display = janelaBens.style.display === "none" ? "flex" : "none";
});

document.getElementById("close-bens")!.addEventListener("click", () => {
    const janelaBens = document.getElementById("janela-bens")!;
    janelaBens.style.display = "none";
});

document.getElementById("botao-emprestimos")!.addEventListener("click", () => {
    const janelaEmprestimos = document.getElementById("janela-emprestimos")!;
    janelaEmprestimos.style.display = janelaEmprestimos.style.display === "none" ? "flex" : "none";
});

document.getElementById("close-emprestimos")!.addEventListener("click", () => {
    const janelaEmprestimos = document.getElementById("janela-emprestimos")!;
    janelaEmprestimos.style.display = "none";
});

acontecimentoAtual = gerarAcontecimentoAleatorio();
eventoAtual = gerarEventoAleatorio();
atualizarUI();