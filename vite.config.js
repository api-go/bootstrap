import { defineConfig } from 'vite';
import { resolve } from 'path';
import terser from '@rollup/plugin-terser';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
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
      formats: ['umd', 'es']
    },
    rollupOptions: {
      external: ['@apigo.cc/state'],
      output: [
        {
          format: 'umd',
          name: 'ApigoBootstrap',
          entryFileNames: 'bootstrap.js',
          globals: {
            '@apigo.cc/state': 'ApigoState'
          }
        },
        {
          format: 'umd',
          name: 'ApigoBootstrap',
          entryFileNames: 'bootstrap.min.js',
          globals: {
            '@apigo.cc/state': 'ApigoState'
          },
          plugins: [terser()]
        },
        {
          format: 'es',
          entryFileNames: 'bootstrap.mjs'
        },
        {
          format: 'es',
          entryFileNames: 'bootstrap.min.mjs',
          plugins: [terser()]
        }
      ]
    },
    minify: false
  }
});
