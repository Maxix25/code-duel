import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/material')) {
              return 'mui';
            }
            if (id.includes('@uiw/react-codemirror')) {
              return 'codemirror';
            }
          }
        }
      }
    }
  }
});
