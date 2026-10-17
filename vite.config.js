import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    // 开发服务器代理，模拟 Pages Functions 的路由
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // 或一个模拟端点
        changeOrigin: true,
        // 由于我们没有本地 Pages Functions 环境，
        // 开发时你可以注释掉这部分，或者使用一个简单的 mock
        bypass: (req, res, options) => {
          // 这里可以返回一个模拟的成功响应用于开发测试
          if (req.url.includes('/api/verify-turnstile') && req.method === 'POST') {
            console.log('开发模式：模拟验证成功');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: '开发模式模拟成功' }));
            return true;
          }
        },
      },
    },
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
