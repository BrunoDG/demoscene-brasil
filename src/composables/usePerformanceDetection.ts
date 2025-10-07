import { ref, onMounted, readonly } from 'vue'

export type QualityLevel = 'low' | 'medium' | 'high'

export function usePerformanceDetection() {
  const quality = ref<QualityLevel>('medium')
  const isLowPerformance = ref(false)

  const detectPerformance = () => {
    // Detectar características do dispositivo para ajustar a qualidade
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    
    if (!gl) {
      quality.value = 'low'
      isLowPerformance.value = true
      return
    }

    // Verificar capacidades do GPU
    let renderer = ''
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
      }
    } catch (e) {
      // Fallback se não conseguir obter informações do renderer
      renderer = ''
    }
    
    // Detectar dispositivos móveis
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Detectar memória disponível (se suportado)
    const memory = (navigator as any).deviceMemory || 4
    
    // Calcular qualidade baseada nos fatores
    if (isMobile || memory < 4 || renderer.toLowerCase().includes('intel')) {
      quality.value = 'low'
      isLowPerformance.value = true
    } else if (memory >= 8 && !renderer.toLowerCase().includes('intel')) {
      quality.value = 'high'
      isLowPerformance.value = false
    } else {
      quality.value = 'medium'
      isLowPerformance.value = false
    }

    // Cleanup
    canvas.remove()
  }

  const setQuality = (newQuality: QualityLevel) => {
    quality.value = newQuality
    isLowPerformance.value = newQuality === 'low'
  }

  onMounted(() => {
    detectPerformance()
  })

  return {
    quality: readonly(quality),
    isLowPerformance: readonly(isLowPerformance),
    setQuality,
    detectPerformance
  }
}