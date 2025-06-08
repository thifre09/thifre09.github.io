let dinheiro = 25000;
let populacao = 50000;
let nomeCidade;

let saude = 50;
let alegria = 50;
let seguranca = 50;
let educacao = 50;
let meioAmbiente = 50;
let economia = 50;
let infraestrutura = 50;
let imposto = 50

let satisfacaoPopulacao = 50;
let IndexPropostaAtual = null;

// for (let i=0; i < 1000; i++) {
//     const adiouElement = document.createElement("audio");
//     adiouElement.id = "audio"+i;
//     const source = document.createElement("source");
//     source.src = "assets/images/mayor-simulator/WhatsApp Audio 2025-06-07 at 18.12.37.mpeg";
//     adiouElement.appendChild(source);
//     document.querySelector("body").appendChild(adiouElement)
//     setTimeout(() => {
//         const audio = document.getElementById("audio"+(i+1));
//         audio.volume = 1;
//         audio.play();
//     }, 1*i)
// }
class Proposta {

    constructor(titulo, descricao, aceitarResultado = new Estatistica(), recusarResultado = new Estatistica()) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.aceitarResultado = aceitarResultado; //Estatistica
        this.recusarResultado = recusarResultado; //Estatistica
    }

    aceitar() {
        dinheiro += this.aceitarResultado.dinheiro + Math.round(Math.abs(this.aceitarResultado.dinheiro * imposto / 100));
        dinheiro = Math.round(dinheiro);
        saude += this.aceitarResultado.saude;
        alegria += this.aceitarResultado.alegria;
        seguranca += this.aceitarResultado.seguranca;
        educacao += this.aceitarResultado.educacao;
        meioAmbiente += this.aceitarResultado.meioAmbiente;
        economia += this.aceitarResultado.economia;
        infraestrutura += this.aceitarResultado.infraestrutura;
        imposto += this.aceitarResultado.imposto;
        populacao *= this.aceitarResultado.populacao;
        populacao = Math.max(1, Math.floor(populacao)); // Garante que a população não seja menor que 1
    }

    recusar() {
        dinheiro += this.recusarResultado.dinheiro + Math.round(Math.abs(this.aceitarResultado.dinheiro * imposto / 100));
        dinheiro = Math.round(dinheiro);
        saude += this.recusarResultado.saude;
        alegria += this.recusarResultado.alegria;
        seguranca += this.recusarResultado.seguranca;
        educacao += this.recusarResultado.educacao;
        meioAmbiente += this.recusarResultado.meioAmbiente;
        economia += this.recusarResultado.economia;
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
            meioAmbiente: 0,
            economia: 0,
            infraestrutura: 0,
            imposto: 0,
            populacao: 1,
            tituloNoticia: "",
            noticia: ""
        }, opcoes); // opcoes sobrescreve os valores padrão
    }
}

