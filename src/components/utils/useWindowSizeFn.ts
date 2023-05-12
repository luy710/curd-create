import { debounce } from 'lodash-es'
import { onBeforeUnmount, onMounted } from 'vue'

interface WindowSizeOptions {
  once?: boolean
  immediate?: boolean
  listenerOptions?: AddEventListenerOptions | boolean
}

export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
  let handler = () => {
    fn()
  }
  const handleSize = debounce(handler, wait)
  handler = handleSize

  const start = () => {
    if (options && options.immediate)
      handler()

    window.addEventListener('resize', handler)
  }

  const stop = () => {
    window.removeEventListener('resize', handler)
  }

  onMounted(() => {
    start()
  })

  onBeforeUnmount(() => {
    stop()
  })
  return [start, stop]
}
