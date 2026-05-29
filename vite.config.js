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
      '@web/state': resolve(__dirname, '../state/src/index.js'),
      '@web/bootstrap': resolve(__dirname, 'src/index.js')
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Bootstrap',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@web/state'],
      output: [
        {
          format: 'es',
          entryFileNames: 'bootstrap.js',
          minifyInternalExports: false
        },
        {
          format: 'es',
          entryFileNames: 'bootstrap.min.js',
          plugins: [terser()]
        }
      ]
    },
    minify: false
  }
});
