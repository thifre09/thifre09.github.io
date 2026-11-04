# Meu site incrível

Site pessoal e laboratório de projetos do Thifre. O projeto reúne páginas interativas, jogos, ferramentas para desenvolvimento web, conteúdos educativos e experiências feitas com HTML, CSS, JavaScript e TypeScript.

Acesse a versão publicada em [thifre09.github.io](https://thifre09.github.io/).

## Conteúdo

A página inicial funciona como um menu para as principais experiências do site:

- **Batatas**: quiz de curiosidades aleatórias.
- **Codificador**: codificador e decodificador baseado na Cifra de César.
- **Cores**: consulta de cores com representações HEX, HSL, HWB e RGB.
- **Curiosidades**: coleção de curiosidades sobre assuntos variados.
- **Editor HTML**: criação de páginas HTML simples com visualização em tempo real.
- **Mayor Simulator**: jogo de administração de uma cidade.
- **Não vá à falência**: jogo de simulação de negócios inspirado no livro *A Falência*.
- **Números**: experiências e ferramentas relacionadas a números.
- **O poder do CSS**: demonstrações e experimentos com CSS.
- **Python**: conteúdo introdutório sobre a linguagem Python.
- **Quadrado Clicker**: jogo incremental baseado em cliques e melhorias.
- **Review de jogos**: opiniões e avaliações de jogos.
- **ThifreBD**: interface experimental para criação e manipulação de bancos de dados.

O menu lateral também oferece recursos compartilhados, como bloco de notas, calculadora, notas de atualização, configurações e autenticação.

## Tecnologias

- HTML5 e CSS3
- JavaScript e TypeScript
- [Vite](https://vite.dev/)
- [Chart.js](https://www.chartjs.org/)
- [dagre](https://github.com/dagrejs/dagre)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Supabase](https://supabase.com/), usado em recursos de autenticação e persistência

## Como executar localmente

### Pré-requisitos

- Node.js
- npm

### Instalação

```bash
npm install
```

### Servidor de desenvolvimento

```bash
npm run dev
```

Depois, abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite. |
| `npm run build` | Gera a build de produção e verifica os tipos TypeScript. |
| `npm run watch` | Executa o TypeScript em modo de observação. |

## Estrutura do projeto

```text
.
├── index.html              # Página inicial
├── src/
│   ├── css/                # Estilos específicos das páginas
│   ├── global/             # Menu e estilos compartilhados
│   ├── html/               # Páginas HTML
│   ├── images/             # Imagens e recursos visuais
│   ├── js/                 # JavaScript executado pelo site
│   ├── jsons/              # Dados, schemas e exemplos
│   ├── others/             # Scripts auxiliares e materiais de apoio
│   └── ts/                 # Código-fonte TypeScript
├── package.json
└── tsconfig.json
```

## Desenvolvimento

As páginas são documentos HTML independentes e compartilham o menu e os estilos globais. Ao criar uma nova página, mantenha essa organização e adicione o link correspondente ao menu principal quando necessário.

O código TypeScript fica em `src/ts/`, enquanto os arquivos JavaScript em `src/js/` são os arquivos consumidos diretamente pelas páginas existentes. Antes de publicar alterações, execute:

```bash
npm run build
```

## Licença e créditos

Este repositório é um projeto pessoal. Consulte [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) para informações sobre componentes e recursos de terceiros utilizados no projeto.

## Como contribuir

Você não não contribui :)