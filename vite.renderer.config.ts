import { defineConfig } from 'vite';
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  plugins: [svgr({ svgrOptions: { icon: true } })],
});
