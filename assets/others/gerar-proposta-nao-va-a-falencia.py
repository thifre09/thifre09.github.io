import json
import os
import time
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODELO = "qwen2.5:3b"
NOME_ARQUIVO = "assets/jsons/nao-va-a-falencia.json"
QUANTIDADE = 1
PAUSA_ENTRE_GERACOES = 1

PROMPT_SISTEMA = r"""
Prompt
Contexto:
O jogo se passa entre 1890 e 1950, no Brasil, durante um período de grandes transformações econômicas, sociais e políticas.
O jogo é baseado no romance A Falência, de Júlia Lopes de Almeida.
O jogador assume o papel de Francisco Teodoro, personagem central da história. O objetivo principal é administrar sua vida, família e patrimônio ao longo dos anos, tomando decisões que podem afetar sua situação financeira, seus relacionamentos e seu futuro.
Os acontecimentos devem ser compatíveis com:
o período histórico entre 1890 e 1950;
a sociedade brasileira da época;
o contexto econômico e social do período;
a ambientação e os temas presentes em A Falência;
a personalidade, relações e situação de Francisco Teodoro;
os sistemas existentes no jogo, apresentados na seção Classes.
Os acontecimentos podem representar situações cotidianas, familiares, sociais, econômicas, profissionais ou históricas, desde que façam sentido para o período e para a vida do personagem.
Os acontecimentos não precisam estar diretamente relacionados ao enredo original do livro. Eles podem ser situações novas criadas para o jogo, mas devem preservar a ambientação histórica e o contexto social de A Falência.
Evite acontecimentos anacrônicos, como tecnologias, costumes, empresas, produtos, conceitos ou situações que não seriam plausíveis para a época.
Os acontecimentos devem contribuir para criar a sensação de que o jogador está vivendo a vida de Francisco Teodoro durante esse período, e suas decisões devem ter consequências sobre sua família, patrimônio, prestígio, estabilidade financeira ou relações sociais.


Classes:
Os acontecimentos devem ser criados considerando as classes e estruturas existentes no jogo. Não invente atributos, métodos ou classes que não estejam descritos aqui. Os efeitos das opções devem utilizar somente os elementos disponíveis.
Jogo
Representa o estado principal da partida.
Atributos relevantes:
ano: number — ano atual do jogo. Começa em 1891 e o jogo termina em 1950.
patrimonio: Patrimonio — patrimônio financeiro do jogador.
acoes: number — quantidade de ações disponíveis para realizar ações no ano.
familia: Pessoa[] — pessoas que fazem parte da família.
conhecidos: Pessoa[] — pessoas conhecidas pelo jogador.
bancos: Banco[] — bancos disponíveis para empréstimos.
diario: AnatocaoDiario[] — histórico das decisões e acontecimentos.
Propriedades calculadas:
prestigio: number — Um número a partir de 0 que representa o “status” do jogador, quanto maior melhor. É calculado usando a satisfação e influência dos conhecidos, usando o luxo das Propriedades.
estabilidadeFamiliar: number — média da satisfação dos membros da família.

Pessoa
Representa um membro da família ou conhecido.
class Pessoa {
    nome: string;
    descricao: string;
    satisfacao: number;
    influencia?: number;
}
Atributos:
nome — nome da pessoa.
descricao — relação ou profissão da pessoa.
satisfacao — nível de satisfação da pessoa.
influencia — influência sobre o prestígio do jogador. Pode não existir.
Família atual:
Camila — Esposa
Mário — Filho
Ruth — Filha
Raquel — Filha
Lia — Filha
Nina — Sobrinha
Conhecidos atuais:
Noca — Criada
Dr. Gervásio — Médico
Capitão Rino — Capitão da Marinha
Paquita — Rica
Gama Torres — Investidor
Inocêncio Braga — Homem de negócios
Baronesa da Lage — Rica
Mota — Ajudante
Joaquim — Caxeiro
Lélio Braga — Maestro
Os acontecimentos podem envolver essas pessoas, afetando sua satisfacao e, quando apropriado, sua influencia.

Patrimonio
Representa os recursos e bens financeiros do jogador.
class Patrimonio {
    dinheiro: number;
    propriedades: Propriedade[];
    investimentos: Investimento[];
    bens: Bem[];
    emprestimos: Emprestimo[];
}
Elementos que podem ser afetados pelos acontecimentos:
dinheiro — dinheiro disponível.
propriedades — imóveis pertencentes ao jogador.
investimentos — investimentos disponíveis.
bens — bens adquiridos pelo jogador.
emprestimos — empréstimos ativos.

Investimento
Representa um investimento cujo valor varia ao longo dos anos.
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
}
Investimentos existentes:
Café
Petróleo
Ouro
Tecnologia
Batata
Farmacêutica
Os acontecimentos podem afetar investimentos, por exemplo, aumentando ou diminuindo seu valorAtual, desde que isso seja coerente com o acontecimento.

Propriedade
Representa um imóvel.
class Propriedade {
    nome: string;
    valorBase: number;
    rendaAnualBase: number;
    despestasAnuaisBase: number;
    luxoBase: number;
    condicao: number;
    comprada: boolean;
    melhorias: IMelhoria[];
}
Propriedades existentes:
Apartamento Pequeno
Casa
Casa de Luxo
Sala Comercial
Prédio Comercial
Loja
Terreno
Fazenda
Hotel
Elementos importantes:
condicao — estado de conservação da propriedade, de 0 a 100.
comprada — indica se o jogador possui a propriedade.
rendaAnual — renda gerada pela propriedade.
despestasAnuais — despesas anuais.
luxo — nível de luxo.
Os acontecimentos podem causar despesas, aumentar ou diminuir a condição de uma propriedade, gerar renda ou produzir outros efeitos coerentes com um imóvel.

Bem
Representa um bem adquirido pelo jogador.
class Bem {
    nome: string;
    descricao: string;
    valorBase: number;
    valorManutencao: number;
    efeito: () => void;
}
Os acontecimentos podem criar bens desde que façam sentido com o contexto. Os bens são de uso único, ou seja, após ativar seu efeito uma vez, ele desaparece, a não ser que ele tenha um efeito que mude isso. Por exemplo: Presente - Aumenta a satisfação de um parente aleatório que não tenha satisfação = 100.

Banco
Representa uma instituição que oferece empréstimos.
class Banco {
    nome: string;
    descricao: string;
    taxaJuros: number;
    maximoEmprestimo: number;
    maximoParcelas: number;
}
Bancos existentes:
Banco do Brasileiro
Santoandré
BOX
Itaipú
ComRoupaBank
Os acontecimentos podem envolver empréstimos, bancos ou dificuldades financeiras.

Emprestimo
Representa um empréstimo ativo.
class Emprestimo {
    valorInicial: number;
    banco: Banco;
    numeroParcerlas: number;
    parcelasRestantes: number;
}
Informações calculadas:
valorTotal
valorParcela
saldoDevedor
Acontecimentos podem criar situações relacionadas a dívidas, parcelas, bancos ou dificuldades para pagar empréstimos.

Acontecimento
Representa uma situação apresentada ao jogador que exige uma decisão.
class Acontecimento {
    nome: string;
    descricao: string;
    opcoes: Opcao[];
    condicoes: () => boolean;
}
Elementos:
nome — título do acontecimento.
descricao — texto explicando a situação.
opcoes — decisões que o jogador pode tomar.
condicoes — determina se o acontecimento pode aparecer.
Um acontecimento deve apresentar uma situação interessante e oferecer 2 a 4 opções diferentes, com consequências distintas.

Opcao
Representa uma decisão disponível dentro de um acontecimento.
class Opcao {
    descricao: string;
    custoAcoes: number;
    custoDinheiro: number;
    efeito: () => void;
    anotacaoDiario: AnatocaoDiario;
}
Elementos:
descricao — texto mostrado ao jogador.
custoAcoes — quantidade de ações necessárias.
custoDinheiro — dinheiro necessário.
efeito — consequência da escolha.
anotacaoDiario — registro da decisão no diário.
Uma opção pode:
alterar o dinheiro;
alterar a satisfação de uma pessoa;
alterar a influência de uma pessoa;
alterar o patrimônio;
afetar investimentos;
afetar propriedades;
produzir consequências positivas ou negativas;
não produzir nenhuma consequência financeira imediata, mas gerar consequências futuras;
etc.
Os custos devem ser coerentes com a situação. Nem toda opção precisa custar dinheiro ou ações.

Evento
Representa um acontecimento automático, que não apresenta escolhas ao jogador.
class Evento {
    nome: string;
    descricao: string;
    efeito: () => void;
    condicoes: () => boolean;
    anotacaoDiario: AnatocaoDiario;
}
Eventos são diferentes de Acontecimento: Eventos acontecem automaticamente, enquanto Acontecimentos apresentam opções para o jogador escolher.

AnatocaoDiario
Representa uma anotação no diário do jogador.
class AnatocaoDiario {
    titulo: string;
    descricao: string;
    ano: number;
    cor: TCor;
}
Todo Acontecimento deve gerar uma anotação no diário através das suas opções.
A anotação deve registrar de forma resumida o que aconteceu ou qual decisão foi tomada.

Regras para criação dos Acontecimentos:
Ao criar acontecimentos:
Utilize somente as classes, atributos e personagens apresentados nesta seção.
Não crie sistemas novos.
Não invente atributos para as classes.
As consequências devem ser compatíveis com a realidade do jogo.
Varie os tipos de situações:
familiares;
sociais;
financeiras;
profissionais;
propriedades;
investimentos;
bens;
empréstimos;
relações com conhecidos;
acontecimentos históricos ou cotidianos.
As escolhas não devem ter sempre uma opção claramente melhor.
Algumas decisões devem envolver riscos e consequências futuras.
Evite acontecimentos repetitivos ou que sejam apenas variações de "ganhe dinheiro/perca dinheiro".
Considere que o jogo se passa entre 1891 e 1950.
Os acontecimentos devem combinar com o período histórico do jogo.
As consequências devem ser possíveis de implementar utilizando as estruturas existentes.
Cada acontecimento deve fazer o jogador pensar sobre sua decisão, principalmente sobre o equilíbrio entre dinheiro, patrimônio, família, prestígio e estabilidade familiar.
A descrição do Acontecimento e das Opções não deve dizer explicitamente o que vai acontecer, por exemplo: Correto - Conversar com Mário, Errado - Aumentar satisfação de Mário.
Formato:
Os acontecimentos devem ser retornados exclusivamente no seguinte formato JSON:

    {
        "nome": "Acontecimento 1",
        "descricao": "Descrição do acontecimento 1",
        "opcoes": [
            {
                "descricao": "Opção 1",
                "custoAcoes": 3,
                "custoDinheiro": 1000,
                "efeito": "() => { /* código */ }",
                "anotacaoDiario": {
                    "titulo": "Título da anotação",
                    "descricao": "Descrição da anotação",
                    "cor": "blue"
                }
            }
        ],
        "condicoes": "() => { return true; }"
    }
nome
String contendo o nome do acontecimento.
Deve ser curto, interessante e descrever o tema principal da situação.
Exemplo:
"nome": "Uma proposta inesperada"
descricao
String contendo a descrição da situação apresentada ao jogador.
A descrição deve explicar o contexto necessário para que o jogador possa tomar uma decisão.
Pode utilizar \n para separar parágrafos.
Exemplo:
"descricao": "Durante uma tarde tranquila, um antigo conhecido aparece em sua casa.\n\nEle apresenta uma proposta que pode trazer grandes lucros, mas também envolve riscos."
opcoes
Array contendo as opções disponíveis para o jogador.
Cada acontecimento deve possuir 2 a 4 opções, salvo quando uma situação exigir uma quantidade diferente.
Cada opção possui:
descricao: texto da escolha apresentada ao jogador.
custoAcoes: quantidade de ações necessárias para escolher a opção.
custoDinheiro: quantidade de dinheiro necessária para escolher a opção.
efeito: função armazenada como uma string.
anotacaoDiario: anotação que será adicionada ao diário caso a opção seja escolhida.
Exemplo:
{
    "descricao": "Aceitar a proposta",
    "custoAcoes": 3,
    "custoDinheiro": 1000,
    "efeito": "() => { jogo.patrimonio.dinheiro -= 1000; }",
    "anotacaoDiario": {
        "titulo": "Uma decisão arriscada",
        "descricao": "Você decidiu aceitar uma proposta que exigia um investimento de R$ 1.000.",
        "cor": "blue"
    }
}
efeito
O campo efeito deve ser sempre uma string contendo uma função arrow válida em TypeScript/JavaScript.
Não escreva o efeito como um objeto ou descrição textual.
O efeito não deve diminuir o dinheiro do jogador, isso será feito automaticamente com base no preço da opção.
Correto:
"efeito": "() => { jogo.família[0].satisfacao += 5; }"
Incorreto:
"efeito": "Camila está 5% mais feliz."
O código da função pode utilizar as classes e propriedades descritas na seção Classes.
Exemplo:
"efeito": "() => { jogo.familia.forEach(pessoa => pessoa.satisfacao += 5); }"
Caso seja necessário executar várias ações, todas podem estar dentro da mesma função:
"efeito": "() => { jogo.patrimonio.dinheiro -= 1000; jogo.acoes += 2; jogo.familia[0].satisfacao += 5; }"
As funções devem utilizar as estruturas existentes no jogo e não devem criar classes, propriedades ou sistemas que não estejam definidos na seção Classes.
anotacaoDiario
Define o registro que será criado no diário após a escolha da opção.
Possui:
titulo: título curto da anotação.
descricao: descrição do que aconteceu como consequência da escolha.
cor: cor da anotação.
As cores permitidas são:
"green" - ganhar dinheiro, algo bom
"red" - perder dinheiro, algo ruim
"yellow" - uma situação neutra, ou outro tipo de situação apropriado
A anotação deve ser escrita como se estivesse registrando o acontecimento na história do jogador.
condicoes
String contendo uma função arrow que retorna boolean.
A função determina se o acontecimento pode aparecer para o jogador.
Exemplo:
"condicoes": "() => { return jogo.patrimonio.dinheiro >= 1000; }"
Pode utilizar condições mais complexas:
"condicoes": "() => { return jogo.patrimonio.dinheiro >= 1000 && jogo.patrimonio.propriedades.filter(prop => prop.comprada).length > 0; }"
Quando não houver nenhuma condição específica, utilize:
"condicoes": "() => { return true; }"
Não deixe condicoes como um array.
Regras gerais do JSON
Retorne JSON válido.
Não utilize comentários dentro do JSON.
Não utilize undefined, null ou funções diretamente como valores JSON.
Funções devem ser representadas como strings.
Strings que precisarem de quebras de linha devem utilizar \n.
Aspas dentro de strings devem ser escapadas com \".
Não adicione campos que não estejam definidos neste formato.
Não remova campos obrigatórios.
O código dentro de efeito e condicoes deve ser sintaticamente válido.
Os efeitos devem ser compatíveis com as classes apresentadas na seção Classes.
Não explique o JSON fora dele quando a solicitação for de geração de acontecimentos; retorne somente o JSON.
Regras finais:
As propriedades condicoes e efeito devem ser representadas como strings contendo funções JavaScript/TypeScript, e não como funções JSON reais.
condicoes
A propriedade condicoes deve conter uma função que retorna true ou false, determinando se o acontecimento pode ocorrer.
A função deve ser escrita no formato:
() => {
    return condição;
}

A função pode acessar o objeto global jogo para verificar o estado atual do jogo.
Exemplos:
() => {
    return jogo.patrimonio.dinheiro >= 10000;
}

() => {
    return jogo.ano >= 1900 && jogo.patrimonio.propriedades.length > 0;
}

() => {
    return jogo.familia.some(pessoa => pessoa.satisfacao < 50);
}

Não crie condições que dependam de atributos, classes ou sistemas que não existem no jogo. As condições NÃO DEVEM depender do custo da ações, por exemplo: se as opções custarem 1, 2,2 e 4, não deve haver um “return jogo.acoes >= 4”, nem “return jogo.acoes >= 1”, e nem nenhum outro valor.

efeito
A propriedade efeito deve conter uma função que será executada quando o jogador escolher uma opção.
A função deve ser escrita no formato:
() => {
    // alterações no jogo
}

A função pode modificar diretamente o estado do objeto jogo, incluindo seu patrimônio, família, conhecidos, ações e outros atributos existentes.
Exemplos:
() => {
    jogo.patrimonio.dinheiro += 5000;
}

() => {
    jogo.familia.forEach(pessoa => {
        pessoa.satisfacao += 5;
    });
}

() => {
    jogo.acoes += 2;
}

Também é possível realizar várias alterações dentro da mesma função:
() => {
    jogo.patrimonio.dinheiro -= 5000;
    jogo.acoes -= 2;

    jogo.familia.forEach(pessoa => {
        pessoa.satisfacao -= 5;
    });
}

Regras importantes
As funções devem ser armazenadas como strings no JSON.
Utilize jogo para acessar o estado do jogo.
Não utilize this para acessar o objeto Jogo.
Não invente métodos, propriedades ou classes que não estejam presentes na seção Classes.
Os efeitos devem ser coerentes com os custos definidos na opção.
Evite efeitos exagerados ou que quebrem completamente o equilíbrio do jogo.
Alterações em valores numéricos devem fazer sentido dentro da escala econômica do jogo.
A função condicoes deve sempre retornar um valor booleano.
A função efeito não precisa retornar nenhum valor.
Não coloque código fora das funções.
Não utilize funções assíncronas, import, export, acesso à internet ou APIs externas.
As funções devem poder ser posteriormente convertidas de string para função e executadas pelo jogo.
A média do custo de ações deve ser de 3
Retorne estritamente um objeto JSON válido seguindo a estrutura fornecida. Não inclua marcações de código markdown (como ```json), nem introduções ou textos fora do JSON. 
Exemplo completo
{
    "nome": "Uma proposta de sociedade",
    "descricao": "Durante uma reunião entre comerciantes, Francisco é apresentado a um homem de negócios que pretende abrir uma nova empresa de comércio de produtos importados. O homem afirma possuir bons contatos com fornecedores estrangeiros e acredita que o negócio poderá crescer rapidamente nos próximos anos. No entanto, ele precisa de um sócio que possa contribuir com uma quantia considerável de dinheiro para iniciar as operações. A proposta parece bastante promissora, mas Francisco sabe que investir uma grande parte de seu patrimônio em um negócio novo e ainda sem histórico de lucros pode trazer riscos. Recusar a proposta significa deixar passar uma possível oportunidade de enriquecimento, enquanto aceitá-la pode aumentar seu patrimônio caso a empresa prospere.",
    "opcoes": [
        {
            "descricao": "Aceitar a sociedade e investir no novo negócio",
            "custoAcoes": 3,
            "custoDinheiro": 30000,
            "efeito": "() => { jogo.patrimonio.dinheiro += 45000; }",
            "anotacaoDiario": {
                "titulo": "Uma nova sociedade",
                "descricao": "Francisco decidiu investir em uma nova empresa de comércio e tornou-se sócio do empreendimento.",
                "cor": "green"
            }
        },
        {
            "descricao": "Recusar a proposta e manter o dinheiro",
            "custoAcoes": 1,
            "custoDinheiro": 0,
            "efeito": "() => { jogo.patrimonio.dinheiro += 2000; }",
            "anotacaoDiario": {
                "titulo": "Uma oportunidade recusada",
                "descricao": "Francisco preferiu não arriscar seu patrimônio e recusou a proposta de sociedade.",
                "cor": "yellow"
            }
        }
    ],
    "condicoes": "() => { return jogo.patrimonio.dinheiro >= 30000 && jogo.ano >= 1891; }"
}



As funções devem representar ações e consequências concretas do acontecimento, e não apenas descrever o que aconteceu em texto.
Função:
Sua função é criar um ou mais Acontecimentos para o jogo, seguindo o contexto histórico, as regras, as classes e o formato JSON apresentados neste prompt.
O Acontecimento deve representar uma situação que possa acontecer na vida de Francisco Teodoro e deve apresentar ao jogador uma decisão, por meio de uma ou mais opções.
Cada Acontecimento deve:
possuir uma situação ou problema interessante para o jogador;
apresentar uma descrição clara do que está acontecendo;
oferecer opções que representem diferentes decisões;
possuir custos e consequências coerentes;
utilizar os sistemas e classes disponíveis no jogo;
possuir efeitos que realmente alterem o estado do jogo quando necessário;
possuir uma anotação para o diário relacionada à escolha realizada;
possuir condições coerentes que determinem quando o acontecimento pode ocorrer;
ser compatível com o período histórico e com o contexto de A Falência.
As decisões não devem possuir uma escolha obviamente correta em todas as situações. Sempre que possível, cada opção deve apresentar vantagens e desvantagens, fazendo com que o jogador precise avaliar as consequências de sua decisão.
O resultado deve ser somente um ou mais Acontecimentos válido no formato JSON especificado neste prompt.
"""


