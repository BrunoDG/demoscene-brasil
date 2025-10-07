<template>
  <footer class="py-8 px-4 border-t border-gray-800/30">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <div class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            DemoScene Brasil
          </div>
          <a href="https://beveldrive.com.br" target="_blank" class="flex items-center mt-2">
            <img src="/apple-touch-icon.png" alt="Bevel Drive Logo" class="h-6 w-6 mr-2" loading="lazy" />
            <p class="text-gray-500 text-sm">© 2025 Bevel Drive. Todos os direitos reservados.</p>
          </a>
        </div>
        <div class="flex space-x-6">
          <a 
            v-for="(social, index) in socialLinks"
            :key="index"
            :href="social.url" 
            class="text-gray-400 hover:text-cyan-400 transition-colors"
            :aria-label="social.label"
          >
            <component :is="social.icon" class="h-5 w-5" />
            <span class="sr-only">{{ social.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { TwitterIcon, YoutubeIcon, GithubIcon, MailIcon } from 'lucide-vue-next'

const socialLinks = [
  {
    label: 'Twitter',
    icon: TwitterIcon,
    url: '#'
  },
  {
    label: 'YouTube',
    icon: YoutubeIcon,
    url: '#'
  },
  {
    label: 'GitHub',
    icon: GithubIcon,
    url: '#'
  },
  {
    label: 'Email',
    icon: MailIcon,
    url: '#'
  }
]
</script>