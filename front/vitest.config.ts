import { defineConfig, defineConfig as viteDefineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig(
  viteDefineConfig({
    plugins: [tsconfigPaths(), react()],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    test: {
      environment: 'jsdom',
    },
  }),
);
