<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-cyan-500/30">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          DemoScene Brasil
        </div>
      </div>
      <nav class="hidden md:flex space-x-8">
        <a 
          v-for="(item, index) in navItems" 
          :key="index" 
          :href="item.href" 
          class="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors"
          @click="(e) => scrollToSection(e, item.href)"
        >
          {{ item.label }}
        </a>
      </nav>
      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
        <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6 text-white" />
        <XIcon v-else class="h-6 w-6 text-white" />
      </button>
    </div>
    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-black/40 backdrop-blur-md border-b border-cyan-500/30">
        <div class="container mx-auto px-4 py-4">
          <nav class="flex flex-col space-y-4">
            <a 
              v-for="(item, index) in navItems" 
              :key="index" 
              :href="item.href" 
              class="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors"
              @click="(e) => scrollToSection(e, item.href)"
            >
              {{ item.label }}
            </a>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Início', href: '#hero' },
  { label: 'O que é', href: '#about' },
  { label: 'Quem Somos', href: '#who-we-are' },
  { label: 'Parties', href: '#parties' },
  { label: 'Contato', href: '#contact' }
]

const mobileMenuOpen = ref(false)

// Função para rolagem suave
const scrollToSection = (event: Event, targetId: string) => {
  event.preventDefault()
  
  // Fecha o menu mobile se estiver aberto
  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
  
  const targetElement = document.querySelector(targetId)
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>