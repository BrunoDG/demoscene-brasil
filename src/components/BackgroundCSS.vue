<template>
  <div class="absolute inset-0 z-0 background-cyberpunk">
    <!-- Grid effect -->
    <div class="absolute inset-0 grid-effect"></div>
    
    <!-- Floating particles -->
    <div class="absolute inset-0 particles">
      <div 
        v-for="i in 15" 
        :key="i" 
        class="particle"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
          animationDuration: (3 + Math.random() * 4) + 's'
        }"
      ></div>
    </div>

    <!-- City silhouette removida para evitar listra preta -->
  </div>
</template>

<script setup lang="ts">
// Props para compatibilidade
interface Props {
  quality?: 'low' | 'medium' | 'high'
}

withDefaults(defineProps<Props>(), {
  quality: 'medium'
})
</script>

<style scoped>
.background-cyberpunk {
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 100, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 100, 120, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(100, 255, 255, 0.05) 0%, transparent 50%),
    linear-gradient(to bottom, #000 0%, #0a0a0a 50%, #1a0a1a 100%);
}

.grid-effect {
  background-image: 
    linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.particles {
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: cyan;
  border-radius: 50%;
  animation: float infinite ease-in-out;
  box-shadow: 0 0 10px currentColor;
}

.particle:nth-child(odd) {
  background: #ff00ff;
}

.particle:nth-child(3n) {
  background: #00ffff;
  width: 1px;
  height: 1px;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}
</style>