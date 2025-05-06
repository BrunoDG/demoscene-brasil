<template>
  <div class="relative min-h-screen overflow-hidden bg-black text-white">
    <!-- Background 3D Animation -->
    <div class="absolute inset-0 z-0">
      <TresCanvas alpha>
        <TresPerspectiveCamera :position="[0, 15, 40]" />
        <OrbitControls 
          :enableDamping="true" 
          :enableZoom="true"
          :maxDistance="60"
          :minDistance="20" 
          :autoRotate="false"
          :minPolarAngle="Math.PI / 6"
          :maxPolarAngle="Math.PI / 2.5"
          :dampingFactor="0.05"
        />
        
        <!-- Fog para efeito de neblina cyberpunk -->
        <TresFog :args="['#0b001a', 10, 60]" />
        
        <TresAmbientLight :intensity="0.1" />
        
        <!-- Cidade Neon -->
        <TresGroup>
          <!-- Estrada/Grid base -->
          <TresMesh :position="[0, -0.5, 0]" :rotation="[-Math.PI / 2, 0, 0]">
            <TresPlaneGeometry :args="[50, 50]" />
            <TresMeshStandardMaterial color="#050505" />
          </TresMesh>
          
          <!-- Linhas de grade da estrada (estilo TRON) -->
          <TresGridHelper 
            :args="[50, 50, '#00ff88', '#101010']" 
            :rotation="[-Math.PI / 2, 0, 0]" 
            :position="[0, -0.48, 0]" 
          />
          
          <!-- Prédios -->
          <TresGroup>
            <TresMesh 
              v-for="(building, i) in buildings" 
              :key="`building-${i}`"
              :position="[building.x, building.y, building.z]"
            >
              <TresBoxGeometry :args="[building.width, building.height, building.depth]" />
              <TresMeshStandardMaterial 
                :color="building.color" 
                :emissive="building.color"
                :emissiveIntensity="0.5"
                :metalness="0.8"
                :roughness="0.2"
              />
            </TresMesh>
          </TresGroup>
          
          <!-- Luzes para iluminar a cena -->
          <TresPointLight :position="[10, 15, 10]" :intensity="2" color="#ff00ff" />
          <TresPointLight :position="[-10, 15, -10]" :intensity="2" color="#00ffff" />
          <TresPointLight :position="[0, 5, 0]" :intensity="1" color="#ffffff" />
          
          <!-- Postes de Luz -->
          <TresGroup>
            <TresGroup v-for="i in 10" :key="`streetlight-${i}`">
              <TresMesh :position="[20 - i * 4, 2.5, 8]">
                <TresCylinderGeometry :args="[0.1, 0.1, 5, 8]" />
                <TresMeshStandardMaterial color="#333333" />
              </TresMesh>
              <TresSpotLight 
                :position="[20 - i * 4, 5, 8]" 
                :intensity="2" 
                color="#ffaa00" 
                :angle="Math.PI / 6"
                :penumbra="0.2"
                :distance="15"
                :castShadow="true"
              />
            </TresGroup>
            
            <TresGroup v-for="i in 10" :key="`streetlight2-${i}`">
              <TresMesh :position="[20 - i * 4, 2.5, -8]">
                <TresCylinderGeometry :args="[0.1, 0.1, 5, 8]" />
                <TresMeshStandardMaterial color="#333333" />
              </TresMesh>
              <TresSpotLight 
                :position="[20 - i * 4, 5, -8]" 
                :intensity="2" 
                color="#ffaa00" 
                :angle="Math.PI / 6"
                :penumbra="0.2"
                :distance="15"
                :castShadow="true"
              />
            </TresGroup>
          </TresGroup>
        </TresGroup>
        
        <!-- Partículas animadas (veículos) -->
        <TresGroup>
          <!-- Veículos indo para um lado -->
          <TresMesh 
            v-for="(pos, i) in carPositions1" 
            :key="`car1-${i}`"
            :position="[pos, 0.1, 6]"
          >
            <TresBoxGeometry :args="[0.8, 0.3, 0.4]" />
            <TresMeshStandardMaterial color="white" :emissive="'white'" :emissiveIntensity="1" />
          </TresMesh>
          <TresPointLight 
            v-for="(pos, i) in carPositions1" 
            :key="`carLight1-${i}`" 
            :position="[pos, 0.3, 6]" 
            :intensity="0.5" 
            color="red" 
            :distance="2" 
          />
          
          <!-- Veículos indo para o outro lado -->
          <TresMesh 
            v-for="(pos, i) in carPositions2" 
            :key="`car2-${i}`"
            :position="[pos, 0.1, -6]"
          >
            <TresBoxGeometry :args="[0.8, 0.3, 0.4]" />
            <TresMeshStandardMaterial color="white" :emissive="'white'" :emissiveIntensity="1" />
          </TresMesh>
          <TresPointLight 
            v-for="(pos, i) in carPositions2" 
            :key="`carLight2-${i}`" 
            :position="[pos, 0.3, -6]" 
            :intensity="0.5" 
            color="white" 
            :distance="2" 
          />
        </TresGroup>
        
        <!-- Partículas flutuantes -->
        <TresMesh 
          v-for="(particle, i) in particles" 
          :key="i" 
          :position="[particle.x, particle.y, particle.z]"
        >
          <TresSphereGeometry :args="[0.05, 8, 8]" />
          <TresMeshStandardMaterial :color="particle.color" :emissive="particle.color" :emissiveIntensity="0.8" />
        </TresMesh>
      </TresCanvas>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-cyan-500/30">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center">
            <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              DemoScene Brasil
            </div>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a v-for="(item, index) in navItems" 
               :key="index" 
               :href="item.href" 
               class="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors"
               @click="(e) => scrollToSection(e, item.href)">
              {{ item.label }}
            </a>
          </nav>
          <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
            <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6 text-white" />
            <XIcon v-else class="h-6 w-6 text-white" />
          </button>
        </div>
        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden bg-black/40 backdrop-blur-md border-b border-cyan-500/30">
          <div class="container mx-auto px-4 py-4">
            <nav class="flex flex-col space-y-4">
              <a v-for="(item, index) in navItems" 
                 :key="index" 
                 :href="item.href" 
                 class="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors"
                 @click="(e) => scrollToSection(e, item.href)">
                {{ item.label }}
              </a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section id="hero" class="min-h-screen flex items-center justify-center px-4 py-20">
        <div class="container mx-auto text-center">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 glitch-text">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Bem vindo à página da<br />DemoScene Brasil!
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explorando a arte digital em tempo real e a criatividade sem limites
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20">
              Explorar
            </button>
            <button class="px-8 py-3 bg-transparent border border-cyan-500 rounded-md text-cyan-400 font-medium hover:bg-cyan-950/30 transition-all">
              Junte-se a nós
            </button>
          </div>
        </div>
      </section>

      <!-- What is DemoScene Section -->
      <section id="about" class="py-20 px-4">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              O que é a DemoScene?
            </span>
          </h2>
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="order-2 md:order-1">
              <p class="text-lg text-gray-300 mb-6">
                A <span class="text-cyan-400 font-semibold">Demoscene</span> é uma subcultura digital internacional focada na produção de demos: apresentações audiovisuais em tempo real que demonstram habilidades em programação, design visual e música eletrônica.
              </p>
              <p class="text-lg text-gray-300 mb-6">
                Surgida nos anos 80 com a pirataria de software, evoluiu para uma forma de arte digital onde programadores, artistas e músicos colaboram para criar experiências audiovisuais impressionantes, muitas vezes com limitações técnicas intencionais.
              </p>
              <p class="text-lg text-gray-300">
                Em 2020, a UNESCO reconheceu a Demoscene como Patrimônio Cultural Imaterial na Alemanha, destacando sua importância cultural e artística.
              </p>
            </div>
            <div class="order-1 md:order-2">
              <div class="bg-black/20 backdrop-blur-sm p-1 border border-cyan-500/30 rounded-lg shadow-xl">
                <div class="rounded-lg p-6 h-full">
                  <h3 class="text-xl font-bold mb-4 text-cyan-400">Características principais:</h3>
                  <ul class="space-y-3">
                    <li class="flex items-start">
                      <CheckIcon class="h-6 w-6 text-cyan-500 mr-2 flex-shrink-0" />
                      <span>Código em tempo real gerando gráficos e música</span>
                    </li>
                    <li class="flex items-start">
                      <CheckIcon class="h-6 w-6 text-cyan-500 mr-2 flex-shrink-0" />
                      <span>Competições em eventos chamados "demoparties"</span>
                    </li>
                    <li class="flex items-start">
                      <CheckIcon class="h-6 w-6 text-cyan-500 mr-2 flex-shrink-0" />
                      <span>Foco em otimização e criatividade técnica</span>
                    </li>
                    <li class="flex items-start">
                      <CheckIcon class="h-6 w-6 text-cyan-500 mr-2 flex-shrink-0" />
                      <span>Comunidade global com décadas de história</span>
                    </li>
                    <li class="flex items-start">
                      <CheckIcon class="h-6 w-6 text-cyan-500 mr-2 flex-shrink-0" />
                      <span>Preservação de plataformas retro e técnicas de programação</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Who We Are Section -->
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
                <div class="bg-black/30 backdrop-blur-sm p-[1px] border border-cyan-500/30 rounded-lg">
                  <div class="rounded-lg h-full flex flex-col items-center justify-center p-4">
                    <CodeIcon class="h-8 w-8 text-cyan-400 mb-2" />
                    <h3 class="font-bold">Programadores</h3>
                  </div>
                </div>
                <div class="bg-black/30 backdrop-blur-sm p-[1px] border border-purple-500/30 rounded-lg">
                  <div class="rounded-lg h-full flex flex-col items-center justify-center p-4">
                    <PaletteIcon class="h-8 w-8 text-pink-400 mb-2" />
                    <h3 class="font-bold">Artistas</h3>
                  </div>
                </div>
                <div class="bg-black/30 backdrop-blur-sm p-[1px] border border-purple-500/30 rounded-lg">
                  <div class="rounded-lg h-full flex flex-col items-center justify-center p-4">
                    <MusicIcon class="h-8 w-8 text-purple-400 mb-2" />
                    <h3 class="font-bold">Músicos</h3>
                  </div>
                </div>
                <div class="bg-black/30 backdrop-blur-sm p-[1px] border border-blue-500/30 rounded-lg">
                  <div class="rounded-lg h-full flex flex-col items-center justify-center p-4">
                    <UsersIcon class="h-8 w-8 text-blue-400 mb-2" />
                    <h3 class="font-bold">Entusiastas</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Parties Section -->
      <section id="parties" class="py-20 px-4">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Próximas Parties
            </span>
          </h2>
          <p class="text-center text-gray-300 max-w-3xl mx-auto mb-12">
            Confira os próximos eventos da demoscene na América do Sul. Junte-se a nós para competições, workshops e muito networking com a comunidade.
          </p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(party, index) in upcomingParties" :key="index" class="bg-black/20 backdrop-blur-sm p-[1px] border border-cyan-500/20 rounded-lg shadow-lg hover:shadow-cyan-500/10 transition-all group">
              <div class="rounded-lg p-6 h-full flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{{ party.name }}</h3>
                  <span class="px-2 py-1 bg-cyan-900/50 text-cyan-400 text-xs rounded-md">{{ party.country }}</span>
                </div>
                <p class="text-gray-400 mb-4 flex-grow">{{ party.description }}</p>
                <div class="flex items-center text-gray-400 mb-4">
                  <CalendarIcon class="h-5 w-5 mr-2 text-cyan-500" />
                  <span>{{ party.date }}</span>
                </div>
                <div class="flex items-center text-gray-400 mb-6">
                  <MapPinIcon class="h-5 w-5 mr-2 text-cyan-500" />
                  <span>{{ party.location }}</span>
                </div>
                <a :href="party.url" target="_blank" class="text-sm text-cyan-400 hover:text-cyan-300 flex items-center mt-auto">
                  Mais informações
                  <ArrowRightIcon class="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
          <div class="text-center mt-12">
            <button class="px-6 py-3 bg-transparent border border-cyan-500 rounded-md text-cyan-400 font-medium hover:bg-cyan-950/30 transition-all">
              Ver todos os eventos
            </button>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
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
                <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord Logo" class="h-16 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-white mb-2">Discord Oficial</h3>
                <p class="text-gray-400">O ponto de encontro da comunidade DemoScene Brasil</p>
              </div>
              <a href="https://discord.gg/demoscene-brasil" target="_blank" class="inline-block px-8 py-3 bg-[#5865F2] rounded-md text-white font-medium hover:bg-[#4752c4] transition-all shadow-lg">
                Entrar no Discord
              </a>
            </div>
          </div>
          <div class="mt-16 max-w-4xl mx-auto">
            <h3 class="text-xl font-bold text-center mb-8 text-cyan-400">Outras formas de contato</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <a href="#" class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm border border-gray-500/30 rounded-lg hover:bg-black/40 hover:border-cyan-500/30 transition-all">
                <MailIcon class="h-8 w-8 text-gray-300 mb-2" />
                <span class="text-gray-300">Email</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm border border-gray-500/30 rounded-lg hover:bg-black/40 hover:border-cyan-500/30 transition-all">
                <TwitterIcon class="h-8 w-8 text-gray-300 mb-2" />
                <span class="text-gray-300">Twitter</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm border border-gray-500/30 rounded-lg hover:bg-black/40 hover:border-cyan-500/30 transition-all">
                <YoutubeIcon class="h-8 w-8 text-gray-300 mb-2" />
                <span class="text-gray-300">YouTube</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-black/20 backdrop-blur-sm border border-gray-500/30 rounded-lg hover:bg-black/40 hover:border-cyan-500/30 transition-all">
                <GithubIcon class="h-8 w-8 text-gray-300 mb-2" />
                <span class="text-gray-300">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 px-4 border-t border-gray-800/30">
        <div class="container mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-4 md:mb-0">
              <div class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                DemoScene Brasil
              </div>
              <a href="https://beveldrive.com.br" target="_blank" class="flex items-center mt-2">
                <img src="/apple-touch-icon.png" alt="Bevel Drive Logo" class="h-6 w-6 mr-2" />
                <p class="text-gray-500 text-sm">© 2025 Bevel Drive. Todos os direitos reservados.</p>
              </a>
            </div>
            <div class="flex space-x-6">
              <a href="#" class="text-gray-400 hover:text-cyan-400 transition-colors">
                <TwitterIcon class="h-5 w-5" />
                <span class="sr-only">Twitter</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-cyan-400 transition-colors">
                <YoutubeIcon class="h-5 w-5" />
                <span class="sr-only">YouTube</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-cyan-400 transition-colors">
                <GithubIcon class="h-5 w-5" />
                <span class="sr-only">GitHub</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-cyan-400 transition-colors">
                <MailIcon class="h-5 w-5" />
                <span class="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  MenuIcon, XIcon, CheckIcon, CodeIcon, PaletteIcon, 
  MusicIcon, UsersIcon, CalendarIcon, MapPinIcon, 
  ArrowRightIcon, MailIcon, TwitterIcon, YoutubeIcon, GithubIcon 
} from 'lucide-vue-next'
import { TresCanvas } from '@tresjs/core'
import { useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

// Navigation
const navItems = [
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

// Cores neon para os edifícios e partículas
const neonColors = ['#00ffff', '#ff00ff', '#00ff88', '#ff0088', '#8800ff', '#00ccff', '#ff00cc']

// Estrutura para definir prédios
interface Building {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  color: string
}

// Array com prédios em posições fixas
const buildings = ref<Building[]>([])

// Gerar prédios com posições fixas
for (let i = 0; i < 20; i++) {
  const color = neonColors[Math.floor(Math.random() * neonColors.length)]
  buildings.value.push({
    x: (Math.random() - 0.5) * 40,
    y: Math.random() * 6 + 1,
    z: (Math.random() - 0.5) * 40,
    width: Math.random() * 3 + 1,
    height: Math.random() * 10 + 2,
    depth: Math.random() * 3 + 1,
    color: color
  })
}

// Partículas flutuantes
interface Particle {
  x: number
  y: number
  z: number
  color: string
  speed: number
  direction: number
}

const particles = ref<Particle[]>([])

// Gerar partículas aleatórias
for (let i = 0; i < 50; i++) {
  particles.value.push({
    x: (Math.random() - 0.5) * 40,
    y: Math.random() * 15,
    z: (Math.random() - 0.5) * 40,
    color: neonColors[Math.floor(Math.random() * neonColors.length)],
    speed: Math.random() * 0.02 + 0.01,
    direction: Math.random() > 0.5 ? 1 : -1
  })
}

// Veículos
const carPositions1 = ref<number[]>([])
const carPositions2 = ref<number[]>([])

// Inicializar posições dos veículos
for (let i = 0; i < 8; i++) {
  carPositions1.value.push(((i * 5) % 45) - 20)
  carPositions2.value.push(20 - ((i * 5) % 45))
}

// Animation loop
const { onLoop } = useRenderLoop()

onMounted(() => {
  onLoop(({ delta }) => {
    // Animar as partículas
    particles.value.forEach(particle => {
      particle.y += particle.speed * particle.direction
      
      // Inverter direção quando atingir limites
      if (particle.y > 15 || particle.y < 0) {
        particle.direction *= -1
      }
    })
    
    // Animar veículos na primeira pista (esquerda para direita)
    for (let i = 0; i < carPositions1.value.length; i++) {
      carPositions1.value[i] += delta * 2
      
      // Loop quando sair do campo de visão
      if (carPositions1.value[i] > 25) {
        carPositions1.value[i] = -25
      }
    }
    
    // Animar veículos na segunda pista (direita para esquerda)
    for (let i = 0; i < carPositions2.value.length; i++) {
      carPositions2.value[i] -= delta * 2
      
      // Loop quando sair do campo de visão
      if (carPositions2.value[i] < -25) {
        carPositions2.value[i] = 25
      }
    }
  })
})

// Upcoming Parties Data
const upcomingParties = [
  {
    name: 'Demoparty Brasil 2025',
    country: 'Brasil',
    description: 'A primeira grande demoparty brasileira, com competições, workshops e palestras.',
    date: '15-17 Maio, 2025',
    location: 'São Paulo, Brasil',
    url: '#'
  },
  {
    name: 'Hacklab Demo Fest',
    country: 'Argentina',
    description: 'Festival focado em demos experimentais e arte digital interativa.',
    date: '22-24 Julho, 2025',
    location: 'Buenos Aires, Argentina',
    url: '#'
  },
  {
    name: 'Retrocomp Chile',
    country: 'Chile',
    description: 'Evento de computação retro com competições de demos para plataformas clássicas.',
    date: '5-7 Setembro, 2025',
    location: 'Santiago, Chile',
    url: '#'
  },
  {
    name: 'Pixel Jam Colombia',
    country: 'Colômbia',
    description: 'Game jam e demoparty com foco em gráficos pixelados e estética retro.',
    date: '12-14 Outubro, 2025',
    location: 'Bogotá, Colômbia',
    url: '#'
  },
  {
    name: 'Byte Fest Uruguay',
    country: 'Uruguai',
    description: 'Festival de arte digital e programação criativa com competições de demos.',
    date: '28-30 Novembro, 2025',
    location: 'Montevidéu, Uruguai',
    url: '#'
  },
  {
    name: 'Retro Coding Peru',
    country: 'Peru',
    description: 'Evento dedicado à programação retro e demos em hardware vintage.',
    date: '16-18 Janeiro, 2026',
    location: 'Lima, Peru',
    url: '#'
  }
]
</script>

<style scoped>
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