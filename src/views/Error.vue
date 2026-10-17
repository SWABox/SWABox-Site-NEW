<template>
  <div class="err">
    <div class="container">
      <div class="grid12 err__grid">
        <div class="err__aside">
          <router-link to="/" class="err__brand">
            <img src="/logo-nobg.png" alt="" width="26" height="26" />
            <span>SWABox</span>
          </router-link>

          <div class="err__card">
            <p class="err__code">{{ code }}</p>
            <p class="err__badge">HTTP 状态码</p>
          </div>

          <p class="err__hint">如果是从别的页面点过来的，那多半是链接旧了。</p>
        </div>

        <div class="err__body">
          <h1 class="err__title">{{ detail.title }}</h1>

          <p class="err__text">{{ detail.text }}</p>

          <div class="err__actions">
            <button type="button" class="btn btn--primary btn--lg" @click="goHome">
              回到首页
            </button>
            <a
              :href="REPO_APP"
              class="btn btn--ghost btn--lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppIcon name="github" :size="16" />
              项目仓库
            </a>
            <button type="button" class="btn btn--ghost btn--lg" @click="goDownload">
              下载页
              <AppIcon name="arrow-right" :size="16" />
            </button>
          </div>

          <p class="err__foot">
            还找不到？把地址发到
            <a :href="'mailto:' + EMAIL" class="text-link">{{ EMAIL }}</a>，我看一眼。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppIcon from '../components/AppIcon.vue';
import { EMAIL, REPO_APP } from '../data/site';

const route = useRoute();

const MESSAGES = {
  403: {
    title: '这道门没开。',
    text: '这个地址不对外开放，或者你手上的链接已经失效了。',
  },
  404: {
    title: '没有这个页面。',
    text: '链接可能拼错了，也可能页面被挪走。回首页重新找一遍更快。',
  },
  500: {
    title: '服务端那边出错了。',
    text: '静态站点很少这样。如果反复出现，去仓库提个 Issue 告诉我。',
  },
  502: {
    title: '网关没把请求转过去。',
    text: '一般是中间的 CDN 出了问题，等几分钟再刷新。',
  },
  503: {
    title: '服务暂时停着。',
    text: '维护中，或者机器在重启。过一会儿再来。',
  },
};

const code = computed(() => String(route.params.code || '404'));
const detail = computed(() => MESSAGES[code.value] || MESSAGES[404]);

function goHome() {
  // 用 location 而不是 router.push：错误页可能是用户直接敲地址进来的，
  // 走一遍完整加载最稳。
  window.location.assign('/');
}

function goDownload() {
  window.location.assign('/#download');
}
</script>

<style scoped>
.err {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: clamp(44px, 8vh, 96px);
}

.err__grid {
  align-items: start;
}

.err__aside {
  grid-column: 1 / span 3;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.err__brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.err__brand img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.err__card {
  padding: 18px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background:
    radial-gradient(220px 120px at 0% 0%, rgba(63, 190, 135, 0.1), transparent 70%),
    var(--surface-1);
  box-shadow: var(--shadow-1);
}

.err__code {
  font-size: clamp(2.6rem, 5vw, 3.6rem);
  font-weight: 650;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.err__badge {
  margin-top: 10px;
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--text-3);
}

.err__hint {
  font-size: 12px;
  line-height: 1.8;
  color: var(--text-3);
}

.err__body {
  grid-column: 5 / span 8;
  max-width: 32em;
}

.err__title {
  font-size: clamp(1.9rem, 3.4vw, 2.7rem);
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.026em;
}

.err__text {
  margin-top: 14px;
  font-size: 1rem;
  line-height: 1.9;
  color: var(--text-2);
}

.err__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: clamp(26px, 3.4vw, 36px);
}

.err__foot {
  margin-top: 20px;
  font-size: 12.5px;
  color: var(--text-3);
}

@media (max-width: 900px) {
  .err__aside {
    grid-column: 1 / span 12;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    order: 2;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid var(--stroke);
  }

  .err__card {
    padding: 10px 16px;
  }

  .err__code {
    font-size: 2rem;
  }

  .err__badge {
    display: none;
  }

  .err__hint {
    flex: 1 1 100%;
  }

  .err__body {
    grid-column: 1 / span 12;
    order: 1;
  }
}

@media (max-width: 480px) {
  .err__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .err__actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
