import { onBeforeUnmount, onMounted, ref } from 'vue'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

export const useScreenScale = () => {
  const scale = ref(1)

  const updateScale = () => {
    const ratioX = window.innerWidth / BASE_WIDTH
    const ratioY = window.innerHeight / BASE_HEIGHT
    scale.value = Math.min(ratioX, ratioY)
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScale)
  })

  return {
    baseWidth: BASE_WIDTH,
    baseHeight: BASE_HEIGHT,
    scale
  }
}
