<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="grid12 hero__grid">
        <div class="hero__main">
          <ul class="hero__chips">
            <li class="hero__chip"><span class="hero__chip-dot" aria-hidden="true"></span>开源</li>
            <li class="hero__chip">Windows 10 / 11</li>
            <li class="hero__chip">MIT</li>
          </ul>

          <h1 id="hero-title" class="hero__title">
            把电教室要用的东西，<br />
            收进一个盒子里。
          </h1>

          <p class="hero__lead">
            白板优化、修复工具、维护文件，还有一个断网时能打开的急救箱。
            装一次，下次开机还在；下载入口只有一个 exe，不用再翻群文件和收藏夹。
          </p>

          <div class="hero__actions">
            <a class="btn btn--primary btn--lg" href="#download" @click.prevent="scrollToDownload">
              <AppIcon name="download" :size="17" />
              下载 Windows 版
            </a>
            <a class="btn btn--ghost btn--lg" :href="REPO_APP" target="_blank" rel="noopener noreferrer">
              <AppIcon name="github" :size="16" />
              看源码
            </a>
          </div>

          <p class="hero__note">
            <AppIcon name="check" :size="14" />
            内置的急救箱不用联网；需要下载的工具会跳到官网，网络得通。
          </p>
        </div>

        <figure class="hero__plate">
          <div class="plate">
            <img
              src="/app-main.png"
              width="517"
              height="483"
              alt="SWABox 主界面截图：左侧是优化工具、修复工具、实用软件、维护文件，右侧是紧急工具、前往白板官网，以及设置、帮助、退出。"
            />
          </div>
          <figcaption class="plate__cap">
            <span>主界面 · 单文件 exe，约 299 MB</span>
            <span class="plate__cap-dim">v0.3.0</span>
          </figcaption>
        </figure>
      </div>

      <dl class="hero__specs">
        <div v-for="spec in SPECS" :key="spec.label" class="hero__spec">
          <dt>{{ spec.label }}</dt>
          <dd>{{ spec.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import AppIcon from './AppIcon.vue';
import { REPO_APP, SPECS } from '../data/site';

function scrollToDownload() {
  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<style scoped>
.hero {
  padding-top: calc(var(--nav-h) + clamp(40px, 5.4vw, 74px));
  padding-bottom: clamp(40px, 4.6vw, 64px);
}

.hero__grid {
  align-items: center;
}

.hero__main {
  grid-column: 1 / span 7;
  animation: rise 0.6s var(--ease-out) both;
}

.hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero__chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 26px;
  padding: 0 11px;
  border: 1px solid var(--stroke);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--text-2);
}

.hero__chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.hero__title {
  margin-top: clamp(18px, 2.2vw, 26px);
  font-size: clamp(2.1rem, 4.1vw, 3.5rem);
  line-height: 1.24;
  letter-spacing: -0.026em;
}

.hero__lead {
  max-width: 33em;
  margin-top: clamp(16px, 2vw, 24px);
  font-size: 1.02rem;
  line-height: 1.85;
  color: var(--text-2);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: clamp(24px, 2.8vw, 32px);
}

.hero__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 32em;
  margin-top: 18px;
  font-size: 0.84rem;
  line-height: 1.7;
  color: var(--text-3);
}

.hero__note :deep(.app-icon) {
  margin-top: 3px;
  color: var(--accent);
}

.hero__plate {
  grid-column: 9 / span 4;
  margin: 0;
  align-self: center;
  animation: rise 0.6s 0.08s var(--ease-out) both;
}

.plate {
  position: relative;
  padding: 8px;
  border: 1px solid var(--stroke-strong);
  border-radius: var(--r-xl);
  background: var(--surface-1);
  box-shadow: var(--shadow-2);
}

.plate img {
  width: 100%;
  border-radius: 7px;
}

.plate__cap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding: 0 4px;
  font-size: 11.5px;
  color: var(--text-2);
}

.plate__cap-dim {
  color: var(--text-3);
}

.hero__specs {
  display: grid;
  grid-template-columns: 1.1fr 0.85fr 1fr 0.75fr;
  margin: clamp(34px, 4vw, 52px) 0 0;
  padding: 0;
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.022);
  overflow: hidden;
  animation: rise 0.6s 0.14s var(--ease-out) both;
}

.hero__spec {
  padding: 16px clamp(16px, 2vw, 22px);
  border-left: 1px solid var(--stroke);
}

.hero__spec:first-child {
  border-left: 0;
}

.hero__spec dt {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.hero__spec dd {
  margin: 5px 0 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
}

@media (max-width: 1080px) {
  .hero__main {
    grid-column: 1 / span 12;
  }

  .hero__plate {
    grid-column: 1 / span 12;
    max-width: 420px;
    margin-top: 6px;
  }

  .hero__specs {
    grid-template-columns: 1fr 1fr;
  }

  .hero__spec:nth-child(odd) {
    border-left: 0;
  }

  .hero__spec:nth-child(n + 3) {
    border-top: 1px solid var(--stroke);
  }
}

@media (max-width: 520px) {
  .hero__title br {
    display: none;
  }

  .hero__title {
    font-size: 1.95rem;
    line-height: 1.34;
  }

  .plate__badge {
    left: 12px;
    bottom: 12px;
    padding: 7px 10px;
  }
}
</style>
