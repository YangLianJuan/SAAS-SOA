import type { App, InjectionKey } from 'vue'
import { computed, inject } from 'vue'

import { initLocale, locale, setLocale, type Locale } from './locale'

import zhCNCommon from './lang/zh-CN/common'
import zhCNDashboard from './lang/zh-CN/dashboard'
import zhCNDevice from './lang/zh-CN/device'
import zhCNLogin from './lang/zh-CN/login'

import enUSCommon from './lang/en-US/common'
import enUSDashboard from './lang/en-US/dashboard'
import enUSDevice from './lang/en-US/device'
import enUSLogin from './lang/en-US/login'

type Messages = Record<string, unknown>

const messages: Record<Locale, Messages> = {
  'zh-CN': {
    common: zhCNCommon,
    dashboard: zhCNDashboard,
    device: zhCNDevice,
    login: zhCNLogin,
  },
  'en-US': {
    common: enUSCommon,
    dashboard: enUSDashboard,
    device: enUSDevice,
    login: enUSLogin,
  },
}

type I18nContext = {
  locale: typeof locale
  setLocale: (next: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18N_KEY: InjectionKey<I18nContext> = Symbol('i18n')

const resolvePath = (obj: unknown, path: string[]) => {
  let cur: any = obj
  for (const p of path) {
    if (!cur || typeof cur !== 'object') return undefined
    cur = cur[p]
  }
  return cur
}

const format = (tpl: string, params?: Record<string, string | number>) => {
  if (!params) return tpl
  return tpl.replace(/\{(\w+)\}/g, (m, key) => (params[key] !== undefined ? String(params[key]) : m))
}

export const i18n = {
  install(app: App) {
    initLocale()

    const ctx: I18nContext = {
      locale,
      setLocale,
      t(key, params) {
        const dict = messages[locale.value]
        const value = resolvePath(dict, key.split('.'))
        if (typeof value === 'string') return format(value, params)
        return key
      },
    }

    app.provide(I18N_KEY, ctx)
  },
}

export const useI18n = () => {
  const ctx = inject(I18N_KEY)
  if (!ctx) throw new Error('i18n is not installed')

  const t = (key: string, params?: Record<string, string | number>) => ctx.t(key, params)
  const currentLocale = computed(() => ctx.locale.value)

  return { t, locale: ctx.locale, currentLocale, setLocale: ctx.setLocale }
}

