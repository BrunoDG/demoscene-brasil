<template>
    <section id="parties" class="py-20 px-4">
        <div class="container mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Próximas Parties
                </span>
            </h2>
            <p class="text-center text-gray-300 max-w-3xl mx-auto mb-12">
                Confira os próximos eventos da demoscene mundial. Dados atualizados em tempo real do demoparty.net.
            </p>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p class="text-gray-400">Carregando eventos...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-red-400 mb-4">{{ error }}</p>
                    <button @click="fetchParties(false)"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors">
                        Tentar novamente
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && !error && parties.length === 0" class="text-center py-12">
                <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-yellow-400 mb-4">Nenhum evento encontrado</p>
                    <button @click="fetchParties(false)"
                        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white transition-colors">
                        Recarregar
                    </button>
                </div>
            </div>

            <!-- Parties Carousel -->
        <div v-if="parties.length > 0" class="container mx-auto">
            <!-- Carousel Header -->
            <div class="flex justify-between items-center mb-8">
                <p class="text-gray-400 text-sm">
                    Página {{ currentPage + 1 }} de {{ totalPages }} • {{ parties.length }} eventos
                </p>
                
                <!-- Navigation Buttons -->
                <div class="flex gap-2">
                    <button 
                        @click="prevPage"
                        :disabled="currentPage === 0"
                        class="p-2 rounded-md bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon class="h-5 w-5" />
                    </button>
                    <button 
                        @click="nextPage"
                        :disabled="currentPage >= totalPages - 1"
                        class="p-2 rounded-md bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRightIcon class="h-5 w-5" />
                    </button>
                </div>
            </div>

            <!-- Cards Grid (3 per page) with Animation -->
            <div class="relative overflow-hidden min-h-[400px]">
                <Transition 
                    name="fade" 
                    mode="out-in"
                >
                    <div 
                        :key="currentPage"
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <div 
                            v-for="(party, index) in currentCards" 
                            :key="`${currentPage}-${index}`"
                            class="bg-black/20 backdrop-blur-sm p-[1px] border border-cyan-500/20 rounded-lg shadow-lg hover:shadow-cyan-500/10 transition-all group"
                        >
                            <div class="rounded-lg p-6 h-full flex flex-col">
                        <!-- Header com logo -->
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                                    {{ party.name }}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-1 bg-cyan-900/50 text-cyan-400 text-xs rounded-md">
                                        {{ party.country }}
                                    </span>
                                    <span v-if="party.isOnline"
                                        class="px-2 py-1 bg-purple-900/50 text-purple-400 text-xs rounded-md">
                                        Online
                                    </span>
                                </div>
                            </div>
                            <img v-if="party.logo" :src="party.logo" :alt="`Logo ${party.name}`"
                                class="w-12 h-12 object-contain rounded ml-3" loading="lazy" @error="handleImageError" />
                        </div>

                        <!-- Description -->
                        <p class="text-gray-400 mb-4 flex-grow text-sm">{{ party.description }}</p>

                        <!-- Event Info -->
                        <div class="space-y-3 mb-6">
                            <div class="flex items-center text-gray-400 text-sm">
                                <CalendarIcon class="h-4 w-4 mr-2 text-cyan-500 flex-shrink-0" />
                                <span>{{ party.date }}</span>
                            </div>
                            <div class="flex items-center text-gray-400 text-sm">
                                <MapPinIcon class="h-4 w-4 mr-2 text-cyan-500 flex-shrink-0" />
                                <span>{{ party.location }}</span>
                            </div>
                            <div v-if="party.platforms.length > 0" class="flex items-start text-gray-400 text-sm">
                                <MonitorIcon class="h-4 w-4 mr-2 text-cyan-500 flex-shrink-0 mt-0.5" />
                                <span>{{ party.platforms.slice(0, 3).join(', ') }}</span>
                                <span v-if="party.platforms.length > 3" class="text-gray-500">...</span>
                            </div>
                        </div>

                        <!-- Action -->
                        <a :href="party.url" target="_blank" rel="noopener noreferrer"
                            class="text-sm text-cyan-400 hover:text-cyan-300 flex items-center mt-auto transition-colors">
                            Mais informações
                            <ArrowRightIcon class="h-4 w-4 ml-1" />
                        </a>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Page Indicators -->
            <div class="flex justify-center mt-8 gap-2">
                <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="goToPage(page - 1)"
                    :class="[
                        'w-3 h-3 rounded-full transition-all',
                        currentPage === page - 1 
                            ? 'bg-cyan-400 scale-110' 
                            : 'bg-gray-600 hover:bg-gray-500'
                    ]"
                ></button>
            </div>
            </div>

            <!-- Footer Actions -->
            <div class="text-center mt-12">
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button @click="fetchParties(false)" :disabled="loading"
                        class="px-6 py-3 bg-transparent border border-cyan-500 rounded-md text-cyan-400 font-medium hover:bg-cyan-950/30 transition-all disabled:opacity-50">
                        {{ loading ? 'Carregando...' : 'Atualizar eventos' }}
                    </button>
                    <a href="https://www.demoparty.net/" target="_blank" rel="noopener noreferrer"
                        class="px-6 py-3 bg-transparent border border-purple-500 rounded-md text-purple-400 font-medium hover:bg-purple-950/30 transition-all">
                        Ver todos no demoparty.net
                    </a>
                </div>

                <p class="text-gray-500 text-xs mt-4">
                    Dados fornecidos por
                    <a href="https://www.demoparty.net/" target="_blank" class="text-cyan-400 hover:text-cyan-300">
                        demoparty.net
                    </a>
                    <span v-if="parties.length > 0" class="ml-2">
                        • {{ parties.length }} eventos • Atualizado automaticamente
                    </span>
                </p>
            </div>
        </div>
    </section>
</template><script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { CalendarIcon, MapPinIcon, ArrowRightIcon, MonitorIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { useDemoParties } from '@/services/demoPartyService'

// Usar o hook para obter os dados das parties
const { parties, loading, error, fetchParties } = useDemoParties()

// Estados do carousel
const currentPage = ref(0)
const cardsPerPage = 3

// Computed para organizar os cards em páginas
const totalPages = computed(() => {
  return Math.ceil(parties.value.length / cardsPerPage)
})

const currentCards = computed(() => {
  const start = currentPage.value * cardsPerPage
  const end = start + cardsPerPage
  return parties.value.slice(start, end)
})

// Funções de navegação do carousel
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Função para lidar com erros de imagem
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// Buscar dados quando o componente for montado
onMounted(async () => {
  await fetchParties()
})
</script>

<style scoped>
/* Animação simples e elegante do carousel */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>