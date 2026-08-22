import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key.startsWith('VITE_') && value !== undefined)) } as Record<string, string>;
  const deploymentEnvironment = env.VITE_DEPLOYMENT_ENV || 'demo';
  const managedEnvironment = deploymentEnvironment === 'staging' || deploymentEnvironment === 'production';
  const includeDialogueStudio = mode === 'dialogue-studio';

  if (managedEnvironment) {
    const apiBaseUrl = env.VITE_API_BASE_URL;
    if (!apiBaseUrl || !apiBaseUrl.startsWith('https://')) {
      throw new Error(`VITE_API_BASE_URL must use HTTPS for ${deploymentEnvironment} builds.`);
    }
  }

  if (deploymentEnvironment === 'staging' && env.VITE_PARENT_IAP_ENABLED === 'true') {
    throw new Error('VITE_PARENT_IAP_ENABLED must remain false for the Staging Readiness sprint.');
  }

  if (deploymentEnvironment === 'production' && env.VITE_PARENT_DEMO_ACCESS !== 'false') {
    throw new Error('VITE_PARENT_DEMO_ACCESS must be false for production builds.');
  }

  if (deploymentEnvironment === 'production' && env.VITE_ENABLE_PENDING_HEALTH_CONTENT === 'true') {
    throw new Error('Pending health-review content cannot be enabled in production builds.');
  }

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
