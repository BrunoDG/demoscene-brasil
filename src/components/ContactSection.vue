<template>
  <section id="contact" class="py-20 px-4">
    <div class="container mx-auto">
      <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Fale Conosco
        </span>
      </h2>
      <p class="text-center text-gray-300 max-w-3xl mx-auto mb-12">
        Junte-se à nossa comunidade no Discord para conhecer outros entusiastas, compartilhar projetos e ficar por dentro das novidades da demoscene brasileira.
      </p>
      <div class="max-w-md mx-auto bg-black/20 backdrop-blur-sm p-1 border border-purple-500/30 rounded-lg shadow-xl">
        <div class="rounded-lg p-8 text-center">
          <div class="mb-6">
            <img 
              src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
              alt="Discord Logo" 
              class="h-16 mx-auto mb-4" 
              loading="lazy"
            />
            <h3 class="text-xl font-bold text-white mb-2">Discord Oficial</h3>
            <p class="text-gray-400">O ponto de encontro da comunidade DemoScene Brasil</p>
          </div>
          <a 
            href="https://discord.gg/demoscene-brasil" 
            target="_blank" 
            class="inline-block px-8 py-3 bg-[#5865F2] rounded-md text-white font-medium hover:bg-[#4752c4] transition-all shadow-lg"
          >
            Entrar no Discord
          </a>
        </div>
      </div>
      <div class="mt-16 max-w-4xl mx-auto">
        <h3 class="text-xl font-bold text-center mb-8 text-cyan-400">Outras formas de contato</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <a 
            v-for="(contact, index) in contactMethods" 
            :key="index"
            :href="contact.url" 
            class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm border border-gray-500/30 rounded-lg hover:bg-black/40 hover:border-cyan-500/30 transition-all"
          >
            <component :is="contact.icon" class="h-8 w-8 text-gray-300 mb-2" />
            <span class="text-gray-300">{{ contact.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MailIcon, TwitterIcon, YoutubeIcon, GithubIcon } from 'lucide-vue-next'

const contactMethods = [
  {
    label: 'Email',
    icon: MailIcon,
    url: '#'
  },
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
  }
]
</script>