<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled }">
    <div class="container nav__inner">
      <router-link to="/" class="brand" @click="closeMenu">
        <img class="brand__mark" src="/logo-nobg.png" alt="" width="28" height="28" />
        <span class="brand__text">
          <span class="brand__name">SWABox</span>
          <span class="brand__sub">电教工具箱</span>
        </span>
      </router-link>

      <nav class="nav__links" aria-label="站内导航">
        <a
          v-for="item in NAV"
          :key="item.id"
          :href="'#' + item.id"
          class="nav__link"
          :class="{ 'is-active': activeId === item.id }"
          :aria-current="activeId === item.id ? 'true' : undefined"
          @click.prevent="goTo(item.id)"
        >
          <span class="nav__dot" aria-hidden="true"></span>{{ item.label }}
        </a>
      </nav>

      <div class="nav__actions">
        <a
          class="nav__repo"
          :href="REPO_APP"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="打开 SWABox 的 GitHub 仓库"
        >
          <AppIcon name="github" :size="16" />
          <span>GitHub</span>
        </a>
        <a class="btn btn--primary btn--sm nav__cta" href="#download" @click.prevent="goTo('download')">
          <AppIcon name="download" :size="14" />
          下载
        </a>
        <button
          class="nav__burger"
          type="button"
          aria-controls="mobile-menu"
          :aria-expanded="open"
          aria-label="打开导航"
          @click="openMenu"
        >
          <AppIcon name="menu" :size="20" />
        </button>
      </div>
    </div>

    <Transition name="drawer">
      <div
        v-if="open"
        id="mobile-menu"
        ref="drawerEl"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="站内导航"
        @keydown.esc="closeMenu"
      >
        <div class="container drawer__inner">
          <div class="drawer__top">
            <span class="drawer__title">导航</span>
            <button class="drawer__close" type="button" aria-label="关闭导航" @click="closeMenu">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <nav class="drawer__links">
            <a
              v-for="item in NAV"
              :key="item.id"
              :href="'#' + item.id"
              class="drawer__link"
              :class="{ 'is-active': activeId === item.id }"
              @click.prevent="goTo(item.id)"
            >
              <span class="drawer__num">{{ item.no }}</span>
              <span class="drawer__label">{{ item.label }}</span>
              <AppIcon name="arrow-right" :size="16" class="drawer__arrow" />
            </a>
          </nav>

          <div class="drawer__foot">
            <a :href="REPO_APP" target="_blank" rel="noopener noreferrer">
              <AppIcon name="github" :size="16" /> 源码仓库
            </a>
            <a :href="RELEASES" target="_blank" rel="noopener noreferrer">
              <AppIcon name="download" :size="16" /> 所有版本
            </a>
            <p>MIT · 开源</p>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppIcon from './AppIcon.vue';
import { RELEASES, REPO_APP } from '../data/site';

// 编号跟页面段落顺序一致：为什么 → 工具 → 做法 → 下载。
const NAV = [
  { no: '01', label: '为什么', id: 'why' },
  { no: '02', label: '工具', id: 'tools' },
  { no: '03', label: '做法', id: 'build' },
  { no: '04', label: '下载', id: 'download' },
];

const route = useRoute();
const router = useRouter();

const scrolled = ref(false);
const open = ref(false);
const drawerEl = ref(null);
const activeId = ref('');
let lastFocused = null;
let spy = null;

function onScroll() {
  scrolled.value = window.scrollY > 8;
}

// 滚到哪一段，顶栏就把哪一段点亮。纯展示，不影响导航。
function initSpy() {
  if (typeof IntersectionObserver === 'undefined') return;
  spy?.disconnect();
  const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean);
  if (!sections.length) return;

  spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id;
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  );
  sections.forEach((el) => spy.observe(el));
}

