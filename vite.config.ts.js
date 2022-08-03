// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "path";
import visualizer from "rollup-plugin-visualizer";
import dts from "vite-plugin-dts";
function pathResolve(dir) {
  return resolve(process.cwd(), ".", dir);
}
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@views": pathResolve("./src/views"),
      "@": pathResolve("./src"),
      "#": pathResolve("./types")
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    visualizer({
      filename: "./node_modules/.cache/visualizer/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
    viteMockServe({
      ignore: /^\_/,
      mockPath: "./mock",
      localEnabled: true,
      injectCode: `
        import { setupProdMockServer } from '../mock/_createProductionServer';
  
        setupProdMockServer();
        `
    }),
    AutoImport({
      imports: ["vue"],
      dts: "./types/auto-imports.d.ts",
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: "./types/components.d.ts",
      resolvers: [ElementPlusResolver()]
    }),
    dts({
      cleanVueFileName: true,
      insertTypesEntry: true,
      exclude: ["./types/auto-imports.d.ts", "./types/components.d.ts", "./types/module.d.ts"]
    })
  ],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      external: ["vue", "element-plus", "dayjs", "lodash-es"],
      output: {
        globals: {
          vue: "Vue",
          "element-plus": "element-plus",
          dayjs: "dayjs",
          "lodash-es": "lodash-es"
        }
      }
    },
    lib: {
      entry: pathResolve("./src/components/index.ts"),
      name: "lib",
      fileName: (format) => `lib.${format}.js`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdmlzdWFsaXplciBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuZnVuY3Rpb24gcGF0aFJlc29sdmUoZGlyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4nLCBkaXIpXG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAdmlld3MnOiBwYXRoUmVzb2x2ZSgnLi9zcmMvdmlld3MnKSxcbiAgICAgICdAJzogcGF0aFJlc29sdmUoJy4vc3JjJyksXG4gICAgICAnIyc6IHBhdGhSZXNvbHZlKCcuL3R5cGVzJylcbiAgICB9XG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIGZpbGVuYW1lOiAnLi9ub2RlX21vZHVsZXMvLmNhY2hlL3Zpc3VhbGl6ZXIvc3RhdHMuaHRtbCcsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICBicm90bGlTaXplOiB0cnVlXG4gICAgfSksXG4gICAgdml0ZU1vY2tTZXJ2ZSh7XG4gICAgICBpZ25vcmU6IC9eXFxfLyxcbiAgICAgIG1vY2tQYXRoOiAnLi9tb2NrJyxcbiAgICAgIGxvY2FsRW5hYmxlZDogdHJ1ZSxcbiAgICAgIGluamVjdENvZGU6IGBcbiAgICAgICAgaW1wb3J0IHsgc2V0dXBQcm9kTW9ja1NlcnZlciB9IGZyb20gJy4uL21vY2svX2NyZWF0ZVByb2R1Y3Rpb25TZXJ2ZXInO1xuICBcbiAgICAgICAgc2V0dXBQcm9kTW9ja1NlcnZlcigpO1xuICAgICAgICBgXG4gICAgfSksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbJ3Z1ZSddLFxuICAgICAgZHRzOiAnLi90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkdHM6ICcuL3R5cGVzL2NvbXBvbmVudHMuZC50cycsXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgfSksXG4gICAgZHRzKHtcbiAgICAgIGNsZWFuVnVlRmlsZU5hbWU6IHRydWUsXG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgZXhjbHVkZTogWycuL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJywgJy4vdHlwZXMvY29tcG9uZW50cy5kLnRzJywgJy4vdHlwZXMvbW9kdWxlLmQudHMnXVxuICAgIH0pXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd2dWUnLCAnZWxlbWVudC1wbHVzJywgJ2RheWpzJywgJ2xvZGFzaC1lcyddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICB2dWU6ICdWdWUnLFxuICAgICAgICAgICdlbGVtZW50LXBsdXMnOiAnZWxlbWVudC1wbHVzJyxcbiAgICAgICAgICBkYXlqczogJ2RheWpzJyxcbiAgICAgICAgICAnbG9kYXNoLWVzJzogJ2xvZGFzaC1lcydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcGF0aFJlc29sdmUoJy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdsaWInLFxuICAgICAgLy8gZm9ybWF0czogWydlcycsICdjanMnLCAndW1kJywgJ2lpZmUnXSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgbGliLiR7Zm9ybWF0fS5qc2BcbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxxQkFBcUIsS0FBYTtBQUNoQyxTQUFPLFFBQVEsUUFBUSxJQUFJLEdBQUcsS0FBSyxHQUFHO0FBQ3hDO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsVUFBVSxZQUFZLGFBQWE7QUFBQSxNQUNuQyxLQUFLLFlBQVksT0FBTztBQUFBLE1BQ3hCLEtBQUssWUFBWSxTQUFTO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsTUFDWixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtkLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVMsQ0FBQyxLQUFLO0FBQUEsTUFDZixLQUFLO0FBQUEsTUFDTCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixrQkFBa0I7QUFBQSxNQUNsQixTQUFTLENBQUMsNkJBQTZCLDJCQUEyQixxQkFBcUI7QUFBQSxJQUN6RixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE9BQU8sZ0JBQWdCLFNBQVMsV0FBVztBQUFBLE1BQ3RELFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxVQUNMLGdCQUFnQjtBQUFBLFVBQ2hCLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILE9BQU8sWUFBWSwyQkFBMkI7QUFBQSxNQUM5QyxNQUFNO0FBQUEsTUFFTixVQUFVLENBQUMsV0FBVyxPQUFPO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
