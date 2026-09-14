# Repositório fa — instruções para o agente

Este repositório contém dois conjuntos de coisas que **não se misturam**:

- **`Fabrícia Satza — Tricologia/`** — o vault do Obsidian da marca pessoal
  `@fabriciasatza`. Tem schema próprio: **leia
  `Fabrícia Satza — Tricologia/CLAUDE.md` antes de tocar em qualquer coisa
  dentro dessa pasta.**
- **Raiz do repo** — material da **New Hair** (clínica): carrosséis HTML,
  `projeto-remotion`, docs de método. Marca diferente, projeto diferente. Não
  mova arquivo de um lado para o outro sem pedido explícito.

## Antes de começar qualquer trabalho no vault

Leia, nesta ordem:

1. `Fabrícia Satza — Tricologia/ESTADO.md` — onde o projeto parou, o que já foi
   decidido e por quê, o que está pendente
2. `Fabrícia Satza — Tricologia/log.md` — as últimas entradas
3. `Fabrícia Satza — Tricologia/CLAUDE.md` — como operar o cofre

Isto vale especialmente **depois de uma compactação de contexto**: o `ESTADO.md`
existe para você retomar o raciocínio sem depender do histórico da conversa.

## Protocolo de entrega — obrigatório

A Fabrícia trabalha no Obsidian do computador dela. Você trabalha num container
na nuvem. **Nada que você escreve chega nela sozinho.** Essa lacuna já custou
uma sessão inteira de trabalho invisível: arquivos prontos no repositório e
cofre vazio na tela dela.

Então, **toda vez que você alterar o vault**, sem ela pedir:

1. Commit e push na branch de trabalho
2. Anexe a entrada no `log.md`
3. Atualize o `ESTADO.md` se alguma decisão, pendência ou problema mudou
4. **Gere o zip do vault e entregue pelo SendUserFile**
5. Diga em uma linha o que mudou e o que ela precisa fazer

O passo 4 não é opcional e não espera ela pedir. Trabalho que não chegou no
Obsidian dela não está entregue.

```bash
cd /home/user/fa && rm -f /tmp/vault.zip && \
  zip -rq /tmp/vault.zip "Fabrícia Satza — Tricologia" -x '*.DS_Store'
```

## Git

Branch de trabalho: `claude/obsidian-salve-0uxb8m` (PR #2).
A branch padrão **não é `main`** — é `claude/install-find-skills-ZbXWA`.
