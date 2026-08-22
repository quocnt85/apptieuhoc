import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const includeDialogueStudio = mode === 'dialogue-studio';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        input: includeDialogueStudio
          ? {
              main: path.resolve(__dirname, 'index.html'),
              dialogueStudio: path.resolve(__dirname, 'dialogue-studio.html'),
            }
          : path.resolve(__dirname, 'index.html'),
      },
    },
    server: {
      port: 3000,
      host: true,
    },
  };
});
