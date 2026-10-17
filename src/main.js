import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);

app.use(router);

app.config.errorHandler = (err, instance, info) => {
  console.error('[SWABox] Vue 运行时错误：', err, info);
};

// Turnstile 在一些内嵌浏览器里会往父页面 postMessage 失败，
// 这不是页面故障，也别让它打断真正的错误上报。
window.addEventListener('error', (event) => {
  const message = event.message || '';
  if (message.includes('postMessage') && message.includes('challenges.cloudflare.com')) {
    event.preventDefault();
    if (import.meta.env.DEV) {
      console.warn('[SWABox] Turnstile postMessage 被拦截，通常是域名未在 Turnstile 控制台登记。');
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('[SWABox] 未处理的 Promise 拒绝：', event.reason);
});

app.mount('#app');
