import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                // 物理引擎通常很大，独立分包
                if (id.includes('@react-three/cannon')) {
                  return 'cannon-vendor';
                }
                // React 核心库
                if (id.includes('react') && !id.includes('@react-three')) {
                  return 'react-vendor';
                }
                // Three.js 核心
                if (id.includes('three')) {
                  return 'three-vendor';
                }
              }
            },
          }
        },
        // 考虑到 3D 项目的特殊性，可以适当调高警告阈值
        chunkSizeWarningLimit: 1000,
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
