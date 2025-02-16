import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lagecy from '@vitejs/plugin-legacy';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  base: './',
  server: {
    port: 5680,
    proxy: {
      '/ws': {
        target: 'ws://localhost:5679', // 目标 WebSocket 服务
        changeOrigin: true, // 允许修改请求头的 origin
        ws: true, // 开启 WebSocket 代理
        rewrite: (path) => path.replace(/^\/ws/, ''), // 可选：根据需要重写路径
      },
    },
    strictPort: true,
    host: host || false,
  },
  build: {
    outDir: '../dist/gui',
    target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
  plugins: [
    react(),
    lagecy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});
