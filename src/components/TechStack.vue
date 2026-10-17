<template>
  <section id="build" class="section section--line build" aria-labelledby="build-title">
    <div class="container">
      <div class="grid12">
        <div class="build__rail">
          <p class="section-label section-label--line">03 / 做法</p>
          <p class="build__rail-note">构建记录</p>
        </div>

        <div class="build__body">
          <h2 id="build-title" class="h2 build__title" data-reveal>
            没用什么花活，就是能跑。
          </h2>

          <p class="lead build__lead" data-reveal>
            客户端是用 Python 写的桌面程序，界面由 Qt 绘制，没有在里面塞一个浏览器内核。
            安装包因此接近 300 MB，确实比同类大一些；换来的是双击就能打开，不必等内核加载。
          </p>

          <div class="build__cols">
            <div class="build__notes" data-reveal>
              <p>
                打包交给 PyInstaller，单文件输出。所以第一次启动会慢上几秒——它得先把内容解到临时目录，
                之后再开就快了。这个行为来自打包工具本身，不是程序在联网。
              </p>
              <p>
                无线检测用 pywifi，日志用标准库的 logging，写在安装目录的
                <code>log/</code> 里。手工塞进去的工具放在
                <code>SWABox/_internal/Tool</code>，界面里的添加入口还在做。
              </p>
              <p class="build__aside">
                <AppIcon name="book" :size="14" />
                这些在仓库的 README 里都有原文，改动了会一起改。
              </p>
            </div>

            <dl class="build__specs" data-reveal>
              <div v-for="item in BUILD_SPECS" :key="item.label" class="build__spec">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
          </div>

          <div class="build__roadmap" data-reveal>
            <div class="build__roadmap-head">
              <h3 class="build__roadmap-title">还没做完的</h3>
              <p class="build__roadmap-note">按仓库 README 的状态抄的</p>
            </div>

            <ul class="build__roadmap-list">
              <li v-for="item in ROADMAP" :key="item.name" class="build__roadmap-row">
                <span class="build__roadmap-name">{{ item.name }}</span>
                <span class="build__roadmap-state" :data-state="item.state">{{ item.state }}</span>
                <span class="build__roadmap-detail">{{ item.note }}</span>
              </li>
            </ul>

            <p class="build__done">
              <span class="build__done-label">已完成</span>
              <span v-for="item in DONE" :key="item" class="build__done-item">{{ item }}</span>
            </p>
          </div>

          <p class="build__links" data-reveal>
            <a :href="REPO_APP" class="text-link" target="_blank" rel="noopener noreferrer">
              看客户端源码 <AppIcon name="arrow-up-right" :size="13" />
            </a>
            <a :href="ISSUES" class="text-link" target="_blank" rel="noopener noreferrer">
              提一个问题 <AppIcon name="arrow-up-right" :size="13" />
            </a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import AppIcon from './AppIcon.vue';
import { BUILD_SPECS, DONE, ISSUES, REPO_APP, ROADMAP } from '../data/site';
</script>

<style scoped>
.build__rail {
  grid-column: 1 / span 2;
  position: sticky;
  top: calc(var(--nav-h) + 28px);
  align-self: start;
}

.build__rail-note {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.build__body {
  grid-column: 4 / span 9;
}

.build__title {
  max-width: 15em;
}

.build__lead {
  margin-top: 18px;
  max-width: 38em;
}

.build__cols {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(22px, 3vw, 40px);
  margin-top: clamp(28px, 3.2vw, 40px);
  align-items: start;
}

.build__notes p {
  font-size: 0.94rem;
  line-height: 1.9;
  color: var(--text-2);
}

.build__notes p + p {
  margin-top: 14px;
}

.build__notes code {
  font-size: 0.86em;
  padding: 2px 6px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-xs);
  background: var(--surface-1);
  color: var(--accent);
  white-space: nowrap;
}

.build__aside {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.022);
  color: var(--text-3) !important;
  font-size: 0.86rem !important;
  line-height: 1.7 !important;
}

.build__aside :deep(.app-icon) {
  margin-top: 2px;
  color: var(--text-3);
}

.build__specs {
  margin: 0;
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: var(--surface-1);
  box-shadow: var(--shadow-1);
  overflow: hidden;
}

.build__spec {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 12px;
  padding: 11px 16px;
  border-top: 1px solid var(--stroke);
}

.build__spec:first-child {
  border-top: 0;
}

.build__spec dt {
  font-size: 11.5px;
  color: var(--text-3);
  padding-top: 3px;
}

.build__spec dd {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text);
}

.build__roadmap {
  margin-top: clamp(30px, 3.6vw, 44px);
}

.build__roadmap-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.build__roadmap-title {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--text);
}

.build__roadmap-note {
  font-size: 11.5px;
  color: var(--text-3);
}

.build__roadmap-list {
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.022);
  overflow: hidden;
}

.build__roadmap-row {
  display: grid;
  grid-template-columns: minmax(150px, 0.9fr) 82px minmax(0, 1.6fr);
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-top: 1px solid var(--stroke);
}

.build__roadmap-row:first-child {
  border-top: 0;
}

.build__roadmap-name {
  font-size: 0.93rem;
  font-weight: 500;
  color: var(--text);
}

.build__roadmap-state {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  gap: 6px;
  height: 22px;
  padding: 0 9px;
  border: 1px solid rgba(213, 171, 109, 0.3);
  border-radius: 999px;
  background: var(--warn-soft);
  font-size: 11px;
  font-weight: 500;
  color: var(--warn);
  white-space: nowrap;
}

.build__roadmap-state::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.build__roadmap-state[data-state="开发中"] {
  color: var(--accent);
  border-color: var(--accent-line);
  background: var(--accent-soft);
}

.build__roadmap-detail {
  font-size: 0.87rem;
  line-height: 1.7;
  color: var(--text-2);
}

.build__done {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-3);
}

.build__done-label {
  font-weight: 500;
  color: var(--text-3);
}

.build__done-item {
  padding: 2px 9px;
  border: 1px solid var(--stroke);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-2);
}

.build__links {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: clamp(24px, 3vw, 34px);
}

@media (max-width: 1024px) {
  .build__body {
    grid-column: 3 / span 10;
  }

  .build__cols {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .build__rail {
    grid-column: 1 / span 12;
    position: static;
  }

  .build__body {
    grid-column: 1 / span 12;
  }

  .build__title {
    font-size: 1.7rem;
  }

  .build__roadmap-row {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 4px;
  }

  .build__roadmap-detail {
    grid-column: 1 / -1;
  }
}
</style>
