# MIRVALIS | Joias na Prata

Web app responsivo premium para vitrine e venda assistida de joias femininas em prata.

## Tecnologias

- React
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase para catalogo compartilhado
- LocalStorage apenas para carrinho e fallback local

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse a URL exibida no terminal, normalmente `http://localhost:5173`.

## Banco de dados compartilhado

O catalogo publico e o painel admin usam Supabase quando estas variaveis existem:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
```

No Supabase, abra o SQL Editor e rode o arquivo:

```txt
supabase/mirvalis-schema.sql
```

Depois configure as mesmas variaveis na Vercel em:

```txt
Project Settings > Environment Variables
```

Sem essas variaveis, o site entra em modo local e as mudancas ficam apenas no navegador.

## WhatsApp

O numero inicial esta em `src/lib/whatsapp.js`, mas a loja tambem pode alterar o WhatsApp pelo painel administrativo.

```js
export const MIRVALIS_WHATSAPP = "32998107950";
```

## Painel administrativo

O painel privado fica em `/#admin`.

Credenciais iniciais:

- login: `admin`
- senha: `mirvalis2026`

Ele permite:

- adicionar produto;
- editar produto;
- remover produto;
- alterar preco;
- cadastrar quantidade disponivel;
- marcar como destaque;
- marcar como esgotado;
- enviar imagens pelo navegador;
- configurar o numero do WhatsApp da loja;
- criar, editar e ativar promocoes.

As alteracoes de catalogo sao salvas no Supabase quando configurado, e passam a aparecer para qualquer visitante em outro celular ou computador.

Esta protecao ainda e client-side. Para operacao comercial com dados sensiveis, troque as policies de escrita anonima por Supabase Auth ou por uma API privada.