function goTo(id) {
  closeMenu();
  const target = '#' + id;
  if (route.path === '/' && document.querySelector(target)) {
    document.querySelector(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 保留锚点，方便直接复制链接；用 replaceState 避免触发一次多余的路由跳转。
    history.replaceState(history.state, '', target);
    activeId.value = id;
  } else {
    router.push({ path: '/', hash: target });
  }
}

async function openMenu() {
  lastFocused = document.activeElement;
  open.value = true;
  document.body.style.overflow = 'hidden';
  await nextTick();
  drawerEl.value?.querySelector('a, button')?.focus();
}

function closeMenu() {
  if (!open.value) return;
  open.value = false;
  document.body.style.overflow = '';
  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  initSpy();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  spy?.disconnect();
  document.body.style.overflow = '';
});
</script>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 90;
  height: var(--nav-h);
  border-bottom: 1px solid transparent;
  background: color-mix(in srgb, #121716 72%, transparent);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  transition:
    background-color 0.2s var(--ease),
    border-color 0.2s var(--ease);
}

/* 不支持 backdrop-filter 时退回不透明底色，别让文字糊在内容上 */
@supports not (backdrop-filter: blur(4px)) {
  .nav {
    background: #121716;
  }
}

.nav.is-scrolled {
  border-bottom-color: var(--stroke);
  background: color-mix(in srgb, #101413 88%, transparent);
}

.nav__inner {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.4vw, 32px);
  height: 100%;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: none;
  border-radius: var(--r-md);
}

.brand__mark {
  width: 28px;
  height: 28px;
  border-radius: var(--r-md);
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand__name {
  font-size: 0.97rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brand__sub {
  margin-top: 3px;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--text-3);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 13px;
  border-radius: var(--r-sm);
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--text-2);
  transition:
    background-color 0.15s var(--ease),
    color 0.15s var(--ease);
}

.nav__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  transform: scale(0.4);
  transition:
    opacity 0.18s var(--ease),
    transform 0.18s var(--ease);
}

.nav__link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.nav__link.is-active {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
}

.nav__link.is-active .nav__dot {
  opacity: 1;
  transform: scale(1);
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.nav__links + .nav__actions {
  margin-left: clamp(6px, 1vw, 14px);
}

.nav__repo {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 11px;
  border-radius: var(--r-sm);
  color: var(--text-3);
  font-size: 0.84rem;
  transition:
    background-color 0.15s var(--ease),
    color 0.15s var(--ease);
}

.nav__repo:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.nav__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-sm);
  color: var(--text-2);
}

.drawer {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: #121716;
  overflow-y: auto;
}

.drawer__inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-block: 0 26px;
}

.drawer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-h);
  border-bottom: 1px solid var(--stroke);
}

.drawer__title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-2);
}

.drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-sm);
  color: var(--text-2);
}

.drawer__links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 14px;
}

.drawer__link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 14px;
  border-radius: var(--r-md);
  transition: background-color 0.15s var(--ease);
}

.drawer__link:hover,
.drawer__link.is-active {
  background: var(--surface-1);
}

.drawer__link.is-active .drawer__label {
  color: var(--text);
}

.drawer__num {
  width: 20px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--accent);
}

.drawer__label {
  font-size: 1.12rem;
  font-weight: 500;
  color: var(--text-2);
}

.drawer__arrow {
  margin-left: auto;
  color: var(--text-3);
}

.drawer__foot {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
  padding-top: 28px;
  font-size: 0.9rem;
  color: var(--text-2);
}

.drawer__foot a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--r-md);
  transition: background-color 0.15s var(--ease);
}

.drawer__foot a:hover {
  background: var(--surface-1);
}

.drawer__foot p {
  padding: 14px 14px 0;
  font-size: 11px;
  color: var(--text-3);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s var(--ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (max-width: 940px) {
  .nav__links,
  .nav__repo,
  .nav__cta {
    display: none;
  }

  .nav__burger {
    display: inline-flex;
  }
}

@media (max-width: 480px) {
  .brand__sub {
    display: none;
  }
}
</style>
