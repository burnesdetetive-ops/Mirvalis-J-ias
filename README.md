# MIRVALIS | Joias na Prata

Web app responsivo premium para vitrine e venda assistida de joias femininas em prata.

## Tecnologias

- React
- Tailwind CSS
- Framer Motion
- Lucide React
- LocalStorage para produtos e carrinho

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse a URL exibida no terminal, normalmente `http://localhost:5173`.

## WhatsApp

O número inicial está em `src/lib/whatsapp.js`, mas a loja também pode alterar o WhatsApp pelo painel administrativo.

Troque `MIRVALIS_WHATSAPP` pelo número real com DDI e DDD, somente dígitos:

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
- enviar imagens pelo navegador.
- configurar o número do WhatsApp da loja.

As alterações são salvas no LocalStorage do navegador.

Esta proteção é client-side e serve para protótipo/publicação simples. Para operação comercial com dados sensíveis, use autenticação real com backend e banco de dados.
