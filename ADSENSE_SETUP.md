# Guia de Configuração Google AdSense

Este guia inclui passo a passo para configurar Google AdSense no projeto Dosific.

## Pré-requisitos
- Domínio cadastrado e funcionando
- Conta Google ativa
- Projeto Next.js rodando

## Etapa 1: Criar Conta Google AdSense

1. Acesse [Google AdSense](https://www.google.com/adsense/)
2. Clique em **"Começar agora"** ou **"Sign in"** se já tiver conta Google
3. Preencha as informações solicitadas:
   - **Seu website**: `seu-dominio.com` (sem `https://`)
   - País/Região onde o conteúdo será criado
   - Idioma do site
   - Categoria do site
   - Descrição do conteúdo

4. Revise os **Termos de Serviço** e confirme
5. Aguarde a aprovação da conta (geralmente 24-48 horas)

## Etapa 2: Validar Domínio

Após criar a conta, você receberá instruções para validar o domínio. O Google pode fornecer:
- **Meta tag** para adicionar no `<head>` do seu site
- **Arquivo de verificação** para upload no servidor

### Opção recomendada (Meta tag):

1. Copie a meta tag fornecida pelo Google
2. Abra [src/app/layout.tsx](src/app/layout.tsx)
3. Procure por `<head>` e adicione a meta tag fornecida pelo Google

Exemplo:
```jsx
<head>
  <meta name="google-site-verification" content="xxxxxxxxxxxxx" />
</head>
```

4. Deploy a aplicação e aguarde o Google verificar (pode levar alguns dias)

## Etapa 3: Criar Ad Units (Blocos de Anúncio)

Após a validação do domínio e aprovação da conta, crie 4 ad units:

### 1. **Sidebar** (Anúncio vertical na lateral)
- **Nome**: Sidebar
- **Formato**: Rectangle 300x250 ou Vertical
- **Tipo**: Display ads
- **Slot ID**: Copie o código fornecido

### 2. **Between Content** (Entre conteúdos)
- **Nome**: Between Content
- **Formato**: Horizontal ou Auto (responsivo)
- **Tipo**: Display ads
- **Slot ID**: Copie o código fornecido

### 3. **In-Feed** (Ads nativos)
- **Nome**: In-Feed
- **Formato**: Native (in-feed ou artigos)
- **Tipo**: Native ads
- **Slot ID**: Copie o código fornecido

### 4. **Product Detail** (Página de produto)
- **Nome**: Product Detail
- **Formato**: Rectangle 300x250 ou Auto
- **Tipo**: Display ads
- **Slot ID**: Copie o código fornecido

### Como criar cada Ad Unit:
1. No painel AdSense, acesse **Anúncios** → **Por tamanho**
2. Clique em **Criar novo ad unit**
3. Nomeie o ad unit
4. Escolha o formato desejado
5. Clique em **Criar**
6. Copie o `data-ad-slot` do código gerado

Exemplo de código gerado:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

O `data-ad-slot` é o que você precisa copiar (ex: `1234567890`)

## Etapa 4: Atualizar Variáveis de Ambiente

### 4.1 Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo `.env.local` com:

```env
# Copie do seu painel AdSense
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="ca-pub-5012986302679215"
NEXT_PUBLIC_ADSENSE_ENABLED="true"
```

**Nota**: Substitua `ca-pub-5012986302679215` pelo seu Publisher ID real

### 4.2 Atualizar Slot IDs

Abra [src/lib/adsense.ts](src/lib/adsense.ts) e preencha com os IDs obtidos na Etapa 3:

```typescript
export const ADSENSE_SLOTS = {
  sidebar: "1234567890",           // Copie do Ad Unit "Sidebar"
  betweenContent: "1234567891",    // Copie do Ad Unit "Between Content"
  inFeed: "1234567892",            // Copie do Ad Unit "In-Feed"
  productDetail: "1234567893",     // Copie do Ad Unit "Product Detail"
} as const
```

## Etapa 5: Onde os Anúncios Serão Exibidos

Os anúncios são exibidos condicionalmente baseado em regras:

- ✅ **Usuários não autenticados**: Verão anúncios
- ✅ **Usuários com plano gratuito**: Verão anúncios
- ❌ **Usuários premium (com assinatura ativa)**: NÃO verão anúncios
- ❌ **Administradores**: NÃO verão anúncios (para testes)

### Locais onde os anúncios aparecem:

1. **Sidebar** - Lateral do site (em telas lg+)
2. **Between Content** - Entre produtos na página inicial
3. **In-Feed** - Aos pés de produtos em listas
4. **Product Detail** - Na página de detalhes do produto

## Etapa 6: Testar Localmente

### ⚠️ Importante: Não clique em anúncios próprios!

Para testar localmente:

1. Execute: `npm run dev`
2. Abra `http://localhost:3000` em modo anônimo/privado
3. Verifique se os anúncios aparecem
4. **NUNCA clique em seus próprios anúncios** (pode levar à suspensão da conta)

### Verificar no console do navegador:

Abra **DevTools** (F12) → **Console** e procure por:
```javascript
adsbygoogle
```

Se aparecer um array, o script foi carregado corretamente.

## Etapa 7: Deploy em Produção

1. Atualize `.env.local` no seu servidor com:
   ```env
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="seu-id-real"
   NEXT_PUBLIC_ADSENSE_ENABLED="true"
   ```

2. Deploy a aplicação

3. Aguarde o Google indexar o site (pode levar dias)

4. Os anúncios começarão a aparecer gradualmente

## Troubleshooting

### Anúncios não aparecem
- ✅ Verifique se `NEXT_PUBLIC_ADSENSE_ENABLED="true"`
- ✅ Verifique se os Slot IDs estão corretos em [src/lib/adsense.ts](src/lib/adsense.ts)
- ✅ Abra DevTools e procure por erros
- ✅ Verifique se o Publisher ID está correto
- ✅ Aguarde aprovação e indexação do Google (24-72h)

### Erro "This site has not been approved yet"
- O Google ainda está revisando o site
- Aguarde 24-72 horas
- Certifique-se que o domínio foi validado

### AdSense desabilitado em .env
- Abra `.env.local` e altere: `NEXT_PUBLIC_ADSENSE_ENABLED="true"`
- Reinicie o servidor de desenvolvimento

## Referências

- [Google AdSense Docs](https://support.google.com/adsense)
- [Google AdSense Help](https://support.google.com/adsense)
- [AdSense Product Information](https://www.google.com/adsense/start/#/?modal_active=none)

## Contato

Para dúvidas, consulte a documentação oficial do Google AdSense ou entre em contato com o suporte.
