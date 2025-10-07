<template>
  <div class="relative text-white">
    <!-- Background FIXO - sempre visível, não rola -->
    <div class="fixed inset-0 z-0">
      <!-- Background CSS para Medium/High Quality -->
      <BackgroundCSS v-if="quality === 'medium' || quality === 'high'" :quality="quality" />
      
      <!-- Elementos extras SOMENTE para High Quality -->
      <div v-if="quality === 'high'" class="absolute inset-0 z-1 high-quality-extras">
        <!-- Scanlines effect -->
        <div class="scanlines"></div>
        
        <!-- Extra floating elements -->
        <div class="floating-holograms">
          <div class="hologram hologram-1"></div>
          <div class="hologram hologram-2"></div>
          <div class="hologram hologram-3"></div>
        </div>
        
        <!-- Data streams -->
        <div class="data-streams">
          <div class="stream stream-1"></div>
          <div class="stream stream-2"></div>
          <div class="stream stream-3"></div>
        </div>
        
        <!-- Extra glow effects -->
        <div class="extra-glows">
          <div class="glow glow-cyan"></div>
          <div class="glow glow-magenta"></div>
          <div class="glow glow-yellow"></div>
        </div>
      </div>
      
      <!-- Static CSS Background para Low Quality -->
      <div 
        v-else-if="quality === 'low'"
        class="absolute inset-0 static-cyberpunk-bg"
      >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>
      </div>
    </div>

    <!-- Content - rola sobre o background fixo -->
    <div class="relative z-10">
      <!-- Header -->
      <AppHeader />

      <!-- Hero Section - completamente transparente -->
      <Hero />

      <!-- Sections - todas transparentes para mostrar o background -->
      <AboutSection />
      <WhoWeAreSection />
      <PartiesSection />
      <ContactSection />
      <AppFooter />
    </div>

    <!-- Performance Toggle (only show in development) -->
    <div 
      v-if="isDev" 
      class="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4"
    >
      <h4 class="text-sm font-bold text-cyan-400 mb-2">Qualidade:</h4>
      <div class="flex space-x-2">
        <button
          v-for="level in ['low', 'medium', 'high']"
          :key="level"
          @click="setQuality(level as QualityLevel)"
          :class="[
            'px-2 py-1 text-xs rounded transition-colors',
            quality === level 
              ? 'bg-cyan-500 text-black' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          ]"
        >
          {{ level }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Hero } from '@/components/LazyComponents'
import BackgroundCSS from '@/components/BackgroundCSS.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AboutSection from '@/components/AboutSection.vue'
import WhoWeAreSection from '@/components/WhoWeAreSection.vue'
import PartiesSection from '@/components/PartiesSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import { usePerformanceDetection, type QualityLevel } from '@/composables/usePerformanceDetection'

// Performance detection
const { quality, setQuality } = usePerformanceDetection()

// Development mode detection
const isDev = computed(() => import.meta.env.DEV)
</script>

<style scoped>
/* Static Cyberpunk Background for Low Quality */
.static-cyberpunk-bg {
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 100, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(255, 100, 120, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 40% 40%, rgba(100, 255, 255, 0.1) 0%, transparent 40%),
    linear-gradient(45deg, transparent 30%, rgba(0, 255, 136, 0.05) 31%, rgba(0, 255, 136, 0.05) 32%, transparent 33%),
    linear-gradient(-45deg, transparent 30%, rgba(255, 0, 255, 0.05) 31%, rgba(255, 0, 255, 0.05) 32%, transparent 33%),
    linear-gradient(to bottom, #000 0%, #0a0a0a 50%, #1a0a1a 100%);
  background-size: 100% 100%, 100% 100%, 100% 100%, 50px 50px, 50px 50px, 100% 100%;
}

/* HIGH QUALITY EXTRAS */
.high-quality-extras {
  pointer-events: none;
}

/* Scanlines effect */
.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 255, 136, 0.03) 50%
  );
  background-size: 100% 4px;
  animation: scanlines 0.1s linear infinite;
}

@keyframes scanlines {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

/* Floating holograms */
.floating-holograms {
  position: absolute;
  inset: 0;
}

.hologram {
  position: absolute;
  border: 1px solid;
  border-radius: 8px;
  background: transparent;
  opacity: 0.7;
}

.hologram-1 {
  top: 20%;
  left: 15%;
  width: 120px;
  height: 80px;
  border-color: #00ffff;
  animation: hologramFloat1 8s ease-in-out infinite;
  box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.1);
}

