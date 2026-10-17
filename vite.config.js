import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// 行为开关（人机验证 + 协议弹窗）只在 serve 阶段通过一个小插件注入：
// vite 5 在 dev 下不会把 config.define 写进模块源码——它只把值挂到全局，
// 所以源码里要读全局 SITE_MODE，别再依赖编译期替换。
// 生产构建交给 Rollup 的 define（见下方 buildDefine）。
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isServe = command === 'serve';
  // dev 默认跳过验证；VITE_ENABLE_SECURITY=true 时完整跑一遍验证流程。
  const securityEnabled = isServe && env.VITE_ENABLE_SECURITY !== 'true' ? false : true;

  const siteModePlugin = {
    name: 'swabox:site-mode',
    // 构建阶段也用同一个插件，不依赖 define：否则 serve 与 build 是两套替换逻辑，
    // 一旦 define 那条没生效（例如配置被改过），产物会带着未定义标识符直接崩在浏览器里。
    // 这里只处理 src/** 下的模块，node_modules 与 Vue 编译产物不碰。
    transform(code, id) {
      const file = id.split('?')[0];
      if (!/[\\/]src[\\/]/.test(file) || !code.includes('SITE_MODE_INJECTED')) return null;
      return code
        .replaceAll('typeof SITE_MODE_INJECTED', '"string"')
        .replace(/\bSITE_MODE_INJECTED\b/g, JSON.stringify(securityEnabled ? 'production' : 'development'));
    },
  };

  return {
    plugins: [vue(), siteModePlugin],
    define: {
      // 生产构建（Rollup）里 SITE_MODE_INJECTED 会被这个值整词替换；
      // 开发服务器下由上面的插件顶替。
      SITE_MODE_INJECTED: JSON.stringify(securityEnabled ? 'production' : 'development'),
    },
    server: {
      // 别去监听临时目录：截图脚本的浏览器配置放在项目里时，vite 的 watcher
      // 会去 watch 这些锁文件并直接 EBUSY 崩掉开发服务器。
      watch: {
        // 顺带排除构建工具自己的临时文件（编辑器/agent 的原子写入会留下 .xxx.tmpdir）。
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.edge-profile/**',
          '**/.shots/**',
          '**/*.tmpdir/**',
        ],
      },
      // 开发服务器没有 Pages Functions，这里只模拟 /api/verify-turnstile。
      // 只在显式开启安全验证时才会走到这条路径。
      proxy: {
        '/api': {
          bypass(req, res) {
            if (req.url.includes('/api/verify-turnstile') && req.method === 'POST') {
              console.log('[dev] 模拟 /api/verify-turnstile 返回 success');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: '开发模式模拟成功' }));
              return req.url;
            }
          },
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
