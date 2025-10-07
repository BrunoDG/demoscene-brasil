// Serviço para buscar e parsear dados das demoparties
import { ref } from 'vue'

export interface DemoParty {
  name: string
  country: string
  countryCode: string
  description: string
  date: string
  startDate: Date
  endDate: Date
  location: string
  url: string
  logo?: string
  type: string
  platforms: string[]
  isOnline: boolean
}

class DemoPartyService {
  private readonly RSS_URL = 'https://www.demoparty.net/demoparties.xml'
  private readonly CORS_PROXIES = [
    'https://api.allorigins.win/get?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://corsproxy.io/?'
  ]
  
  // Mapeamento de códigos de país para nomes em português
  private readonly countryMap: Record<string, string> = {
    'dk': 'Dinamarca 🇩🇰',
    'ar': 'Argentina 🇦🇷',
    'se': 'Suécia 🇸🇪',
    'es': 'Espanha 🇪🇸',
    'fr': 'França 🇫🇷',
    'de': 'Alemanha 🇩🇪',
    'us': 'Estados Unidos 🇺🇸',
    'pl': 'Polônia 🇵🇱',
    'pt': 'Portugal 🇵🇹',
    'jp': 'Japão 🇯🇵',
    'ru': 'Rússia 🇷🇺',
    'be': 'Bélgica 🇧🇪',
    'br': 'Brasil 🇧🇷',
    'mx': 'México 🇲🇽',
    'cl': 'Chile 🇨🇱',
    'co': 'Colômbia 🇨🇴',
    'uy': 'Uruguai 🇺🇾',
    'pe': 'Peru 🇵🇪'
  }

  async fetchDemoParties(): Promise<DemoParty[]> {
    try {
      let xmlContent = ''
      
      // Tentar primeiro sem proxy (para caso o CORS seja permitido)
      try {
        const directResponse = await fetch(this.RSS_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml',
          }
        })
        if (directResponse.ok) {
          xmlContent = await directResponse.text()
        }
      } catch (err) {
        // Acesso direto falhou, tentar proxies
      }
      
      // Se não conseguiu direto, tentar proxies em sequência
      if (!xmlContent) {
        for (const proxy of this.CORS_PROXIES) {
          try {
            xmlContent = await this.tryFetchWithProxy(proxy)
            if (xmlContent) {
              break
            }
          } catch (error) {
            continue
          }
        }
      }

      // Se ainda não conseguiu, usar dados de fallback
      if (!xmlContent) {
        throw new Error('Todos os proxies falharam')
      }

      // Validar se é XML válido
      if (!xmlContent.trim().startsWith('<?xml')) {
        throw new Error('Resposta não é um XML válido')
      }

      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')
      
      // Verificar se houve erro no parsing
      const parseError = xmlDoc.querySelector('parsererror')
      if (parseError) {
        throw new Error('XML mal formado')
      }
      
