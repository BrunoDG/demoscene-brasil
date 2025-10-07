// Lazy loading configuration for heavy components
import { defineAsyncComponent } from 'vue'

// Define async components with loading states
export const Hero = defineAsyncComponent({
  loader: () => import('@/components/Hero.vue'),
  loadingComponent: {
    template: `
      <section id="hero" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p class="text-gray-400">Carregando experiência...</p>
        </div>
      </section>
    `
  },
  delay: 200,
  timeout: 3000
})