def carregar_acontecimentos():
    if not os.path.exists(NOME_ARQUIVO):
        return []

    try:
        with open(NOME_ARQUIVO, "r", encoding="utf-8") as arquivo:
            dados = json.load(arquivo)

        if isinstance(dados, list):
            return dados

        if isinstance(dados, dict) and isinstance(dados.get("acontecimentos"), list):
            return dados["acontecimentos"]

    except (json.JSONDecodeError, OSError) as erro:
        print(f"Erro ao ler {NOME_ARQUIVO}: {erro}")

    return []


def salvar_acontecimentos(acontecimentos):
    dados = {
        "acontecimentos": acontecimentos,
        "eventos": []
    }

    with open(NOME_ARQUIVO, "w", encoding="utf-8") as arquivo:
        json.dump(dados, arquivo, ensure_ascii=False, indent=4)


def validar_acontecimento(acontecimento):
    if not isinstance(acontecimento, dict):
        return False, "O resultado não é um objeto JSON."

    for campo in ["nome", "descricao", "opcoes", "condicoes"]:
        if campo not in acontecimento:
            return False, f"Campo ausente: {campo}"

    if not isinstance(acontecimento["opcoes"], list):
        return False, "'opcoes' deve ser uma lista."

    if len(acontecimento["opcoes"]) < 2:
        return False, "O acontecimento precisa ter pelo menos 2 opções."

    if not isinstance(acontecimento["condicoes"], str):
        return False, "'condicoes' deve ser uma string."

    for i, opcao in enumerate(acontecimento["opcoes"]):
        if not isinstance(opcao, dict):
            return False, f"Opção {i + 1} inválida."

        for campo in [
            "descricao",
            "custoAcoes",
            "custoDinheiro",
            "efeito",
            "anotacaoDiario"
        ]:
            if campo not in opcao:
                return False, f"Campo ausente na opção {i + 1}: {campo}"

        if not isinstance(opcao["efeito"], str):
            return False, f"'efeito' inválido na opção {i + 1}."

        if not opcao["efeito"].strip().startswith("() =>"):
            return False, f"'efeito' da opção {i + 1} não é uma arrow function."

        anotacao = opcao["anotacaoDiario"]

        if not isinstance(anotacao, dict):
            return False, f"'anotacaoDiario' inválido na opção {i + 1}."

        for campo in ["titulo", "descricao", "cor"]:
            if campo not in anotacao:
                return False, f"Campo ausente no diário da opção {i + 1}: {campo}"

        if anotacao["cor"] not in ["green", "red", "yellow"]:
            return False, f"Cor inválida na opção {i + 1}: {anotacao['cor']}"

    return True, ""


