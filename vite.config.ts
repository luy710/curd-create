import { resolve } from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import dts from 'vite-plugin-dts'
import { VitePluginStyleInject } from './vite-plugin-style-inject'

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
        '#': pathResolve('./types'),
      },
    },
    server: {
      port: 5177,
    },
    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({
        ignore: /^\_/,
        mockPath: './mock',
        localEnabled: true,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
    
          setupProdMockServer();
          `,
      }),
      AutoImport({
        imports: ['vue'],
        dts: './types/auto-imports.d.ts',
        resolvers: isBuild ? [] : [ElementPlusResolver()],
      }),

      Components({
        dts: './types/components.d.ts',
        resolvers: isBuild ? [] : [ElementPlusResolver()],
      }),
      isBuild && VitePluginStyleInject('curd-create'),
      dts({
        insertTypesEntry: true,
        exclude: [],
      }),
    ],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        external: ['vue', 'element-plus'],
        output: {
          globals: {
            'vue': 'Vue',
            'element-plus': 'element-plus',
          },
        },
      },
      lib: {
        entry: pathResolve('./src/components/index.ts'),
        name: 'lib',
        formats: ['es', 'umd'],
        fileName: format => `lib.${format}.js`,
      },
    },
  }
}
