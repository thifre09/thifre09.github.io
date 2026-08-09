# Regras do projeto

# CRITICAL — DO NOT MODIFY EXISTING SVGs

Before generating or modifying code, preserve every existing SVG exactly.

NEVER:
- modify an existing `<svg>`
- modify an existing `<path>`
- modify a `d` attribute
- replace an SVG with another icon
- regenerate an existing SVG

Only modify an existing SVG when the user's current request explicitly asks to modify that specific SVG.

## SVG

- NUNCA altere, substitua, remova ou reescreva elementos `<svg>` existentes.
- Preserve exatamente o conteúdo dos SVGs existentes, incluindo `viewBox`, `fill`, `path`, `d`, atributos e estrutura interna.
- NÃO substitua SVGs por outros ícones ou versões "equivalentes".
- NÃO modifique o atributo `d` de `<path>` existentes.
- Só altere um SVG quando a solicitação do usuário pedir explicitamente uma alteração naquele SVG.
- Se uma alteração no código exigir modificar um SVG, preserve-o e faça somente a alteração explicitamente solicitada.

## Interface existente

- Não altere estilos existentes sem necessidade.
- Não substitua valores de CSS existentes por valores diferentes apenas por preferência estética.
- Ao implementar uma nova funcionalidade, altere somente o CSS necessário para essa funcionalidade.
- Preserve o design e os componentes existentes.

## Modificações

- Faça alterações mínimas e focadas no pedido.
- NÃO refatore código que não esteja relacionado à tarefa.
- NÃO altere elementos existentes apenas para "melhorá-los".
- Preserve funcionalidades existentes.