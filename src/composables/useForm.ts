import { reactive } from 'vue'

export const useForm = <T extends Record<string, unknown>>(initialValues: T) => {
  const model = reactive({ ...initialValues }) as T

  const reset = () => {
    for (const key of Object.keys(initialValues)) {
      model[key as keyof T] = initialValues[key as keyof T]
    }
  }

  return { model, reset }
}

