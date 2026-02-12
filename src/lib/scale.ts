import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

export const useScreenScale = (containerRef: Ref<HTMLElement | null>) => {
  const scale = ref(1)
  let observer: ResizeObserver | null = null

  const updateScale = () => {
    const container = containerRef.value
    const width = container?.clientWidth ?? window.innerWidth
    const height = container?.clientHeight ?? window.innerHeight
    const ratioX = width / BASE_WIDTH
    const ratioY = height / BASE_HEIGHT
    scale.value = Math.min(ratioX, ratioY)
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
    if (containerRef.value) {
      observer = new ResizeObserver(updateScale)
      observer.observe(containerRef.value)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScale)
    observer?.disconnect()
    observer = null
  })

  return {
    baseWidth: BASE_WIDTH,
    baseHeight: BASE_HEIGHT,
    scale
  }
}