listaPropostas = [
    new Proposta("Trazer Hyago Kadson para a cidade.",
        `Nos termos do disposto no art. 215 da Constituição Federal, que assegura o pleno exercício dos direitos culturais e o acesso às fontes da cultura nacional, a Prefeitura Municipal comunica, por meio da Secretaria de Cultura e Eventos, a contratação do artista Hyago Kadson como atração principal do evento Festival Municipal de Cultura Popular, a ser realizado em praça pública com entrada gratuita.
    
        A iniciativa integra o calendário oficial de ações de valorização da cultura nordestina e tem por objetivo fortalecer os laços comunitários, fomentar a economia criativa e proporcionar entretenimento de qualidade à população local, sobretudo aos jovens e às famílias que tradicionalmente participam de eventos populares.

        A escolha do artista, amplamente reconhecido por seu repertório regional e apelo junto ao público, foi fundamentada em critérios de relevância cultural, projeção artística e retorno social, conforme parecer técnico emitido pela Comissão Municipal de Cultura.
    
        A ação está em consonância com o princípio da dignidade da pessoa humana e da promoção do bem-estar social, sendo esperada grande adesão popular e impacto positivo tanto econômico quanto simbólico para o município.

        Custo: 2800 reais.
        Vereador Pedão.`,

        new Estatistica({
            dinheiro: -2800,
            saude: -2,
            alegria: 8,
            economia: 6,
            populacao: 1.02,
            tituloNoticia: "Festival com Hyago Kadson reúne multidão e aquece economia local",
            noticia: `A realização do Festival Municipal de Cultura Popular com a participação de Hyago Kadson movimentou a cidade neste fim de semana. Milhares de pessoas compareceram ao evento gratuito na praça central, celebrando a cultura nordestina com música, dança e comidas típicas.

		Além da expressiva adesão popular, comerciantes relataram aumento nas vendas e o evento gerou empregos temporários no setor de eventos e alimentação. Apesar de críticas isoladas por parte de opositores ao gasto de R$ 2.800, a maioria da população demonstrou satisfação com a iniciativa.

		Autoridades destacam que o festival cumpriu seu papel de fomentar a economia criativa, promover o bem-estar social e fortalecer os laços comunitários.`

        }),
        new Estatistica({
            alegria: -5,
            saude: 4,
            economia: -3,
            populacao: 0.97,
            tituloNoticia: "População lamenta cancelamento de show cultural com Hyago Kadson",
            noticia: `A prefeitura anunciou o cancelamento do show de Hyago Kadson, que seria a atração principal do Festival Municipal de Cultura Popular. A decisão gerou frustração entre os moradores, especialmente os jovens que aguardavam o evento com expectativa.

		Comerciantes locais também expressaram descontentamento, apontando que o festival representava uma oportunidade de aquecer a economia durante o mês. A medida foi vista por muitos como um retrocesso nas ações de valorização cultural e no incentivo ao lazer popular.

		Apesar da economia com os gastos, a prefeitura enfrenta críticas pela falta de alternativas culturais e pela perda do que seria um importante momento de integração comunitária.`

        }),
    ),

    new Proposta("Novo material de estudo para a rede de educação municipal.",
        `Em observância ao disposto no art. 205 da Constituição Federal e à Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996), a Prefeitura Municipal, por meio da Secretaria de Educação, anuncia a adoção de um novo conjunto de materiais didáticos-pedagógicos para uso obrigatório na rede pública de ensino fundamental.
        
        A medida visa à modernização dos recursos educacionais, à adequação às competências da Base Nacional Comum Curricular (BNCC) e à promoção de uma educação equitativa, inclusiva e de excelência. O novo material contempla recursos impressos e digitais, com linguagem acessível, conteúdo contextualizado à realidade local e apoio multidisciplinar voltado tanto ao corpo docente quanto aos estudantes.
        
        O processo de escolha e aquisição respeitou os princípios da legalidade, impessoalidade, moralidade e eficiência, sendo conduzido mediante parecer técnico-pedagógico emitido por comissão avaliadora composta por especialistas da área educacional.
        
        A iniciativa representa um avanço na política pública educacional do município, fortalecendo o processo de ensino-aprendizagem, combatendo desigualdades de acesso ao conhecimento e garantindo melhores condições para o pleno desenvolvimento intelectual e cidadão dos estudantes da rede municipal.
        
        Custo: 3500 reais.
        Vereador Dr Thiago Frutas.`,

        new Estatistica({
            dinheiro: -3500,
            meioAmbiente: 4,
            alegria: 5,
            educacao: 10,
            populacao: 1.01,
            tituloNoticia: "Novo material didático é implementado e eleva qualidade da educação municipal",
            noticia: `A Prefeitura Municipal iniciou a distribuição de um novo conjunto de materiais pedagógicos para todas as escolas da rede pública de ensino fundamental. A iniciativa visa modernizar o processo de ensino, promover a equidade educacional e alinhar o conteúdo à Base Nacional Comum Curricular (BNCC).

		Educadores destacaram a qualidade dos recursos, que incluem versões impressas e digitais com linguagem acessível e conteúdo contextualizado. Alunos também demonstraram entusiasmo com os novos materiais, que facilitarão a aprendizagem em diversas disciplinas.

		Apesar do investimento de R$ 3.500, a medida foi bem recebida por especialistas e pela população, que enxergam na ação um passo concreto para o fortalecimento da educação municipal.`

        }),
        new Estatistica({
            alegria: -7,
            educacao: -6,
            meioAmbiente: -4,
            tituloNoticia: "Corte em investimento educacional gera críticas na rede municipal de ensino",
            noticia: `A decisão da prefeitura de não adotar o novo material didático para a rede pública municipal de ensino gerou reações negativas entre educadores e famílias. A medida foi vista como um retrocesso na busca por uma educação mais equitativa e moderna.

		Professores relatam dificuldades em manter a qualidade do ensino com os recursos atuais, considerados defasados e desconectados das diretrizes da BNCC. Pais e responsáveis demonstraram preocupação com o impacto direto na aprendizagem dos alunos.

		Especialistas apontam que a falta de atualização dos materiais compromete o desenvolvimento educacional e amplia desigualdades no acesso ao conhecimento.`

        }),
    ),

    new Proposta("Prefeitura Lança Aplicativo de Transporte aos Domingos",
        `Em consonância com os princípios da mobilidade urbana sustentável previstos na Lei Federal nº 12.587/2012 (Política Nacional de Mobilidade Urbana), e com fundamento na função social do transporte público, a Prefeitura Municipal, por meio da Secretaria de Mobilidade e Inovação, lança oficialmente o Aplicativo 'Domingo Livre', plataforma digital que garantirá transporte gratuito aos domingos para todos os cidadãos cadastrados.
        
        A iniciativa visa promover o direito de ir e vir com dignidade, reduzir a exclusão social, estimular o uso de espaços públicos de lazer, cultura e esporte, além de contribuir com a diminuição do tráfego de veículos particulares e da emissão de gases poluentes.
        
        O serviço, de caráter experimental durante os primeiros seis meses, abrangerá as principais rotas urbanas e contará com veículos acessíveis, frota monitorada por GPS e atendimento prioritário em regiões de maior vulnerabilidade social, conforme estudos técnicos realizados pelos setores competentes.

        A gratuidade será operacionalizada mediante cadastro prévio no aplicativo, disponível para dispositivos móveis com sistemas Android e iOS, e a operação seguirá normas de segurança, eficiência e acessibilidade, em consonância com os princípios da administração pública.

        Custo: 4000 reais.
        Vereador Mr. Cuca.`,

        new Estatistica({
            dinheiro: -4000,
            saude: 3,
            alegria: 6,
            meioAmbiente: 4,
            infraestrutura: 10,
            tituloNoticia: "Aplicativo 'Domingo Livre' promove transporte gratuito e incentiva mobilidade sustentável",
            noticia: `A Prefeitura lançou o aplicativo 'Domingo Livre', garantindo transporte gratuito aos domingos para toda a população cadastrada. A iniciativa busca facilitar o acesso a espaços de lazer, cultura e esporte, além de reduzir o uso de veículos particulares e a emissão de poluentes.

		O serviço experimental, com frota acessível e monitorada por GPS, tem foco nas regiões de maior vulnerabilidade social. A população recebeu bem a novidade, que alia tecnologia e inclusão social, fortalecendo a mobilidade urbana sustentável.

		Especialistas destacam que a ação está alinhada com a Política Nacional de Mobilidade Urbana e reforça o compromisso do município com o meio ambiente e o bem-estar dos cidadãos.`

        }),
        new Estatistica({
            alegria: -5,
            infraestrutura: -7,
            meioAmbiente: -6,
            saude: -3,
            tituloNoticia: "População crítica diminuição do transporte gratuito aos domingos",
            noticia: `A decisão de não implementar o aplicativo 'Domingo Livre' foi recebida com insatisfação por muitos moradores, que viam no serviço uma forma de garantir acesso facilitado a lazer e cultura nos domingos.

		Usuários relataram preocupação com o aumento do uso de veículos particulares e o impacto negativo no meio ambiente. A ausência do serviço também afeta diretamente moradores das regiões menos assistidas pelo transporte público.

		Organizações e especialistas alertam para a importância da mobilidade urbana sustentável e criticam a prefeitura pela falta de iniciativas que promovam a inclusão social e a redução da poluição.`

        }),
    ),

    new Proposta("Projeto 'Município iluminado': Iluminação LED em 100% das Comunidades até o Fim do Ano",
        `No âmbito das competências  municipais previstas no art. 30, inciso I, da Constituição Federal, e visando à promoção do bem-estar social, à segurança urbana e à eficiência energética, a Prefeitura Municipal propõe, por meio do Projeto 'Município Iluminado', a substituição integral do atual sistema de iluminação pública convencional por luminárias dotadas de tecnologia LED em 100% das comunidades locais até o encerramento do presente exercício fiscal.
    
        Tal medida objetiva a redução significativa do consumo de energia elétrica, a diminuição dos índices de criminalidade mediante a ampliação da visibilidade noturna, e o aprimoramento da qualidade de vida da população residente em regiões historicamente negligenciadas por políticas públicas de infraestrutura urbana.
        
        A execução do projeto observará os princípios da legalidade, eficiência e economicidade, sendo priorizadas as áreas com maior déficit de iluminação e maior vulnerabilidade social, conforme mapeamento técnico realizado pelas secretarias competentes.
        
        Custo: 5000.
        Vereador Retificador de onda completa com filtro capacitivo.`,

        new Estatistica({
            dinheiro: -5000,
            alegria: 7,
            seguranca: 6,
            infraestrutura: 12,
            meioAmbiente: 3,
            tituloNoticia: "Município atinge 100% de cobertura com iluminação LED e melhora segurança",
            noticia: `A Prefeitura concluiu a instalação de iluminação pública com tecnologia LED em todas as comunidades do município. O Projeto 'Município Iluminado' trouxe melhorias significativas na segurança urbana, qualidade de vida e eficiência energética.

		Moradores relataram aumento da sensação de segurança e valorização dos espaços públicos durante o período noturno. A substituição das antigas lâmpadas contribuiu ainda para a redução no consumo de energia, gerando economia a longo prazo.

		Especialistas destacam que a medida fortalece o compromisso da gestão com infraestrutura moderna, inclusão social e sustentabilidade.`

        }),
        new Estatistica({
            alegria: -10,
            seguranca: -6,
            infraestrutura: -9,
            tituloNoticia: "Falta de investimento em iluminação pública gera insegurança em comunidades",
            noticia: `A decisão da prefeitura de não executar o Projeto 'Município Iluminado' foi alvo de críticas por parte da população e de entidades de segurança pública. Moradores das regiões mais vulneráveis relataram sensação de abandono e aumento da insegurança à noite.

		A ausência de melhorias na iluminação pública compromete o uso dos espaços urbanos no período noturno e dificulta ações de prevenção à criminalidade. Comunidades mais carentes, que seriam as principais beneficiadas, manifestaram frustração com a falta de ação.

		A oposição acusa a gestão de negligenciar políticas de infraestrutura e segurança, deixando de promover uma medida que traria benefícios diretos à população.`

        }),
    ),

    new Proposta("Proposta para a construção de uma praça pública no Bairro Freitas",
        `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Por meio da presente, propomos a construção de uma praça pública no Bairro Freitas, com o intuito de promover o bem-estar social e melhorar a qualidade de vida dos munícipes, especialmente dos idosos. O espaço atenderá à demanda de áreas para lazer, descanso e atividades de baixo impacto físico, além de fomentar a convivência comunitária.

        A implantação dessa praça contribuirá para a revitalização urbana, a inclusão social e a promoção da saúde preventiva. A obra trará, também, benefícios para a qualidade de vida geral da população, promovendo o convívio intergeracional e a valorização do patrimônio público.

        Diante do exposto, solicitamos a inclusão do projeto no planejamento do Município, com a devida previsão orçamentária.

        Custo: 3800 reais
        Vereador Dr. Giuseppe Camolle.`,

        new Estatistica({
            dinheiro: -3800,
            alegria: 7,
            saude: 6,
            infraestutura: 6,
            economia: 3,
            tituloNoticia: "Nova praça no Bairro Freitas promove bem-estar e revitalização urbana",
            noticia: `A Prefeitura iniciou as obras da nova praça pública no Bairro Freitas, atendendo a uma antiga demanda dos moradores. O espaço contará com áreas de convivência, bancos, jardins e infraestrutura adequada para idosos e atividades de lazer.

		Moradores comemoraram a iniciativa, que deve melhorar a qualidade de vida, promover a saúde preventiva e fortalecer os laços comunitários. Especialistas destacam o impacto positivo da praça na valorização do bairro e na inclusão social.

		A construção está dentro do planejamento orçamentário e é vista como um avanço importante na política de bem-estar urbano do município.`

        }),
        new Estatistica({
            alegria: -5,
            infraestutura: -5,
            economia: -5,
            infraestrutura: -4,
            tituloNoticia: "Moradores do Bairro Freitas lamentam recusa de proposta para construção de praça",
            noticia: `A proposta de construção de uma praça pública no Bairro Freitas foi recusada pela gestão municipal, gerando frustração entre os moradores da região. A comunidade esperava o novo espaço como forma de lazer, saúde e valorização do bairro.

		A ausência da praça mantém o déficit de áreas de convivência na região, impactando especialmente idosos e crianças, que carecem de espaços adequados para atividades ao ar livre.

		Lideranças locais criticaram a decisão, afirmando que o projeto traria benefícios sociais significativos com investimento considerado viável dentro do orçamento público.`

        }),

    ),
    new Proposta("Proposta para a construção de um hospital público municipal",
        `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Vimos por meio desta propor a construção de um hospital público municipal, com o objetivo de ampliar o atendimento médico de qualidade à população. A implantação deste equipamento de saúde visa atender à crescente demanda por serviços médicos e melhorar a eficiência dos atendimentos, especialmente nas áreas de urgência e especialidades.

        A construção do hospital proporcionará a redução das filas de espera, aumento da capacidade de atendimento e melhoria nas condições de saúde da população, promovendo o acesso a cuidados médicos adequados e dignos para todos.

        Solicitamos a inclusão deste projeto no planejamento orçamentário municipal e a análise para sua viabilização.

        Custo: 6000 reais
        Vereador Dr. Giuseppe Camolle.`,

        new Estatistica({
            dinheiro: -6000,
            saude: 12,
            alegria: 6,
            meioAmbiente: -3,
            economia: 4,
            infraestutura: 8,
            populacao: 1.03,
            tituloNoticia: "Hospital público municipal começa a ser construído e promete transformar a saúde local",
            noticia: `A Prefeitura deu início à construção do tão aguardado hospital público municipal, uma obra que visa ampliar o acesso da população a serviços de saúde de qualidade e reduzir a superlotação nas unidades já existentes.

		A iniciativa foi bem recebida pelos moradores, que celebraram o investimento como um marco histórico para o município. O novo hospital contará com setores de urgência, especialidades médicas e geração de empregos diretos e indiretos.

		Especialistas da área da saúde afirmam que a obra representa um salto na infraestrutura médica e no atendimento digno à população, refletindo o compromisso da gestão com o bem-estar coletivo.`

        }),
        new Estatistica({
            meioAmbiente: 6,
            saude: -8,
            alegria: -8,
            economia: -4,
            infraestrutura: -5,
            tituloNoticia: "População critica recusa da proposta de construção de hospital público municipal",
            noticia: `A decisão da Prefeitura de não aprovar a construção de um hospital público municipal gerou forte repercussão negativa entre moradores, especialistas e lideranças comunitárias.

		Com o crescimento da demanda por atendimento médico, a ausência do novo hospital manterá a sobrecarga nas unidades existentes e o prolongamento das filas de espera por serviços de saúde especializados.

		Representantes da sociedade civil apontam que a recusa representa uma oportunidade perdida de melhorar a qualidade de vida da população, gerar empregos e garantir o direito básico à saúde.`

        }),

    ),

    new Proposta("Proposta para a implementação de um projeto EJA (educação de jovens e adultos)",
        `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Propomos a criação de um Projeto de Educação de Jovens e Adultos (EJA), com o intuito de proporcionar educação de qualidade aos cidadãos que não tiveram a oportunidade de concluir seus estudos na idade regular. O projeto visa atender às necessidades educacionais dessa população, promovendo sua inclusão social e melhorando suas condições de empregabilidade.

        A proposta inclui a oferta de cursos de Ensino Fundamental e Médio, com metodologias adaptadas, acessíveis a todos, inclusive às pessoas com deficiência. O projeto será desenvolvido em parceria com as Secretarias Municipais de Educação e Assistência Social, com apoio de educadores qualificados.

        Solicitamos a aprovação deste projeto e sua inclusão no planejamento orçamentário do Município.

        Custo: 4000 reais.
        Vereador Dayvyd Lavaniery.`,

        new Estatistica({
            dinheiro: -4000,
            alegria: 4,
            educacao: 8,
            seguranca: 5,
            economia: 6,
            tituloNoticia: "Prefeitura lança projeto EJA e amplia acesso à educação para adultos",
            noticia: `A Prefeitura anunciou o início do projeto de Educação de Jovens e Adultos (EJA), voltado a pessoas que não concluíram os estudos na idade apropriada. A medida visa promover inclusão social, aumentar a empregabilidade e reduzir desigualdades educacionais no município.

		O projeto oferecerá cursos do Ensino Fundamental e Médio, com metodologia adaptada, profissionais capacitados e estrutura inclusiva para atender diferentes perfis da população.

		A iniciativa foi elogiada por educadores e líderes comunitários como um passo importante na promoção da cidadania, no combate ao analfabetismo e na valorização do direito à educação.`

        }),
        new Estatistica({
            alegria: -1,
            seguranca: -4,
            educacao: -8,
            economia: -7,
            tituloNoticia: "Município adia projeto EJA e adultos continuam sem acesso à educação básica",
            noticia: `A proposta de criação do projeto de Educação de Jovens e Adultos (EJA) foi recusada pela gestão municipal, frustrando expectativas de moradores que aguardavam a oportunidade de voltar a estudar.

		A ausência do programa mantém adultos e idosos em situação de vulnerabilidade educacional, dificultando o acesso a empregos melhores e à cidadania plena.

		Especialistas e entidades educacionais criticaram a decisão, afirmando que a falta de políticas inclusivas reforça desigualdades sociais e compromete o desenvolvimento humano da população.`

        }),

    ),

    new Proposta("Proposta para o aumento da oferta de emprego de oficiais de segurança pública no município",
        `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Vimos por meio desta, apresentar a proposta para o aumento da oferta de empregos para oficiais da segurança pública em nosso Município, com o objetivo de fortalecer o efetivo da Guarda Municipal e melhorar a segurança da população.

        O aumento de vagas para oficiais de segurança é fundamental para garantir uma presença maior nas ruas, aumentar a eficácia no combate à criminalidade e melhorar a resposta da segurança pública às necessidades da comunidade. A ampliação do número de oficiais permitirá maior patrulhamento, apoio a eventos públicos e uma atuação mais eficaz nas áreas de prevenção e repressão de crimes.

        A proposta inclui a contratação de profissionais qualificados, com o devido treinamento, além da promoção de ações voltadas ao bem-estar dos servidores da segurança pública. Tal medida contribuirá diretamente para a sensação de segurança da população e para a melhoria da qualidade de vida no Município.

        Solicitamos a inclusão desta proposta no planejamento orçamentário municipal e a análise das possibilidades de viabilização dessa ação, com base nas necessidades de segurança e na capacidade de gestão do Município.
    
        Custo: 4600 reais.
        Vereador Abacate da Sombrinha.`,

        new Estatistica({
            dinheiro: -3700,
            alegria: 8,
            seguranca: 12,
            economia: 6,
            tituloNoticia: "Prefeitura amplia efetivo da segurança pública e população sente maior proteção",
            noticia: `A Prefeitura iniciou a contratação de novos oficiais da segurança pública como parte do plano de reforço ao efetivo da Guarda Municipal. A medida tem como objetivo ampliar o patrulhamento, garantir mais segurança e gerar empregos no setor.

		Moradores já relatam maior presença de agentes nas ruas e redução de pequenos delitos em algumas regiões da cidade. A contratação foi comemorada como um avanço no combate à criminalidade e na prevenção de violência.

		Além do impacto direto na segurança, a iniciativa também contribui para a geração de empregos e valorização do serviço público de proteção à população.`

        }),
        new Estatistica({
            alegria: -8,
            seguranca: -8,
            economia: -4,
            tituloNoticia: "Insegurança aumenta após recusa em reforçar efetivo da Guarda Municipal",
            noticia: `A proposta para aumentar o número de oficiais da segurança pública foi rejeitada pela administração municipal, provocando reações negativas de moradores e representantes comunitários.

		A falta de reforço no patrulhamento tem causado preocupação crescente, com relatos de aumento na sensação de insegurança em bairros mais vulneráveis.

		Lideranças locais criticaram a decisão, afirmando que a recusa ignora a necessidade urgente de fortalecer a segurança pública e gera impactos também no desemprego de profissionais da área.`

        }),
    ),

    new Proposta("Aumento dos impostos sobre anticoncepcionais",
        `Por meio da presente, propomos a análise e possível implementação de medidas tributárias voltadas ao aumento de impostos ou taxas incidentes sobre produtos anticoncepcionais comercializados no âmbito municipal, com o objetivo de incrementar a arrecadação pública e viabilizar novos investimentos em programas de saúde, assistência social e educação familiar.

        Tal medida poderá estimular o debate público sobre o planejamento familiar sob uma ótica educativa, além de abrir espaço para a reavaliação de políticas locais relacionadas à demografia e ao uso de recursos públicos. É importante que a proposta observe os limites da competência tributária municipal, sendo viável, por exemplo, a instituição de taxas regulatórias incidentes sobre serviços que envolvam esses produtos, como clínicas e estabelecimentos privados.

        Diante do exposto, solicitamos a inclusão do tema na pauta de estudos da administração municipal, com a devida análise jurídica e orçamentária.

        Custo: 0 reais.
        Vereador Dr. Tung Tung Tung Sahur.`,
        new Estatistica({
            dinheiro: 4000,
            alegria: -7,
            saude: -5,
            economia: -1,
            imposto: 2,
            populacao: 1.05,
            tituloNoticia: "Prefeitura aprova aumento de impostos sobre anticoncepcionais e gera polêmica",
            noticia: `A administração municipal aprovou a proposta de aumento de impostos sobre produtos anticoncepcionais, com o objetivo de ampliar a arrecadação para programas de saúde e assistência social.

		A medida gerou forte reação popular e foi alvo de críticas de organizações de saúde, que apontam retrocesso no acesso ao planejamento familiar e impacto negativo para mulheres de baixa renda.

		Apesar da polêmica, a Prefeitura argumenta que a arrecadação será revertida em ações educativas e programas sociais voltados à saúde da família.`

        }),
        new Estatistica({
            alegria: 7,
            saude: 6,
            economia: 6,
            populacao: 0.96,
            tituloNoticia: "Município recusa aumento de impostos sobre anticoncepcionais e mantém acesso garantido",
            noticia: `A proposta de aumento de impostos sobre anticoncepcionais foi rejeitada pela Prefeitura, mantendo inalterada a carga tributária desses produtos no âmbito municipal.

		Entidades de saúde e grupos sociais comemoraram a decisão, destacando a importância do acesso democrático aos métodos de planejamento familiar.

		Segundo representantes da administração, a recusa da medida visa proteger direitos reprodutivos e evitar possíveis impactos negativos sobre a população mais vulnerável.`

        })
    ),

    new Proposta("Promoção de feira cultural.",
        `
        Por meio da presente, propomos a realização de uma feira cultural no Município, com o intuito de valorizar a diversidade artística local, incentivar a economia criativa e promover o acesso à cultura por parte da população. O evento contará com apresentações musicais, exposições de arte, gastronomia regional, artesanato, literatura e atividades voltadas ao público de todas as idades.

        A promoção da feira contribuirá para o fortalecimento da identidade cultural do Município, a geração de renda para artistas e pequenos empreendedores locais, além de fomentar o turismo e a ocupação qualificada dos espaços públicos. A ação poderá ser realizada em parceria com escolas, coletivos culturais e instituições da sociedade civil.

        Diante do exposto, solicitamos a inclusão do projeto no calendário oficial de eventos do Município, com a devida previsão orçamentária.

        Custo: 5.000 reais.
        Vereador Dr. Jurandy Egito.`,
        new Estatistica({
            dinheiro: -5000,
            alegria: 8,
            economia: 9,
            educacao: 3,
            populacao: 1.08,
            tituloNoticia: "Feira cultural movimenta cidade e fortalece economia criativa",
            noticia: `A realização da feira cultural promovida pela Prefeitura reuniu milhares de pessoas e destacou a diversidade artística local com apresentações musicais, exposições de arte, gastronomia e artesanato.

		O evento gerou renda para empreendedores locais, fortaleceu a identidade cultural e incentivou a ocupação dos espaços públicos de forma positiva. Representantes da sociedade civil e das escolas participaram ativamente da programação.

		Com grande adesão popular, a feira foi celebrada como um sucesso e já há pedidos para que se torne parte permanente do calendário cultural do Município.`


        }),
        new Estatistica({
            alegria: -7,
            economia: -7,
            educacao: -7,
            populacao: 0.96,
            tituloNoticia: "Proposta de feira cultural é recusada e gera críticas de artistas locais",
            noticia: `A Prefeitura decidiu não aprovar a proposta de realização da feira cultural municipal, alegando limitações orçamentárias e outras prioridades administrativas no momento.

		Artistas, coletivos culturais e empreendedores manifestaram frustração com a decisão, destacando a importância da cultura para a economia local e o fortalecimento dos vínculos sociais.

		Entidades culturais solicitaram que novas propostas sejam avaliadas futuramente com maior abertura ao diálogo e planejamento.`

        })
    ),

    new Proposta("Campanha de doação de sangue",
        `
        Por meio da presente, propomos a realização de uma campanha municipal de doação de sangue, com o objetivo de incentivar a solidariedade entre os munícipes e colaborar com os bancos de sangue da região, especialmente em períodos de baixa nos estoques. A campanha poderá ser promovida em parceria com hemocentros, hospitais e instituições de saúde, contando com postos móveis de coleta em pontos estratégicos da cidade.

        A iniciativa contribuirá significativamente para a promoção da saúde pública, o salvamento de vidas e a conscientização da população quanto à importância da doação regular e responsável de sangue. Além disso, poderá envolver escolas, igrejas, empresas e associações, fortalecendo o engajamento comunitário.

        Diante do exposto, solicitamos o apoio institucional e a inclusão da campanha no cronograma de ações da Secretaria Municipal de Saúde, com a devida previsão orçamentária para materiais de divulgação e estrutura de apoio.

        Custo: 2.500 reais
        Vereador Amazias Zesty.`,
        new Estatistica({
            dinheiro: -2500,
            saude: 10,
            economia: 4,
            populacao: 1.02,
            tituloNoticia: "Campanha de doação de sangue mobiliza cidade e salva vidas",
            noticia: `A campanha de doação de sangue promovida pela Prefeitura teve ampla adesão da população, com pontos móveis de coleta distribuídos em locais estratégicos da cidade.

		A ação contou com a parceria de hemocentros e hospitais, além da participação ativa de escolas, empresas e igrejas, que ajudaram na mobilização e conscientização sobre a importância da doação.

		Autoridades comemoram os resultados, destacando o impacto positivo na saúde pública e o fortalecimento do espírito de solidariedade entre os munícipes.`
        }),
        new Estatistica({
            saude: -7,
            economia: -4,
            populacao: 0.99,
            tituloNoticia: "Prefeitura recusa campanha de doação de sangue e decisão gera repercussão",
            noticia: `A proposta de realização de uma campanha municipal de doação de sangue foi recusada pela administração pública, sob justificativa de limitações orçamentárias e priorização de outras ações.

		A decisão gerou insatisfação entre representantes da saúde, que alertam para a importância de reforçar os estoques em períodos críticos e de fomentar a cultura da doação voluntária.

		Entidades e munícipes pedem que a proposta seja reavaliada, ressaltando o custo relativamente baixo frente aos benefícios à vida e à saúde pública.`
        })
    ),

    new Proposta("Projeto Vacinação 100",
        `
        Por meio da presente, propomos a criação e implementação do Projeto Vacinação 100, com o objetivo de atingir 100% de cobertura vacinal nas principais campanhas de imunização do Município, especialmente entre crianças, idosos e grupos prioritários. A iniciativa prevê ações intensificadas de conscientização, busca ativa, ampliação dos horários de atendimento nas unidades de saúde e realização de mutirões em escolas, centros comunitários e zonas rurais.

        O projeto contribuirá diretamente para a prevenção de doenças, o fortalecimento do Sistema Único de Saúde (SUS) e o cumprimento das metas estabelecidas pelos órgãos de vigilância sanitária. A ampla cobertura vacinal é essencial para a proteção coletiva e a redução de internações e gastos com tratamentos preventivos.

        Diante do exposto, solicitamos a inclusão do Projeto Vacinação 100 no plano de ações da Secretaria Municipal de Saúde, com a devida previsão orçamentária para materiais, pessoal de apoio e campanhas de divulgação.

        Custo: 4.300 reais.
        Vereador Dr. Monkey D. Alberto.`,
        new Estatistica({
            dinheiro: -4300,
            saude: 12,
            infraestrutura: 5,
            populacao: 1.08,
            tituloNoticia: "Município alcança recorde de cobertura vacinal com o Projeto Vacinação 100",
            noticia: `Com ações coordenadas e intensivas de mobilização, o Projeto Vacinação 100 atingiu sua meta de cobrir 100% do público-alvo nas principais campanhas de imunização.

		Mutirões foram realizados em escolas, centros comunitários e regiões rurais, ampliando o acesso à vacinação e fortalecendo a confiança da população nas políticas de saúde pública.

		Profissionais da saúde destacam que a ampla cobertura vacinal ajudará a prevenir surtos, reduzir internações e proteger os grupos mais vulneráveis.`
        }),
        new Estatistica({
            saude: -9,
            infraestrutura: -6,
            populacao: 0.94,
            tituloNoticia: "Município deixa de implementar projeto de vacinação ampla e preocupa especialistas",
            noticia: `A proposta do Projeto Vacinação 100, que previa estratégias para alcançar cobertura vacinal total no Município, foi rejeitada pela administração municipal.

		A decisão gerou críticas por parte de especialistas e profissionais da saúde, que alertam para os riscos do declínio vacinal e possíveis surtos de doenças já controladas.

		Entidades da sociedade civil pedem a reavaliação da medida, lembrando que a imunização em massa é uma das formas mais eficazes e econômicas de preservar vidas.`
        })
    ),

    new Proposta("Formação de policiais",
        `
        Por meio da presente, propomos a criação de um programa municipal de apoio à formação e capacitação continuada de policiais, com foco na valorização profissional, no aprimoramento das técnicas de segurança pública e na promoção de um policiamento mais próximo, humanizado e eficaz. O programa poderá incluir cursos de aperfeiçoamento, oficinas de mediação de conflitos, treinamentos operacionais, além de palestras sobre direitos humanos e atendimento ao cidadão.

        Essa iniciativa contribuirá para o fortalecimento da segurança no Município, o aumento da confiança da população nas forças de segurança e a melhoria na prevenção e resposta a ocorrências. Além disso, fomentará a integração entre a Guarda Municipal (quando existente), as polícias estaduais e a comunidade.

        Diante do exposto, solicitamos a inclusão do programa no planejamento estratégico da área de segurança pública, com a devida previsão orçamentária.

        Custo: 4.800 reais.
        Vereador Natsuki Subaru.`,
        new Estatistica({
            dinheiro: -4800,
            seguranca: 12,
            educacao: 7,
            alegria: 6,
            populacao: 1.02,
            tituloNoticia: "Município investe em capacitação policial e melhora sensação de segurança",
            noticia: `Com o lançamento do programa de formação e capacitação continuada para policiais, a cidade deu um passo importante na valorização das forças de segurança.

		O treinamento incluiu oficinas de mediação de conflitos, cursos de direitos humanos e técnicas operacionais, aproximando a polícia da comunidade.

		Moradores relatam maior confiança nos agentes e percebem melhoria na abordagem policial e no combate à criminalidade.`

        }),
        new Estatistica({
            seguranca: -9,
            educacao: -4,
            alegria: -5,
            populacao: 0.96,
            tituloNoticia: "Formação policial continuada é deixada de lado e preocupa especialistas",
            noticia: `A proposta que previa o investimento em capacitação e valorização profissional dos policiais foi rejeitada pelo Município.

		Sindicatos e especialistas em segurança pública alertam para o impacto negativo da decisão, destacando que a falta de treinamento contínuo compromete a eficácia do policiamento.

		Moradores expressam preocupação com a ausência de iniciativas que promovam um policiamento mais humanizado e preparado.`

        })
    ),

    new Proposta("Jogos escolares municipais.",
        `
        Por meio da presente, propomos a realização dos Jogos Escolares Municipais, com o objetivo de promover a integração entre os estudantes da rede pública e privada, incentivar a prática esportiva desde a infância e fortalecer valores como disciplina, trabalho em equipe e respeito. As competições poderão abranger diversas modalidades, como futebol, vôlei, atletismo, xadrez e queimada, sendo realizadas em espaços esportivos do Município e com apoio das escolas locais.

        O evento contribuirá para a melhoria da saúde física e mental dos alunos, o combate ao sedentarismo e o surgimento de novos talentos esportivos. Além disso, fortalecerá o sentimento de pertencimento e identidade entre as instituições de ensino, promovendo o desenvolvimento educacional de forma integral.

        Diante do exposto, solicitamos a inclusão dos Jogos Escolares no calendário oficial do Município, com a devida previsão orçamentária para transporte, premiações, materiais esportivos e estrutura de apoio.

        Custo: 2900 reais.
        Vereador Zé ninguém.`,
        new Estatistica({
            dinheiro: -2900,
            alegria: 8,
            saude: 5,
            educacao: 5,
            tituloNoticia: "Jogos Escolares Municipais promovem esporte e integração entre estudantes",
            noticia: `Com a realização dos Jogos Escolares Municipais, a cidade celebrou a integração entre estudantes da rede pública e privada.

		As competições envolveram modalidades diversas como futebol, vôlei e atletismo, promovendo saúde, disciplina e trabalho em equipe.

		Participantes e educadores destacam o fortalecimento dos valores esportivos e o surgimento de novos talentos.`

        }),
        new Estatistica({
            alegria: -7,
            educacao: -3,
            saude: -5,
            tituloNoticia: "Jogos Escolares Municipais são rejeitados e preocupam comunidade escolar",
            noticia: `A proposta para realização dos Jogos Escolares Municipais foi recusada pelo Município, gerando insatisfação entre estudantes e educadores.

		Especialistas alertam que a falta do evento pode impactar negativamente a saúde física e mental dos alunos, além de prejudicar a formação integral e o espírito de equipe.

		A comunidade escolar cobra uma nova avaliação para retomar a iniciativa no futuro.`

        })
    ),

    new Proposta("Incentivo ao turismo",
        `Por meio da presente, propomos a implementação de um programa municipal de incentivo ao turismo, com o objetivo de valorizar os atrativos naturais, culturais, históricos e gastronômicos do Município, promovendo o desenvolvimento econômico sustentável e a geração de emprego e renda. A proposta inclui a criação de roteiros turísticos, capacitação de guias locais, apoio a eventos culturais e a divulgação das potencialidades turísticas por meio de materiais promocionais e plataformas digitais.

        A iniciativa contribuirá para o fortalecimento da identidade local, o aumento da circulação de visitantes e o estímulo ao comércio, à hotelaria e à produção artesanal. Além disso, poderá atrair investimentos e fomentar o sentimento de pertencimento e orgulho da população com relação ao seu território.

        Diante do exposto, solicitamos a inclusão do projeto no planejamento estratégico do Município, com a devida previsão orçamentária.

        Custo: 5500 reais (possível lucro).
        Vereador Alguém debaixo do fogão.`,
        new Estatistica({
            dinheiro: (Math.random() * -5500) + 4500,
            economia: 9,
            populacao: 1.14,
            tituloNoticia: "Município lança programa de incentivo ao turismo e aquece a economia local",
            noticia: `Com o lançamento do programa municipal de incentivo ao turismo, o Município visa valorizar seus atrativos naturais, culturais e históricos, fortalecendo a economia local.

		O projeto inclui roteiros turísticos, capacitação de guias e apoio a eventos culturais, aumentando a circulação de visitantes e gerando emprego e renda.

		Comerciantes e moradores celebram o impacto positivo na geração de oportunidades e no fortalecimento da identidade local.`

        }),
        new Estatistica({
            meioAmbiente: 7,
            economia: -7,
            populacao: 0.96,
            tituloNoticia: "Proposta de incentivo ao turismo é rejeitada e preocupa setores econômicos",
            noticia: `A proposta para implementação de um programa municipal de incentivo ao turismo foi rejeitada, gerando apreensão em setores ligados ao comércio, hotelaria e cultura.

		Especialistas alertam que a ausência de ações para atrair visitantes pode comprometer o desenvolvimento econômico sustentável do Município.

		A população manifesta preocupação com a perda de oportunidades para geração de emprego e valorização da identidade local.`

        })
    ),

    new Proposta("Conversa com o presidente sobre a construção de um Instituto Federal no município",
        `
        Por meio da presente, propomos a articulação institucional com a Presidência da República e o Ministério da Educação, visando à construção de um Instituto Federal de Educação, Ciência e Tecnologia em nosso Município. A instalação de uma unidade do IF proporcionará ensino técnico e superior de qualidade, gratuito e inclusivo, atendendo à juventude local e regional, e promovendo desenvolvimento social e econômico sustentável.

        A presença de um Instituto Federal impulsionará a formação de mão de obra qualificada, incentivará a inovação, criará oportunidades de pesquisa e ampliará o acesso ao ensino público de excelência. Além disso, representará um marco no avanço educacional do Município, gerando impactos positivos duradouros em toda a comunidade.

        Diante do exposto, solicitamos o apoio do Executivo Municipal para a formalização de um pedido oficial à Presidência da República, incluindo a disponibilização de terreno adequado e a inserção do projeto nas prioridades do Município.

        Custo: 8000 (parte municipal).
        Vereador Chapolin Colorado.`,
        new Estatistica({
            dinheiro: -8000,
            educacao: 15,
            economia: 8,
            infraestrutura: 15,
            meioAmbiente: -7,
            tituloNoticia: "Município avança em parceria para construção de Instituto Federal",
            noticia: `O Executivo Municipal formalizou um pedido oficial à Presidência da República para a instalação de um Instituto Federal de Educação, Ciência e Tecnologia no Município.

        A iniciativa, apoiada pela Prefeitura e vereadores, visa oferecer ensino técnico e superior gratuito, impulsionando o desenvolvimento social, econômico e educacional da região.

        O projeto também prevê a disponibilização de terreno e infraestrutura adequada para viabilizar a implantação da unidade.`

        }),
        new Estatistica({
            educacao: -8,
            infraestrutura: -8,
            alegria: -10,
            meioAmbiente: 8,
            tituloNoticia: "Projeto para Instituto Federal é rejeitado e gera debate na comunidade",
            noticia: `A proposta para a construção de um Instituto Federal no Município foi rejeitada no planejamento orçamentário, gerando preocupações entre estudantes, educadores e setores da sociedade civil.

        Especialistas alertam que a decisão pode retardar o avanço educacional e limitar oportunidades de formação técnica e superior para a população local.

        O diálogo segue aberto para futuras discussões sobre o tema.`

        })
    ),

    new Proposta("Palestra para a população",
        `
        Por meio da presente, propomos a realização de uma palestra aberta à população, com o objetivo de promover informação, conscientização e diálogo sobre temas de interesse público, como saúde, cidadania, meio ambiente, educação financeira, entre outros. O evento poderá ser conduzido por especialistas convidados e ocorrer em espaços públicos como escolas, praças ou auditórios municipais, com acesso gratuito e ampla divulgação.

        Essa iniciativa contribuirá para o fortalecimento da participação cidadã, a valorização do conhecimento e a construção de uma sociedade mais informada e engajada com as questões coletivas. Além disso, pode servir como instrumento de prevenção, orientação e promoção do bem-estar social.

        Diante do exposto, solicitamos a inclusão da atividade no calendário de eventos do Município, com a devida previsão orçamentária para estrutura, som, material gráfico e apoio logístico.

        Custo: 1.000 reais.
        Vereador Dr. Benício Fonteiras.`,
        new Estatistica({
            dinheiro: -1000,
            alegria: 2,
            economia: 2,
            educacao: 2,
            saude: 2,
            seguranca: 2,
            infraestrutura: 2,
            meioAmbiente: 2,
            tituloNoticia: "Município promove palestra para fortalecer cidadania e educação",
            noticia: `Por meio de palestra aberta à população, o Município incentivou a participação cidadã e o diálogo sobre temas importantes como saúde, meio ambiente e educação financeira.

		O evento gratuito, realizado em espaços públicos, contou com especialistas convidados e ampla divulgação, promovendo conscientização e bem-estar social.

		A iniciativa foi bem recebida e vista como importante instrumento de orientação e engajamento da comunidade.`

        }),
        new Estatistica({
            alegria: -4,
            economia: -1,
            educacao: -1,
            saude: -1,
            seguranca: -1,
            infraestrutura: -1,
            meioAmbiente: -1,
            tituloNoticia: "Palestra para a população é cancelada e gera insatisfação",
            noticia: `A proposta de realização de palestra aberta à população não foi aprovada, causando preocupação entre educadores e líderes comunitários.

		O cancelamento da iniciativa prejudica ações de conscientização e diálogo sobre temas relevantes para a cidadania e a educação local.

		A comunidade demonstra insatisfação diante da falta de investimentos em eventos que promovam o conhecimento e o engajamento social.`

        })
    ),

    new Proposta("Formação de médicos e enfermeiros",
        `
        Por meio da presente, propomos a criação de um programa municipal de apoio à formação de médicos e enfermeiros, com o objetivo de incentivar a qualificação de profissionais da saúde e suprir a demanda crescente por atendimento de qualidade na rede pública. A proposta inclui parcerias com instituições de ensino, concessão de bolsas de estudo, estágios supervisionados na rede municipal e ações de capacitação continuada para profissionais já atuantes.

        Essa iniciativa contribuirá para o fortalecimento do sistema de saúde local, a valorização da carreira pública na área da saúde e a formação de profissionais comprometidos com as necessidades da população. A médio e longo prazo, o programa poderá reduzir a rotatividade de profissionais e elevar os índices de qualidade no atendimento básico e especializado.

        Diante do exposto, solicitamos a inclusão do projeto no plano de governo municipal, com a devida previsão orçamentária.
        
        Custo: 5400 reais.
        Vereador Edson Isaac.`,
        new Estatistica({
            dinheiro: -5400,
            saude: 10,
            populacao: 1.04,
            economia: 8,
            educacao: 8,
            tituloNoticia: "Município investe na formação de médicos e enfermeiros para melhorar saúde pública",
            noticia: `Com a aprovação do programa municipal de formação e capacitação para médicos e enfermeiros, a cidade aposta na qualificação profissional para melhorar o atendimento na rede pública.

		A iniciativa prevê bolsas de estudo, estágios supervisionados e capacitação continuada, visando reduzir a rotatividade e elevar a qualidade dos serviços de saúde.

		A população já percebe avanços no atendimento básico e especializado, fortalecendo o sistema de saúde local.`

        }),
        new Estatistica({
            saude: -8,
            populacao: 0.97,
            economia: -7,
            educacao: -7,
            tituloNoticia: "Projeto de formação para profissionais da saúde é rejeitado e preocupa especialistas",
            noticia: `A proposta para criação de programa de formação continuada para médicos e enfermeiros foi recusada pela administração municipal.

		Especialistas alertam para o impacto negativo dessa decisão na qualidade do atendimento público e na rotatividade dos profissionais.

		A população manifesta preocupação com a falta de investimento em capacitação, essencial para garantir saúde pública eficiente e humanizada.`

        })
    ),

    new Proposta("Curso de inglês",
        `
        Por meio da presente, propomos a criação e oferta de um curso de inglês gratuito para a população, com foco em jovens, estudantes da rede pública e trabalhadores que buscam ampliar suas oportunidades profissionais. As aulas poderão ser realizadas em escolas municipais, centros culturais ou espaços comunitários, com turmas organizadas por faixa etária e nível de conhecimento, ministradas por professores qualificados.

        A iniciativa contribuirá para o desenvolvimento educacional e profissional dos munícipes, preparando-os melhor para o mercado de trabalho, concursos e intercâmbios, além de incentivar o aprendizado contínuo e a valorização da educação como ferramenta de transformação social.

        Diante do exposto, solicitamos a inclusão do curso no planejamento educacional do Município, com a devida previsão orçamentária para material didático, remuneração de instrutores e estrutura de apoio.

        Custo: 2.300 reais.
        Vereador Real Slim Shady.`,
        new Estatistica({
            dinheiro: -2300,
            educacao: 8,
            economia: 4,
            populacao: 1.03,
            tituloNoticia: "Curso gratuito de inglês é ofertado para a população",
            noticia: `Por meio da iniciativa da Prefeitura, foi lançado um curso gratuito de inglês voltado para jovens, estudantes da rede pública e trabalhadores.

		O curso é ministrado por professores qualificados e ocorre em escolas e centros culturais, visando ampliar oportunidades profissionais e incentivar a educação contínua.

		A população tem reagido positivamente, destacando o impacto na preparação para o mercado de trabalho e intercâmbios.`

        }),
        new Estatistica({
            educacao: -6,
            alegria: -4,
            economia: -3,
            tituloNoticia: "Curso de inglês gratuito enfrenta críticas e cortes",
            noticia: `Apesar da proposta para ampliar o ensino de inglês gratuito, o programa sofreu cortes orçamentários que comprometem sua continuidade.

		Especialistas alertam para os riscos da interrupção, que pode prejudicar o desenvolvimento educacional e reduzir as oportunidades para jovens e trabalhadores.

		A comunidade educativa manifesta preocupação com a falta de investimentos na educação básica e profissionalizante.`

        })
    ),

    new Proposta("Aumento de imposto geral",
        `
        Por meio da presente, propomos a abertura de estudos técnicos e jurídicos para a revisão e possível aumento de impostos municipais gerais, com o objetivo de fortalecer a arrecadação pública e garantir recursos suficientes para a manutenção e ampliação de serviços essenciais à população, como saúde, educação, infraestrutura e assistência social. A medida poderá contemplar a atualização de alíquotas do IPTU, ISS, taxas municipais e demais tributos dentro da competência legal do Município.

        A proposta visa garantir equilíbrio fiscal, ampliar investimentos públicos e reduzir a dependência de repasses externos, sempre observando os princípios da razoabilidade, justiça tributária e capacidade contributiva. Recomenda-se que eventuais reajustes sejam precedidos de diálogo com a sociedade e acompanhados de medidas de transparência e compensação social.

        Diante do exposto, solicitamos que o tema seja incluído na pauta de planejamento financeiro e legislativo do Município, com a devida previsão de impacto orçamentário.

        Custo: Nenhum (medida arrecadatória).
        Vereador Taxad de Imposteira.`,
        new Estatistica({
            imposto: 4,
            alegria: -15,
            economia: -14,
            dinheiro: 5000,
            tituloNoticia: "Município planeja aumento de impostos para fortalecer serviços públicos",
            noticia: `Foi proposta a revisão e possível aumento dos impostos municipais gerais, visando garantir recursos para saúde, educação, infraestrutura e assistência social.

		Estudos técnicos e jurídicos serão realizados, com diálogo previsto junto à população, para assegurar equilíbrio fiscal e justiça tributária.

		Autoridades destacam a importância da medida para ampliar investimentos públicos e reduzir a dependência de repasses externos.`

        }),
        new Estatistica({
            alegria: 14,
            economia: 14,
            tituloNoticia: "Reajuste de impostos municipais provoca protestos e preocupação social",
            noticia: `A proposta de aumento dos impostos gerais no Município gerou insatisfação entre moradores e setores produtivos, que temem impactos negativos na economia local.

		Críticas apontam para a elevada carga tributária e o efeito sobre o poder de compra das famílias, além do risco de redução da atividade econômica.

		Especialistas alertam para a necessidade de alternativas menos onerosas e maior transparência na gestão dos recursos públicos.`

        })
    ),

    new Proposta("Incentivo a agricultura de batatas",
        `
        Por meio da presente, propomos a criação de um programa municipal de incentivo à agricultura de batatas, com o objetivo de fortalecer a produção local, diversificar a economia agrícola e gerar emprego e renda para os pequenos e médios produtores rurais. A iniciativa poderá incluir apoio técnico, distribuição de sementes selecionadas, capacitação dos agricultores, fomento à mecanização e acesso facilitado a linhas de crédito rural.

        A medida contribuirá para o desenvolvimento do setor agrícola, o aumento da produtividade e a valorização dos produtos da agricultura familiar. Além disso, poderá fomentar a agroindústria e abrir novas possibilidades de comercialização no mercado interno e regional.

        Diante do exposto, solicitamos a inclusão do programa no planejamento da Secretaria Municipal de Agricultura, com a devida previsão orçamentária.

        Custo: 3.200 reais.
        Vereador Mr. Potato Batatas.`,
        new Estatistica({
            dinheiro: -3200,
            meioAmbiente: 6,
            economia: 9,
            populacao: 1.04,
            tituloNoticia: "Município investe em programa de incentivo à agricultura de batatas",
            noticia: `Por meio da criação do programa municipal de incentivo à agricultura de batatas, a cidade fortalece a produção local e fomenta a economia agrícola.

		O programa oferece apoio técnico, capacitação, sementes selecionadas e facilidades de crédito aos produtores, gerando emprego e renda.

		A iniciativa é vista com otimismo pelos agricultores, que esperam aumento da produtividade e novas oportunidades comerciais.`

        }),
        new Estatistica({
            meioAmbiente: -7,
            economia: -7,
            populacao: 0.98,
            tituloNoticia: "Proposta de incentivo à agricultura de batatas é rejeitada e gera preocupação",
            noticia: `A proposta de criação de um programa de incentivo à agricultura de batatas foi recusada pela administração municipal.

		Produtores rurais e especialistas alertam que a decisão pode comprometer o desenvolvimento da agricultura familiar e o fortalecimento da economia local.

		O cenário preocupa pela possível queda na produtividade e aumento do desemprego na zona rural.`

        }),
    ),

    new Proposta("Revitalização de centro histórico com Espaços Culturais e Feiras de Artesanato",
        `
        Nos termos do art. 216 da Constituição Federal, que reconhece como patrimônio cultural brasileiro os bens de natureza material e imaterial tomados individualmente ou em conjunto, a Prefeitura Municipal, por meio da Secretaria de Cultura e Urbanismo, institui o Plano de Revitalização do Centro Histórico, com o objetivo de promover a recuperação estrutural, urbanística e funcional da região central do município, integrando ações de valorização cultural e incentivo à economia criativa.

        O projeto prevê a restauração de edificações históricas, a criação de espaços culturais de uso comunitário (galerias, salas de oficinas, teatros de bolso), e a institucionalização de feiras permanentes de artesanato e gastronomia regional, em conformidade com as diretrizes de proteção ao patrimônio histórico e de desenvolvimento socioeconômico sustentável.

        Além de preservar a memória arquitetônica da cidade, a iniciativa estimulará a geração de emprego e renda por meio do fomento à produção artesanal, ao turismo local e à ocupação qualificada do espaço público, priorizando a inclusão de artistas, artesãos e empreendedores locais.

        O plano será executado com base em estudos técnicos e audiências públicas, respeitando os princípios da participação popular, da função social da cidade e da gestão democrática do território urbano, conforme previsto no Estatuto da Cidade (Lei nº 10.257/2001).
        

        Custo: 4000 reais.
        Vereadora Hatsune miku.
        `,
        new Estatistica({
            dinheiro: -2000,
            alegria: 9,
            infraestrutura: 8,
            economia: 8,
            tituloNoticia: "Revitalização do centro histórico impulsiona cultura e economia local",
            noticia: `O Plano de Revitalização do Centro Histórico trouxe nova vida à região, com restauração de prédios históricos, criação de espaços culturais e feiras permanentes de artesanato e gastronomia.

		A iniciativa tem gerado emprego, valorizado artistas locais e atraído turistas, fortalecendo a economia criativa e promovendo o orgulho pela memória arquitetônica da cidade.

		A população demonstra satisfação com as melhorias na infraestrutura e o aumento das oportunidades culturais e econômicas.`

        }),
        new Estatistica({
            alegria: -2,
            economia: -6,
            infraestrutura: -12,
            tituloNoticia: "População crítica à revitalização do centro histórico por impacto econômico e social",
            noticia: `O projeto de revitalização do centro histórico gerou críticas por parte de moradores e comerciantes que apontam impactos negativos na economia local e na rotina da população.

		Custos elevados e alterações no espaço urbano têm causado insatisfação, além da percepção de que o projeto não atende às necessidades de todos os segmentos sociais.

		Surgem debates sobre a necessidade de maior diálogo e ajustes para garantir benefícios mais equilibrados para a comunidade.`

        }),
    ),

    new Proposta("Cobrança de Estacionamento em Vias Públicas da Zona Urbana", `
        
        Com fundamento no art. 24, inciso I, da Constituição Federal e na Lei Federal nº 9.503/1997 (Código de Trânsito Brasileiro), a Prefeitura Municipal institui, por meio de decreto, a Zona Municipal de Estacionamento Regulamentado (ZMER), que estabelece a cobrança de tarifas para uso de vagas em vias públicas localizadas na área urbana central e em pontos de grande fluxo comercial.

        A medida tem por objetivo disciplinar o uso do espaço público, reduzir a rotatividade indevida de veículos e coibir o estacionamento prolongado em áreas de alta demanda, promovendo a democratização do acesso ao estacionamento urbano. A arrecadação será destinada à manutenção da infraestrutura viária, sinalização e investimentos em mobilidade urbana.

        A tarifa inicial será definida por ato normativo complementar e cobrada por meio de parquímetros ou aplicativo oficial da Prefeitura. O não pagamento implicará em autuação administrativa e aplicação de sanções previstas no Código de Trânsito.

        Embora a medida possa gerar desconforto inicial entre os usuários, a Administração Pública reforça que se trata de ação planejada com base em estudos técnicos, visando à melhoria da mobilidade e da equidade no uso do solo urbano.

        Custo: nenhum (arrecadatório).
        Vereador Xandão.
        
        `,

        new Estatistica({
            dinheiro: 2500,
            imposto: 2,
            alegria: -15,
            economia: -12,
            tituloNoticia: "Prefeitura institui cobrança em estacionamentos públicos para melhorar mobilidade",
            noticia: `A Prefeitura Municipal anunciou a criação da Zona Municipal de Estacionamento Regulamentado (ZMER), com cobrança de tarifas para vagas em áreas centrais e de grande fluxo comercial.

		Objetivando disciplinar o uso do espaço público e garantir maior rotatividade, a medida prevê arrecadação para investimentos em infraestrutura viária e mobilidade urbana.

		Apesar do desconforto inicial, a ação visa promover a equidade no uso do solo e melhorar a mobilidade na cidade, com respaldo em estudos técnicos.`

        }),
        new Estatistica({
            alegria: 15,
            economia: 12,
            tituloNoticia: "População crítica à cobrança de estacionamento público na zona urbana",
            noticia: `A recente implementação da Zona Municipal de Estacionamento Regulamentado gerou insatisfação entre os usuários, que apontam perda de conforto e aumento de custos no dia a dia.

		Críticas também destacam o impacto negativo na alegria da população, mesmo com possíveis ganhos em segurança.

		Moradores e comerciantes pedem revisão e diálogo para equilibrar os interesses envolvidos.`

        }),
    ),

    new Proposta("Prefeitura Instala Bibliotecas Comunitárias em Bairros Periféricos para Incentivar a Leitura e a Convivência Social", `
        
        Em conformidade com os princípios previstos no art. 205 da Constituição Federal e na Lei nº 9.394/1996 (Lei de Diretrizes e Bases da Educação Nacional), a Prefeitura Municipal, por meio da Secretaria de Educação e Cultura, institui o Programa “Leitura para Todos”, que visa à implantação de bibliotecas comunitárias em bairros periféricos e zonas de vulnerabilidade social.

        O objetivo da iniciativa é ampliar o acesso gratuito ao livro e à leitura, promover a inclusão cultural e estimular a formação cidadã por meio de atividades literárias, rodas de leitura, oficinas de escrita e projetos com autores locais.

        As bibliotecas serão instaladas em espaços públicos adaptados — como centros comunitários, praças e escolas em contraturno — e contarão com acervos diversificados, acesso à internet e ambientes acolhedores para estudo, lazer e convivência.
        
        A ação reflete o compromisso da Administração Pública com a valorização da cultura, a redução das desigualdades educacionais e o fortalecimento da cidadania por meio do acesso democrático ao conhecimento.

        Custo: 6000 reais.
        Vereador Pedão.
        
        `,
        new Estatistica({
            dinheiro: -6000,
            economia: 5,
            educacao: 8,
            alegria: 9,
            infraestrutura: 11,
            tituloNoticia: "Programa 'Leitura para Todos' amplia acesso à cultura em bairros periféricos",
            noticia: `A Prefeitura Municipal, por meio do Programa "Leitura para Todos", implantou bibliotecas comunitárias em bairros periféricos, promovendo o acesso gratuito a livros, atividades literárias e convivência social.

		As novas bibliotecas contam com ambientes acolhedores, acervos diversificados e acesso à internet, fortalecendo a educação, a cultura e a inclusão social na comunidade.

		Essa iniciativa reafirma o compromisso com a valorização cultural e a redução das desigualdades educacionais no município.`

        }),
        new Estatistica({
            alegria: -6,
            educacao: -8,
            economia: -8,
            infraestrutura: -8,
            tituloNoticia: "Críticas ao programa de bibliotecas comunitárias por impacto nos recursos e infraestrutura",
            noticia: `Apesar dos benefícios culturais esperados, a implantação do Programa "Leitura para Todos" enfrenta críticas devido ao alto custo e impacto negativo na infraestrutura local.

		Moradores e setores da comunidade apontam que a iniciativa gerou sobrecarga em espaços públicos e dificuldades na manutenção, além de preocupações com a alocação dos recursos públicos.

		Debates sobre ajustes e melhorias são esperados para equilibrar os benefícios com a gestão eficiente dos recursos.`

        }),
    ),

    new Proposta("Atendimento Noturno suspenso em Unidades de Saúde Secundárias por Tempo Indeterminado", `
            
        Em razão de restrições orçamentárias enfrentadas no exercício fiscal corrente e em conformidade com o princípio da responsabilidade fiscal estabelecido pela Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal), a Prefeitura Municipal, por meio da Secretaria de Saúde, informa a suspensão temporária do atendimento noturno em unidades de saúde de porte secundário, a partir do próximo mês.

        A medida tem caráter emergencial e visa à readequação da alocação de recursos humanos e financeiros, priorizando o funcionamento pleno das unidades de pronto atendimento (UPAs) e hospitais de maior complexidade, cuja demanda crítica se mantém crescente.

        Estão garantidos os atendimentos diurnos regulares, inclusive consultas agendadas, vacinação, assistência materno-infantil e serviços de vigilância epidemiológica. Casos urgentes deverão ser direcionados, exclusivamente, às unidades de referência hospitalar.

        A Administração Municipal reconhece os transtornos que a decisão poderá causar, mas reforça seu compromisso com a continuidade dos serviços essenciais, transparência na gestão pública e adoção de medidas compensatórias assim que o cenário financeiro permitir.

        Custo: nenhum (Suspensão de serviços públicos).
        Vereadora Hatsune miku.`,

        new Estatistica({
            alegria: -15,
            dinheiro: 5000,
            saude: -10,
            populacao: 0.97,
            tituloNoticia: "Suspensão do atendimento noturno em unidades secundárias de saúde",
            noticia: `Devido a restrições orçamentárias, a Prefeitura suspendeu temporariamente o atendimento noturno nas unidades de saúde secundárias, priorizando os serviços essenciais em UPAs e hospitais.

		A medida visa reorganizar recursos para garantir a continuidade dos atendimentos diurnos e emergenciais, apesar dos transtornos temporários para a população.

		A administração reforça o compromisso com a saúde pública e o retorno dos serviços assim que possível.`

        }),
        new Estatistica({
            alegria: 18,
            saude: 12,
            tituloNoticia: "População lamenta suspensão do atendimento noturno em unidades de saúde",
            noticia: `A suspensão do atendimento noturno em unidades de saúde secundárias tem causado insatisfação entre munícipes, que enfrentam dificuldades para acesso a serviços fora do horário comercial.

		A queda na qualidade do atendimento e o impacto negativo na saúde pública são motivo de preocupação e protestos.

		A comunidade clama por soluções que minimizem os prejuízos causados pela medida emergencial.`

        }),

    ),

    new Proposta("Programa Municipal de Estímulo à Atividade Econômica e à Inovação", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Vimos, por meio desta, apresentar proposta voltada à instituição de programa de incentivos fiscais com o objetivo de fomentar o desenvolvimento econômico e social do nosso Município, mediante a atração de empresas, a geração de empregos e o fortalecimento da arrecadação local.

        A concessão de incentivos fiscais, devidamente regulamentada em conformidade com a legislação vigente, poderá incluir a isenção ou redução de tributos municipais, como o ISSQN, o IPTU e taxas específicas, por prazo determinado e mediante critérios objetivos, tais como a criação de postos de trabalho, o investimento em infraestrutura local e o respeito à legislação ambiental e urbanística.

        A adoção desta medida visa tornar o Município mais competitivo e atrativo para a instalação de empreendimentos produtivos, promovendo a diversificação da economia local, o aumento da renda da população e o crescimento sustentável da cidade.

        Solicitamos, assim, a análise desta proposta e a possibilidade de sua inclusão no planejamento orçamentário e estratégico do Município, de modo a viabilizar a criação de um marco legal que proporcione segurança jurídica e estímulo ao setor produtivo, contribuindo para o progresso social e econômico de nossa comunidade.
        
        Custo: 0 (redução de impostos).
        Vereador Manga Mangas.`,

        new Estatistica({
            dinheiro: 4000,
            meioAmbiente: -10,
            economia: 10,
            infraestrutura: 10,
            imposto: -2,
            populacao: 1.05,
            tituloNoticia: "Prefeitura lança programa de incentivos fiscais para estimular economia local",
            noticia: `O município aprovou hoje o Programa Municipal de Estímulo à Atividade Econômica, oferecendo reduções fiscais para empresas que se instalarem na região.

		A medida visa atrair novos negócios, gerar empregos e diversificar a base econômica da cidade, com benefícios como redução de ISSQN e IPTU para empresas que cumprirem metas de contratação.

		Especialistas projetam que o programa pode aumentar em 15% a atividade econômica e reduzir o desemprego em 2% nos próximos meses.`
        }),
        new Estatistica({
            meioAmbiente: 7,
            infraestrutura: -8,
            economia: -5,
            imposto: 2,
            tituloNoticia: "Prefeitura rejeita proposta de incentivos fiscais para empresas",
            noticia: `A administração municipal decidiu não implementar o programa de incentivos fiscais para empresas, alegando preocupações com a arrecadação.

		Economistas alertam que a decisão pode levar a uma redução de 5% na atividade econômica local e dificultar a atração de novos negócios para a região.

		Vereadores da oposição criticaram a medida, argumentando que perdemos uma oportunidade de gerar empregos e modernizar nossa infraestrutura empresarial.`
        })
    ),

    new Proposta("Criação da Casa do Empreendedor", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Vimos, por meio desta, apresentar proposta para a criação da Casa do Empreendedor, um espaço de atendimento unificado voltado ao suporte e à orientação de empreendedores locais, especialmente microempreendedores individuais (MEIs), pequenos empresários e trabalhadores informais em processo de formalização.

        A proposta visa concentrar, em um único local, serviços essenciais como abertura de empresas, emissão de alvarás, orientação tributária, cadastro em programas de crédito, capacitação em gestão e suporte para regularização fiscal. A iniciativa também pode contar com parcerias com o SEBRAE, instituições bancárias e entidades de classe.

        A Casa do Empreendedor contribuirá para a desburocratização do ambiente de negócios, o estímulo à formalização, o aumento da arrecadação própria e a geração de empregos. Com apoio técnico e estrutura adequada, o Município poderá se tornar referência regional em ambiente favorável ao empreendedorismo.

        Solicitamos a viabilidade da proposta no planejamento estratégico municipal, com eventual destinação de espaço físico e equipe técnica multidisciplinar.
        
        custo: 3800.
        Vereador Tales elementar.`,

        new Estatistica({
            dinheiro: -3800,
            infraestrutura: 8,
            meioAmbiente: -4,
            populacao: 1.02,
            economia: 8,
            tituloNoticia: "Prefeitura inaugura Casa do Empreendedor para apoiar pequenos negócios",
            noticia: `Foi inaugurada hoje a Casa do Empreendedor, espaço que reúne todos os serviços necessários para abertura e gestão de pequenos negócios em um só local.

		O novo centro oferecerá desde orientação tributária até cadastro em programas de crédito, com atendimento especializado para microempreendedores e trabalhadores informais.

		A iniciativa promete simplificar a vida dos empresários locais e impulsionar a economia do município através do fortalecimento dos pequenos negócios.`
        }),
        new Estatistica({
            infraestrutura: -6,
            meioAmbiente: 4,
            economia: -7,
            populacao: 0.98,
            tituloNoticia: "Projeto da Casa do Empreendedor é rejeitado pela prefeitura",
            noticia: `A administração municipal decidiu não implementar o projeto da Casa do Empreendedor, alegando restrições orçamentárias.

		A decisão foi recebida com frustração por pequenos empresários, que perderão a oportunidade de contar com um espaço unificado de atendimento e orientação.

		Especialistas alertam que a falta de apoio ao empreendedorismo local pode dificultar a formalização de negócios e o crescimento econômico da região.`
        })
    ),

    new Proposta("Fechamento Temporário de Creches em Reformas Gera Reorganização de Matrículas", `
        
        Com fundamento no art. 208, inciso IV, da Constituição Federal, bem como nos preceitos estabelecidos pela Lei nº 9.394/1996 (Lei de Diretrizes e Bases da Educação Nacional) e pelo Estatuto da Criança e do Adolescente (Lei nº 8.069/1990), a Prefeitura Municipal, por intermédio da Secretaria Municipal de Educação, torna pública a interdição temporária de quatro unidades de educação infantil, em razão da constatação de irregularidades estruturais que comprometem a segurança física dos alunos, profissionais e colaboradores.

        As referidas interdições decorrem de laudos técnicos emitidos por engenheiros credenciados junto ao Município, cujos relatórios apontam a necessidade urgente de obras de reforço e readequação predial, conforme normativas técnicas da ABNT e diretrizes da Defesa Civil.

        Durante o período das intervenções, estimado em até 180 (cento e oitenta) dias corridos, as matrículas ativas serão redistribuídas provisoriamente para unidades próximas, observando-se critérios de zoneamento, acessibilidade e disponibilidade de vagas, conforme normatização expedida por resolução interna da Secretaria.

        Os responsáveis legais pelos estudantes serão devidamente notificados e assistidos por equipe pedagógica e social, com vistas à manutenção do vínculo educacional, à mitigação de impactos logísticos e à garantia do direito à educação conforme previsto no ordenamento jurídico vigente.

        A Administração Municipal reafirma seu compromisso com a qualidade do ensino e a segurança da comunidade escolar, e reforça que as obras ora iniciadas constituem medida preventiva e imprescindível à continuidade das políticas públicas educacionais no Município.
        
        Custo: nenhum (Suspensão de serviços públicos).
        Vereador juão malandro.
        
        `,
        new Estatistica({
            dinheiro: 3000,
            infraestrutura: 6,
            alegria: -12,
            educacao: -4,
            populacao: 0.99,
            tituloNoticia: "Creches municipais são interditadas para reformas emergenciais",
            noticia: `A prefeitura anunciou hoje o fechamento temporário de quatro unidades de educação infantil devido a problemas estruturais identificados em vistorias técnicas. As creches permanecerão fechadas por aproximadamente seis meses para a realização de obras de adequação e reforço predial.

		Durante este período, todas as crianças matriculadas serão realocadas para outras unidades educacionais próximas, garantindo a continuidade do atendimento educacional. A secretaria de educação está organizando um esquema especial de transporte e acolhimento para minimizar os impactos nas famílias afetadas.

		Especialistas em educação infantil destacam a importância das reformas para garantir a segurança das crianças, mas alertam para os possíveis transtornos na rotina das famílias e no desenvolvimento pedagógico dos alunos durante o período de transição entre as unidades escolares.`
        }),
        new Estatistica({
            alegria: 14,
            educacao: 4,
            infraestrutura: -6,
            tituloNoticia: "Prefeitura mantém creches abertas após revisão de laudos técnicos",
            noticia: `Após reavaliação dos laudos técnicos e amplo debate com a comunidade escolar, a administração municipal decidiu manter abertas as creches que estariam previstas para reforma.

		A decisão levou em consideração os impactos sociais da realocação das crianças e a possibilidade de realizar as melhorias necessárias de forma escalonada, sem interromper o atendimento. Um cronograma alternativo de obras será implementado nos finais de semana e períodos de recesso escolar.

		Pais e educadores comemoraram a decisão, que preserva a rotina das crianças enquanto ainda garante a realização das melhorias necessárias na infraestrutura das unidades de ensino infantil.`
        }),

    ),

    new Proposta("Cancelamento do Carnaval Oficial por Motivos de Contenção de Despesas", `
        
        Considerando o disposto nos arts. 1º e 70 da Constituição Federal, que preveem a moralidade e a eficiência como princípios da administração pública, e em observância ao art. 1º da Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal), a Prefeitura Municipal comunica, por meio de decreto publicado em edição extraordinária do Diário Oficial, a suspensão da realização do Carnaval Oficial.

        A medida, de natureza excepcional e temporária, decorre da análise do cenário fiscal municipal, que aponta significativa redução na arrecadação corrente líquida e elevação de despesas obrigatórias com saúde, educação e custeio administrativo essencial. Diante disso, a Administração optou por priorizar a alocação de recursos em áreas consideradas de maior impacto social e urgência estrutural.

        A decisão foi tomada após consulta aos órgãos de controle interno, análise da Procuradoria Geral do Município e parecer técnico da Secretaria Municipal de Finanças, que apontaram risco de comprometimento da meta de resultado primário, caso fossem mantidos os contratos e repasses destinados ao evento.
        
        O Município ressalta que eventos culturais independentes, realizados por iniciativa privada ou por entidades civis, poderão ser autorizados mediante requerimento formal e observância das exigências legais, sem oneração ao erário público.

        A Prefeitura reafirma seu compromisso com a gestão responsável dos recursos públicos e reconhece o valor simbólico e econômico do Carnaval, destacando que a medida adotada visa assegurar o equilíbrio fiscal e a continuidade dos serviços públicos essenciais à população.
        
        Custo: nenhum (Suspensão de um evento).
        Vereador: micro faraday.
        `,
        new Estatistica({
            dinheiro: 6000,
            alegria: -25,
            seguranca: 8,
            meioAmbiente: 8,
            saude: 8,
            economia: -20,
            tituloNoticia: "Prefeitura anuncia cancelamento do Carnaval oficial para contenção de gastos",
            noticia: `Em decisão polêmica, a administração municipal decretou o cancelamento do Carnaval oficial deste ano, alegando necessidade de contenção de despesas e priorização de serviços essenciais. A medida economizará milhões que seriam destinados à estruturação dos blocos e eventos oficiais.

		O prefeito destacou que a decisão foi tomada após análise minuciosa das contas públicas, que mostraram déficit em setores prioritários como saúde e educação. Enquanto isso, a oposição critica a medida, alegando impacto negativo no turismo e na economia local.

		Comerciantes e trabalhadores do setor de eventos manifestaram preocupação com a perda de renda durante o período que tradicionalmente movimenta a economia da cidade. A prefeitura prometeu criar um programa emergencial para amenizar os impactos nos profissionais afetados.`
        }),
        new Estatistica({
            alegria: 20,
            saude: -6,
            seguranca: -6,
            meioAmbiente: -9,
            economia: 20,
            tituloNoticia: "Carnaval será mantido apesar de pressão por cortes orçamentários",
            noticia: `Após intenso debate, a prefeitura recuou da proposta de cancelar o Carnaval oficial e garantiu a realização do evento com orçamento reduzido. A decisão foi comemorada por foliões e trabalhadores do setor de eventos.

		O prefeito afirmou que encontrou alternativas para equilibrar as contas sem sacrificar a tradição carnavalesca da cidade. No entanto, especialistas alertam para possíveis impactos nos serviços de saúde e segurança durante o período de festividades.

		O comércio e a hotelaria já registram aumento na procura por hospedagem e produtos carnavalescos, indicando que o evento deve movimentar significativamente a economia local, gerando empregos temporários e renda para diversos setores.`
        }),
    ),

    new Proposta("Projeto de Educação Sexual nas Escolas para Reduzir Gravidez na Adolescência", `
        
        Nos termos do disposto no art. 205 da Constituição Federal, que estabelece a educação como direito de todos e dever do Estado, bem como em conformidade com os arts. 3º e 14 da Lei nº 9.394/1996 (Lei de Diretrizes e Bases da Educação Nacional) e com as diretrizes da Lei nº 8.069/1990 (Estatuto da Criança e do Adolescente), a Prefeitura Municipal, por meio da Secretaria Municipal de Educação, em parceria com a Secretaria Municipal de Saúde, institui o Projeto “Conhecer para Cuidar”, com foco na promoção da educação sexual, da saúde reprodutiva e da prevenção à gravidez na adolescência.

        O projeto será implementado de forma transversal no currículo do Ensino Fundamental, a partir do 8º ano, com o apoio de equipe multidisciplinar composta por pedagogos, psicólogos, assistentes sociais e profissionais de saúde capacitados, garantindo o respeito aos princípios da dignidade da pessoa humana, da pluralidade de ideias e da proteção integral ao adolescente.

        A iniciativa visa proporcionar formação crítica, informativa e preventiva, respeitando os valores familiares, a liberdade de consciência e a maturidade do público-alvo, conforme previsto nas diretrizes da Política Nacional de Atenção Integral à Saúde de Adolescentes e Jovens.

        As atividades serão desenvolvidas por meio de aulas, rodas de conversa, materiais didáticos próprios e ações intersetoriais, assegurando ampla participação da comunidade escolar, com direito à informação prévia às famílias e possibilidade de acompanhamento dos conteúdos ministrados.

        A Administração Municipal reafirma, por meio desta política pública, seu compromisso com a formação cidadã, a prevenção de vulnerabilidades sociais e a promoção da saúde integral dos adolescentes matriculados na rede pública de ensino.

        Custo: 3700 reais.
        Vereador Batatão.`,

        new Estatistica({
            dinheiro: -3700,
            saude: 8,
            alegria: 2,
            educacao: 6,
            populacao: 0.95,
            tituloNoticia: "Prefeitura implementa projeto pioneiro de educação sexual nas escolas",
            noticia: `O município lançou hoje o projeto "Conhecer para Cuidar", um programa abrangente de educação sexual que será ministrado nas escolas públicas a partir do 8º ano. A iniciativa visa reduzir os índices de gravidez na adolescência através de informação qualificada.

		Desenvolvido por equipe multidisciplinar, o programa abordará temas como saúde reprodutiva, prevenção e relações interpessoais, respeitando os valores familiares e a maturidade dos estudantes. Professores receberam capacitação especial para lidar com o tema de forma adequada a cada faixa etária.

		Especialistas em educação e saúde pública elogiaram a iniciativa, destacando que a informação científica é a melhor ferramenta para prevenir problemas como gravidez precoce e doenças sexualmente transmissíveis entre adolescentes.`
        }),
        new Estatistica({
            saude: -9,
            educacao: -4,
            populacao: 1.05,
            tituloNoticia: "Projeto de educação sexual é rejeitado após polêmica",
            noticia: `A proposta de implementar educação sexual nas escolas foi arquivada após intenso debate na câmara municipal. Grupos conservadores alegaram que o tema deveria ser tratado exclusivamente no âmbito familiar.

		A decisão gerou preocupação entre profissionais de saúde, que alertam para o aumento nos casos de gravidez na adolescência e doenças sexualmente transmissíveis. Escolas relataram dificuldade em abordar o tema sem diretrizes claras da secretaria de educação.

		Estudos mostram que municípios sem programas estruturados de educação sexual apresentam índices até 40% maiores de gravidez precoce, sobrecarregando o sistema público de saúde e aumentando a evasão escolar entre adolescentes.`
        }),

    ),

    new Proposta("Implantação de Programa de Reforço Escolar no Contraturno", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Apresentamos a proposta de implantação de um Programa Municipal de Reforço Escolar no Contraturno, com foco em estudantes da rede pública municipal que apresentem dificuldades no processo de aprendizagem, especialmente nas disciplinas de base como Língua Portuguesa e Matemática.

        A iniciativa visa oferecer aulas de reforço em horário alternativo ao período regular, contribuindo para a elevação do desempenho escolar, a correção de defasagens de aprendizagem e a prevenção da evasão escolar, especialmente em comunidades vulneráveis.

        O programa poderá ser executado com profissionais da rede municipal, inclusive com bolsas ou gratificações para professores atuantes, e pode incluir atividades lúdicas, apoio psicopedagógico e merenda escolar durante o período complementar.

        Solicitamos a inclusão dessa proposta na agenda de prioridades da Secretaria Municipal de Educação, com previsão orçamentária e avaliação técnica de sua implementação por etapas.
        
        Custo: 2400 reais.
        Vereador Pitbul raivoso.
        `,

        new Estatistica({
            dinheiro: -2400,
            alegria: 3,
            educacao: 7,
            economia: 5,
            tituloNoticia: "Prefeitura lança programa inovador de reforço escolar no contraturno",
            noticia: `A rede municipal de ensino ganhará um reforço importante com a implantação de aulas complementares no período inverso ao das aulas regulares. O programa visa atender estudantes com dificuldades de aprendizagem em português e matemática.

		Professores selecionados receberão capacitação específica para trabalhar com metodologias diferenciadas que ajudem a superar as defasagens educacionais. Cada aluno terá um plano de estudos personalizado conforme suas necessidades identificadas.

		A iniciativa inclui ainda merenda escolar no período do contraturno e acompanhamento psicopedagógico, criando um ambiente acolhedor que incentive a permanência dos estudantes na escola e melhore seus resultados acadêmicos.`
        }),
        new Estatistica({
            educacao: -8,
            economia: -4,
            tituloNoticia: "Projeto de reforço escolar é rejeitado por falta de verba",
            noticia: `A proposta de implementar aulas de reforço no contraturno das escolas municipais foi arquivada pela prefeitura, que alegou restrições orçamentárias para custear a iniciativa neste momento.

		Educadores expressaram preocupação com o impacto da decisão, principalmente nos alunos com maior dificuldade de aprendizagem. Sem o apoio extra, muitos estudantes podem continuar acumulando defasagens que prejudicam seu desenvolvimento escolar.

		Associações de pais lamentaram a perda da oportunidade de melhorar o rendimento dos filhos, especialmente em disciplinas fundamentais como português e matemática, que são base para todas as outras áreas do conhecimento.`
        }),
    ),

    new Proposta("Criação do Edital Municipal de Fomento à Produção Cultural Local", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Sugerimos a criação do Edital Municipal de Fomento à Produção Cultural, com a finalidade de apoiar financeiramente projetos culturais de artistas, coletivos e produtores locais em áreas como música, teatro, dança, audiovisual, literatura, cultura afro-brasileira, indígena e popular.

        A proposta visa estimular a produção artística regional, promover a inclusão cultural, gerar oportunidades de trabalho no setor criativo e fomentar a identidade cultural do Município. O edital poderá funcionar com critérios transparentes, chamamento público, avaliação técnica e repasse de recursos via premiações ou bolsas de incentivo.

        Recursos do orçamento da cultura, da Lei Paulo Gustavo, Lei Aldir Blanc ou convênios estaduais/federais podem ser utilizados para a execução da política.

        Recomendamos a criação de uma comissão específica para regulamentar e operacionalizar o edital, com apoio da Secretaria Municipal de Cultura e participação da sociedade civil.
        
        Custo: 3600 reais
        Vereadora Aparecida.`,

        new Estatistica({
            dinheiro: -3600,
            economia: 10,
            alegria: 8,
            infraestrutura: 3,
            tituloNoticia: "Prefeitura lança edital inédito para fomentar a cultura local",
            noticia: `Artistas e produtores culturais da cidade ganharam um importante incentivo com o lançamento do Edital Municipal de Fomento à Produção Cultural. A iniciativa vai destinar recursos para projetos em diversas áreas artísticas, valorizando a criatividade local.

		O edital contemplará desde manifestações tradicionais até expressões contemporâneas, com atenção especial para culturas afro-brasileiras, indígenas e populares. Uma comissão mista formada por gestores públicos e representantes da sociedade civil será responsável pela seleção dos projetos.

		Especialistas destacam que o programa vai aquecer a economia criativa, gerar empregos no setor cultural e fortalecer a identidade artística do município, além de democratizar o acesso aos recursos públicos para a cultura.`
        }),
        new Estatistica({
            alegria: -7,
            economia: -8,
            infraestrutura: -3,
            tituloNoticia: "Projeto de incentivo à cultura é arquivado na prefeitura",
            noticia: `A proposta de criar um edital municipal para fomentar a produção cultural local foi rejeitada pela administração pública, que alegou priorizar outras áreas no momento. A decisão desanimou artistas e coletivos culturais da cidade.

		Sem o apoio prometido, muitos projetos artísticos que dependiam do financiamento público terão dificuldades para se concretizar. Representantes do setor cultural alertam para o risco de êxodo de talentos para cidades vizinhas que oferecem melhores condições.

		A oposição criticou a decisão, argumentando que o investimento em cultura gera retorno econômico e social, além de ser fundamental para a preservação das tradições locais e formação de novas plateias.`
        }),

    ),

    new Proposta("Criação do projeto 'Esporte para Todos'", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Propomos a criação do Programa Municipal “Esporte para Todos”, voltado à oferta gratuita de atividades físicas e esportivas em praças, escolas e centros comunitários do Município, prioritariamente para crianças, adolescentes, pessoas com deficiência e idosos.

        A proposta visa promover a saúde preventiva, a convivência comunitária, a inclusão social e o combate à vulnerabilidade, por meio de modalidades esportivas como futebol, vôlei, basquete, ginástica funcional, caminhada orientada, capoeira, entre outras.

        O programa poderá ser desenvolvido com profissionais de educação física da rede pública, estagiários de cursos de graduação conveniados, e monitores comunitários, com bolsas de incentivo. Também sugerimos a inclusão de ações itinerantes nos bairros e a realização de campeonatos interbairros.

        Solicitamos análise da proposta por parte da Secretaria Municipal de Esportes e sua integração com ações de juventude, saúde e assistência social.
        
        Custo: 1800 reais.
        Vereador Mennino ney`,

        new Estatistica({
            dinheiro: -1800,
            alegria: 4,
            saude: 4,
            economia: 4,
            tituloNoticia: "Prefeitura lança programa 'Esporte para Todos' com atividades gratuitas",
            noticia: `A administração municipal anunciou hoje o início do programa "Esporte para Todos", que oferecerá atividades físicas e esportivas gratuitas em diversos pontos da cidade. A iniciativa visa promover saúde, inclusão social e qualidade de vida para todas as idades.

		Serão oferecidas modalidades como futebol, vôlei, basquete e ginástica, com turmas especiais para pessoas com deficiência e idosos. As aulas serão ministradas por profissionais de educação física em praças, escolas e centros comunitários.

		O programa também prevê a realização de campeonatos interbairros e atividades itinerantes, criando oportunidades de integração social e descoberta de novos talentos esportivos em comunidades carentes.`
        }),
        new Estatistica({
            saúde: -3,
            alegria: -3,
            economia: -3,
            tituloNoticia: "Projeto de esporte comunitário é rejeitado por falta de verba",
            noticia: `A proposta de criar um programa municipal de esportes gratuitos foi arquivada pela prefeitura, que alegou restrições orçamentárias. A decisão frustrou expectativas de muitas famílias que dependiam de iniciativas públicas para atividades esportivas.

		Especialistas em saúde pública lamentaram a decisão, destacando que programas como este ajudam a prevenir doenças, combater a obesidade e afastar jovens da criminalidade. Sem o projeto, muitas crianças ficarão sem opções de lazer saudável no contraturno escolar.

		Moradores de bairros periféricos criticaram a priorização de outras áreas, argumentando que o esporte é ferramenta fundamental para transformação social e redução da violência em comunidades vulneráveis.`
        }),
    ),

    new Proposta("Reajuste na tarifa de energia", `
        
        Nos termos da legislação vigente, em especial a Lei nº 8.987/1995 (Lei das Concessões e Permissões) e as diretrizes estabelecidas pela agência reguladora competente, a Prefeitura Municipal comunica à população o reajuste tarifário médio de 8,2% nas contas de energia elétrica, a ser aplicado a partir do próximo ciclo de faturamento.

        A medida decorre da necessidade de recomposição dos custos operacionais da concessionária responsável pela distribuição de energia elétrica no território municipal, considerando os aumentos registrados nos insumos, a necessidade de manutenção e modernização da rede elétrica, e os impactos financeiros acumulados desde o último reajuste autorizado.

        A revisão tarifária encontra respaldo contratual e normativo, visando à continuidade dos serviços públicos essenciais, à eficiência na prestação e à sustentabilidade econômica da operação.

        A Prefeitura reitera seu compromisso com a transparência, responsabilidade fiscal e a proteção dos direitos fundamentais dos cidadãos, ao tempo em que busca garantir a prestação adequada e contínua dos serviços essenciais à população.
        
        Custo: nenhum (Ganho com mais impostos).
        Vereador Caixista Xbox.

        `,
        new Estatistica({
            dinheiro: 4000,
            alegria: -12,
            infraestutura: 7,
            economia: -10,
            imposto: 3,
            populacao: 0.99,
            tituloNoticia: "Prefeitura anuncia reajuste de 8,2% na tarifa de energia elétrica",
            noticia: `A administração municipal confirmou hoje o aumento de 8,2% nas contas de luz, que entrará em vigor no próximo mês. Segundo a prefeitura, o reajuste é necessário para cobrir os custos de manutenção e modernização da rede elétrica.

		O aumento vem em um momento de preocupação com a inflação e deve impactar principalmente famílias de baixa renda e pequenos comerciantes. A prefeitura alega que o reajuste foi aprovado pela agência reguladora e ajudará a evitar problemas no fornecimento de energia.

		Economistas alertam que o aumento na conta de luz pode pressionar ainda mais o orçamento doméstico, especialmente em lares que já enfrentam dificuldades financeiras após a pandemia.`
        }),
        new Estatistica({
            alegria: 14,
            economia: 8,
            infraestrutura: -2,
            tituloNoticia: "Prefeitura recua e mantém tarifa de energia sem reajuste",
            noticia: `Após forte pressão popular, a administração municipal decidiu não autorizar o aumento de 8,2% nas tarifas de energia elétrica que estava previsto. A decisão foi comemorada por consumidores e entidades de defesa do consumidor.

		O prefeito afirmou que encontrou alternativas para garantir a manutenção da rede elétrica sem repassar os custos para a população. Especialistas, no entanto, questionam por quanto tempo será possível manter as tarifas congeladas sem comprometer a qualidade do serviço.

		A concessionária de energia expressou preocupação com a decisão, alegando que o congelamento tarifário pode prejudicar investimentos necessários na modernização da infraestrutura elétrica do município.`
        }),

    ),

    new Proposta("Implantar Sistema de Videomonitoramento em Pontos Críticos da Cidade", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,
        
        Esta proposta tem como objetivo ampliar e modernizar as ações de segurança pública no município, por meio da instalação de câmeras de videomonitoramento em locais estratégicos, como entradas e saídas da cidade, praças públicas, escolas, unidades de saúde, centros comerciais, vias com alto fluxo de veículos e áreas com maior incidência de ocorrências policiais.
        
        As imagens captadas serão transmitidas em tempo real para uma central de monitoramento municipal, podendo ser integrada com a Guarda Municipal, a Polícia Militar ou outro órgão de segurança pública, possibilitando uma resposta mais rápida a situações de emergência, delitos e infrações.

        A instalação de sistemas de videomonitoramento tem se mostrado uma ferramenta eficaz na redução de crimes, na prevenção à violência e no apoio à investigação policial.
        
        Além disso, o monitoramento contribui para a organização do trânsito, para a identificação de suspeitos e para o aumento da sensação de segurança da população.
        
        Custo: 4000
        Vereador Credson Tecnologias
        `,

        new Estatistica({
            dinheiro: -4000,
            alegria: 5,
            seguranca: 10,
            infraestrutura: 8,
            tituloNoticia: "Prefeitura implanta sistema de câmeras de segurança em pontos estratégicos da cidade",
            noticia: `A administração municipal anunciou hoje a instalação de um moderno sistema de videomonitoramento em áreas consideradas críticas. As câmeras estarão conectadas a uma central 24 horas que coordenará as ações da Guarda Municipal e Polícia Militar.

		O projeto, que custou R$ 4 mil, promete reduzir significativamente os índices de criminalidade e melhorar a sensação de segurança da população. As primeiras câmeras já estão sendo instaladas em praças públicas, escolas e principais vias de acesso à cidade.

		Especialistas em segurança pública elogiaram a iniciativa, destacando que o monitoramento eletrônico é uma ferramenta comprovadamente eficaz na prevenção e investigação de crimes, além de ajudar no planejamento urbano.`
        }),
        new Estatistica({
            alegria: -6,
            seguranca: -7,
            infraestrutura: -7,
            tituloNoticia: "Projeto de videomonitoramento é rejeitado por questões orçamentárias",
            noticia: `A proposta de instalar câmeras de segurança em pontos críticos da cidade foi arquivada pela prefeitura. A justificativa foi a falta de recursos para custear o sistema, que teria um investimento inicial de R$ 4 mil.

		Moradores expressaram preocupação com a decisão, especialmente em bairros com altos índices de criminalidade. Sem o sistema de monitoramento, a população se sente mais vulnerável a assaltos e outros crimes.

		Especialistas alertam que a falta de investimento em segurança pública pode levar ao aumento da criminalidade e prejudicar o desenvolvimento econômico da cidade, afastando investidores e turistas.`
        }),
    ),

    new Proposta("Implantação de Unidade Penitenciária no Município", `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Vimos, por meio desta, apresentar proposta para a implantação de uma unidade penitenciária em nosso Município, com o objetivo de contribuir para a melhoria do sistema prisional regional, o fortalecimento da segurança pública e a geração de emprego e renda local.

        A construção de um estabelecimento prisional, seja de regime fechado, semiaberto ou misto, poderá atender à crescente demanda por vagas no sistema carcerário estadual, colaborar com o processo de descentralização penitenciária e permitir uma gestão mais eficaz da população carcerária, dentro dos parâmetros constitucionais de dignidade humana, ressocialização e segurança.

        Além de responder a um problema estrutural enfrentado em todo o país, a instalação da unidade poderá representar importante vetor de desenvolvimento socioeconômico local, por meio da criação de empregos diretos e indiretos, atração de recursos federais/estaduais e fortalecimento da cadeia de serviços e fornecedores, como alimentação, transporte, vigilância e manutenção.

        Sugerimos que a Prefeitura manifeste formalmente interesse junto ao Governo do Estado e/ou Departamento Penitenciário Nacional (DEPEN), apresentando áreas públicas viáveis para a construção, com localização adequada em relação à malha viária e afastamento da zona urbana, conforme as diretrizes de segurança, mobilidade e impacto ambiental.

        Adicionalmente, a participação do Município na cessão do terreno, apoio logístico e articulação institucional pode representar um diferencial estratégico para a priorização do projeto em âmbito estadual ou federal.

        Solicitamos, assim, a análise desta proposta por parte do Executivo Municipal, em articulação com as Secretarias de Segurança, Planejamento e Desenvolvimento Urbano, a fim de viabilizar os estudos técnicos necessários e encaminhamentos junto aos entes competentes.
        
        Custo: 6000 reais.
        Vereador Renato Impera.`,

        new Estatistica({
            dinheiro: -6000,
            alegria: 10,
            seguranca: 15,
            infraestrutura: 8,
            populacao: 1.01,
            tituloNoticia: "Prefeitura aprova construção de presídio municipal após polêmico debate",
            noticia: `A administração municipal confirmou hoje a construção de uma unidade prisional na cidade após intensos debates. O projeto, orçado em R$ 5.200, promete gerar empregos e melhorar a segurança regional.

		O complexo penitenciário será construído em área afastada do centro urbano e contará com modernos sistemas de segurança. Autoridades afirmam que a unidade ajudará a desafogar o sistema carcerário estadual e trará investimentos para a região.

		Apesar dos benefícios econômicos anunciados, muitos moradores manifestaram preocupação com o impacto na imagem da cidade e possíveis riscos de segurança, organizando protestos contra a instalação do presídio.`
        }),
        new Estatistica({
            alegria: -10,
            seguranca: -10,
            infraestrutura: -8,
            populacao: 0.98,
            tituloNoticia: "Projeto de presídio municipal é rejeitado após pressão popular",
            noticia: `A proposta de construir uma unidade prisional na cidade foi arquivada após forte oposição da comunidade. Manifestantes alegaram que o presídio traria mais problemas que benefícios para o município.

		Sem a nova unidade, o sistema carcerário regional continuará sobrecarregado, com delegacias mantendo presos além da capacidade. Especialistas em segurança alertam para o risco de aumento da criminalidade organizada.

		A decisão foi comemorada por moradores e empresários, que temiam os impactos negativos no turismo e no valor dos imóveis, mas deixou autoridades estaduais preocupadas com a falta de vagas no sistema prisional.`
        }),
    ),
];
// funções gerais

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
    const dinheiroElement = document.getElementById('dinheiro');
    const populacaoElement = document.getElementById('populacao');
    const impostoElement = document.getElementById('imposto');
    const satisfacaoElement = document.getElementById('satisfacao');
    const saudeElement = document.getElementById('saude');
    const alegriaElement = document.getElementById('alegria');
    const segurancaElement = document.getElementById('seguranca');
    const educacaoElement = document.getElementById('educacao');
    const meioAmbienteElement = document.getElementById('meioAmbiente');
    const economiaElement = document.getElementById('economia');
    const infraestruturaElement = document.getElementById('infraestrutura');
    satisfacaoPopulacao = (saude + alegria + seguranca + educacao + meioAmbiente + economia + infraestrutura) / 7;
    dinheiroElement.innerText = `Dinheiro: R$ ${Math.round(dinheiro)}`;
    populacaoElement.innerText = `População: ${Math.floor(populacao)}`;
    impostoElement.innerText = `Imposto: ${Math.round(imposto)}%`;
    satisfacaoElement.innerText = `Satisfação da População: ${satisfacaoPopulacao.toFixed(2)}%`;

    saudeElement.innerText = `${formatarNumero(saude)}`;
    saudeElement.style.backgroundColor = corTabela(saude);
    alegriaElement.innerText = `${formatarNumero(alegria)}`;
    alegriaElement.style.backgroundColor = corTabela(alegria);
    segurancaElement.innerText = `${formatarNumero(seguranca)}`;
    segurancaElement.style.backgroundColor = corTabela(seguranca);
    educacaoElement.innerText = `${formatarNumero(educacao)}`;
    educacaoElement.style.backgroundColor = corTabela(educacao);
    meioAmbienteElement.innerText = `${formatarNumero(meioAmbiente)}`;
    meioAmbienteElement.style.backgroundColor = corTabela(meioAmbiente);
    economiaElement.innerText = `${formatarNumero(economia)}`;
    economiaElement.style.backgroundColor = corTabela(economia);
    infraestruturaElement.innerText = `${formatarNumero(infraestrutura)}`;
    infraestruturaElement.style.backgroundColor = corTabela(infraestrutura);

    document.getElementById("tituloProposta").innerText = listaPropostas[IndexPropostaAtual].titulo;
    document.getElementById("textoProposta").innerText = listaPropostas[IndexPropostaAtual].descricao;
}

