import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { breakpoints } from '@/styles/tokens'

export function useBreakpoint() {
  const width = ref<number>(typeof window === 'undefined' ? breakpoints.lg : window.innerWidth)
  const height = ref<number>(typeof window === 'undefined' ? 0 : window.innerHeight)

  let raf = 0

  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  const onResize = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      raf = 0
      update()
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', onResize, { passive: true })
  })

  onBeforeUnmount(() => {
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
  })

  const isMobile = computed(() => width.value < breakpoints.md)

  return { width, height, isMobile }
}