.hologram-2 {
  top: 60%;
  right: 20%;
  width: 90px;
  height: 60px;
  border-color: #ff00ff;
  animation: hologramFloat2 6s ease-in-out infinite;
  box-shadow: inset 0 0 20px rgba(255, 0, 255, 0.1);
}

.hologram-3 {
  bottom: 30%;
  left: 50%;
  width: 100px;
  height: 70px;
  border-color: #ffff00;
  animation: hologramFloat3 7s ease-in-out infinite;
  box-shadow: inset 0 0 20px rgba(255, 255, 0, 0.1);
}

@keyframes hologramFloat1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.7; }
  50% { transform: translate(10px, -15px) rotate(2deg); opacity: 0.9; }
}

@keyframes hologramFloat2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
  50% { transform: translate(-8px, 12px) rotate(-1deg); opacity: 0.8; }
}

@keyframes hologramFloat3 {
  0%, 100% { transform: translate(-50%, 0) rotate(0deg); opacity: 0.7; }
  50% { transform: translate(-50%, -10px) rotate(1deg); opacity: 0.9; }
}

/* Data streams */
.data-streams {
  position: absolute;
  inset: 0;
}

.stream {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #00ff00, transparent);
  opacity: 0.6;
}

.stream-1 {
  left: 25%;
  animation: dataStream1 3s linear infinite;
}

.stream-2 {
  left: 65%;
  animation: dataStream2 4s linear infinite;
}

.stream-3 {
  right: 30%;
  animation: dataStream3 3.5s linear infinite;
}

@keyframes dataStream1 {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(100vh); opacity: 0; }
}

@keyframes dataStream2 {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(100vh); opacity: 0; }
}

@keyframes dataStream3 {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 0.7; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* Extra glow effects */
.extra-glows {
  position: absolute;
  inset: 0;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
}

.glow-cyan {
  top: 10%;
  left: 20%;
  width: 200px;
  height: 200px;
  background: #00ffff;
  animation: glowPulse1 5s ease-in-out infinite;
}

.glow-magenta {
  bottom: 20%;
  right: 25%;
  width: 150px;
  height: 150px;
  background: #ff00ff;
  animation: glowPulse2 4s ease-in-out infinite;
}

.glow-yellow {
  top: 50%;
  left: 60%;
  width: 180px;
  height: 180px;
  background: #ffff00;
  animation: glowPulse3 6s ease-in-out infinite;
}

@keyframes glowPulse1 {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.1); }
}

@keyframes glowPulse2 {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.2); }
}

@keyframes glowPulse3 {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(1.15); }
}

/* Glitch effect for text */
.glitch-text {
  position: relative;
  animation: glitch 5s infinite;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 255, 0.75),
                -0.05em -0.025em 0 rgba(0, 255, 255, 0.75),
                0.025em 0.05em 0 rgba(0, 255, 0, 0.75);
  }
  14% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 255, 0.75),
                -0.05em -0.025em 0 rgba(0, 255, 255, 0.75),
                0.025em 0.05em 0 rgba(0, 255, 0, 0.75);
  }
  15% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 255, 0.75),
                0.025em 0.025em 0 rgba(0, 255, 255, 0.75),
                -0.05em -0.05em 0 rgba(0, 255, 0, 0.75);
  }
  49% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 255, 0.75),
                0.025em 0.025em 0 rgba(0, 255, 255, 0.75),
                -0.05em -0.05em 0 rgba(0, 255, 0, 0.75);
  }
  50% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 255, 0.75),
                0.05em 0 0 rgba(0, 255, 255, 0.75),
                0 -0.05em 0 rgba(0, 255, 0, 0.75);
  }
  99% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 255, 0.75),
                0.05em 0 0 rgba(0, 255, 255, 0.75),
                0 -0.05em 0 rgba(0, 255, 0, 0.75);
  }
  100% {
    text-shadow: -0.025em 0 0 rgba(255, 0, 255, 0.75),
                -0.025em -0.025em 0 rgba(0, 255, 255, 0.75),
                -0.025em -0.05em 0 rgba(0, 255, 0, 0.75);
  }
}
</style>