atualizarTela();

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

function corTabela(numero) {
    if (numero === 100) return "lime";
    if (numero >= 87.5) return "rgb(129, 255, 25)";
    if (numero >= 75) return "rgb(162, 230, 37)";
    if (numero >= 62.5) return "yellowgreen";
    if (numero >= 50) return "yellow";
    if (numero >= 37.5) return "rgb(255, 183, 49)";
    if (numero >= 25) return "rgb(255, 128, 24)";
    if (numero >= 12.5) return "rgb(255, 92, 63)";
    if (numero >= 0) return "red";
    return "#e4e4e4";
}

function corrigir() {
    saude = Math.max(0, Math.min(100, saude));
    alegria = Math.max(0, Math.min(100, alegria));
    seguranca = Math.max(0, Math.min(100, seguranca));
    educacao = Math.max(0, Math.min(100, educacao));
    meioAmbiente = Math.max(0, Math.min(100, meioAmbiente));
    economia = Math.max(0, Math.min(100, economia));
    infraestrutura = Math.max(0, Math.min(100, infraestrutura));
    imposto = Math.max(0, Math.min(50, imposto));
}

function ecolherCidade() {
    nomeCidade = document.getElementById('nome-cidade').value;
    document.getElementById("cidade").innerText = `Cidade: ${nomeCidade}`;
}

