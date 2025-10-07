# Sistema de Performance - DemoScene Brasil

## 🚀 Overview

O sistema de performance detecta automaticamente a capacidade do dispositivo e ajusta a qualidade visual da aplicação para garantir uma experiência fluida.

## 📱 Qualidades Disponíveis

### Low Quality
- **Background**: CSS estático com gradientes simples
- **Efeitos**: Mínimos
- **Uso**: Dispositivos com recursos limitados
- **Performance**: Máxima otimização

### Medium Quality  
- **Background**: CSS animado com partículas e grid
- **Efeitos**: Partículas flutuantes, grid dinâmico
- **Performance**: Balanceada
- **Uso**: Dispositivos intermediários

### High Quality
- **Background**: CSS animado + elementos extras cyberpunk
- **Efeitos**: Scanlines, hologramas, data streams, glows extras
- **Performance**: Visual premium para dispositivos potentes
- **Uso**: Dispositivos de alta performance

## 🔍 Detecção Automática

O sistema detecta automaticamente baseado em:
- **Hardware concurrency** (número de núcleos do processador)
- **User agent** (dispositivo móvel vs desktop)
- **Conexão de rede** (velocidade de conexão)

## 🛠️ Customização

Para ajustar manualmente a qualidade durante desenvolvimento, use o painel no canto inferior direito (apenas em modo DEV).

## ⚙️ Configuração Técnica

- **Arquivo principal**: `src/composables/usePerformanceDetection.ts`
- **Background CSS**: `src/components/BackgroundCSS.vue`
- **Elementos extras**: Definidos em `src/views/DemoSceneBrasil.vue`

## 🎨 Efeitos por Qualidade

### Low
- Gradientes estáticos
- Sem animações

### Medium
- Grid animado
- 15 partículas flutuantes
- Efeitos de movimento suaves

### High (Medium +)
- Scanlines (efeito CRT)
- 3 hologramas flutuantes
- Data streams verticais
- Glows extras com pulsação
- Animações mais complexas

## 🔧 Performance Tips

1. **CSS over JavaScript**: Todos os efeitos usam CSS puro para máxima performance
2. **Hardware acceleration**: `transform3d`, `will-change` e `backface-visibility`
3. **Lazy loading**: Componentes carregam sob demanda
4. **Conditional rendering**: Elementos extras só aparecem quando necessário