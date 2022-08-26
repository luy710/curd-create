import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VitePluginStyleInject } from './vite-plugin-style-inject'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'
import visualizer from 'rollup-plugin-visualizer'
import dts from 'vite-plugin-dts'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  return {
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
        imports: [],
        dts: './types/auto-imports.d.ts',
        resolvers: isBuild ? [] : [ElementPlusResolver()]
      }),

      Components({
        dts: './types/components.d.ts',
        resolvers: isBuild ? [] : [ElementPlusResolver()]
      }),
      isBuild && VitePluginStyleInject('curd-create'),
      dts({
        cleanVueFileName: true,
        insertTypesEntry: true,
        outputDir: 'dist/types',
        exclude: ['./types/auto-imports.d.ts', './types/components.d.ts', './types/module.d.ts']
      })
    ],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        external: ['vue', 'element-plus', 'dayjs', 'lodash-es'],
        output: {
          globals: {
            vue: 'Vue',
            'element-plus': 'element-plus',
            dayjs: 'dayjs',
            'lodash-es': 'lodash-es'
          }
        }
      },
      lib: {
        entry: pathResolve('./src/components/index.ts'),
        name: 'lib',
        // formats: ['es', 'cjs', 'umd', 'iife'],
        fileName: (format) => `lib.${format}.js`
      }
    }
  }
}