// relacionado a tempo

let tempoInicio = Date.now();
let intervaloAtualizacao;
let ultimosMeses = 0; // Controla o último mês em que a ação foi disparada

function formatarTempo(decorrido) {
    const minutosTotais = decorrido / 60000;
    const anos = Math.floor(minutosTotais / 3);
    const meses = Math.floor((minutosTotais % 3) * 4);
    return `${anos}A ${meses}m`;
}

function verificarEventosMensais(mesesAtuais) {
    // Verifica se passou um novo bloco de 4 meses
    if (Math.floor(mesesAtuais / 4) > Math.floor(ultimosMeses / 4)) {
        // Ação que ocorre a cada 4 meses
        acaoPeriodica(); // Chame sua função personalizada aqui
    }
    ultimosMeses = mesesAtuais;
}

function acaoPeriodica() {
    dinheiro += (populacao / 25) * (imposto / 10);
    saude -= 3;
    alegria -= 3;
    seguranca -= 3;
    educacao -= 3;
    meioAmbiente -= 3;
    economia -= 3;
    infraestrutura -= 3;
    corrigir();
    populacao *= 0.95;
    atualizarTela();
}

function atualizarTempo() {
    const agora = Date.now();
    const decorrido = agora - tempoInicio;
    const minutosTotais = decorrido / 60000;
    const mesesTotais = Math.floor(minutosTotais * 4); // 1 minuto = 4 meses

    document.getElementById('tempo').textContent = `Tempo passado: ${formatarTempo(decorrido)}`;
    verificarEventosMensais(mesesTotais);

    if (decorrido >= 720000) { // 12 minutos = 4 anos
        clearInterval(intervaloAtualizacao);
        acabarJogo();
    }
}

