import { defineConfig } from 'vite';
import { resolve } from 'path';
import terser from '@rollup/plugin-terser';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  server: { fs: { allow: [resolve(__dirname), resolve(__dirname, '../state'), resolve(__dirname, '../.profile/node_modules/bootstrap-icons/font/fonts')] } },
  plugins: [
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      '@apigo.cc/state': resolve(__dirname, '../state/src/index.js'),
      '@apigo.cc/bootstrap': resolve(__dirname, 'src/index.js')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ApigoBootstrap',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['@apigo.cc/state'],
      output: [
        {
          format: 'umd',
          name: 'ApigoBootstrap',
          entryFileNames: 'bootstrap.js',
          extend: true,
          globals: {
            '@apigo.cc/state': 'ApigoState'
          }
        },
        {
          format: 'umd',
          name: 'ApigoBootstrap',
          entryFileNames: 'bootstrap.min.js',
          extend: true,
          globals: {
            '@apigo.cc/state': 'ApigoState'
          },
          plugins: [terser()]
        }
      ]
    },
    minify: false
  }
});
