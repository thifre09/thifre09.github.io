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
let imposto = 10;

let satisfacaoPopulacao = 50;
let IndexPropostaAtual = null;

const audio = document.getElementById("musicaFundo");

document.addEventListener("click", () => {
    audio.volume = 0.5;
    audio.play();
}, { once: true });

class Proposta {

    constructor(titulo, descricao, aceitarResultado = new Estatistica(), recusarResultado = new Estatistica()) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.aceitarResultado = aceitarResultado; //Estatistica
        this.recusarResultado = recusarResultado; //Estatistica
        this.aconteceu = false;
    }

    aceitar() {
        dinheiro += this.aceitarResultado.dinheiro + Math.round(Math.abs(this.aceitarResultado.dinheiro / 10));
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

let listaPropostas = [
    new Proposta("Trazer a celebridade Hyago Kadson para a cidade.",
        `Nos termos do disposto no art. 215 da Constituição Federal, que assegura o pleno exercício dos direitos culturais e o acesso às fontes da cultura nacional, a Prefeitura Municipal comunica, por meio da Secretaria de Cultura e Eventos, a contratação do artista Hyago Kadson como atração principal do evento Festival Municipal de Cultura Popular, a ser realizado em praça pública com entrada gratuita.
    
        A iniciativa integra o calendário oficial de ações de valorização da cultura nordestina e tem por objetivo fortalecer os laços comunitários, fomentar a economia criativa e proporcionar entretenimento de qualidade à população local, sobretudo aos jovens e às famílias que tradicionalmente participam de eventos populares.

        A escolha do artista, amplamente reconhecido por seu repertório regional e apelo junto ao público, foi fundamentada em critérios de relevância cultural, projeção artística e retorno social, conforme parecer técnico emitido pela Comissão Municipal de Cultura.
    
        A ação está em consonância com o princípio da dignidade da pessoa humana e da promoção do bem-estar social, sendo esperada grande adesão popular e impacto positivo tanto econômico quanto simbólico para o município.

        Custo: 2600 reais.
        Vereador Pedão.`,

        new Estatistica({
            dinheiro: -2600,
            saude: -2,
            alegria: 10,
            economia: 6,
            populacao: 1.025,
            tituloNoticia: "Festival com Hyago Kadson reúne multidão e aquece economia local",
            noticia: `A realização do Festival Municipal de Cultura Popular com a participação de Hyago Kadson movimentou a cidade neste fim de semana. Milhares de pessoas compareceram ao evento gratuito na praça central, celebrando a cultura nordestina com música, dança e comidas típicas.

		Além da expressiva adesão popular, comerciantes relataram aumento nas vendas e o evento gerou empregos temporários no setor de eventos e alimentação. Apesar de críticas isoladas por parte de opositores ao gasto de R$ 2.800, a maioria da população demonstrou satisfação com a iniciativa.

		Autoridades destacam que o festival cumpriu seu papel de fomentar a economia criativa, promover o bem-estar social e fortalecer os laços comunitários.`

        }),
        new Estatistica({
            alegria: -5,
            saude: 4,
            economia: -4,
            populacao: 0.992,
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
        
        Custo: 3300 reais.
        Vereador Dr Thiago Frutas.`,

        new Estatistica({
            dinheiro: -3300,
            meioAmbiente: 4,
            alegria: 6,
            educacao: 11,
            populacao: 1.014,
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

        Custo: 3800 reais.
        Vereador Mr. Cuca.`,

        new Estatistica({
            dinheiro: -3800,
            saude: 3,
            alegria: 6,
            meioAmbiente: 5,
            infraestrutura: 11,
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
        
        Custo: 4800.
        Vereador Retificador de onda completa com filtro capacitivo.`,

        new Estatistica({
            dinheiro: -4800,
            alegria: 7,
            seguranca: 7,
            infraestrutura: 13,
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

        Custo: 3600 reais
        Vereador Dr. Giuseppe Camolle.`,

        new Estatistica({
            dinheiro: -3600,
            alegria: 8,
            saude: 6,
            infraestutura: 7,
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

        Custo: 5800 reais
        Vereador Dr. Giuseppe Camolle.`,

        new Estatistica({
            dinheiro: -5800,
            saude: 14,
            alegria: 6,
            meioAmbiente: -3,
            economia: 4,
            infraestutura: 8,
            populacao: 1.042,
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

        Custo: 3800 reais.
        Vereador Dayvyd Lavaniery.`,

        new Estatistica({
            dinheiro: -3800,
            alegria: 4,
            educacao: 10,
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
    
        Custo: 4400 reais.
        Vereador Abacate da Sombrinha.`,

        new Estatistica({
            dinheiro: -4400,
            alegria: 8,
            seguranca: 13,
            economia: 7,
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
            dinheiro: 5000,
            alegria: -7,
            saude: -5,
            economia: -1,
            imposto: 2,
            populacao: 1.07,
            tituloNoticia: "Prefeitura aprova aumento de impostos sobre anticoncepcionais e gera polêmica",
            noticia: `A administração municipal aprovou a proposta de aumento de impostos sobre produtos anticoncepcionais, com o objetivo de ampliar a arrecadação para programas de saúde e assistência social.

		A medida gerou forte reação popular e foi alvo de críticas de organizações de saúde, que apontam retrocesso no acesso ao planejamento familiar e impacto negativo para mulheres de baixa renda.

		Apesar da polêmica, a Prefeitura argumenta que a arrecadação será revertida em ações educativas e programas sociais voltados à saúde da família.`

        }),
        new Estatistica({
            alegria: 7,
            saude: 7,
            economia: 7,
            populacao: 0.99,
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

        Custo: 4.800 reais.
        Vereador Dr. Jurandy Egito.`,
        new Estatistica({
            dinheiro: -4800,
            alegria: 8,
            economia: 9,
            educacao: 5,
            populacao: 1.095,
            tituloNoticia: "Feira cultural movimenta cidade e fortalece economia criativa",
            noticia: `A realização da feira cultural promovida pela Prefeitura reuniu milhares de pessoas e destacou a diversidade artística local com apresentações musicais, exposições de arte, gastronomia e artesanato.

		O evento gerou renda para empreendedores locais, fortaleceu a identidade cultural e incentivou a ocupação dos espaços públicos de forma positiva. Representantes da sociedade civil e das escolas participaram ativamente da programação.

		Com grande adesão popular, a feira foi celebrada como um sucesso e já há pedidos para que se torne parte permanente do calendário cultural do Município.`


        }),
        new Estatistica({
            alegria: -7,
            economia: -7,
            educacao: -7,
            populacao: 0.986,
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

        Custo: 2.300 reais
        Vereador Amazias Zesty.`,
        new Estatistica({
            dinheiro: -2300,
            saude: 10,
            economia: 6,
            populacao: 1.022,
            tituloNoticia: "Campanha de doação de sangue mobiliza cidade e salva vidas",
            noticia: `A campanha de doação de sangue promovida pela Prefeitura teve ampla adesão da população, com pontos móveis de coleta distribuídos em locais estratégicos da cidade.

		A ação contou com a parceria de hemocentros e hospitais, além da participação ativa de escolas, empresas e igrejas, que ajudaram na mobilização e conscientização sobre a importância da doação.

		Autoridades comemoram os resultados, destacando o impacto positivo na saúde pública e o fortalecimento do espírito de solidariedade entre os munícipes.`
        }),
        new Estatistica({
            saude: -7,
            economia: -4,
            populacao: 0.991,
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

        Custo: 4.100 reais.
        Vereador Dr. Monkey D. Alberto.`,
        new Estatistica({
            dinheiro: -4100,
            saude: 12,
            infraestrutura: 7,
            populacao: 1.072,
            tituloNoticia: "Município alcança recorde de cobertura vacinal com o Projeto Vacinação 100",
            noticia: `Com ações coordenadas e intensivas de mobilização, o Projeto Vacinação 100 atingiu sua meta de cobrir 100% do público-alvo nas principais campanhas de imunização.

		Mutirões foram realizados em escolas, centros comunitários e regiões rurais, ampliando o acesso à vacinação e fortalecendo a confiança da população nas políticas de saúde pública.

		Profissionais da saúde destacam que a ampla cobertura vacinal ajudará a prevenir surtos, reduzir internações e proteger os grupos mais vulneráveis.`
        }),
        new Estatistica({
            saude: -9,
            infraestrutura: -6,
            populacao: 0.97,
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

        Custo: 4.600 reais.
        Vereador Natsuki Subaru.`,
        new Estatistica({
            dinheiro: -4600,
            seguranca: 12,
            educacao: 7,
            alegria: 8,
            populacao: 1.03,
            tituloNoticia: "Município investe em capacitação policial e melhora sensação de segurança",
            noticia: `Com o lançamento do programa de formação e capacitação continuada para policiais, a cidade deu um passo importante na valorização das forças de segurança.

		O treinamento incluiu oficinas de mediação de conflitos, cursos de direitos humanos e técnicas operacionais, aproximando a polícia da comunidade.

		Moradores relatam maior confiança nos agentes e percebem melhoria na abordagem policial e no combate à criminalidade.`

        }),
        new Estatistica({
            seguranca: -9,
            educacao: -4,
            alegria: -5,
            populacao: 0.976,
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

        Custo: 2700 reais.
        Vereador Zé ninguém.`,
        new Estatistica({
            dinheiro: -2700,
            alegria: 8,
            saude: 6,
            educacao: 6,
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

        Custo: 5300 reais.
        Vereador Alguém debaixo do fogão.`,
        new Estatistica({
            dinheiro: -5300,
            economia: 18,
            alegria: 10,
            meioAmbiente: -7,
            populacao: 1.12,
            tituloNoticia: "Município lança programa de incentivo ao turismo e aquece a economia local",
            noticia: `Com o lançamento do programa municipal de incentivo ao turismo, o Município visa valorizar seus atrativos naturais, culturais e históricos, fortalecendo a economia local.

		O projeto inclui roteiros turísticos, capacitação de guias e apoio a eventos culturais, aumentando a circulação de visitantes e gerando emprego e renda.

		Comerciantes e moradores celebram o impacto positivo na geração de oportunidades e no fortalecimento da identidade local.`

        }),
        new Estatistica({
            meioAmbiente: 10,
            economia: -7,
            populacao: 0.98,
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

        Custo: 7500 (parte municipal).
        Vereador Chapolin Colorado.`,
        new Estatistica({
            dinheiro: -7500,
            educacao: 20,
            economia: 12,
            infraestrutura: 20,
            meioAmbiente: -9,
            tituloNoticia: "Município avança em parceria para construção de Instituto Federal",
            noticia: `O Executivo Municipal formalizou um pedido oficial à Presidência da República para a instalação de um Instituto Federal de Educação, Ciência e Tecnologia no Município.

        A iniciativa, apoiada pela Prefeitura e vereadores, visa oferecer ensino técnico e superior gratuito, impulsionando o desenvolvimento social, econômico e educacional da região.

        O projeto também prevê a disponibilização de terreno e infraestrutura adequada para viabilizar a implantação da unidade.`

        }),
        new Estatistica({
            educacao: -8,
            infraestrutura: -8,
            alegria: -8,
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

        Custo: 800 reais.
        Vereador Dr. Benício Fonteiras.`,
        new Estatistica({
            dinheiro: -800,
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
        
        Custo: 5200 reais.
        Vereador Edson Isaac.`,
        new Estatistica({
            dinheiro: -5200,
            saude: 12,
            populacao: 1.05,
            economia: 8,
            educacao: 8,
            tituloNoticia: "Município investe na formação de médicos e enfermeiros para melhorar saúde pública",
            noticia: `Com a aprovação do programa municipal de formação e capacitação para médicos e enfermeiros, a cidade aposta na qualificação profissional para melhorar o atendimento na rede pública.

		A iniciativa prevê bolsas de estudo, estágios supervisionados e capacitação continuada, visando reduzir a rotatividade e elevar a qualidade dos serviços de saúde.

		A população já percebe avanços no atendimento básico e especializado, fortalecendo o sistema de saúde local.`

        }),
        new Estatistica({
            saude: -8,
            populacao: 0.978,
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

        Custo: 2.100 reais.
        Vereador Real Slim Shady.`,
        new Estatistica({
            dinheiro: -2100,
            educacao: 9,
            economia: 5,
            populacao: 1.04,
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
        Vereador Sr. Impostinho.`,
        new Estatistica({
            imposto: 4,
            alegria: -13,
            economia: -12,
            dinheiro: 6000,
            tituloNoticia: "Município planeja aumento de impostos para fortalecer serviços públicos",
            noticia: `Foi proposta a revisão e possível aumento dos impostos municipais gerais, visando garantir recursos para saúde, educação, infraestrutura e assistência social.

		Estudos técnicos e jurídicos serão realizados, com diálogo previsto junto à população, para assegurar equilíbrio fiscal e justiça tributária.

		Autoridades destacam a importância da medida para ampliar investimentos públicos e reduzir a dependência de repasses externos.`

        }),
        new Estatistica({
            alegria: 15,
            economia: 15,
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

        Custo: 3.000 reais.
        Vereador Mr. Potato Batatas.`,
        new Estatistica({
            dinheiro: -3000,
            meioAmbiente: 8,
            economia: 9,
            populacao: 1.05,
            tituloNoticia: "Município investe em programa de incentivo à agricultura de batatas",
            noticia: `Por meio da criação do programa municipal de incentivo à agricultura de batatas, a cidade fortalece a produção local e fomenta a economia agrícola.

		O programa oferece apoio técnico, capacitação, sementes selecionadas e facilidades de crédito aos produtores, gerando emprego e renda.

		A iniciativa é vista com otimismo pelos agricultores, que esperam aumento da produtividade e novas oportunidades comerciais.`

        }),
        new Estatistica({
            meioAmbiente: -7,
            economia: -7,
            populacao: 0.988,
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
        

        Custo: 3.800 reais.
        Vereadora Hatsune miku.
        `,
        new Estatistica({
            dinheiro: -3800,
            alegria: 7,
            infraestrutura: 10,
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
            dinheiro: 4500,
            alegria: -12,
            economia: -12,
            tituloNoticia: "Prefeitura institui cobrança em estacionamentos públicos para melhorar mobilidade",
            noticia: `A Prefeitura Municipal anunciou a criação da Zona Municipal de Estacionamento Regulamentado (ZMER), com cobrança de tarifas para vagas em áreas centrais e de grande fluxo comercial.

		Objetivando disciplinar o uso do espaço público e garantir maior rotatividade, a medida prevê arrecadação para investimentos em infraestrutura viária e mobilidade urbana.

		Apesar do desconforto inicial, a ação visa promover a equidade no uso do solo e melhorar a mobilidade na cidade, com respaldo em estudos técnicos.`

        }),
        new Estatistica({
            alegria: 15,
            economia: 15,
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

        Custo: 5800 reais.
        Vereador Pedão.
        
        `,
        new Estatistica({
            dinheiro: -5800,
            economia: 7,
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
            dinheiro: 6000,
            saude: -10,
            populacao: 0.993,
            tituloNoticia: "Suspensão do atendimento noturno em unidades secundárias de saúde",
            noticia: `Devido a restrições orçamentárias, a Prefeitura suspendeu temporariamente o atendimento noturno nas unidades de saúde secundárias, priorizando os serviços essenciais em UPAs e hospitais.

		A medida visa reorganizar recursos para garantir a continuidade dos atendimentos diurnos e emergenciais, apesar dos transtornos temporários para a população.

		A administração reforça o compromisso com a saúde pública e o retorno dos serviços assim que possível.`

        }),
        new Estatistica({
            alegria: 18,
            saude: 14,
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
            dinheiro: 5000,
            meioAmbiente: -15,
            economia: 12,
            infraestrutura: 10,
            imposto: -2,
            populacao: 1.068,
            tituloNoticia: "Prefeitura lança programa de incentivos fiscais para estimular economia local",
            noticia: `O município aprovou hoje o Programa Municipal de Estímulo à Atividade Econômica, oferecendo reduções fiscais para empresas que se instalarem na região.

		A medida visa atrair novos negócios, gerar empregos e diversificar a base econômica da cidade, com benefícios como redução de ISSQN e IPTU para empresas que cumprirem metas de contratação.

		Especialistas projetam que o programa pode aumentar em 15% a atividade econômica e reduzir o desemprego em 2% nos próximos meses.`
        }),
        new Estatistica({
            meioAmbiente: 12,
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
        
        custo: 3600.
        Vereador Tales elementar.`,

        new Estatistica({
            dinheiro: -3600,
            infraestrutura: 10,
            meioAmbiente: -4,
            populacao: 1.014,
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
            populacao: 0.992,
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
            dinheiro: 4500,
            infraestrutura: 5,
            alegria: -9,
            educacao: -4,
            populacao: 0.992,
            tituloNoticia: "Creches municipais são interditadas para reformas emergenciais",
            noticia: `A prefeitura anunciou hoje o fechamento temporário de quatro unidades de educação infantil devido a problemas estruturais identificados em vistorias técnicas. As creches permanecerão fechadas por aproximadamente seis meses para a realização de obras de adequação e reforço predial.

		Durante este período, todas as crianças matriculadas serão realocadas para outras unidades educacionais próximas, garantindo a continuidade do atendimento educacional. A secretaria de educação está organizando um esquema especial de transporte e acolhimento para minimizar os impactos nas famílias afetadas.

		Especialistas em educação infantil destacam a importância das reformas para garantir a segurança das crianças, mas alertam para os possíveis transtornos na rotina das famílias e no desenvolvimento pedagógico dos alunos durante o período de transição entre as unidades escolares.`
        }),
        new Estatistica({
            alegria: 14,
            educacao: 6,
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
            dinheiro: 9000,
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
            alegria: 22,
            saude: -6,
            seguranca: -6,
            meioAmbiente: -9,
            economia: 22,
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

        Custo: 3500 reais.
        Vereador Batatão.`,

        new Estatistica({
            dinheiro: -3500,
            saude: 8,
            alegria: 2,
            educacao: 8,
            populacao: 0.976,
            tituloNoticia: "Prefeitura implementa projeto pioneiro de educação sexual nas escolas",
            noticia: `O município lançou hoje o projeto "Conhecer para Cuidar", um programa abrangente de educação sexual que será ministrado nas escolas públicas a partir do 8º ano. A iniciativa visa reduzir os índices de gravidez na adolescência através de informação qualificada.

		Desenvolvido por equipe multidisciplinar, o programa abordará temas como saúde reprodutiva, prevenção e relações interpessoais, respeitando os valores familiares e a maturidade dos estudantes. Professores receberam capacitação especial para lidar com o tema de forma adequada a cada faixa etária.

		Especialistas em educação e saúde pública elogiaram a iniciativa, destacando que a informação científica é a melhor ferramenta para prevenir problemas como gravidez precoce e doenças sexualmente transmissíveis entre adolescentes.`
        }),
        new Estatistica({
            saude: -9,
            educacao: -4,
            populacao: 1.071,
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
        
        Custo: 2200 reais.
        Vereador Pitbul raivoso.
        `,

        new Estatistica({
            dinheiro: -2200,
            alegria: 4,
            educacao: 7,
            economia: 6,
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
        
        Custo: 3400 reais
        Vereadora Aparecida.`,

        new Estatistica({
            dinheiro: -3400,
            economia: 10,
            alegria: 8,
            infraestrutura: 5,
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
        
        Custo: 1600 reais.
        Vereador Mennino ney`,

        new Estatistica({
            dinheiro: -1600,
            alegria: 6,
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
            dinheiro: 5500,
            alegria: -12,
            infraestutura: 9,
            economia: -12,
            imposto: 3,
            populacao: 0.975,
            tituloNoticia: "Prefeitura anuncia reajuste de 8,2% na tarifa de energia elétrica",
            noticia: `A administração municipal confirmou hoje o aumento de 8,2% nas contas de luz, que entrará em vigor no próximo mês. Segundo a prefeitura, o reajuste é necessário para cobrir os custos de manutenção e modernização da rede elétrica.

		O aumento vem em um momento de preocupação com a inflação e deve impactar principalmente famílias de baixa renda e pequenos comerciantes. A prefeitura alega que o reajuste foi aprovado pela agência reguladora e ajudará a evitar problemas no fornecimento de energia.

		Economistas alertam que o aumento na conta de luz pode pressionar ainda mais o orçamento doméstico, especialmente em lares que já enfrentam dificuldades financeiras após a pandemia.`
        }),
        new Estatistica({
            alegria: 14,
            economia: 10,
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
        
        Custo: 3800
        Vereador Credson Tecnologias
        `,

        new Estatistica({
            dinheiro: -3800,
            alegria: 7,
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
        
        Custo: 5800 reais.
        Vereador Renato Impera.`,

        new Estatistica({
            dinheiro: -5800,
            alegria: 10,
            seguranca: 15,
            infraestrutura: 10,
            populacao: 1.025,
            tituloNoticia: "Prefeitura aprova construção de presídio municipal após polêmico debate",
            noticia: `A administração municipal confirmou hoje a construção de uma unidade prisional na cidade após intensos debates. O projeto, orçado em R$ 6.000, promete gerar empregos e melhorar a segurança regional.

		O complexo penitenciário será construído em área afastada do centro urbano e contará com modernos sistemas de segurança. Autoridades afirmam que a unidade ajudará a desafogar o sistema carcerário estadual e trará investimentos para a região.

		Apesar dos benefícios econômicos anunciados, muitos moradores manifestaram preocupação com o impacto na imagem da cidade e possíveis riscos de segurança, organizando protestos contra a instalação do presídio.`
        }),
        new Estatistica({
            alegria: -10,
            seguranca: -10,
            infraestrutura: -8,
            populacao: 0.991,
            tituloNoticia: "Projeto de presídio municipal é rejeitado após pressão popular",
            noticia: `A proposta de construir uma unidade prisional na cidade foi arquivada após forte oposição da comunidade. Manifestantes alegaram que o presídio traria mais problemas que benefícios para o município.

		Sem a nova unidade, o sistema carcerário regional continuará sobrecarregado, com delegacias mantendo presos além da capacidade. Especialistas em segurança alertam para o risco de aumento da criminalidade organizada.

		A decisão foi comemorada por moradores e empresários, que temiam os impactos negativos no turismo e no valor dos imóveis, mas deixou autoridades estaduais preocupadas com a falta de vagas no sistema prisional.`
        }),
    ),

    //precisa modificar a partir daqui

    new Proposta(`Proposta de Criação de Zona de Proteção Ambiental (ZPA) no Município de ${nomeCidade}`, `Excelentíssimo(a) Senhor(a) Prefeito(a) Municipal,

        Vimos, por meio deste, propor a criação de uma Zona de Proteção Ambiental (ZPA) no âmbito do território municipal, com o objetivo de assegurar a preservação dos recursos naturais, promover a sustentabilidade ambiental e garantir a qualidade de vida da população.

        A implementação da ZPA visa a proteção de áreas de relevante interesse ecológico, com a adoção de medidas rigorosas de controle sobre atividades que possam causar degradação ambiental. Com a criação dessa zona, será possível preservar ecossistemas, melhorar a qualidade do ar, da água e do solo, bem como promover o equilíbrio entre o desenvolvimento urbano e a conservação ambiental.

        Considerando a importância de tal iniciativa para o bem-estar coletivo e a preservação do meio ambiente, solicitamos a inclusão deste projeto nas diretrizes de planejamento e a avaliação de sua viabilidade, com vistas à sua implementação efetiva.
        
        Custo: 3200 reais
        Vereador Natural`,

        new Estatistica({
            dinheiro: -3200,
            meioAmbiente: 12,
            saude: 5,
            infraestrutura: 5,
            tituloNoticia: `${nomeCidade} cria Zona de Proteção Ambiental para preservar ecossistemas locais`,
            noticia: `A prefeitura de ${nomeCidade} anunciou hoje a criação de uma Zona de Proteção Ambiental (ZPA) que abrangerá áreas de relevante interesse ecológico no município. A medida visa proteger os recursos naturais e garantir o desenvolvimento sustentável da região.

		A nova legislação estabelece regras rigorosas para atividades econômicas na área protegida, com o objetivo de preservar a biodiversidade e melhorar a qualidade ambiental para as futuras gerações. Ambientalistas comemoraram a decisão como um marco na política ecológica da cidade.

		Estudos preliminares indicam que a ZPA poderá aumentar em 15% a qualidade do ar e da água na região metropolitana, além de proteger espécies nativas ameaçadas de extinção.`
        }),
        new Estatistica({
            meioAmbiente: -8,
            saude: -4,
            infraestrutura: -5,
            tituloNoticia: `Projeto de proteção ambiental é rejeitado em ${nomeCidade}`,
            noticia: `A proposta de criação de uma Zona de Proteção Ambiental (ZPA) foi arquivada pela prefeitura de ${nomeCidade}, gerando críticas de ambientalistas e moradores preocupados com a degradação dos ecossistemas locais.

		O veto à medida foi justificado pela administração municipal como necessário para não prejudicar o desenvolvimento econômico da região. No entanto, especialistas alertam que a falta de proteção pode levar à perda irreparável de biodiversidade.

		Manifestantes protestaram em frente à prefeitura, argumentando que a decisão coloca em risco áreas naturais importantes e compromete a qualidade de vida da população a longo prazo.`
        }),
    ),

    new Proposta("Criação do lar de idosos para ajudar a população acima de 65 anos",
        `
        Considerando o crescimento progressivo da população idosa no Município — especialmente a faixa etária acima dos 65 anos, que já representa uma parcela significativa dos habitantes locais —, propõe-se a criação de um Lar Municipal para Idosos, com estrutura adequada para acolhimento, cuidados médicos, atividades socioculturais e apoio psicossocial.

        A proposta responde ao aumento da expectativa de vida e à tendência de envelhecimento populacional, identificada nos dados demográficos recentes. Muitos desses idosos vivem sozinhos, sem rede de apoio familiar, ou enfrentam situações de vulnerabilidade socioeconômica e dependência funcional. 

        O Lar de Idosos será voltado especialmente à população de baixa renda e contemplará tanto moradores urbanos quanto de zonas rurais, com serviços de transporte assistido e atendimento multiprofissional. A iniciativa visa garantir dignidade, segurança, e qualidade de vida à população idosa, além de aliviar a sobrecarga de cuidadores informais e unidades básicas de saúde.

        Custo: 4600 reais.  
        Vereadora Vó Dirce.
        `,

        new Estatistica({
            dinheiro: -4600,
            alegria: 8,
            saude: 8,
            infraestrutura: 11,
            populacao: 1.023,
            tituloNoticia: `${nomeCidade} inaugura Lar Municipal para Idosos com estrutura completa`,
            noticia: `A prefeitura de ${nomeCidade} celebrou hoje a abertura do primeiro Lar Municipal para Idosos, destinado a acolher a população acima de 65 anos em situação de vulnerabilidade. A unidade oferecerá moradia assistida, cuidados médicos e atividades recreativas.

		Com quartos adaptados, equipe multiprofissional e programação cultural, o espaço visa garantir dignidade e qualidade de vida aos idosos que não possuem rede de apoio familiar. A iniciativa já recebeu mais de 120 inscrições de candidatos a vagas.

		"É nosso dever cuidar de quem cuidou de nós", declarou o prefeito durante a cerimônia, destacando que o projeto alia assistência social e saúde pública, reduzindo a sobrecarga nas unidades básicas de saúde.`
        }),

        new Estatistica({
            alegria: -6,
            saude: -8,
            infraestrutura: -9,
            populacao: 0.99,
            tituloNoticia: `Projeto de Lar para Idosos é arquivado em ${nomeCidade}`,
            noticia: `A proposta de criação de um Lar Municipal para Idosos foi rejeitada pela prefeitura de ${nomeCidade}, deixando desamparados centenas de idosos em situação de vulnerabilidade. A justificativa foi a falta de recursos no orçamento.

		Associações de defesa dos direitos dos idosos protestaram contra a decisão, lembrando que muitos vivem sozinhos, sem cuidados básicos. "É uma população que precisa de apoio, não de descaso", criticou uma representante do Conselho do Idoso.

		Sem a nova estrutura, famílias continuarão sobrecarregadas com os cuidados ou dependentes de instituições particulares, muitas vezes inacessíveis para a população de baixa renda.`
        })
    ),

    new Proposta("Criação de centro de entretenimento com foco na população jovem",
        `
        Com base nos dados demográficos mais recentes, observa-se que uma parte expressiva da população do Município está concentrada na faixa etária entre 15 e 29 anos. Esta parcela jovem demanda espaços adequados para lazer, expressão cultural e desenvolvimento de atividades sociais e esportivas.

        Diante disso, propõe-se a criação de um Centro Municipal de Entretenimento Juvenil, com instalações modernas que incluam áreas para esportes, jogos eletrônicos, oficinas criativas, eventos culturais, coworking para jovens empreendedores e atividades voltadas à saúde mental.

        O projeto visa não apenas oferecer alternativas saudáveis de lazer para a juventude, mas também prevenir problemas sociais como o uso de drogas, o sedentarismo e a violência urbana, ao mesmo tempo em que estimula o protagonismo juvenil, o empreendedorismo e a inclusão digital.

        Custo: 3600 reais.  
        Vereador Zeca da Galera.
        `,

        new Estatistica({
            dinheiro: -3600,
            infraestrutura: 6,
            economia: 5,
            alegria: 10,
            tituloNoticia: "Prefeitura cria Centro de Entretenimento para a juventude",
            noticia: `A administração municipal anunciou a construção de um moderno Centro de Entretenimento voltado para os jovens, com áreas esportivas, oficinas criativas e espaços digitais.

		O projeto visa promover lazer saudável, prevenir a violência e estimular o protagonismo juvenil, beneficiando milhares de adolescentes e jovens adultos da cidade.

		A população comemora a iniciativa como um marco na valorização da juventude.`

        }),
        new Estatistica({
            infraestrutura: -4,
            economia: -5,
            alegria: -9,
            tituloNoticia: "Falta de espaços para jovens preocupa especialistas",
            noticia: `A recusa na criação de um Centro de Entretenimento para jovens acendeu o alerta entre educadores e profissionais da saúde.

		A ausência de alternativas saudáveis de lazer pode ampliar o risco de problemas sociais como o uso de drogas, violência e evasão escolar.

		Movimentos juvenis cobram políticas públicas mais efetivas e inclusivas.`

        })
    ),

    new Proposta("Criação de linha de transporte exclusivo para crescente população idosa",
        `
		Considerando o aumento contínuo da população acima de 60 anos no Município, propõe-se a criação de uma linha de transporte público exclusiva para idosos, com foco em acessibilidade, conforto e segurança.

		A medida visa atender às necessidades de mobilidade dessa faixa etária, muitas vezes limitada em termos físicos e com dificuldades de acesso ao transporte convencional. Os veículos serão adaptados com plataformas elevatórias, assentos prioritários ampliados e equipe capacitada para o atendimento humanizado.

		A linha terá como prioridade a conexão entre bairros residenciais e centros de saúde, farmácias, praças, unidades de assistência social e centros de convivência para a terceira idade.

		Com esta ação, busca-se promover a autonomia, a inclusão social e a melhoria da qualidade de vida da população idosa, respondendo ao desafio do envelhecimento demográfico com políticas públicas eficazes e humanizadas.

		Custo: 2600  
		Vereador Raul Vitalício.
		`,
        new Estatistica({
            dinheiro: -2600,
            infraestrutura: 10,
            saude: 4,
            alegria: 5,
            tituloNoticia: "Prefeitura lança linha de transporte exclusiva para idosos",
            noticia: `A nova linha de ônibus voltada à população idosa já está em operação. Com veículos adaptados e equipe capacitada, o serviço garante acesso seguro a serviços de saúde, lazer e assistência.

        A medida foi celebrada por entidades da terceira idade, que destacam a importância da mobilidade para a autonomia e bem-estar dos idosos.`

        }),
        new Estatistica({
            infraestrutura: -7,
            saude: -3,
            alegria: -4,
            tituloNoticia: "Falta de transporte adequado dificulta rotina de idosos",
            noticia: `Sem uma linha de transporte específica, muitos idosos continuam enfrentando dificuldades para acessar postos de saúde, praças e serviços essenciais.

        Organizações sociais cobram do poder público ações mais inclusivas para a crescente população idosa do Município.`

        })
    ),

    new Proposta("Incentivo a vinda de imigrantes por meio de bolsas de trabalho",
        `
		Diante da redução no crescimento populacional e da necessidade de revitalização de determinadas regiões do município, propõe-se um programa de incentivo à vinda de imigrantes por meio de bolsas de trabalho e integração social.

		O projeto visa atrair pessoas de outras localidades e países, especialmente em idade produtiva (entre 20 e 45 anos), oferecendo apoio financeiro inicial, cursos de idioma e cultura local, além de parcerias com empresas para inserção no mercado de trabalho formal.

		A iniciativa pretende equilibrar o perfil etário da população, fomentar o crescimento econômico e repovoar bairros com baixa densidade habitacional, contribuindo para a diversidade cultural e o dinamismo social.

		Com políticas bem estruturadas de acolhimento e acompanhamento, o município poderá enfrentar os desafios do envelhecimento populacional e escassez de mão de obra qualificada em áreas estratégicas.

		Custo: 2300 reais. 
		Vereador Ibrahim Lopes.
		`,
        new Estatistica({
            dinheiro: -2300,
            populacao: 1.07,
            economia: 11,
            tituloNoticia: "Município atrai imigrantes com bolsas de trabalho e vê economia crescer",
            noticia: `O novo programa de incentivo à imigração lançado pela prefeitura já mostra resultados: bairros com baixa densidade populacional começaram a receber novos moradores, e o comércio local está aquecido.

        A oferta de bolsas de trabalho e cursos de integração tem facilitado a adaptação dos recém-chegados, enquanto empresas locais elogiam a chegada de mão de obra qualificada.

        Moradores destacam o impacto positivo da diversidade cultural e o renascimento de áreas antes esquecidas.`

        }),
        new Estatistica({
            alegria: -5,
            economia: -5,
            populacao: 0.98,
            tituloNoticia: "Falta de incentivo à imigração mantém regiões vazias e economia estagnada",
            noticia: `A proposta de atrair imigrantes por meio de bolsas de trabalho foi rejeitada pela gestão municipal, frustrando expectativas de revitalização populacional e econômica.

        Especialistas alertam para o agravamento do envelhecimento da população e o risco de escassez de mão de obra qualificada em setores estratégicos.

        Moradores de bairros com baixa ocupação relatam desânimo com a ausência de ações que tragam vida e oportunidades às suas regiões.`

        })
    ),

    new Proposta("Proposta para integração da população idosa com informatica",
        `
		Considerando o aumento expressivo da população com mais de 60 anos no município, propõe-se a criação de um programa de inclusão digital voltado exclusivamente para a terceira idade, com cursos gratuitos e adaptados às necessidades dessa faixa etária.

		O objetivo principal é promover a autonomia dos idosos no uso de tecnologias básicas, como smartphones, internet, redes sociais e serviços públicos digitais, contribuindo para o fortalecimento de vínculos familiares, acesso à informação e prevenção do isolamento social.

		As atividades serão conduzidas por educadores capacitados, com metodologia acessível e material didático apropriado, em parceria com escolas, centros comunitários e universidades locais.

		Essa iniciativa não apenas valoriza o envelhecimento ativo e participativo, como também reduz barreiras intergeracionais e amplia o acesso da população idosa às inovações tecnológicas.

		Custo: 2500 reais.  
		Vereador Professor Elísio.
		`,
        new Estatistica({
            dinheiro: -2500,
            alegria: 8,
            educacao: 11,
            tituloNoticia: "Inclusão digital transforma a vida da população idosa no município",
            noticia: `Com o lançamento do programa de inclusão digital para idosos, dezenas de cidadãos acima dos 60 anos agora acessam redes sociais, realizam serviços públicos online e mantêm contato com familiares de forma mais frequente.

        As aulas, conduzidas em centros comunitários e escolas, estão sendo elogiadas pela abordagem prática e sensível às limitações da idade. Para muitos participantes, a experiência tem sido transformadora.

        “Me sinto mais conectada ao mundo”, afirmou Dona Neusa, de 72 anos.`

        }),
        new Estatistica({
            alegria: -5,
            educacao: -6,
            populacao: 0.98,
            tituloNoticia: "Falta de apoio à inclusão digital deixa idosos à margem da tecnologia",
            noticia: `A proposta de oferecer cursos gratuitos de informática para a população idosa foi recusada, gerando críticas de educadores e representantes de associações da terceira idade.

        Com o avanço dos serviços digitais, especialistas alertam que muitos idosos continuam dependentes de terceiros para tarefas simples, como marcar consultas ou pagar contas online.

        “Não é só aprender computador — é manter a autonomia e evitar o isolamento”, comentou o vereador Professor Elísio, autor da proposta.`

        })
    ),

    new Proposta("Redução de impostos sobre cameras de segurança",
        `
		Propõe-se a redução dos impostos municipais incidentes sobre a comercialização e instalação de câmeras de segurança, com o intuito de estimular a adesão da população a sistemas de monitoramento doméstico e comercial.

		A medida visa não apenas ampliar a sensação de segurança entre os cidadãos, mas também fortalecer a rede colaborativa de vigilância urbana, especialmente em áreas residenciais com maior concentração de idosos e comércios locais.

		Com a crescente demanda por segurança preventiva e o avanço da tecnologia acessível, facilitar o acesso a equipamentos de monitoramento pode contribuir para inibir delitos, apoiar investigações e integrar os esforços do poder público com a comunidade.

		A proposta ainda prevê campanhas de conscientização sobre o uso responsável desses equipamentos e incentivo à criação de redes de vizinhança segura, principalmente em bairros com maior densidade populacional e presença de grupos vulneráveis.

		Custo: 0 reais (renúncia fiscal).
		Vereador Claudemir Bigode.
		`,
        new Estatistica({
            imposto: -4,
            seguranca: 12,
            alegria: 9,
            tituloNoticia: "Município aprova isenção de impostos sobre câmeras de segurança",
            noticia: `A Câmara Municipal aprovou a proposta do vereador Claudemir Bigode que reduz impostos sobre câmeras de segurança, facilitando o acesso da população a esses equipamentos.

        Com a medida, espera-se o fortalecimento das redes de vigilância colaborativa, principalmente em bairros residenciais. A população comemorou a iniciativa como uma forma de prevenção aos crimes.

        “Agora posso instalar câmeras na minha mercearia com menos custo”, disse a comerciante Rita Barbosa, do bairro São José.`

        }),
        new Estatistica({
            seguranca: -7,
            alegria: -7,
            imposto: 2,
            tituloNoticia: "Câmara rejeita proposta de redução de impostos sobre câmeras de segurança",
            noticia: `A proposta de isenção fiscal para câmeras de segurança foi rejeitada pela maioria dos vereadores, sob o argumento de que a renúncia de receita prejudicaria outras áreas essenciais do orçamento.

        Moradores e comerciantes demonstraram frustração com a decisão, afirmando que o incentivo poderia fortalecer a proteção de bairros mais vulneráveis.

        “O custo ainda é muito alto para quem quer se proteger”, reclamou um morador da região central.`

        })
    ),

    new Proposta("Criação do feriado municipal do Tralalero Tralala",
        `
		Propõe-se a criação do feriado municipal do Tralalero Tralala, celebrado anualmente como um marco cultural e de identidade local, com o objetivo de fortalecer os laços comunitários e valorizar tradições populares da região.

		A instituição do feriado busca oferecer um momento de pausa para a população, especialmente para trabalhadores formais e estudantes, promovendo a realização de eventos comemorativos, apresentações artísticas, feiras e atividades voltadas ao lazer.

		Estudos demográficos indicam que datas comemorativas locais tendem a aumentar a coesão social, gerar impacto econômico positivo no setor de comércio e turismo, além de atender ao desejo das faixas etárias mais jovens e de meia-idade por celebrações culturais.

		A medida será submetida à consulta pública e inserida no calendário oficial do município, respeitando os limites de feriados definidos pela legislação nacional.

		Custo: 800 reais.
		Vereador Bombardillo Crocodilo/Lirio Lirio Larila.
		`,
        new Estatistica({
            dinheiro: -800,
            alegria: 5,
            economia: 5,
            tituloNoticia: `${nomeCidade} institui feriado do Tralalero Tralala como nova tradição municipal`,
            noticia: `A Câmara Municipal aprovou por ampla maioria a criação do feriado do Tralalero Tralala, data que entrará para o calendário oficial de ${nomeCidade}. A celebração acontecerá anualmente no dia 13 de julho.

		O prefeito destacou que o feriado fortalecerá a identidade cultural local: "É uma homenagem às nossas raízes e uma oportunidade para movimentar a economia criativa". Já estão programados desfiles, oficinas artísticas e um grande festival gastronômico.

		Pesquisas indicam que feriados municipais podem aumentar em até 30% o movimento no comércio local e gerar empregos temporários na organização de eventos.`
        }),
        new Estatistica({
            alegria: -2,
            economia: -3,
            tituloNoticia: `Câmara rejeita criação do feriado do Tralalero Tralala em ${nomeCidade}`,
            noticia: `A proposta do vereador Bombardillo Crocodilo para instituir o feriado do Tralalero Tralala foi arquivada após debate acalorado. Opositores argumentaram que a cidade já tem excesso de datas comemorativas.

		"Precisamos priorizar a produtividade, não mais folgas", declarou o líder da oposição. Já os defensores do projeto lamentaram a decisão: "Perdemos a chance de criar uma tradição única que colocaria ${nomeCidade} no mapa cultural da região".

		Sem o novo feriado, o calendário municipal mantém suas 12 datas oficiais, sendo 8 nacionais e 4 locais estabelecidas há mais de década.`
        })
    ),

    new Proposta("Redução de imposto geral",
        `
        Por meio da presente, propomos a realização de estudos técnicos e financeiros visando à redução de impostos municipais gerais, como forma de aliviar a carga tributária sobre a população e os empreendedores locais, estimulando o consumo, o investimento e o crescimento econômico no Município. A medida poderá abranger tributos como IPTU, ISS e taxas diversas, com ajustes graduais e sustentáveis conforme a capacidade fiscal do Município.

        A iniciativa busca fomentar a atividade econômica, incentivar a regularização de contribuintes, atrair novos negócios e gerar empregos, promovendo um ambiente mais justo e competitivo. A redução estratégica da carga tributária, acompanhada de ações de gestão eficiente, poderá resultar em aumento da arrecadação a médio prazo, por meio do crescimento da base de contribuintes.

        Diante do exposto, solicitamos a inclusão do tema no planejamento orçamentário e legislativo do Município, com a devida análise de impacto fiscal e jurídico.

        Custo: Nenhum (medida desonerativa)
        Vereador Sr. Anti-Impostinho.`,

        new Estatistica({
            imposto: -4,
            alegria: 14,
            economia: 14,
            populacao: 1.03,
            tituloNoticia: "Câmara aprova redução de impostos municipais para aliviar carga tributária",
            noticia: `A Câmara Municipal aprovou a proposta do vereador Sr. Anti-Impostinho que visa reduzir impostos gerais, como IPTU e ISS, com o objetivo de estimular a economia local e aliviar a carga tributária sobre a população e empreendedores.

        A medida, que passará por estudos técnicos e financeiros, busca incentivar o consumo, atrair novos negócios e gerar empregos, promovendo um ambiente mais competitivo no município. Comerciantes e moradores comemoraram a decisão, que pode também aumentar a arrecadação a médio prazo.

        “Essa redução vai ajudar muito meu pequeno negócio a crescer”, afirmou o empresário Carlos Mendes, dono de uma padaria no centro da cidade. A proposta não terá custo imediato para os cofres públicos, sendo uma medida desonerativa.`
        }),
        new Estatistica({
            imposto: 2,
            alegria: -10,
            economia: -10,
            populacao: 0.95,
            tituloNoticia: "Câmara rejeita proposta de redução de impostos municipais",
            noticia: `A Câmara Municipal decidiu rejeitar a proposta do vereador Sr Anti-Impostinho que sugeria a redução de impostos como IPTU e ISS para estimular a economia local. A justificativa foi a preocupação com o impacto fiscal a curto prazo no orçamento público.

        Apesar dos argumentos de que a medida poderia aliviar a carga tributária e atrair investimentos, a maioria dos vereadores considerou o momento inadequado, citando a necessidade de manter a arrecadação para cobrir despesas essenciais. Empresários demonstraram frustração com a decisão.

        “Perdemos uma oportunidade de reaquecer o comércio e gerar empregos”, lamentou a microempreendedora Ana Lúcia, dona de uma loja de roupas. A proposta, que não teria custo direto, foi arquivada para possível revisão no futuro.`
        })
    ),

    new Proposta("Plantação de árvores no centro da cidade",
        `
        Por meio da presente, propomos a realização de um projeto de plantação de árvores no centro da cidade, com o objetivo de melhorar a qualidade do ar, reduzir as ilhas de calor, embelezar os espaços públicos e promover a sustentabilidade ambiental. A iniciativa poderá incluir o plantio de espécies nativas e ornamentais em calçadas, praças e canteiros centrais, com acompanhamento técnico para garantir a harmonia com a infraestrutura urbana.

        A arborização urbana contribui para o bem-estar da população, a valorização dos espaços públicos e o equilíbrio ecológico, além de oferecer sombra, abrigo para a fauna e benefícios estéticos que incentivam o uso coletivo das áreas centrais. A ação também poderá envolver escolas e organizações locais em atividades de educação ambiental.

        Diante do exposto, solicitamos a inclusão do projeto no plano de revitalização urbana e meio ambiente do Município, com a devida previsão orçamentária para aquisição de mudas, insumos e mão de obra.
        
        Custo: 2200 reais.
        Vereador Caveirinha.

        `,
        new Estatistica({
            dinheiro: -2200,
            meioAmbiente: 8,
            alegria: 6,
            saude: 3,
            tituloNoticia: "Câmara aprova projeto de arborização no centro da cidade",
            noticia: `A Câmara Municipal aprovou a proposta de plantação de árvores no centro da cidade, apresentada pelo vereador Caveirinha. O projeto visa melhorar a qualidade do ar, reduzir as ilhas de calor e embelezar os espaços públicos, com o plantio de espécies nativas e ornamentais em praças e calçadas.  

        A iniciativa, que contará com apoio técnico e participação da comunidade, também incluirá ações de educação ambiental em escolas. Moradores e comerciantes comemoraram a decisão, destacando os benefícios para o bem-estar e a valorização da região central.  

        “Ter mais árvores vai deixar a cidade mais fresca e agradável”, disse Maria Souza, dona de uma loja no centro. O projeto será incluído no plano de revitalização urbana, com previsão orçamentária para mudas e manutenção.`
        }),
        new Estatistica({
            meioAmbiente: -6,
            alegria: -2,
            saude: -4,
            tituloNoticia: "Câmara rejeita projeto de plantio de árvores no centro da cidade",
            noticia: `A Câmara Municipal rejeitou a proposta de arborização no centro da cidade, apresentada pelo vereador Caveirinha. A justificativa foi a falta de recursos no orçamento e preocupações com possíveis conflitos com a infraestrutura urbana, como raízes danificando calçadas.  

        Apesar dos argumentos sobre melhorias na qualidade do ar e no bem-estar da população, a maioria dos vereadores considerou que o momento não é adequado para o investimento. Ambientalistas e moradores expressaram frustração com a decisão.  

        “Perdemos a chance de deixar a cidade mais verde e sustentável”, lamentou o estudante Pedro Almeida, integrante de um grupo ecológico local. A proposta foi arquivada, mas poderá ser reconsiderada no futuro.`
        })
    ),

    new Proposta("Implantação de energia solar em unidades municipais",
        `
        Por meio da presente, propomos a implantação de sistemas de energia solar fotovoltaica nas unidades municipais, como escolas, postos de saúde, prédios administrativos e centros comunitários, com o objetivo de reduzir os custos com energia elétrica, promover o uso de fontes renováveis e contribuir com a sustentabilidade ambiental. A proposta pode ser executada por meio de parcerias públicas, convênios com instituições federais e uso de recursos próprios ou emendas parlamentares.

        Essa iniciativa permitirá significativa economia aos cofres públicos a médio e longo prazo, além de servir como modelo educativo e de conscientização ambiental para a população. A adoção de energia limpa reafirma o compromisso do Município com a inovação, a responsabilidade ambiental e o futuro das próximas gerações.

        Diante do exposto, solicitamos a inclusão do projeto no plano de modernização da infraestrutura pública, com a devida previsão orçamentária e estudos técnicos de viabilidade.
        
        Custo: 4800,
        Vereador DeepSeek.
        
        `,
        new Estatistica({
            dinheiro: -4800,
            economia: 8,
            meioAmbiente: 12,
            infraestrutura: 10,
            tituloNoticia: "Câmara aprova projeto de energia solar em prédios públicos para reduzir custos e promover sustentabilidade",
            noticia: `A Câmara Municipal aprovou por maioria o projeto do vereador DeepSeek que prevê a instalação de sistemas de energia solar em escolas, postos de saúde e prédios administrativos. A medida visa reduzir gastos com energia elétrica em até 40% nos próximos anos, além de promover fontes renováveis.

        O projeto será implementado através de parcerias públicas e recursos de emendas parlamentares. Técnicos estimam que a economia gerada poderá ser reinvestida em melhorias para a população. "É um avanço para o meio ambiente e para os cofres públicos", afirmou o secretário de Administração.

        Moradores comemoram a iniciativa: "Minha filha estuda em uma escola municipal que sempre sofre com falta de verba. Essa economia pode melhorar a educação", disse a dona de casa Eliana Torres, mãe de uma aluna da rede pública.`
        }),
        new Estatistica({
            economia: -8,
            meioAmbiente: -10,
            infraestrutura: -7,
            tituloNoticia: "Proposta de energia solar em prédios públicos é rejeitada por falta de verba",
            noticia: `A Câmara Municipal rejeitou o projeto de implantação de energia solar fotovoltaica em unidades públicas, apresentado pelo vereador DeepSeek. A justificativa foi a inviabilidade financeira no atual cenário orçamentário.

        Apesar dos argumentos sobre economia a longo prazo e benefícios ambientais, a maioria dos vereadores considerou o investimento inicial elevado. "A ideia é boa, mas não temos como bancar os custos agora", declarou o presidente da Comissão de Finanças.

        Ambientalistas criticaram a decisão: "Perdemos a chance de modernizar a cidade e reduzir a pegada de carbono", protestou o coordenador do Instituto EcoLocal, Marcos Rocha. O vereador proponente afirmou que buscará alternativas para reapresentar a proposta no próximo ano.`
        })
    ),

    new Proposta("Introdução de energia eólica na cidade",
        `
        Por meio da presente, propomos a introdução de energia eólica no Município, com o objetivo de diversificar a matriz energética local, reduzir os custos com eletricidade e fortalecer o compromisso com fontes de energia limpa e sustentável. A proposta visa a instalação de aerogeradores em áreas estratégicas, de forma experimental ou permanente, com base em estudos técnicos sobre a viabilidade dos ventos e parcerias com instituições públicas e privadas.

        A adoção da energia eólica representa um avanço tecnológico importante, além de gerar benefícios ambientais, educacionais e econômicos. O projeto poderá ainda atrair investimentos, fomentar a inovação e criar oportunidades de capacitação e emprego no setor de energias renováveis.

        Diante do exposto, solicitamos a inclusão desta proposta no planejamento estratégico do Município, com a devida previsão orçamentária para estudos de viabilidade, instalação piloto e estrutura de apoio.
        
        Custo: 6400 reais
        Vereador Alberto de Judas.


        `,
        new Estatistica({
            dinheiro: -6400,
            economia: 6,
            alegria: 6,
            meioAmbiente: 14,
            infraestrutura: 10,
            populacao: 1.025,
            tituloNoticia: "Câmara aprova projeto pioneiro de energia eólica para diversificar matriz energética da cidade",
            noticia: `A Câmara Municipal aprovou hoje o projeto inovador do vereador Alberto de Judas que prevê a instalação de aerogeradores em áreas estratégicas da cidade. A iniciativa tem como objetivo reduzir custos com energia elétrica e promover fontes renováveis, colocando o município na vanguarda da sustentabilidade energética.

        O projeto será implementado inicialmente de forma experimental, com parcerias entre poder público, universidades e empresas especializadas. Estudos preliminares indicam que a região possui ventos favoráveis para geração de energia limpa. "Esta é uma oportunidade para nos tornarmos referência em energias renováveis", destacou o secretário de Meio Ambiente.

        Moradores e empresários comemoraram a decisão. "Além de ajudar o meio ambiente, pode trazer novos empregos para nossa região", afirmou Carlos Mendes, dono de um restaurante local. A previsão é que os primeiros aerogeradores comecem a ser instalados dentro de 12 meses.`
        }),
        new Estatistica({
            economia: -8,
            meioAmbiente: -12,
            alegria: -5,
            infraestrutura: -8,
            tituloNoticia: "Projeto de energia eólica é rejeitado pela Câmara Municipal",
            noticia: `A proposta de implantação de energia eólica no município, apresentada pelo vereador Alberto de Judas, foi rejeitada pela maioria dos parlamentares. Os opositores alegaram altos custos iniciais e incertezas sobre a viabilidade técnica do projeto.

        Apesar dos argumentos sobre benefícios ambientais e econômicos a longo prazo, os vereadores consideraram que o município não possui condições financeiras para bancar os estudos e a infraestrutura necessários. "É uma ideia interessante, mas prematura para nossa realidade atual", declarou o relator do projeto.

        Ambientalistas e acadêmicos criticaram a decisão. "Perdemos a chance de dar um salto tecnológico e reduzir nossa dependência de energias poluentes", lamentou a professora de Engenharia Ambiental da Universidade local, Dra. Ana Beatriz. O vereador proponente afirmou que continuará buscando alternativas para viabilizar o projeto no futuro.`
        })
    ),

    new Proposta("Insenção de impostos sobre carros elétricos",
        `
        Por meio da presente, propomos a isenção total dos impostos municipais incidentes sobre veículos elétricos, como o IPVA municipal (quando aplicável) e taxas de licenciamento e estacionamento público, com o objetivo de incentivar a mobilidade sustentável, reduzir a emissão de poluentes e modernizar a frota veicular da cidade. A medida também poderá incluir benefícios como isenção de rodízios ou prioridade em zonas de tráfego limitado.

        Essa iniciativa visa alinhar o Município às diretrizes de sustentabilidade e inovação, promovendo a transição para fontes de energia limpa no transporte urbano, além de posicionar a cidade como referência em políticas ambientais e estímulo à tecnologia verde.

        Diante do exposto, solicitamos a análise jurídica e financeira da viabilidade da medida, bem como sua inclusão no plano de mobilidade urbana e desenvolvimento sustentável do Município.
        
        Custo: 0 (Redução de imposto)
        Vereador Nascimento.

        `,
        new Estatistica({
            imposto: -2,
            meioAmbiente: 10,
            economia: 6,
            alegria: 6,
            tituloNoticia: "Câmara aprova isenção fiscal para carros elétricos em incentivo à mobilidade sustentável",
            noticia: `A Câmara Municipal aprovou hoje o projeto do vereador Nascimento que concede isenção total de impostos municipais para veículos elétricos, incluindo IPVA municipal, taxas de licenciamento e estacionamento público. A medida busca estimular a adoção de transportes não poluentes e modernizar a frota veicular da cidade.

        "Esta é uma política visionária que coloca nossa cidade na vanguarda da mobilidade sustentável", declarou o secretário de Meio Ambiente durante a sessão. Estudos da prefeitura indicam que a medida pode reduzir em até 15% as emissões de CO2 no trânsito municipal nos próximos cinco anos.

        Proprietários de veículos elétricos comemoraram: "Agora ficou mais acessível manter meu carro limpo na cidade", disse a arquiteta Juliana Moraes, que adquiriu um veículo elétrico há seis meses. A isenção entra em vigor em 60 dias e inclui benefícios como liberação de rodízios municipais.`
        }),
        new Estatistica({
            imposto: 2,
            economia: -5,
            meioAmbiente: -10,
            alegria: -8,
            tituloNoticia: "Proposta de isenção para carros elétricos é rejeitada por impacto no orçamento",
            noticia: `A Câmara Municipal rejeitou o projeto que previa isenção de impostos para veículos elétricos, apresentado pelo vereador Nascimento. A maioria dos parlamentares considerou que a medida criaria um rombo significativo nos cofres públicos sem benefício imediato para a maioria da população.

        "Apoiamos a sustentabilidade, mas não podemos abrir mão de recursos essenciais para serviços públicos", argumentou o líder do governo na Casa. Dados da secretaria de Finanças estimavam perda anual de R$ 2,8 milhões em arrecadação.

        Ambientalistas criticaram a decisão: "Perdemos a chance de acelerar a transição ecológica no transporte", protestou o diretor da ONG Mobilidade Verde, Ricardo Lopes. O vereador proponente afirmou que buscará alternativas parciais para reapresentar a proposta.`
        })
    ),

    new Proposta("Projeto: Cidade 100% reciclada",
        `
        Por meio da presente, propomos a criação e implementação do projeto Cidade 100% Reciclada, com o objetivo de transformar o Município em referência nacional em gestão de resíduos sólidos e sustentabilidade ambiental. A iniciativa contempla ações como coleta seletiva universalizada, instalação de ecopontos, campanhas de conscientização, parcerias com cooperativas de catadores e incentivo à reciclagem em escolas, comércios e repartições públicas.

        O projeto visa reduzir significativamente o volume de lixo destinado a aterros, promover a economia circular, gerar empregos verdes e fortalecer a educação ambiental. Além disso, contribui para a melhoria da qualidade de vida, preservação dos recursos naturais e fortalecimento da imagem do Município como comprometido com o futuro sustentável.

        Diante do exposto, solicitamos a inclusão do projeto no plano diretor municipal e na política de meio ambiente, com a devida previsão orçamentária para sua execução em etapas.
        
        Custo: 2900 reais.
        Vereador Risadinha.

        `,
        new Estatistica({
            meioAmbiente: 8,
            dinheiro: -2900,
            economia: 5,
            alegria: 2,
            infraestrutura: 6,
            tituloNoticia: "Câmara transforma cidade em modelo nacional de reciclagem com projeto pioneiro",
            noticia: `A Câmara Municipal aprovou por unanimidade o projeto "Cidade 100% Reciclada", proposta do vereador Risadinha que posicionará o município como referência em sustentabilidade. O plano prevê coleta seletiva em 100% dos bairros, instalação de 30 ecopontos estratégicos e parcerias com cooperativas de catadores até 2026.

        "Esta é a política ambiental mais ousada dos últimos 20 anos", declarou a secretária de Meio Ambiente, destacando que o projeto pode desviar 80% do lixo dos aterros. A primeira fase começará pelo centro expandido, com investimento inicial de R$ 3,2 milhões em infraestrutura e educação ambiental.

        Cooperativas celebram: "Finalmente teremos estrutura digna para nosso trabalho", comemorou Maria dos Santos, presidente da CooperRecicla. Escolas municipais incorporarão oficinas de reciclagem no currículo a partir do próximo semestre.`
        }),
        new Estatistica({
            meioAmbiente: -4,
            economia: -4,
            alegria: -4,
            infraestrutura: -4,
            tituloNoticia: "Projeto ambicioso de reciclagem integral é barrado na Câmara",
            noticia: `O projeto "Cidade 100% Reciclada", que pretendia transformar o município em modelo nacional de sustentabilidade, foi rejeitado por 15 votos contra 10. Os opositores alegaram custos proibitivos (R$ 12 milhões totais) e complexidade operacional.

        "A ideia é nobre, mas inviável no atual cenário fiscal", justificou o relator. Estudos da secretaria de Serviços Urbanos indicavam necessidade de triplicar a frota de coleta seletiva, com retorno financeiro apenas após 7 anos.

        Ambientalistas reagiram: "Preferiram o comodismo à visão de futuro", criticou o Movimento EcoCidade. Catadores de materiais recicláveis protestaram nas galerias. O vereador proponente prometeu fragmentar a proposta em projetos menores para tentar aprovação parcial.`
        })
    ),

    new Proposta("Distribuição de tablets para estudo nas escolas municipais",
        `
        Por meio da presente, propomos a distribuição de tablets para uso educacional nas escolas da rede municipal de ensino, com o objetivo de modernizar os processos pedagógicos, ampliar o acesso dos alunos à tecnologia e promover a inclusão digital desde os primeiros anos de escolarização. Os dispositivos poderão ser utilizados em sala de aula e em casa, com acesso a plataformas educativas, conteúdos didáticos e ferramentas interativas.

        A iniciativa contribuirá para a melhoria do rendimento escolar, a formação tecnológica dos estudantes e o fortalecimento da igualdade de oportunidades, especialmente para alunos em situação de vulnerabilidade social. Além disso, a ação estará alinhada com as diretrizes nacionais de inovação na educação pública.

        Diante do exposto, solicitamos a inclusão do projeto no planejamento da Secretaria Municipal de Educação, com a devida previsão orçamentária para aquisição dos equipamentos, treinamento de professores e suporte técnico.
        
        Custo: 5200 reais
        Vereador BMW
        
        `,
        new Estatistica({
            dinheiro: -5200,
            educacao: 14,
            alegria: 9,
            infraestrutura: 9,
            tituloNoticia: "Câmara aprova distribuição de tablets para todos os alunos da rede municipal",
            noticia: `A Câmara Municipal aprovou hoje o projeto do vereador BMW que prevê a distribuição de tablets educacionais para os 28 mil alunos da rede pública municipal. A iniciativa, que contará com investimento inicial de R$ 8,5 milhões, tem como objetivo reduzir a desigualdade digital e modernizar o ensino na cidade.

        "Esta é uma revolução na educação municipal", declarou a secretária de Educação, anunciando que os primeiros 5 mil dispositivos serão entregues já no início do próximo ano letivo. Os tablets virão com conteúdo pedagógico pré-instalado e acesso gratuito a plataformas educacionais.

        Pais e educadores comemoram: "Meus filhos finalmente terão as mesmas oportunidades que alunos de escolas particulares", disse a dona de casa Carla Santos, mãe de dois estudantes. Professores receberão capacitação especial para integrar a tecnologia às aulas.`
        }),
        new Estatistica({
            educacao: -11,
            alegria: -9,
            infraestrutura: -7,
            tituloNoticia: "Projeto de tablets para escolas municipais é rejeitado por falta de verba",
            noticia: `O projeto que previa a distribuição de tablets para alunos da rede pública municipal foi rejeitado pela Câmara por 12 votos contra 9. A justificativa foi a incompatibilidade com o atual cenário orçamentário, que prioriza obras emergenciais em unidades escolares.

        "A proposta é meritória, mas o custo de R$ 8,5 milhões inviabiliza sua execução neste momento", explicou o relator. Estudos técnicos apontavam ainda desafios como manutenção dos equipamentos e conectividade em áreas periféricas.

        Professores manifestaram decepção: "Perdemos a chance de reduzir o abismo tecnológico", lamentou a diretora da Escola Municipal João Paulo II. O vereador proponente afirmou que buscará parcerias com a iniciativa privada para viabilizar versão reduzida do projeto.`
        })

    ),

    new Proposta("Investimentos gerais na segurança",
        `Por meio da presente, propomos a realização de investimentos estratégicos na segurança pública municipal, com o objetivo de garantir maior proteção à população, prevenir a criminalidade e fortalecer as ações das forças de segurança locais. A iniciativa poderá contemplar a aquisição de viaturas, instalação de câmeras de monitoramento em pontos críticos, melhoria na iluminação pública, capacitação da Guarda Municipal e integração com sistemas estaduais de segurança.

        A medida visa promover a sensação de segurança, valorizar os profissionais da área e tornar o Município um ambiente mais seguro para viver, estudar e empreender. Com uma abordagem preventiva e tecnológica, será possível aumentar a eficiência na resposta às ocorrências e reduzir os índices de violência.

        Diante do exposto, solicitamos a inclusão desta proposta no planejamento orçamentário e no plano de ação da Secretaria Municipal de Segurança, com a devida previsão de recursos.
        
        Custo: 3000 reais
        Vereador Vogais
        
        
        `,
        new Estatistica({
            dinheiro: -3000,
            seguranca: 21,
            tituloNoticia: "Prefeitura e Câmara aprovam pacote de R$ 15 milhões para modernizar segurança municipal",
            noticia: `Foi aprovado hoje o plano de investimentos em segurança pública proposto pelo vereador Vogais, com orçamento de R$ 15 milhões para aquisição de 30 novas viaturas, instalação de 500 câmeras de monitoramento e modernização da iluminação pública em áreas de risco. A medida integra o programa municipal "Cidade Segura".

        "Estamos dando um salto na capacidade de prevenção e resposta", afirmou o secretário de Segurança, destacando que os recursos também incluem treinamento especializado para 200 guardas municipais e integração com o sistema estadual de inteligência. As primeiras câmeras começam a ser instaladas em 90 dias.

        Comerciantes e moradores de regiões críticas comemoram: "Finalmente teremos segurança para abrir nossos negócios até mais tarde", declarou André Lima, dono de um restaurante no centro. O projeto prevê ainda parcerias com universidades para análise de dados criminais.`
        }),
        new Estatistica({
            seguranca: -8,
            alegria: -8,
            tituloNoticia: "Câmara rejeita pacote de investimentos em segurança por divergências sobre prioridades",
            noticia: `O projeto de investimentos em segurança pública foi rejeitado pela Câmara Municipal após acalorados debates. A proposta do vereador Vogais, que previa R$ 15 milhões para viaturas, câmeras e capacitação, foi derrotada por 14 votos contra 11, com críticas à distribuição dos recursos.

        "Precisamos primeiro resolver problemas estruturais básicos antes de investir em tecnologia", argumentou a líder da oposição. Técnicos da prefeitura alertaram sobre dificuldades de manutenção dos equipamentos a médio prazo sem garantia de verba adicional.

        Associações de bairro protestaram: "Estamos abandonados à própria sorte", desabafou Maria Oliveira, presidente do conselho comunitário do Jardim São Pedro. O prefeito sinalizou que enviará nova proposta com foco inicial no policiamento preventivo.`
        })
    ),

    new Proposta("Investimentos gerais na saúde",
        `Por meio da presente, propomos a realização de investimentos gerais na área da saúde pública municipal, com o objetivo de ampliar e qualificar o atendimento à população, reduzir filas, garantir o abastecimento de medicamentos e fortalecer a estrutura física e humana das unidades de saúde. A proposta inclui aquisição de equipamentos médicos, reformas de postos de saúde, contratação de profissionais e ampliação dos serviços de atenção básica e especializada.

        A iniciativa contribuirá para o acesso universal e igualitário à saúde, assegurando melhores condições de diagnóstico, tratamento e prevenção de doenças, especialmente para as comunidades mais vulneráveis. Além disso, os investimentos permitirão maior resolutividade no atendimento e valorização dos servidores da área.

        Diante do exposto, solicitamos a inclusão da proposta no plano de gestão da Secretaria Municipal de Saúde, com a devida previsão orçamentária.
        
        Custo: 3000 reais
        Vereador Dráuzio
    
        `,
        new Estatistica({
            dinheiro: -3000,
            saude: 21,
            tituloNoticia: "Câmara aprova amplo pacote de investimentos para fortalecer a saúde municipal",
            noticia: `A Câmara Municipal aprovou por ampla maioria o projeto do vereador Dráuzio que prevê uma série de melhorias para a rede pública de saúde. A medida inclui a aquisição de novos equipamentos médicos, reformas em unidades de saúde e a contratação de profissionais para reforçar o atendimento à população.

        "Estamos dando um importante passo para garantir saúde de qualidade para todos os cidadãos", declarou o secretário municipal de Saúde durante a sessão. O projeto beneficiará especialmente as comunidades mais carentes, com ampliação dos serviços de atenção básica e especializada.

        Moradores comemoraram a decisão: "Finalmente teremos um posto de saúde digno no nosso bairro", disse a dona de casa Marta Silva, residente na Zona Leste. As primeiras ações devem começar ainda neste semestre, priorizando as regiões com maior carência de serviços.`
        }),
        new Estatistica({
            saude: -6,
            alegria: -5,
            infraestrutura: -5,
            tituloNoticia: "Proposta de investimentos na saúde é rejeitada pela Câmara Municipal",
            noticia: `O projeto que previa melhorias para a rede pública de saúde foi rejeitado pela Câmara Municipal após debates acalorados. A proposta do vereador Dráuzio, que incluía aquisição de equipamentos e reformas em unidades de saúde, não obteve votos suficientes para aprovação.

        "Reconhecemos a importância da proposta, mas o momento não é adequado para sua implementação", justificou o relator do projeto. Alguns vereadores defenderam que as ações precisam ser melhor planejadas para garantir sua efetividade.

        Usuários do SUS manifestaram preocupação: "Nossas unidades de saúde continuarão precárias", lamentou o aposentado João Santos, frequentador de um posto no centro da cidade. O vereador proponente afirmou que trabalhará em uma nova versão do projeto para reapresentação no próximo ano.`
        })
    ),

    new Proposta("Investimentos gerais na economia",
        `Por meio da presente, propomos a realização de investimentos estratégicos na economia municipal, com o objetivo de estimular o desenvolvimento local, gerar empregos, apoiar o empreendedorismo e fortalecer os setores produtivos da cidade. A proposta engloba ações como incentivos a micro e pequenas empresas, qualificação profissional, modernização da infraestrutura comercial, apoio a feiras e eventos econômicos, além de parcerias com instituições financeiras para facilitar o acesso ao crédito.

        Esses investimentos visam dinamizar a atividade econômica, aumentar a arrecadação, atrair novos negócios e promover a inclusão produtiva, beneficiando especialmente jovens, mulheres e trabalhadores informais. A medida também reforça a autonomia do Município e prepara a cidade para os desafios de um mercado cada vez mais competitivo.

        Diante do exposto, solicitamos a inclusão da proposta no plano de desenvolvimento econômico do Município, com a devida previsão orçamentária.
        
        Custo: 3000 reais.
        Vereador Juão Paulo.

        `,
        new Estatistica({
            dinheiro: -3000,
            economia: 21,
            tituloNoticia: "Câmara aprova pacote de medidas para impulsionar a economia local",
            noticia: `A Câmara Municipal aprovou hoje o projeto do vereador Dr. Juão Paulo que estabelece um conjunto de ações para estimular o desenvolvimento econômico da cidade. A iniciativa prevê incentivos para pequenos negócios, programas de qualificação profissional e modernização da infraestrutura comercial.

        "Estamos plantando as sementes para uma economia mais forte e inclusiva", declarou o secretário de Desenvolvimento Econômico. O pacote inclui ainda a realização de feiras empresariais e parcerias para facilitar o acesso ao crédito, com foco especial em jovens empreendedores e mulheres chefes de família.

        Comerciantes comemoraram a decisão: "Esses incentivos vão ajudar minha pequena loja a se recuperar após a crise", afirmou Carlos Mendes, dono de uma mercearia no bairro industrial. As primeiras ações devem começar ainda neste trimestre.`
        }),
        new Estatistica({
            economia: -8,
            alegria: -8,
            tituloNoticia: "Proposta de estímulo à economia local é rejeitada pela Câmara",
            noticia: `O projeto que visava impulsionar a economia municipal foi rejeitado pela Câmara após intensos debates. A proposta do vereador Juão Paulo, que incluía incentivos a pequenas empresas e programas de qualificação, não obteve maioria dos votos.

        "A ideia é válida, mas precisa de ajustes para se adequar à realidade orçamentária", explicou o relator da matéria. Alguns vereadores defenderam que as ações propostas deveriam ter foco mais específico em setores estratégicos.

        Pequenos empresários expressaram decepção: "Perdemos uma oportunidade de renovar nossos negócios", lamentou a artesã Ana Lúcia, que participa de feiras locais. O vereador proponente afirmou que trabalhará em uma versão revisada do projeto.`
        })
    ),

    new Proposta("Investimentos gerais na educação",
        `Por meio da presente, propomos a realização de investimentos abrangentes na educação municipal, com o objetivo de melhorar a infraestrutura das escolas, qualificar os profissionais da educação, ampliar o acesso a materiais didáticos e tecnologias educacionais, e fortalecer programas pedagógicos voltados para a inclusão e o desenvolvimento integral dos alunos. A iniciativa poderá incluir reformas e ampliações de unidades escolares, capacitação continuada para professores, aquisição de equipamentos tecnológicos e estímulo a atividades culturais e esportivas.

        Esses investimentos visam garantir ensino de qualidade, promover a equidade educacional e preparar os estudantes para os desafios do século XXI, contribuindo para o progresso social e econômico do Município. Além disso, reforça o compromisso da gestão pública com a valorização da educação como base do desenvolvimento sustentável.

        Diante do exposto, solicitamos a inclusão da proposta no planejamento da Secretaria Municipal de Educação, com a devida previsão orçamentária para sua execução.
        
        Custo: 3000 reais.
        Vereador Greg Heffley.
        
        
        `,
        new Estatistica({
            dinheiro: -3000,
            educacao: 21,
            tituloNoticia: "Câmara aprova pacote histórico de investimentos para revolucionar educação municipal",
            noticia: `A Câmara Municipal aprovou por unanimidade o ambicioso projeto de investimentos educacionais proposto pelo vereador Greg Heffley. O plano prevê transformações profundas na rede municipal de ensino, com modernização de escolas, capacitação de professores e aquisição de tecnologias educacionais de ponta.

        "Estamos escrevendo um novo capítulo na educação do nosso município", declarou emocionada a secretária de Educação, destacando que o projeto beneficiará mais de 50 mil alunos. As ações incluem desde reformas em unidades escolares até a implantação de laboratórios de ciências e robótica em todas as regionais.

        Professores e pais comemoram: "Meus filhos terão acesso à mesma qualidade de ensino das melhores escolas particulares", comemorou a dona de casa Eliana Costa, mãe de dois estudantes. As primeiras intervenções começam já no próximo mês, com prioridade para as escolas em pior estado de conservação.`
        }),
        new Estatistica({
            educacao: -6,
            infraestrutura: -5,
            alegria: -5,
            tituloNoticia: "Projeto de modernização da educação municipal é barrado na Câmara",
            noticia: `O amplo pacote de investimentos na educação pública municipal foi rejeitado após acirrada discussão na Câmara. A proposta do vereador Greg Heffley, que prometia revolucionar as escolas da rede pública, não conseguiu os votos necessários para aprovação.

        "A iniciativa é louvável, mas desconsidera nossas reais possibilidades financeiras", argumentou o líder do governo. Estudos técnicos apontaram incompatibilidade entre o escopo do projeto e a capacidade atual de execução da secretaria de Educação.

        A comunidade escolar reagiu com frustração: "Mais uma vez a educação fica para depois", protestou a diretora Maria Fernandes, de uma escola na periferia. O vereador afirmou que fragmentará a proposta em projetos menores para tentar aprovação parcial ainda este ano.`})
    ),

    new Proposta("Investimentos gerais na infraestrutura",
        `Por meio da presente, propomos a realização de investimentos estratégicos na infraestrutura municipal, com o objetivo de modernizar e ampliar a rede viária, melhorar o sistema de abastecimento de água, saneamento básico, iluminação pública, e fortalecer a infraestrutura urbana e rural para garantir melhores condições de vida à população. A proposta abrange reparos, obras de pavimentação, expansão de redes elétricas e hidráulicas, além de projetos voltados para acessibilidade e mobilidade urbana.

        Esses investimentos visam impulsionar o desenvolvimento socioeconômico do Município, promover a inclusão social e garantir a sustentabilidade ambiental, atendendo às demandas atuais e futuras da comunidade. Ademais, contribuem para a valorização dos imóveis, atração de novos investimentos e melhoria da qualidade dos serviços públicos.

        Diante do exposto, solicitamos a inclusão da proposta no planejamento orçamentário e estratégico da Prefeitura, com a devida previsão de recursos para sua execução.
        
        Custo: 3000 reais
        Vereador Lukete

        
        `,
        new Estatistica({
            dinheiro: -3000,
            infraestrutura: 21,
            tituloNoticia: "Câmara aprova megapacote de infraestrutura que transformará a cidade",
            noticia: `Em sessão histórica, a Câmara Municipal aprovou por ampla maioria o ambicioso plano de investimentos em infraestrutura proposto pelo vereador Lukete. O projeto vai revolucionar a malha urbana com obras de pavimentação, saneamento básico completo e modernização do sistema de iluminação pública em todos os bairros.

        "Estamos corrigindo décadas de atraso e preparando a cidade para o futuro", declarou o prefeito durante o anúncio. O pacote prevê ainda a universalização do acesso à água potável e a criação de corredores acessíveis para pessoas com deficiência.

        Moradores de áreas carentes comemoram: "Finalmente teremos ruas pavimentadas e esgoto tratado", comemorou a líder comunitária Rita Oliveira, da região Norte. As obras prioritárias começam em 60 dias, com cronograma de execução em etapas até 2026.`
        }),
        new Estatistica({
            infraestrutura: -8,
            alegria: -8,
            tituloNoticia: "Projeto que prometia revolucionar infraestrutura da cidade é rejeitado",
            noticia: `O amplo plano de modernização da infraestrutura municipal foi barrado na Câmara após acalorados debates. A proposta do vereador Lukete, que previa obras em saneamento, pavimentação e iluminação pública, foi considerada "inviável no cenário atual" pela maioria dos parlamentares.

        "Apesar de necessário, o projeto exige recursos além da nossa capacidade", justificou o relator. Técnicos alertaram sobre riscos de licitações apressadas e sobrecarga na máquina pública para gerenciar tantas obras simultaneamente.

        Comunidades periféricas protestaram: "Continuaremos vivendo na idade das trevas", desabafou o pedreiro Marcos Silva, morador de um bairro sem asfalto há 20 anos. O prefeito sinalizou que enviará uma versão mais enxuta do projeto em breve.`
        })
    ),

    new Proposta("Investimentos gerais no meio ambiente",
        `Por meio da presente, propomos a realização de investimentos abrangentes na área ambiental municipal, com o objetivo de preservar os recursos naturais, promover a sustentabilidade, melhorar a qualidade de vida da população e garantir o equilíbrio ecológico do Município. A iniciativa inclui ações como recuperação de áreas degradadas, conservação de mananciais, ampliação da arborização urbana, educação ambiental, fiscalização ambiental e incentivo a práticas sustentáveis entre cidadãos e empresas.

        Esses investimentos contribuirão para a proteção da biodiversidade local, a mitigação dos efeitos das mudanças climáticas e o fortalecimento das políticas públicas ambientais, além de promover a conscientização social e o engajamento comunitário em prol do meio ambiente.

        Diante do exposto, solicitamos a inclusão da proposta no plano municipal de meio ambiente, com a devida previsão orçamentária para sua implementação.
        
        Custo: 3000.
        Vereadora Jinx`,

        new Estatistica({
            dinheiro: -3000,
            meioAmbiente: 21,
            tituloNoticia: "Câmara aprova pacote de investimentos ambientais para preservação e sustentabilidade",
            noticia: `A Câmara Municipal aprovou por ampla maioria o projeto de investimentos em meio ambiente proposto pela vereadora Jinx, que prevê recuperação de áreas degradadas, proteção de mananciais e ampliação de áreas verdes urbanas.  

        A iniciativa, que será incluída no orçamento municipal, inclui ainda programas de educação ambiental e fiscalização para garantir práticas sustentáveis. "É um avanço para nossa cidade, que precisa urgentemente de políticas ecológicas de longo prazo", declarou a bióloga Marta Rios, integrante de uma ONG local.  

        Moradores de bairros afetados por enchentes comemoraram a medida: "Finalmente teremos ações concretas para proteger nossos rios", disse o aposentado José Almeida. A prefeitura estima que os projetos gerem empregos verdes e melhorem a qualidade do ar e da água em até cinco anos.
        `
        }),

        new Estatistica({
            meioAmbiente: -6,
            alegria: -5,
            infraestrutura: -5,
            tituloNoticia: "Câmara barra investimentos em meio ambiente por falta de recursos",
            noticia: `A proposta de ampliação de investimentos ambientais no município, apresentada pela vereadora Jinx, foi rejeitada pela maioria da Câmara sob alegação de "restrições orçamentárias". O projeto incluía recuperação de áreas verdes, proteção de nascentes e campanhas de conscientização.  

        "Infelizmente, prioridades como saúde e segurança consomem nosso orçamento", justificou o relator da matéria. Ambientalistas criticaram a decisão: "É um retrocesso, já sofremos com erosões e poluição", protestou Carlos Mendes, do Movimento EcoVida.  

        A vereadora autora da proposta prometeu buscar parcerias com o governo estadual para viabilizar parte das ações. Enquanto isso, moradores de regiões com risco de deslizamentos temem pelo adiamento das medidas: "A natureza não espera", desabafou a dona de casa Lucia Santos.`
        })
    ),

    new Proposta("Incentivar o aumento da natalidade",
        `Por meio da presente, propomos a implementação de políticas públicas voltadas para o incentivo ao aumento da natalidade no Município, com o objetivo de promover o equilíbrio demográfico e assegurar o desenvolvimento sustentável da comunidade. A proposta contempla ações como ampliação do acesso a serviços de saúde materno-infantil, programas de apoio financeiro e social para gestantes e famílias, flexibilização de benefícios trabalhistas, e campanhas educativas sobre a importância da maternidade e paternidade responsáveis.

        Essas medidas visam criar um ambiente favorável à formação e ampliação das famílias, garantindo assistência integral durante a gravidez, parto e primeiros anos de vida, além de incentivar o planejamento familiar consciente e a responsabilidade social.

        Diante do exposto, solicitamos a inclusão da proposta no plano municipal de saúde e assistência social, com a devida previsão orçamentária para sua execução.
        
        Custo: 4400 reais.
        Vereador Alguém do Outro Lado da Rua de Dentro`,

        new Estatistica({
            dinheiro: -4400,
            populacao: 1.12,
            economia: -7,
            saude: -7,
            alegria: -1,
            tituloNoticia: "Município aprova pacote de incentivos para aumentar natalidade e apoiar famílias",
            noticia: `A Câmara Municipal aprovou nesta semana o programa de incentivo à natalidade proposto pelo vereador Alguém do Outro Lado da Rua de Dentro, que prevê benefícios financeiros, ampliação da saúde materno-infantil e campanhas educativas para famílias.  

        Entre as medidas estão auxílios para gestantes, flexibilização de direitos trabalhistas e consultas pré-natal gratuitas. "Queremos reverter a queda demográfica e garantir um futuro sustentável para nossa cidade", afirmou o vereador durante a sessão.  

        Mães como Ana Lúcia, 32 anos, comemoraram: "Agora terei apoio para ter meu segundo filho". Especialistas destacam que o projeto pode reduzir a evasão de jovens e fortalecer a economia local em médio prazo. A prefeitura estima que os primeiros resultados apareçam em 3 anos.`
        }),

        new Estatistica({
            populacao: 0.96,
            economia: 7,
            saude: 7,
            alegria: 6,
            tituloNoticia: "Câmara rejeita proposta de incentivo à natalidade por 'prioridades conflitantes'",
            noticia: `A proposta do vereador Alguém do Outro Lado da Rua de Dentro para aumentar a natalidade no município foi rejeitada por 12 votos a 5. O projeto, que incluía auxílios a gestantes e ampliação de creches, foi considerado "inviável financeiramente" pela maioria.  

        "Temos urgências como saneamento básico e segurança", justificou a líder do governo. Sociedades de pediatria criticaram a decisão: "Famílias pobres continuarão adiando a maternidade por falta de suporte", disse Dra. Renata Góes.  

        O vereador prometeu buscar parcerias com a iniciativa privada para viabilizar partes do projeto. Enquanto isso, jovens casais como Marcos e Juliana, 28 anos, desabafam: "Sem políticas públicas, fica impossível planejar filhos".`
        })
    ),

    new Proposta("Campanha de uso da camisinha",
        `Por meio da presente, propomos a realização de uma campanha educativa e preventiva sobre o uso da camisinha, com o objetivo de reduzir a incidência de doenças sexualmente transmissíveis (DSTs) e evitar gravidez indesejada entre a população. A iniciativa incluirá distribuição gratuita de preservativos em unidades de saúde, escolas e espaços públicos, além de palestras, materiais informativos e ações de conscientização direcionadas a jovens, adultos e grupos vulneráveis.

        A campanha visa promover a saúde sexual e reprodutiva, fortalecer a cultura da prevenção e incentivar comportamentos responsáveis, contribuindo para a redução dos custos com tratamentos médicos e melhoria da qualidade de vida da comunidade.

        Diante do exposto, solicitamos a inclusão da proposta no plano municipal de saúde pública, com a devida previsão orçamentária para sua realização.
        
        Custo: 5000 reais.
        Vereador Falta de Amor Recíproco.`,

        new Estatistica({
            dinheiro: -5000,
            populacao: 0.91,
            economia: 12,
            saude: 10,
            alegria: 9,
            tituloNoticia: "Município lança campanha de distribuição gratuita de camisinhas e conscientização sobre DSTs",
            noticia: `A Câmara Municipal aprovou por unanimidade a proposta de campanha de prevenção e conscientização sobre o uso de camisinhas, apresentada pelo vereador Falta de Amor Recíproco. A iniciativa prevê a distribuição gratuita de preservativos em postos de saúde, escolas e locais públicos, além de palestras educativas.

        "Esta é uma medida de saúde pública essencial para reduzir as DSTs e gravidezes não planejadas entre nossos jovens", afirmou o Secretário Municipal de Saúde durante o anúncio. Estudantes comemoraram a decisão: "Agora teremos acesso fácil a informações e métodos preventivos", disse Maria Eduarda, 17 anos.

        A campanha, que terá início no próximo mês, incluirá parcerias com unidades básicas de saúde e ONGs especializadas. Especialistas estimam que a medida pode reduzir em até 30% os casos de sífilis e HIV na cidade nos próximos dois anos.`
        }),

        new Estatistica({
            populacao: 1.03,
            economia: -8,
            saude: -8,
            alegria: -8,
            tituloNoticia: 'Câmara rejeita campanha de prevenção sexual sob alegação de "conteúdo inadequado"',
            noticia: `A proposta de campanha educativa sobre uso de camisinhas foi rejeitada pela maioria dos vereadores, que alegaram "incompatibilidade com valores familiares". O projeto, que previa distribuição gratuita de preservativos e palestras em escolas, foi arquivado após acalorados debates.

        "Temos que preservar a inocência das crianças", declarou o vereador opositor. Profissionais de saúde reagiram com indignação: "Estão negando informação que salva vidas", criticou a Dra. Ana Beatriz, infectologista.

        O vereador proponente, Falta de Amor Recíproco, lamentou: "O preconceito venceu a saúde pública". Enquanto isso, ativistas prometem pressionar por nova votação. "Jovens continuarão expostos a riscos por falta de orientação", alertou um representante de ONG que combate a AIDS.`
        })
    ),

];
// funções gerais

function escolherProposta() {
    // Verifica se todas as propostas já foram mostradas
    const todasMostradas = listaPropostas.every(p => p.aconteceu);

    if (todasMostradas) {
        // Reseta todas as propostas
        listaPropostas.forEach(p => p.aconteceu = false);
    }

    let randomIndex;
    let tentativas = 0;
    const maxTentativas = 100;

    do {
        randomIndex = Math.floor(Math.random() * listaPropostas.length);
        tentativas++;

        // Prevenir loop infinito
        if (tentativas >= maxTentativas) {
            // Força seleção mesmo que já tenha acontecido
            break;
        }
    } while (listaPropostas[randomIndex].aconteceu);

    // Atualiza a proposta atual e marca como mostrada
    IndexPropostaAtual = randomIndex;
    listaPropostas[IndexPropostaAtual].aconteceu = true;
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
    if (nomeCidade === "") {
        nomeCidade = "Xique-Xique Baia"
    }
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
    dinheiro += (populacao / 20) * (imposto / 7.5);
    saude -= 2;
    alegria -= 2;
    seguranca -= 2;
    educacao -= 2;
    meioAmbiente -= 2;
    economia -= 2;
    infraestrutura -= 2;
    corrigir();
    populacao *= 0.97;
    atualizarTela();
}

function atualizarTempo() {
    const agora = Date.now();
    const decorrido = agora - tempoInicio;
    const minutosTotais = decorrido / 60000;
    const mesesTotais = Math.floor(minutosTotais * 4); // 1 minuto = 4 meses

    if (decorrido >= 720000) { // 12 minutos = 4 anos
        clearInterval(intervaloAtualizacao);
        acabarJogo();
        return;
    }

    document.getElementById('tempo').textContent = `Tempo passado: ${formatarTempo(decorrido)}`;
    verificarEventosMensais(mesesTotais);


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
    document.getElementById("resultado-dinheiro").innerText = `Dinheiro: R$ ${Math.round(dinheiro)}`;
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