function iniciarTempoJogo() {
    tempoInicio = Date.now();
    ultimosMeses = 0;
    clearInterval(intervaloAtualizacao);
    intervaloAtualizacao = setInterval(atualizarTempo, 1000);
    atualizarTempo();
}

function acabarJogo() {
    document.getElementById('tela-fim-de-jogo').style.display = 'flex';
    const resultado = document.getElementById('resultado');
    resultado.innerText = satisfacaoPopulacao > 50 ? "Você foi um bom prefeito!" : "Você não foi um bom prefeito.";
    resultado.style.color = satisfacaoPopulacao > 50 ? "green" : "red";
    document.getElementById("pontuacao").innerText = `Pontuação: ${Math.round(satisfacaoPopulacao * 100 + populacao / 10 + dinheiro)}`;
    document.getElementById("resultado-dinheiro").innerText = `Dinheiro: R$ ${dinheiro}`;
    document.getElementById("resultado-populacao").innerText = `População: ${Math.floor(populacao)}`;
    document.getElementById("resultado-imposto").innerText = `Imposto: ${imposto}%`;
    document.getElementById("resultado-satifacao").innerText = `Satisfação da População: ${satisfacaoPopulacao.toFixed(2)}%`;
    document.getElementById("resultado-saude").innerText = `${formatarNumero(saude)}`;
    document.getElementById("resultado-alegria").innerText = `${formatarNumero(alegria)}`;
    document.getElementById("resultado-seguranca").innerText = `${formatarNumero(seguranca)}`;
    document.getElementById("resultado-educacao").innerText = `${formatarNumero(educacao)}`;
    document.getElementById("resultado-meioAmbiente").innerText = `${formatarNumero(meioAmbiente)}`;
    document.getElementById("resultado-economia").innerText = `${formatarNumero(economia)}`;
    document.getElementById("resultado-infraestrutura").innerText = `${formatarNumero(infraestrutura)}`;
}

