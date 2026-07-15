# 📍 Mapa de Anúncios - Onde aparecem os Anúncios

## 🗺️ Estrutura de Locais

```
┌─────────────────────────────────────────────┐
│            CABEÇALHO (Header)               │  ← Sem anúncios
├──────────────┬──────────────────────────────┤
│  SIDEBAR     │     CONTEÚDO PRINCIPAL      │
│  (Vertical)  │                             │
│              │  ┌─────────────────────┐   │
│  📍 Ad Unit  │  │   Produtos em Grid  │   │
│  SIDEBAR     │  │                     │   │
│              │  │   [Produto 1] ...   │   │
│              │  │                     │   │
│              │  │ ┌─────────────────┐ │   │
│              │  │ │ 📍 Ad Between   │ │   │
│              │  │ │    Content      │ │   │
│              │  │ └─────────────────┘ │   │
│              │  │                     │   │
│              │  │   [Produto 2] ...   │   │
│              │  │                     │   │
│              │  │ ┌─────────────────┐ │   │
│              │  │ │ 📍 Ad In-Feed   │ │   │
│              │  │ │  (Native/Grid)  │ │   │
│              │  │ └─────────────────┘ │   │
│              │  │                     │   │
│              │  │ [Mais Produtos] ... │   │
│              │  └─────────────────────┘   │
└──────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────┐
│        PÁGINA DE DETALHES DO PRODUTO        │
├─────────────────────────────────────────────┤
│  [Imagem do Produto]                        │
│                                             │
│  Título do Produto                          │
│  ────────────────────────                  │
│  Preço: R$ 99,99                           │
│  Cálculo por dose: R$ 1,23                 │
│                                             │
│  📍 AD UNIT: Product Detail                │
│  (Rectangle 300x250 ou Auto)               │
│                                             │
│  Descrição completa do produto             │
│  Especificações técnicas                   │
│  Reviews e comentários                     │
│                                             │
└─────────────────────────────────────────────┘
```

## 📍 Ad Units Configurados

### 1. **Sidebar** (id: `sidebar`)
- **Localização**: Lateral esquerda (visível em telas `lg` e maiores)
- **Formato**: Rectangle 300x250 ou Vertical
- **Quando aparece**: Todas as páginas
- **Código**: `<AdBanner slot={ADSENSE_SLOTS.sidebar} format="vertical" />`

### 2. **Between Content** (id: `betweenContent`)
- **Localização**: Entre blocos de produtos na página inicial
- **Formato**: Horizontal ou Auto (responsivo)
- **Quando aparece**: Página inicial (Home)
- **Código**: `<AdBanner slot={ADSENSE_SLOTS.betweenContent} format="horizontal" />`

### 3. **In-Feed** (id: `inFeed`)
- **Localização**: Dentro do feed/grid de produtos
- **Formato**: Native (anúncios que parecem conteúdo)
- **Quando aparece**: Lista de produtos
- **Código**: `<AdBanner slot={ADSENSE_SLOTS.inFeed} format="auto" />`

### 4. **Product Detail** (id: `productDetail`)
- **Localização**: Página de detalhes do produto
- **Formato**: Rectangle 300x250 ou Auto
- **Quando aparece**: Página de produto individual
- **Código**: `<AdBanner slot={ADSENSE_SLOTS.productDetail} format="rectangle" />`

## 🎯 Regras de Exibição

Os anúncios **NÃO** aparecem para:
- ❌ Usuários com papel "ADMIN"
- ❌ Usuários com assinatura ATIVA (premium)

Os anúncios **APARECEM** para:
- ✅ Usuários não autenticados
- ✅ Usuários com conta gratuita (sem assinatura)

## 📂 Arquivos Relacionados

| Arquivo | Responsabilidade |
|---------|------------------|
| [src/lib/adsense.ts](src/lib/adsense.ts) | Configuração de slots e lógica |
| [src/components/ad-banner.tsx](src/components/ad-banner.tsx) | Componente de renderização |
| [src/app/layout.tsx](src/app/layout.tsx) | Script do AdSense |
| [.env.local](.env.local) | Variáveis de ambiente |
| [ADSENSE_SETUP.md](ADSENSE_SETUP.md) | Guia completo de setup |

## 💡 Como Adicionar Mais Anúncios

Se quiser adicionar mais anúncios em outros lugares:

1. **Adicione um novo slot em `src/lib/adsense.ts`:**
```typescript
export const ADSENSE_SLOTS = {
  sidebar: "1234567890",
  betweenContent: "1234567891",
  inFeed: "1234567892",
  productDetail: "1234567893",
  meuNovoAnuncio: "", // 👈 Novo slot
} as const
```

2. **Crie um novo Ad Unit no Google AdSense console**

3. **Copie o ID do slot**

4. **Importe e use em qualquer componente:**
```tsx
import { AdBanner } from "@/components/ad-banner"
import { ADSENSE_SLOTS } from "@/lib/adsense"

export function MeuComponente() {
  return (
    <div>
      <AdBanner slot={ADSENSE_SLOTS.meuNovoAnuncio} format="auto" />
    </div>
  )
}
```

## 🧪 Testando Localmente

```bash
# 1. Certifique-se que .env.local tem:
NEXT_PUBLIC_ADSENSE_ENABLED="true"
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="ca-pub-xxxxx"

# 2. Inicie o servidor
npm run dev

# 3. Abra em modo privado/anônimo
# http://localhost:3000

# 4. No DevTools (F12), procure por:
# window.adsbygoogle (deve aparecer um array)
```

## ⚠️ Troubleshooting

### Anúncios em branco ou não aparecem
- Verifique se `NEXT_PUBLIC_ADSENSE_ENABLED="true"`
- Verifique se os Slot IDs estão corretos
- Abra DevTools e procure por erros no console
- Aguarde aprovação do Google (24-72h)

### Erro "Site ainda não foi aprovado"
- O Google está revisando o domínio
- Pode levar dias
- Certifique-se que o domínio foi validado

### Ad Blocker está bloqueando
- É normal em desenvolvimento local
- Use navegação privada ou desative ad blockers
- Teste em produção com usuários reais

---

**Próxima etapa:** [Leia ADSENSE_SETUP.md para instruções completas](ADSENSE_SETUP.md)
