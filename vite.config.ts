import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This prevents "process is not defined" errors in the browser
    // The actual values will be provided by window.process from env-config.js
    'process.env': 'window.process.env',
  },
});