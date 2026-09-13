import json
import os
import time
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

MODELO = "Qwen/Qwen2.5-3B-Instruct"

PROMPT_ARQUIVO = "assets/others/prompt.md"
NOME_ARQUIVO = "assets/jsons/nao-va-a-falencia.json"

QUANTIDADE = 1
PAUSA_ENTRE_GERACOES = 1

def carregar_prompt():
    if not os.path.exists(PROMPT_ARQUIVO):
        raise FileNotFoundError(
            f"Arquivo de prompt não encontrado: {PROMPT_ARQUIVO}"
        )

    with open(PROMPT_ARQUIVO, "r", encoding="utf-8") as arquivo:
        return arquivo.read()

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
                return False, (
                    f"Campo ausente no diário da opção {i + 1}: {campo}"
                )

        if anotacao["cor"] not in ["green", "red", "yellow"]:
            return False, (
                f"Cor inválida na opção {i + 1}: {anotacao['cor']}"
            )

    return True, ""

def carregar_modelo():
    print(f"Modelo: {MODELO}")
    print("Carregando tokenizer...")

    tokenizer = AutoTokenizer.from_pretrained(MODELO)

    print("Carregando modelo...")
    print("Se o modelo ainda não estiver no cache, ele será baixado do Hugging Face.")

    modelo = AutoModelForCausalLM.from_pretrained(
        MODELO,
        torch_dtype="auto",
        device_map="auto"
    )

    print("Modelo carregado.")
    print()

    return tokenizer, modelo

def gerar_acontecimento(tokenizer, modelo, prompt_sistema):
    prompt_usuario = """
Crie exatamente UM Acontecimento seguindo rigorosamente todas as regras,
classes, contexto e formato definidos no prompt do sistema.

Retorne SOMENTE o objeto JSON do Acontecimento.

Não use markdown.
Não use ```json.
Não escreva nenhuma explicação antes ou depois do JSON.
"""

    mensagens = [
        {
            "role": "system",
            "content": prompt_sistema
        },
        {
            "role": "user",
            "content": prompt_usuario
        }
    ]

    texto = tokenizer.apply_chat_template(
        mensagens,
        tokenize=False,
        add_generation_prompt=True,
        enable_thinking=False
    )

    entradas = tokenizer(
        texto,
        return_tensors="pt"
    ).to(modelo.device)

    with torch.no_grad():
        saida = modelo.generate(
            **entradas,
            max_new_tokens=2500,
            temperature=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    tokens_novos = saida[0][entradas["input_ids"].shape[1]:]

    resposta = tokenizer.decode(
        tokens_novos,
        skip_special_tokens=True
    ).strip()

    if not resposta:
        raise ValueError("O modelo não retornou uma resposta.")

    return json.loads(resposta)

def gerar_acontecimentos(tokenizer, modelo, prompt_sistema, quantidade):
    acontecimentos = carregar_acontecimentos()

    nomes_existentes = {
        acontecimento.get("nome", "").strip().lower()
        for acontecimento in acontecimentos
        if isinstance(acontecimento, dict)
    }

    print(f"Acontecimentos existentes: {len(acontecimentos)}")
    print(f"Acontecimentos a gerar: {quantidade}")
    print()

    gerados = 0

    while gerados < quantidade:
        print(
            f"[{gerados + 1}/{quantidade}] Gerando...",
            end=" ",
            flush=True
        )

        try:
            acontecimento = gerar_acontecimento(
                tokenizer,
                modelo,
                prompt_sistema
            )

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

        except json.JSONDecodeError:
            print("ERRO: O modelo não retornou JSON válido.")

        except RuntimeError as erro:
            print(f"ERRO durante a geração: {erro}")

        except Exception as erro:
            print(f"ERRO: {erro}")

        if gerados < quantidade:
            time.sleep(PAUSA_ENTRE_GERACOES)

    print()
    print(f"Concluído. Total no arquivo: {len(acontecimentos)}")

def main():
    prompt_sistema = carregar_prompt()

    tokenizer, modelo = carregar_modelo()

    gerar_acontecimentos(
        tokenizer,
        modelo,
        prompt_sistema,
        QUANTIDADE
    )

if __name__ == "__main__":
    main()