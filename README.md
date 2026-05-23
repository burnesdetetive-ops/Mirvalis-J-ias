# MIRVALIS | Joias na Prata

Web app responsivo premium para vitrine e venda assistida de joias femininas em prata.

## Tecnologias

- React
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase para catálogo compartilhado
- LocalStorage apenas para carrinho e fallback local

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse a URL exibida no terminal, normalmente `http://localhost:5173`.

## Banco de dados compartilhado

O catálogo público e o painel admin usam Supabase quando estas variáveis existem:

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

O número inicial está em `src/lib/whatsapp.js`, mas a loja também pode alterar o WhatsApp pelo painel administrativo.

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
- alterar preço;
- cadastrar quantidade disponível;
- marcar como destaque;
- marcar como esgotado;
- enviar imagens pelo navegador;
- configurar o número do WhatsApp da loja;
- criar, editar e ativar promoções.

As alterações de catálogo são salvas no Supabase quando configurado, e passam a aparecer para qualquer visitante em outro celular ou computador.

Esta protecao ainda e client-side. Para operacao comercial com dados sensiveis, troque as policies de escrita anonima por Supabase Auth ou por uma API privada.
