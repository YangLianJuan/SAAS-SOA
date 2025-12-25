import { ref } from 'vue'

const STORAGE_KEY = 'saas_locale'
const DEFAULT_LOCALE = 'zh-CN'

export type Locale = 'zh-CN' | 'en-US'

export const locale = ref<Locale>(DEFAULT_LOCALE)

export const initLocale = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'zh-CN' || stored === 'en-US') {
    locale.value = stored
  }
}

export const setLocale = (next: Locale) => {
  locale.value = next
  localStorage.setItem(STORAGE_KEY, next)
}

