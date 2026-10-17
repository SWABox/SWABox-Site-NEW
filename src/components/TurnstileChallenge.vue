<template>
  <div class="gate">
    <div class="container gate__grid">
      <div class="gate__rail">
        <p class="section-label section-label--line">安全验证</p>
        <dl class="gate__facts">
          <div class="gate__fact">
            <dt>处理方</dt>
            <dd>Cloudflare Turnstile</dd>
          </div>
          <div class="gate__fact">
            <dt>记录</dt>
            <dd>不做用户画像</dd>
          </div>
          <div class="gate__fact">
            <dt>有效期</dt>
            <dd>通过后 24 小时</dd>
          </div>
        </dl>
        <p class="gate__foot">SWABox · 电教工具箱</p>
      </div>

      <div class="gate__body">
        <p class="gate__kicker">请先过这一道</p>

        <h1 class="gate__title">确认一下，你这边不是机器人。</h1>

        <p class="gate__lead">
          这层验证挡的是扫站脚本，不用注册，也不记录你是谁。
          多数情况它会自己通过；如果没有，点一下方框就好。
        </p>

        <div class="gate__panel">
          <div ref="widgetContainer" class="gate__widget">
            <p v-if="!isLoaded" class="gate__loading">
              <span class="gate__pulse" aria-hidden="true"></span>
              正在加载验证组件…
            </p>
          </div>

          <p v-if="notice" class="gate__notice" role="alert">{{ notice }}</p>

          <div class="gate__actions">
            <p class="gate__provider">
              由 Cloudflare Turnstile 提供保护
            </p>
            <button
              type="button"
              class="gate__refresh"
              :disabled="isRefreshing || !widgetId"
              @click="handleRefresh"
            >
              <AppIcon name="refresh" :size="13" />
              {{ isRefreshing ? '刷新中' : '刷新验证' }}
            </button>
          </div>
        </div>

        <p class="gate__note">
          验证通过后，同一台浏览器 24 小时内不会再问一次。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import AppIcon from './AppIcon.vue';

defineProps({
  notice: { type: String, default: '' },
});

const emit = defineEmits(['verified', 'error']);

const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const isLoaded = ref(false);
const isRefreshing = ref(false);
const widgetContainer = ref(null);
let widgetId = null;
let retryTimer = null;

function renderWidget() {
  if (!sitekey) {
    console.error('[SWABox] 未配置 VITE_TURNSTILE_SITE_KEY');
    emit('error', '验证服务没有配置好，请联系站点维护者。');
    return;
  }

  if (!window.turnstile || !widgetContainer.value) {
    emit('error', '安全组件加载失败，刷新页面再试一次。');
    return;
  }

  try {
    widgetId = window.turnstile.render(widgetContainer.value, {
      sitekey,
      theme: 'dark',
      size: 'normal',
      callback: (token) => {
        emit('verified', token);
      },
      'error-callback': (errorCode) => {
        console.error('[SWABox] Turnstile 错误码：', errorCode);

        if (String(errorCode) === '300010') {
          console.error(
            '[SWABox] 300010 = 域名未在 Turnstile 控制台登记。' +
              '当前域名：' + window.location.hostname
          );
          emit('error', '域名没有登记在 Turnstile 里，验证无法完成。');
          return;
        }

        emit('error', '验证没能完成（错误码 ' + errorCode + '），刷新一次试试。');
      },
      'expired-callback': () => {
        emit('error', '验证超时了，请重新验证。');
      },
      'timeout-callback': () => {
        emit('error', '等待时间太久，请重新验证。');
      },
    });

    isLoaded.value = true;
  } catch (error) {
    console.error('[SWABox] Turnstile 渲染失败：', error);
    emit('error', '验证组件没有初始化成功。');
  }
}

function handleRefresh() {
  if (isRefreshing.value || !widgetId) return;
  isRefreshing.value = true;

  if (window.turnstile?.reset) {
    window.turnstile.reset(widgetId);
  }

  window.setTimeout(() => {
    isRefreshing.value = false;
  }, 800);
}