function trocarIcone(idIcone, escolha) {
    if (escolha == 1) escolha = "block";
    else escolha = "none";
    const icone = document.getElementById(idIcone);
    icone.style.display = escolha;
}

const btnPlay = document.getElementById('btn-play');
const btnTutorial = document.getElementById('btn-tutorial');
const btnCredits = document.getElementById('btn-credits');
const btnReturn = document.getElementById('btn-return');
const btnNews = document.getElementById('news');
const btnPropostas = document.getElementById('proposals');

let nomeIncriveldeVarivelSocorroJSJaConteceuPelaPrimeiraVez = false;

btnPlay.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('jogo').style.display = 'flex';
    ecolherCidade();
    if (!nomeIncriveldeVarivelSocorroJSJaConteceuPelaPrimeiraVez) {
        iniciarTempoJogo();
        nomeIncriveldeVarivelSocorroJSJaConteceuPelaPrimeiraVez = true;
    }
    atualizarTela();
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
    trocarIcone("newNews", 0);
});

function eventoClickProposta() {
    document.getElementById('noticias').style.display = 'none';
    document.getElementById('propostas').style.display = 'block';
    trocarIcone("newProposal", 0);
}

// Mantenha uma referência única ao listener
const handlePropostaClick = eventoClickProposta;
btnPropostas.addEventListener("click", handlePropostaClick);

