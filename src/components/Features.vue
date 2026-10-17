<template>
  <section id="tools" class="section section--line tools" aria-labelledby="tools-title">
    <div class="container">
      <div class="grid12">
        <div class="tools__rail">
          <p class="section-label section-label--line">02 / 盒子清单</p>
          <p class="tools__rail-note">客户端入口</p>
        </div>

        <div class="tools__body">
          <h2 id="tools-title" class="h2 tools__title" data-reveal>
            打开盒子，六件事都能直接办。
          </h2>

          <p class="lead tools__lead" data-reveal>
            左边一排是分类，点进去再挑具体软件。下面这六个入口，和客户端主界面上的按钮一一对应，
            截图在首页上方，可以对着看。
          </p>

          <div class="tools__table" data-reveal>
            <div class="tools__head" aria-hidden="true">
              <span>序号</span>
              <span>入口</span>
              <span>说明</span>
              <span>方式</span>
            </div>

            <ul class="tools__list">
              <li v-for="tool in TOOLS" :key="tool.no" class="tools__row">
                <span class="tools__no">{{ tool.no }}</span>
                <h3 class="tools__name">{{ tool.name }}</h3>
                <p class="tools__summary">{{ tool.summary }}</p>
                <span class="tag" :class="'tag--' + tool.tone">{{ tool.tag }}</span>
              </li>
            </ul>
          </div>

          <p class="tools__foot" data-reveal>
            标「本地内置」的不走网络；其余跳转官网，交给系统浏览器打开。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { TOOLS } from '../data/site';
</script>

<style scoped>
.tools__rail {
  grid-column: 1 / span 2;
  position: sticky;
  top: calc(var(--nav-h) + 28px);
  align-self: start;
}

.tools__rail-note {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.tools__body {
  grid-column: 4 / span 9;
}

.tools__title {
  max-width: 18em;
}

.tools__lead {
  margin-top: 18px;
  max-width: 35em;
}

.tools__table {
  margin-top: clamp(26px, 3.2vw, 38px);
}

.tools__head,
.tools__row {
  display: grid;
  grid-template-columns: 48px minmax(120px, 0.85fr) minmax(0, 1.9fr) 104px;
  align-items: center;
  column-gap: clamp(12px, 1.6vw, 22px);
}

.tools__head {
  padding: 0 16px 10px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.tools__head span:last-child {
  text-align: right;
}

.tools__list {
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: var(--surface-1);
  box-shadow: var(--shadow-1);
  overflow: hidden;
}

.tools__row {
  padding: 15px 16px;
  border-top: 1px solid var(--stroke);
  transition: background-color 0.15s var(--ease);
}

.tools__row:first-child {
  border-top: 0;
}

.tools__row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.tools__no {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--text-3);
  transition: color 0.15s var(--ease);
}

.tools__row:hover .tools__no {
  color: var(--accent);
}

.tools__name {
  font-size: 0.99rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text);
  letter-spacing: -0.008em;
}

.tools__summary {
  font-size: 0.91rem;
  line-height: 1.7;
  color: var(--text-2);
}

.tools__row .tag {
  justify-self: end;
}

.tools__foot {
  margin-top: 14px;
  padding-left: 2px;
  font-size: 12px;
  line-height: 1.75;
  color: var(--text-3);
}

@media (max-width: 1024px) {
  .tools__body {
    grid-column: 3 / span 10;
  }

  .tools__head,
  .tools__row {
    grid-template-columns: 36px minmax(0, 1fr) 96px;
  }

  .tools__summary {
    grid-column: 2 / -1;
    margin-top: 4px;
  }

  .tools__head span:nth-child(3) {
    display: none;
  }

  .tools__row .tag {
    grid-row: 1;
    grid-column: 3;
  }
}

@media (max-width: 760px) {
  .tools__rail {
    grid-column: 1 / span 12;
    position: static;
  }

  .tools__body {
    grid-column: 1 / span 12;
  }

  .tools__title {
    font-size: 1.7rem;
  }

  .tools__head {
    display: none;
  }

  .tools__table {
    margin-top: 22px;
  }

  .tools__summary {
    font-size: 0.88rem;
  }
}
</style>
