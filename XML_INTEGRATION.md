# Integração com demoparty.net XML Feed

## 🎯 Objetivo

Consumir dados reais do feed XML da demoparty.net para exibir eventos atualizados automaticamente no site DemoScene Brasil.

## 🔧 Como Funciona

### 1. **Serviço de Dados** (`demoPartyService.ts`)
- Consome o RSS XML de `https://www.demoparty.net/demoparties.xml`
- Usa proxy CORS para desenvolvimento (`allorigins.win`)
- Parseia XML para objetos TypeScript tipados
- Fallback para dados mockados em caso de erro

### 2. **Cache Inteligente** (`useCachedDemoParties.ts`)
- Cache de 1 hora no localStorage
- Carregamento offline-first
- Estatísticas e filtros computados
- Organização por região

### 3. **Interface Atualizada** (`PartiesSection.vue`)
- Loading states elegantes
- Tratamento de erros
- Exibição de logos dos eventos
- Informações detalhadas (plataformas, tipo, online/offline)

## 📊 Estrutura dos Dados

```typescript
interface DemoParty {
  name: string              // Nome da party
  country: string           // País com emoji
  countryCode: string       // Código do país (br, ar, etc)
  description: string       // Descrição resumida
  date: string             // Data formatada em português
  startDate: Date          // Data de início
  endDate: Date            // Data de fim
  location: string         // Local do evento
  url: string              // Link oficial
  logo?: string            // URL do logo
  type: string             // Tipo (Demoparty, Meeting, etc)
  platforms: string[]      // Plataformas suportadas
  isOnline: boolean        // Se é evento online
}
```

## 🌐 CORS e Produção

### Desenvolvimento
- Usa proxy CORS (`allorigins.win`)
- Funciona imediatamente sem configuração

### Produção (Recomendações)

#### Opção 1: Servidor Proxy Próprio
```javascript
// backend/proxy.js
app.get('/api/demoparties', async (req, res) => {
  const response = await fetch('https://www.demoparty.net/demoparties.xml')
  const xml = await response.text()
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(xml)
})
```

#### Opção 2: Netlify Functions
```javascript
// netlify/functions/demoparties.js
exports.handler = async (event, context) => {
  const response = await fetch('https://www.demoparty.net/demoparties.xml')
  const xml = await response.text()
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: xml
  }
}
```

#### Opção 3: Vercel API Routes
```javascript
// pages/api/demoparties.js
export default async function handler(req, res) {
  const response = await fetch('https://www.demoparty.net/demoparties.xml')
  const xml = await response.text()
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).send(xml)
}
```

## 🚀 Configuração

### 1. Para usar em produção, atualize a URL no serviço:

```typescript
// src/services/demoPartyService.ts
class DemoPartyService {
  private readonly RSS_URL = process.env.NODE_ENV === 'production' 
    ? '/api/demoparties'  // Sua URL de produção
    : 'https://www.demoparty.net/demoparties.xml'
  
  private readonly CORS_PROXY = process.env.NODE_ENV === 'production'
    ? ''  // Sem proxy em produção
    : 'https://api.allorigins.win/get?url='
}
```

### 2. Variáveis de ambiente:

```bash
# .env.production
VITE_DEMOPARTY_API_URL=https://seu-dominio.com/api/demoparties
```

## 🎨 Features Implementadas

### ✅ Dados Reais
- Eventos de todo o mundo
- Atualizados automaticamente
- Logos originais dos eventos

### ✅ Performance
- Cache inteligente (1 hora)
- Loading offline-first
- Fallback para dados mockados

### ✅ UX Melhorada
- Loading states animados
- Tratamento elegante de erros
- Informações detalhadas
- Botão de atualização manual

### ✅ Filtros e Organização
- Apenas eventos futuros
- Organizados por data
- Limitado a 12 eventos
- Separação por região

## 🗺️ Mapeamento de Países

O sistema mapeia códigos de país do XML para nomes em português com emojis:

```typescript
const countryMap = {
  'br': 'Brasil 🇧🇷',
  'ar': 'Argentina 🇦🇷',
  'de': 'Alemanha 🇩🇪',
  // ... mais países
}
```

## 🔄 Cache Strategy

1. **Primeiro carregamento**: Busca XML + salva cache
2. **Carregamentos seguintes**: Usa cache se < 1 hora
3. **Cache expirado**: Busca novo XML + atualiza cache
4. **Erro de rede**: Usa cache antigo ou fallback

## 📱 Responsivo

- Grid adaptável (1/2/3 colunas)
- Cards otimizados para mobile
- Logos com lazy loading
- Informações hierarquizadas

## 🚨 Monitoramento

Para produção, considere adicionar:

```typescript
// Analytics para falhas de carregamento
if (error.value) {
  analytics.track('demoparty_load_error', {
    error: error.value,
    fallback_used: parties.value.length > 0
  })
}
```

## 🛠️ Manutenção

- O feed XML da demoparty.net é atualizado automaticamente
- Não há necessidade de manutenção manual dos dados
- Cache pode ser limpo via localStorage no browser
- Logs de erro ajudam no debugging