import type { App, Plugin } from 'vue'
import { unref } from 'vue'

export function withInstall<T>(component: T, alias?: string) {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias)
      app.config.globalProperties[alias] = component
  }
  return component as T & Plugin
}

export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}
