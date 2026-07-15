# 🎯 Checklist Rápido - Configuração Google AdSense

## 📋 Tarefas Manuais (no Google AdSense)

- [ ] **1. Criar conta**
  - Acesse: https://www.google.com/adsense/
  - Preencha dados da conta e domínio

- [ ] **2. Aguardar aprovação** (24-48h)
  - Google revisará o site

- [ ] **3. Validar domínio**
  - Adicionar meta tag em `src/app/layout.tsx` (se solicitado)
  - Ou fazer upload de arquivo no servidor

- [ ] **4. Criar 4 Ad Units**
  - [ ] **Sidebar** → Rectangle 300x250 → Copiar Slot ID
  - [ ] **Between Content** → Horizontal/Auto → Copiar Slot ID
  - [ ] **In-Feed** → Native → Copiar Slot ID
  - [ ] **Product Detail** → Rectangle 300x250 → Copiar Slot ID

## 💻 Tarefas no Código

### 1️⃣ Atualizar Slot IDs
Abra `src/lib/adsense.ts` e preencha:
```typescript
export const ADSENSE_SLOTS = {
  sidebar: "COLE_AQUI_O_ID_DO_SIDEBAR",           // Ex: 1234567890
  betweenContent: "COLE_AQUI_O_ID_BETWEEN",       // Ex: 1234567891
  inFeed: "COLE_AQUI_O_ID_INFEED",                // Ex: 1234567892
  productDetail: "COLE_AQUI_O_ID_PRODUCT_DETAIL", // Ex: 1234567893
} as const
```

### 2️⃣ Atualizar `.env.local`
O arquivo `.env.local` já existe! Apenas preencha:
```env
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="ca-pub-XXXXXXXXXXXXX"
NEXT_PUBLIC_ADSENSE_ENABLED="true"
```

## ✅ Verificação

- [ ] Arquivo `.env.local` preenchido
- [ ] Slot IDs preenchidos em `src/lib/adsense.ts`
- [ ] Executar: `npm run dev`
- [ ] Abrir em navegador anônimo
- [ ] Verificar se anúncios aparecem

## 🚀 Deploy

1. Adicione as mesmas variáveis no servidor:
   - `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
   - `NEXT_PUBLIC_ADSENSE_ENABLED=true`

2. Deploy a aplicação

3. Aguarde Google indexar (24-72h)

## 📚 Documentação Completa
Veja: `ADSENSE_SETUP.md`

## ❌ NÃO FAÇA

- ❌ Clique em seus próprios anúncios
- ❌ Use AdSense em páginas de teste sem conteúdo real
- ❌ Compartilhe link do site para amigos clicarem nos anúncios
- ❌ Use bot de cliques

Isso pode resultar em **suspensão permanente da conta**!

---

**Próximos Passos:**
1. Ir para Google AdSense
2. Criar conta
3. Validar domínio
4. Criar Ad Units
5. Voltar e preencher `src/lib/adsense.ts` e `.env.local`
6. Deploy