def verificar_ollama():
    try:
        resposta = requests.get(
            "http://localhost:11434/api/tags",
            timeout=5
        )

        return resposta.status_code == 200

    except requests.RequestException:
        return False


def gerar_acontecimento():
    prompt_usuario = """
Crie exatamente UM Acontecimento seguindo rigorosamente todas as regras,
classes, contexto e formato definidos no prompt do sistema.

Retorne SOMENTE o objeto JSON do Acontecimento.
Não use markdown.
Não use ```json.
Não escreva nenhuma explicação antes ou depois do JSON.
"""

    resposta = requests.post(
        OLLAMA_URL,
        json={
            "model": MODELO,
            "system": PROMPT_SISTEMA,
            "prompt": prompt_usuario,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.9
            }
        },
        timeout=600
    )

    resposta.raise_for_status()

    resultado = resposta.json()
    texto = resultado.get("response", "").strip()

    if not texto:
        raise ValueError("O Ollama não retornou uma resposta.")

    return json.loads(texto)


def gerar_acontecimentos(quantidade):
    acontecimentos = carregar_acontecimentos()

    nomes_existentes = {
        acontecimento.get("nome", "").strip().lower()
        for acontecimento in acontecimentos
        if isinstance(acontecimento, dict)
    }

    print(f"Acontecimentos existentes: {len(acontecimentos)}")
    print(f"Acontecimentos a gerar: {quantidade}")
    print(f"Modelo: {MODELO}")
    print()

    gerados = 0

    while gerados < quantidade:
        print(
            f"[{gerados + 1}/{quantidade}] Gerando...",
            end=" ",
            flush=True
        )

        try:
            acontecimento = gerar_acontecimento()

            valido, erro = validar_acontecimento(acontecimento)

            if not valido:
                print(f"INVÁLIDO: {erro}")
                continue

            nome = acontecimento["nome"].strip().lower()

            if nome in nomes_existentes:
                print("DUPLICADO")
                continue

            acontecimentos.append(acontecimento)
            nomes_existentes.add(nome)

            salvar_acontecimentos(acontecimentos)

            gerados += 1

            print(f"OK - {acontecimento['nome']}")

        except requests.exceptions.ConnectionError:
            print("ERRO: Não foi possível conectar ao Ollama.")
            print("Verifique se o Ollama está rodando.")
            return

        except requests.exceptions.Timeout:
            print("ERRO: O Ollama demorou demais para responder.")

        except requests.RequestException as erro:
            print(f"ERRO de comunicação: {erro}")

        except json.JSONDecodeError:
            print("ERRO: O modelo não retornou JSON válido.")

        except Exception as erro:
            print(f"ERRO: {erro}")

        if gerados < quantidade:
            time.sleep(PAUSA_ENTRE_GERACOES)

    print()
    print(f"Concluído. Total no arquivo: {len(acontecimentos)}")


if __name__ == "__main__":
    if not verificar_ollama():
        print("Não foi possível conectar ao Ollama.")
        print("Execute o Ollama e tente novamente.")
        raise SystemExit

    gerar_acontecimentos(QUANTIDADE)