const btnAceitar = document.getElementById('btnAceitar');
const btnRecusar = document.getElementById('btnRecusar');

btnAceitar.addEventListener("click", () => {
    const propostaAtual = listaPropostas[IndexPropostaAtual];
    const custo = propostaAtual.aceitarResultado.dinheiro * -1;

    if (dinheiro >= custo) {
        // 1. Executa a proposta
        propostaAtual.aceitar();

        // 2. Cria e exibe a notícia
        const noticiasDiv = document.getElementById('noticias');
        const noticia = document.createElement("div");
        noticia.innerHTML = `
            <h1>${propostaAtual.aceitarResultado.tituloNoticia || 'Nova decisão'}</h1>
            <p>${propostaAtual.aceitarResultado.noticia || 'Decisão implementada com sucesso.'}</p>
        `;
        noticia.classList.add("noticia");
        noticiasDiv.prepend(noticia); // Adiciona no início

        // 3. Atualiza interface
        trocarIcone("newNews", 1);
        corrigir();
        atualizarTela();

        // 4. Esconde propostas temporariamente
        document.getElementById("propostas").style.display = "none";

        // 5. Previne novas interações durante o tempo de espera
        btnPropostas.removeEventListener("click", handlePropostaClick);

        // 6. Programa a próxima proposta
        setTimeout(() => {
            escolherProposta();
            corrigir();
            atualizarTela();
            trocarIcone("newProposal", 1);
            btnPropostas.addEventListener("click", handlePropostaClick);
        }, 5000); // Reduzi para 3 segundos (mais jogável)
    } else {
        alert("Você não tem dinheiro suficiente para recursar essa proposta.");
    }
});

