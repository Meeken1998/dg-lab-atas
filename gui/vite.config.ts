import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  },
  build: {
    outDir: '../dist/gui',
  },
  plugins: [react()],
});
