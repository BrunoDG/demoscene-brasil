<template>
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
                <li v-for="(feature, index) in features" :key="index" class="flex items-start">
                  <CheckIcon class="h-6 w-6 text-cyan-500 mr-2 flex-shrink-0" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'

const features = [
  'Código em tempo real gerando gráficos e música',
  'Competições em eventos chamados "demoparties"',
  'Foco em otimização e criatividade técnica',
  'Comunidade global com décadas de história',
  'Preservação de plataformas retro e técnicas de programação'
]
</script>