import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import basicRoutes from './basic'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
