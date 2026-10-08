import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function githubPagesAndDevPlugin(): Plugin {
  return {
    name: 'fleearn-github-pages-and-dev-adapter',
    transformIndexHtml: {
      order: 'pre',
      handler(html, { server }) {
        // Remove static production placeholder (using /g flag to match all occurrences)
        const cleanedHtml = html.replace(
          /<!-- STATIC_PROD_START -->[\s\S]*?<!-- STATIC_PROD_END -->/g,
          ''
        );

        if (server) {
          // Dev Server Mode: inject live dev entry
          return cleanedHtml.replace(
            '<!-- VITE_DEV_ENTRY -->',
            '<script type="module" src="/src/main.tsx"></script>'
          );
        } else {
          // Build Mode: Vite will compile /src/main.tsx into the bundle
          return cleanedHtml.replace(
            '<!-- VITE_DEV_ENTRY -->',
            '<script type="module" src="/src/main.tsx"></script>'
          );
        }
      },
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      githubPagesAndDevPlugin(),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/index.js',
          chunkFileNames: 'assets/chunk-[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.names && assetInfo.names.some((n: string) => n.endsWith('.css'))) {
              return 'assets/index.css';
            }
            if (typeof (assetInfo as any).name === 'string' && (assetInfo as any).name.endsWith('.css')) {
              return 'assets/index.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

