// Cache e otimização para dados das demoparties
import { ref, computed } from 'vue'
import type { DemoParty } from '@/services/demoPartyService'

const CACHE_KEY = 'demoscene-brasil-parties'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora em milliseconds

interface CachedData {
  data: DemoParty[]
  timestamp: number
}

class CacheManager {
  static set(data: DemoParty[]): void {
    try {
      const cachedData: CachedData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData))
    } catch (error) {
      console.warn('Não foi possível salvar no cache:', error)
    }
  }

  static get(): DemoParty[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const cachedData: CachedData = JSON.parse(cached)
      const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      // Converter strings de data de volta para objetos Date
      return cachedData.data.map(party => ({
        ...party,
        startDate: new Date(party.startDate),
        endDate: new Date(party.endDate)
      }))
    } catch (error) {
      console.warn('Erro ao ler cache:', error)
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  }

  static clear(): void {
    localStorage.removeItem(CACHE_KEY)
  }
}

// Hook para usar cache inteligente
export function useCachedDemoParties() {
  const parties = ref<DemoParty[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Computadas para filtros
  const upcomingParties = computed(() => {
    const now = new Date()
    return parties.value.filter(party => party.startDate > now)
  })

  const partiesByRegion = computed(() => {
    const regions: Record<string, DemoParty[]> = {
      'América do Sul': [],
      'Europa': [],
      'América do Norte': [],
      'Ásia': [],
      'Online': [],
      'Outros': []
    }

    parties.value.forEach(party => {
      if (party.isOnline) {
        regions['Online'].push(party)
      } else {
        switch (party.countryCode) {
          case 'br':
          case 'ar':
          case 'cl':
          case 'co':
          case 'uy':
          case 'pe':
            regions['América do Sul'].push(party)
            break
          case 'de':
          case 'fr':
          case 'es':
          case 'se':
          case 'dk':
          case 'pl':
          case 'pt':
          case 'be':
            regions['Europa'].push(party)
            break
          case 'us':
          case 'ca':
          case 'mx':
            regions['América do Norte'].push(party)
            break
          case 'jp':
          case 'kr':
          case 'cn':
            regions['Ásia'].push(party)
            break
          default:
            regions['Outros'].push(party)
        }
      }
    })

    return regions
  })

  const stats = computed(() => ({
    total: parties.value.length,
    upcoming: upcomingParties.value.length,
    online: parties.value.filter(p => p.isOnline).length,
    thisMonth: upcomingParties.value.filter(party => {
      const now = new Date()
      return party.startDate.getMonth() === now.getMonth() && 
             party.startDate.getFullYear() === now.getFullYear()
    }).length
  }))

  // Verificar se precisa atualizar
  const needsUpdate = (): boolean => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return true

    try {
      const cachedData: CachedData = JSON.parse(cached)
      return Date.now() - cachedData.timestamp > CACHE_DURATION
    } catch {
      return true
    }
  }

  // Carregar do cache primeiro
  const loadFromCache = (): boolean => {
    const cachedParties = CacheManager.get()
    if (cachedParties) {
      parties.value = cachedParties
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const cachedData: CachedData = JSON.parse(cached)
        lastUpdated.value = new Date(cachedData.timestamp)
      }
      return true
    }
    return false
  }

  // Salvar no cache
  const saveToCache = (data: DemoParty[]) => {
    CacheManager.set(data)
    lastUpdated.value = new Date()
  }

  // Limpar cache
  const clearCache = () => {
    CacheManager.clear()
    parties.value = []
    lastUpdated.value = null
  }

  return {
    parties,
    loading,
    error,
    lastUpdated,
    upcomingParties,
    partiesByRegion,
    stats,
    needsUpdate,
    loadFromCache,
    saveToCache,
    clearCache
  }
}