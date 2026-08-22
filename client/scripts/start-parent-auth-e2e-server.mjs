import { createServer } from 'vite';

process.env.VITE_DEPLOYMENT_ENV = 'demo';
process.env.VITE_PARENT_DEMO_ACCESS = 'false';
process.env.VITE_PARENT_IAP_ENABLED = 'false';
process.env.VITE_ENABLE_PENDING_HEALTH_CONTENT = 'false';

const server = await createServer({
  server: { host: '127.0.0.1', port: 3001, strictPort: true },
});

await server.listen();
server.printUrls();