btnRecusar.addEventListener("click", () => {
    const propostaAtual = listaPropostas[IndexPropostaAtual];
    const custo = propostaAtual.recusarResultado.dinheiro * -1;

    if (dinheiro >= custo) {
        // 1. Executa a proposta
        propostaAtual.recusar();

        // 2. Cria e exibe a notícia
        const noticiasDiv = document.getElementById('noticias');
        const noticia = document.createElement("div");
        noticia.innerHTML = `
            <h1>${propostaAtual.recusarResultado.tituloNoticia || 'Nova decisão'}</h1>
            <p>${propostaAtual.recusarResultado.noticia || 'Decisão implementada com sucesso.'}</p>
        `;
        noticia.classList.add("noticia");
        noticiasDiv.prepend(noticia); // Adiciona no início

        // 3. Atualiza interface
        trocarIcone("newNews", 1);
        corrigir();
        atualizarTela();

        // 4. Esconde propostas temporariamente
        document.getElementById("propostas").style.display = "none";

        // 5. Previne novas interações durante o tempo de espera
        btnPropostas.removeEventListener("click", handlePropostaClick);

        // 6. Programa a próxima proposta
        setTimeout(() => {
            escolherProposta();
            corrigir();
            atualizarTela();
            trocarIcone("newProposal", 1);
            btnPropostas.addEventListener("click", handlePropostaClick);
        }, 5000);
    } else {
        alert("Você não tem dinheiro suficiente para aceitar essa proposta.");
    }
});