onMounted(() => {
  if (window.turnstile) {
    renderWidget();
    return;
  }

  let attempts = 0;
  retryTimer = window.setInterval(() => {
    attempts += 1;

    if (window.turnstile) {
      window.clearInterval(retryTimer);
      retryTimer = null;
      renderWidget();
      return;
    }

    // 脚本迟迟不来就停手，别无限重试。
    if (attempts >= 50) {
      window.clearInterval(retryTimer);
      retryTimer = null;
      emit('error', '验证脚本没加载出来，可能是网络挡住了。');
    }
  }, 200);
});

onUnmounted(() => {
  if (retryTimer) window.clearInterval(retryTimer);

  if (widgetId && window.turnstile?.remove) {
    try {
      window.turnstile.remove(widgetId);
    } catch (error) {
      console.warn('[SWABox] 清理验证组件失败：', error);
    }
  }
});
</script>

<style scoped>
.gate {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: clamp(40px, 7vh, 84px);
}

.gate__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.4vw, 28px);
  align-items: center;
}

.gate__rail {
  grid-column: 1 / span 3;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-right: clamp(12px, 2vw, 26px);
  border-right: 1px solid var(--stroke);
}

.gate__facts {
  margin: 0;
}

.gate__fact {
  padding: 12px 0;
  border-top: 1px solid var(--stroke);
}

.gate__fact dt {
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--text-3);
}

.gate__fact dd {
  margin: 4px 0 0;
  font-size: 0.84rem;
  line-height: 1.6;
  color: var(--text);
}

.gate__foot {
  margin-top: auto;
  font-size: 11px;
  color: var(--text-3);
}

.gate__body {
  grid-column: 5 / span 7;
  max-width: 34em;
}

.gate__kicker {
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--accent);
}

.gate__title {
  margin-top: 12px;
  font-size: clamp(1.7rem, 2.9vw, 2.35rem);
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: var(--text);
}

.gate__lead {
  margin-top: 14px;
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-2);
}

.gate__panel {
  margin-top: clamp(24px, 3.2vw, 34px);
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: var(--surface-1);
  box-shadow: var(--shadow-1);
  overflow: hidden;
}

.gate__widget {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  padding: 18px;
}

.gate__loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-3);
}

.gate__pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: blink 1.4s var(--ease) infinite;
}

.gate__notice {
  padding: 12px 18px;
  border-top: 1px solid rgba(213, 171, 109, 0.28);
  background: var(--warn-soft);
  font-size: 0.87rem;
  line-height: 1.75;
  color: var(--warn);
}

.gate__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 18px;
  border-top: 1px solid var(--stroke);
}

.gate__provider {
  font-size: 12px;
  color: var(--text-3);
}

.gate__refresh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  font-size: 12px;
  color: var(--text-2);
  transition:
    background-color 0.15s var(--ease),
    border-color 0.15s var(--ease),
    color 0.15s var(--ease);
}

.gate__refresh:hover:not(:disabled) {
  border-color: var(--stroke);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.gate__refresh:disabled {
  opacity: 0.45;
  cursor: default;
}

.gate__note {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-3);
}

@media (max-width: 1024px) {
  .gate__rail {
    grid-column: 1 / span 3;
  }

  .gate__body {
    grid-column: 4 / span 9;
  }
}

@media (max-width: 760px) {
  .gate {
    align-items: flex-start;
    padding-block: 28px 48px;
  }

  .gate__rail {
    grid-column: 1 / span 12;
    gap: 16px;
    padding-right: 0;
    padding-bottom: 18px;
    border-right: 0;
    border-bottom: 1px solid var(--stroke);
  }

  .gate__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 16px;
  }

  .gate__fact {
    border-top: 0;
    padding: 4px 0 0;
  }

  .gate__foot {
    display: none;
  }

  .gate__body {
    grid-column: 1 / span 12;
    margin-top: 24px;
  }

  .gate__actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