      const result = this.parseXMLToDemoParties(xmlDoc)
      return result
    } catch (error) {
      // Fallback para dados mockados em caso de erro
      return this.getFallbackData()
    }
  }

  private async tryFetchWithProxy(proxy: string): Promise<string> {
    if (proxy.includes('allorigins.win')) {
      // AllOrigins retorna JSON
      const response = await fetch(`${proxy}${encodeURIComponent(this.RSS_URL)}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      if (!data.contents) {
        throw new Error('Sem conteúdo na resposta')
      }
      return data.contents
    } else {
      // Outros proxies retornam texto direto
      const response = await fetch(`${proxy}${this.RSS_URL}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return await response.text()
    }
  }

  private parseXMLToDemoParties(xmlDoc: Document): DemoParty[] {
    const items = xmlDoc.querySelectorAll('item')
    const parties: DemoParty[] = []

    items.forEach(item => {
      try {
        const party = this.parsePartyItem(item)
        if (party) {
          parties.push(party)
        }
      } catch (error) {
        console.warn('Erro ao parsear item da party:', error)
      }
    })

    // Filtrar apenas eventos futuros e ordenar por data
    const now = new Date()
    return parties
      .filter(party => party.startDate > now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 12) // Limitado a 12 eventos
  }

  private parsePartyItem(item: Element): DemoParty | null {
    const getElementText = (selector: string): string => {
      // Tentar múltiplas formas de encontrar o elemento
      let element: Element | null = null
      
      try {
        // Primeiro: tentar selector direto (para elementos sem namespace)
        if (!selector.includes(':')) {
          element = item.querySelector(selector)
          if (element) {
            return element.textContent?.trim() || ''
          }
        }
        
        // Segundo: para elementos com namespace, usar getElementsByTagName
        if (selector.includes(':')) {
          const tagName = selector.split(':')[1] // pega apenas a parte depois do ':'
          
          // Buscar por nome completo com namespace
          let elements = item.getElementsByTagName(selector)
          if (elements.length > 0) {
            element = elements[0]
          } else {
            // Buscar apenas pelo nome local (sem namespace)
            elements = item.getElementsByTagName(tagName)
            if (elements.length > 0) {
              element = elements[0]
            }
          }
        }
        
        // Terceiro: tentar buscar todos os filhos e procurar pelo nome da tag
        if (!element) {
          const children = Array.from(item.children)
          for (const child of children) {
            const localName = child.localName || child.tagName.split(':').pop()
            const targetName = selector.includes(':') ? selector.split(':')[1] : selector
            
            if (localName === targetName) {
              element = child
              break
            }
          }
        }
        
      } catch (error) {
        console.warn(`Erro ao buscar elemento ${selector}:`, error)
      }
      
      return element?.textContent?.trim() || ''
    }

    try {
      const name = getElementText('title')
      const link = getElementText('link')
      const countryCode = getElementText('demopartynet:country') || getElementText('country')
      const startDateText = getElementText('demopartynet:startDate') || getElementText('startDate')
      const endDateText = getElementText('demopartynet:endDate') || getElementText('endDate')
      const partyUrl = getElementText('demopartynet:url') || getElementText('url') || link
      const eventAttendanceMode = getElementText('demopartynet:eventAttendanceMode') || getElementText('eventAttendanceMode')

      if (!name) {
        return null
      }

      // Parsear descrição HTML para extrair informações
      const description = item.querySelector('description')?.textContent || ''
      const locationMatch = description.match(/Location<\/dt>\s*<dd>([^<]+)/i)
      const platformsMatch = description.match(/Platforms<\/dt>\s*<dd>([^<]+)/i)
      const typeMatch = description.match(/Type<\/dt>\s*<dd>([^<]+)/i)

      // Parsear datas com validação
      let startDate = new Date()
      let endDate = new Date()
      
      try {
        if (startDateText) {
          startDate = new Date(startDateText)
          if (isNaN(startDate.getTime())) {
            startDate = new Date()
          }
        }
        if (endDateText) {
          endDate = new Date(endDateText)
          if (isNaN(endDate.getTime())) {
            endDate = startDate
          }
        } else {
          endDate = startDate
        }
      } catch {
        startDate = new Date()
        endDate = new Date()
      }

      // Extrair logo com validação
      const enclosure = item.querySelector('enclosure')
      let logo = enclosure?.getAttribute('url') || ''
      
      // Verificar se a URL do logo é válida
      if (logo && !logo.startsWith('http')) {
        logo = ''
      }

      const party = {
        name,
        country: countryCode ? (this.countryMap[countryCode] || countryCode.toUpperCase()) : 'International',
        countryCode: countryCode || 'int',
        description: this.cleanDescription(description),
        date: this.formatDateRange(startDate, endDate),
        startDate,
        endDate,
        location: this.extractLocation(locationMatch?.[1] || '', countryCode),
        url: partyUrl || '#',
        logo: logo,
        type: typeMatch?.[1]?.trim() || 'Demoparty',
        platforms: this.extractPlatforms(platformsMatch?.[1] || ''),
        isOnline: eventAttendanceMode?.includes('Online') || false
      }

      return party

    } catch (error) {
      console.warn('Erro ao parsear item:', error)
      return null
    }
  }

  private cleanDescription(htmlDescription: string): string {
    // Extrair primeira linha útil da descrição
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlDescription
    
    const paragraphs = tempDiv.querySelectorAll('p')
    if (paragraphs.length > 0) {
      const firstP = paragraphs[0].textContent?.trim() || ''
      return firstP.length > 0 ? firstP.substring(0, 150) + '...' : ''
    }
    
    return 'Evento da demoscene internacional.'
  }

  private extractLocation(locationText: string, countryCode: string): string {
    if (!locationText) {
      const countryName = this.countryMap[countryCode]
      return countryName ? countryName.split(' ')[0] : countryCode.toUpperCase()
    }
    
    // Limpar quebras de linha e HTML
    const cleaned = locationText.replace(/<br>/gi, ', ').replace(/\s+/g, ' ').trim()
    return cleaned.length > 50 ? cleaned.substring(0, 50) + '...' : cleaned
  }

  private extractPlatforms(platformText: string): string[] {
    if (!platformText) return ['Multiplatform']
    
    const platforms = platformText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)
    
    return platforms.length > 0 ? platforms : ['Multiplatform']
  }

  private formatDateRange(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('pt-BR', options)
    }
    
    const startStr = start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
    const endStr = end.toLocaleDateString('pt-BR', options)
    
    return `${startStr} - ${endStr}`
  }

  // Dados de fallback caso o RSS não esteja disponível
  private getFallbackData(): DemoParty[] {
    const fallbackData = [
      {
        name: 'Demoparty Brasil 2025',
        country: 'Brasil 🇧🇷',
        countryCode: 'br',
        description: 'A primeira grande demoparty brasileira, com competições, workshops e palestras.',
        date: '15-17 Maio, 2025',
        startDate: new Date('2025-05-15'),
        endDate: new Date('2025-05-17'),
        location: 'São Paulo, Brasil',
        url: '#',
        type: 'Demoparty',
        platforms: ['Multiplatform'],
        isOnline: false
      },
      {
        name: 'TRSAC 2025',
        country: 'Dinamarca 🇩🇰',
        countryCode: 'dk',
        description: 'Uma das principais demoparties da Europa, com foco em plataformas clássicas e modernas.',
        date: '17-19 Outubro, 2025',
        startDate: new Date('2025-10-17'),
        endDate: new Date('2025-10-19'),
        location: 'Aarhus, Dinamarca',
        url: 'https://trsac.dk',
        type: 'Demoparty',
        platforms: ['Multiplatform'],
        isOnline: false
      },
      {
        name: 'Flashparty 2025',
        country: 'Argentina 🇦🇷',
        countryCode: 'ar',
        description: 'A demoparty argentina com foco em arte ASCII, chiptune e desenvolvimento de jogos independentes.',
        date: '18 Outubro, 2025',
        startDate: new Date('2025-10-18'),
        endDate: new Date('2025-10-18'),
        location: 'Buenos Aires, Argentina',
        url: 'https://flashparty.ar',
        type: 'Demoparty',
        platforms: ['Multiplatform'],
        isOnline: false
      },
      {
        name: 'Comparade 2025',
        country: 'Alemanha 🇩🇪',
        countryCode: 'de',
        description: 'Party como nos velhos tempos! Entrada gratuita, BBQ grátis, acts ao vivo e competições.',
        date: '7-9 Novembro, 2025',
        startDate: new Date('2025-11-07'),
        endDate: new Date('2025-11-09'),
        location: 'Emmering, Alemanha',
        url: 'https://comparade.de',
        type: 'Demoparty',
        platforms: ['Multiplatform', 'PC', 'Amiga', 'C64', 'Amstrad CPC'],
        isOnline: false
      },
      {
        name: 'Demosplash 2025',
        country: 'Estados Unidos 🇺🇸',
        countryCode: 'us',
        description: 'Demoparty americana em Pittsburgh com competições multiplatforma.',
        date: '31 Outubro - 1 Novembro, 2025',
        startDate: new Date('2025-10-31'),
        endDate: new Date('2025-11-01'),
        location: 'Pittsburgh, Estados Unidos',
        url: 'https://www.demosplash.org/',
        type: 'Demoparty',
        platforms: ['Multiplatform'],
        isOnline: false
      },
      {
        name: 'Transmission64 2025',
        country: 'Bélgica 🇧🇪',
        countryCode: 'be',
        description: 'A demoparty online dedicada ao Commodore 64.',
        date: '29 Novembro, 2025',
        startDate: new Date('2025-11-29'),
        endDate: new Date('2025-11-29'),
        location: 'Online',
        url: 'https://transmission64.com',
        type: 'Online Demoparty',
        platforms: ['C64'],
        isOnline: true
      }
    ]
    
    return fallbackData
  }
}

