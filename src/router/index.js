import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Privacy from '../views/Privacy.vue';
import Terms from '../views/Terms.vue';
import Challenge from '../views/Challenge.vue';
import Error from '../views/Error.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/privacy', name: 'Privacy', component: Privacy, meta: { title: '隐私政策', requiresAuth: true } },
  { path: '/terms', name: 'Terms', component: Terms, meta: { title: '用户协议', requiresAuth: true } },
  { path: '/challenge', name: 'Challenge', component: Challenge, meta: { title: '安全验证' } },
  { path: '/error/:code', name: 'Error', component: Error, meta: { title: '出错了' } },
  { path: '/:pathMatch(.*)*', redirect: '/error/404' },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, left: 0 };
  },
});

const HOME_TITLE = 'SWABox 电教工具箱 · 把要用的工具收进一个盒子';

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · SWABox 电教工具箱` : HOME_TITLE;
});

// 真正的校验在 /api/verify-turnstile（Pages Function）里完成，这里只读本地凭证。
// 状态格式与 Home.vue 写入的 localStorage['swabox_verified'] 保持一致：{ valid, ts }。
const VERIFIED_KEY = 'swabox_verified';
const VERIFIED_TTL = 24 * 60 * 60 * 1000;

function hasValidPass() {
  const saved = localStorage.getItem(VERIFIED_KEY);
  if (!saved) return false;

  try {
    const { valid, ts } = JSON.parse(saved);
    return Boolean(valid) && Date.now() - ts < VERIFIED_TTL;
  } catch {
    localStorage.removeItem(VERIFIED_KEY);
    return false;
  }
}

router.beforeEach((to) => {
  if (import.meta.env.DEV) return true;
  if (!to.matched.some((record) => record.meta.requiresAuth)) return true;
  if (hasValidPass()) return true;
  return { path: '/challenge', query: { redirect: to.fullPath } };
});

export default router;
