import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './routes'
import 'element-plus/dist/index.css'

async function bootstrap() {
  const app = createApp(App)
  // 配置路由
  setupRouter(app)

  app.mount('#app')
}

bootstrap()
