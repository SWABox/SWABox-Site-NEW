<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="showModal" class="consent" @click.self="handleDisagree">
        <div
          ref="dialogEl"
          class="consent__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          aria-describedby="consent-desc"
          @keydown="onKeydown"
        >
          <div class="consent__head">
            <span class="consent__icon" aria-hidden="true">
              <AppIcon name="shield" :size="18" />
            </span>
            <div>
              <p class="consent__kicker">开始之前</p>
              <h2 id="consent-title" class="consent__title">有两份文件需要你点头。</h2>
            </div>
          </div>

          <p id="consent-desc" class="consent__desc">
            本站放的是 SWABox 的说明和下载地址，没有账号、也没有收集你资料的打算。
            不过还是要按规矩说清楚：数据怎么处理，以及用起来的边界在哪。
          </p>

          <div class="consent__docs">
            <a class="consent__doc" href="/terms" target="_blank" rel="noopener">
              <span class="consent__doc-icon" aria-hidden="true"><AppIcon name="file" :size="16" /></span>
              <span class="consent__doc-text">
                <span class="consent__doc-name">用户协议</span>
                <span class="consent__doc-sub">使用范围与责任边界</span>
              </span>
              <AppIcon name="arrow-up-right" :size="15" class="consent__doc-arrow" />
            </a>
            <a class="consent__doc" href="/privacy" target="_blank" rel="noopener">
              <span class="consent__doc-icon" aria-hidden="true"><AppIcon name="shield" :size="16" /></span>
              <span class="consent__doc-text">
                <span class="consent__doc-name">隐私政策</span>
                <span class="consent__doc-sub">收集了什么、存在哪</span>
              </span>
              <AppIcon name="arrow-up-right" :size="15" class="consent__doc-arrow" />
            </a>
          </div>

          <p class="consent__note">
            点「同意」即表示你读过并接受上面两份文件；这份记录只存在你自己的浏览器里。
          </p>

          <div class="consent__buttons">
            <button type="button" class="btn btn--ghost" @click="handleDisagree">
              不同意
            </button>
            <button ref="agreeBtn" type="button" class="btn btn--primary" @click="handleAgree">
              同意
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import AppIcon from './AppIcon.vue';
import { securityEnabled } from '../data/runtime.js';

const STORAGE_KEY = 'swabox_terms_accepted';


const showModal = ref(false);
const dialogEl = ref(null);
const agreeBtn = ref(null);
let lastFocused = null;

onMounted(() => {
  if (!securityEnabled) return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  showModal.value = true;
  lastFocused = document.activeElement;
  document.body.style.overflow = 'hidden';

  nextTick(() => {
    agreeBtn.value?.focus();
  });
});

onBeforeUnmount(release);

function release() {
  document.body.style.overflow = '';

  if (lastFocused instanceof HTMLElement) {
    lastFocused.focus();
  }
}

function handleAgree() {
  localStorage.setItem(STORAGE_KEY, 'true');
  showModal.value = false;
  release();
}

function handleDisagree() {
  showModal.value = false;
  release();
}

// 弹窗打开时把 Tab 圈在里面，别让焦点跑到背后的页面上。
function onKeydown(event) {
  if (event.key === 'Escape') {
    handleDisagree();
    return;
  }

  if (event.key !== 'Tab' || !dialogEl.value) return;

  const focusable = dialogEl.value.querySelectorAll('a[href], button:not([disabled])');
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
</script>

<style scoped>
.consent {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(5, 8, 7, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.consent__panel {
  position: relative;
  width: min(470px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: clamp(22px, 3vw, 28px);
  border: 1px solid var(--stroke-strong);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  box-shadow: var(--shadow-dialog);
}

.consent__head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.consent__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: none;
  border: 1px solid var(--accent-line);
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--accent);
}

.consent__kicker {
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--text-3);
}

.consent__title {
  margin-top: 3px;
  font-size: 1.24rem;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.015em;
  color: var(--text);
}

.consent__desc {
  margin-top: 14px;
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--text-2);
}

.consent__docs {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.consent__doc {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 13px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.025);
  transition:
    background-color 0.15s var(--ease),
    border-color 0.15s var(--ease);
}

.consent__doc:hover {
  background: rgba(255, 255, 255, 0.055);
  border-color: var(--stroke-strong);
}

.consent__doc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-2);
}

.consent__doc-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.consent__doc-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.consent__doc-sub {
  font-size: 11.5px;
  color: var(--text-3);
}

.consent__doc-arrow {
  margin-left: auto;
  color: var(--text-3);
}

.consent__note {
  margin-top: 14px;
  font-size: 11.5px;
  line-height: 1.75;
  color: var(--text-3);
}

.consent__buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.18s var(--ease);
}

.dialog-enter-active .consent__panel,
.dialog-leave-active .consent__panel {
  transition:
    transform 0.22s var(--ease-out),
    opacity 0.18s var(--ease);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .consent__panel,
.dialog-leave-to .consent__panel {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

@media (max-width: 480px) {
  .consent {
    align-items: flex-end;
    padding: 12px;
  }

  .consent__panel {
    width: 100%;
    max-height: calc(100vh - 24px);
  }

  .consent__buttons {
    flex-direction: column-reverse;
  }

  .consent__buttons .btn {
    width: 100%;
  }
}
</style>