// Hook composable para usar o serviço com cache
export function useDemoParties() {
  const parties = ref<DemoParty[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = new DemoPartyService()

  const fetchParties = async (useCache = true) => {
    loading.value = true
    error.value = null
    
    try {
      // Tentar carregar do cache primeiro
      if (useCache) {
        const cached = loadFromCache()
        if (cached) {
          parties.value = cached
          loading.value = false
          return
        }
      }

      // Buscar dados frescos
      const freshParties = await service.fetchDemoParties()
      parties.value = freshParties
      
      // Salvar no cache
      saveToCache(freshParties)
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
      error.value = 'Erro ao carregar eventos'
    } finally {
      loading.value = false
    }
  }

  // Funções de cache
  const loadFromCache = (): DemoParty[] | null => {
    try {
      const cached = localStorage.getItem('demoscene-parties-cache')
      if (!cached) return null

      const data = JSON.parse(cached)
      const isExpired = Date.now() - data.timestamp > 60 * 60 * 1000 // 1 hora

      if (isExpired) {
        localStorage.removeItem('demoscene-parties-cache')
        return null
      }

      return data.parties.map((party: any) => ({
        ...party,
        startDate: new Date(party.startDate),
        endDate: new Date(party.endDate)
      }))
    } catch {
      return null
    }
  }

  const saveToCache = (data: DemoParty[]) => {
    try {
      const cacheData = {
        parties: data,
        timestamp: Date.now()
      }
      localStorage.setItem('demoscene-parties-cache', JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Não foi possível salvar no cache:', error)
    }
  }

  return {
    parties,
    loading,
    error,
    fetchParties
  }
}