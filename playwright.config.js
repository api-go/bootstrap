import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  use: {
    baseURL: 'http://127.0.0.1:5173',
  },
  webServer: {
    command: 'npx vite --port 5173 --host 127.0.0.1',
    url: 'http://127.0.0.1:5173/test/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
