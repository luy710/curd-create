import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'
import visualizer from 'rollup-plugin-visualizer'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@views': pathResolve('./src/views'),
      '@': pathResolve('./src'),
      '#': pathResolve('./types')
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
    viteMockServe({
      ignore: /^\_/,
      mockPath: './mock',
      localEnabled: true,
      injectCode: `
        import { setupProdMockServer } from '../mock/_createProductionServer';
  
        setupProdMockServer();
        `
    }),
    AutoImport({
      imports: ['vue'],
      dts: './types/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: './types/components.d.ts',
      resolvers: [ElementPlusResolver()]
    })
  ],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'element-plus', 'dayjs', 'lodash-es'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          dayjs: 'dayjs',
          'lodash-es': 'lodashEs'
        }
      }
    },
    lib: {
      entry: pathResolve('./src/components/index.ts'),
      name: 'lib',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: (format) => `lib.${format}.js`
    }
  }
})
