import { ref } from 'vue'

export const useTable = <T>() => {
  const loading = ref(false)
  const dataSource = ref<T[]>([])

  const run = async (loader: () => Promise<T[]>) => {
    loading.value = true
    try {
      dataSource.value = await loader()
    } finally {
      loading.value = false
    }
  }

  return { loading, dataSource, run }
}

