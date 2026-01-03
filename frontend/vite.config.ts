import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tanstackStart({ srcDirectory: 'app' })],
  server: {
    port: 4173,
  },
});
