<template>
  <section id="who-we-are" class="py-20 px-4">
    <div class="container mx-auto">
      <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Quem Somos
        </span>
      </h2>
      <div class="max-w-4xl mx-auto bg-black/20 backdrop-blur-sm p-1 border border-cyan-500/30 rounded-lg shadow-xl">
        <div class="rounded-lg p-8">
          <p class="text-lg text-gray-300 mb-6">
            A <span class="text-cyan-400 font-semibold">DemoScene Brasil</span> é uma comunidade dedicada a reunir e fomentar a cena brasileira de demos, conectando programadores, artistas visuais, músicos e entusiastas da arte digital em tempo real.
          </p>
          <p class="text-lg text-gray-300 mb-6">
            Nosso objetivo é criar um espaço de colaboração, aprendizado e expressão criativa, promovendo a cultura demoscene no Brasil e conectando nossa comunidade ao cenário internacional.
          </p>
          <p class="text-lg text-gray-300 mb-8">
            Seja você um veterano da demoscene ou alguém curioso para aprender mais, todos são bem-vindos a participar, compartilhar conhecimentos e contribuir para o crescimento desta forma única de arte digital em nosso país.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div 
              v-for="(role, index) in roles" 
              :key="index" 
              class="bg-black/30 backdrop-blur-sm p-[1px] border border-cyan-500/30 rounded-lg"
              :class="role.borderClass"
            >
              <div class="rounded-lg h-full flex flex-col items-center justify-center p-4">
                <component :is="role.icon" :class="role.iconClass" class="h-8 w-8 mb-2" />
                <h3 class="font-bold">{{ role.title }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CodeIcon, PaletteIcon, MusicIcon, UsersIcon } from 'lucide-vue-next'

const roles = [
  {
    title: 'Programadores',
    icon: CodeIcon,
    iconClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30'
  },
  {
    title: 'Artistas',
    icon: PaletteIcon,
    iconClass: 'text-pink-400',
    borderClass: 'border-purple-500/30'
  },
  {
    title: 'Músicos',
    icon: MusicIcon,
    iconClass: 'text-purple-400',
    borderClass: 'border-purple-500/30'
  },
  {
    title: 'Entusiastas',
    icon: UsersIcon,
    iconClass: 'text-blue-400',
    borderClass: 'border-blue-500/30'
  }
]
</script>