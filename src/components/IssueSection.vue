<template>
  <section id="why" class="section section--line issue" aria-labelledby="issue-title">
    <div class="container">
      <div class="grid12">
        <div class="issue__rail">
          <p class="section-label section-label--line">01 / 为什么</p>
          <p class="issue__rail-note">问题清单</p>
        </div>

        <div class="issue__body">
          <h2 id="issue-title" class="h2 issue__title" data-reveal>
            电教委的时间，不该花在找链接上。
          </h2>

          <p class="lead issue__lead" data-reveal>
            一台机房电脑从开学用到报废，用的还是那几样东西。可工具一直散着——
            一个在群文件里，一个在论坛帖子的第三页，还有一个链接早就打不开了。
          </p>

          <p class="issue__text" data-reveal>
            SWABox 做的事很笨：把它们收拢，一个一个对过，再打成一个 exe。
            盒子打开，工具就在那儿。
          </p>

          <ul class="issue__list" data-reveal>
            <li v-for="item in PROBLEMS" :key="item.mark" class="issue__item">
              <span class="issue__mark">{{ item.mark }}</span>
              <div class="issue__item-body">
                <h3 class="issue__item-title">{{ item.title }}</h3>
                <p class="issue__item-text">{{ item.text }}</p>
              </div>
            </li>
          </ul>

          <blockquote class="issue__quote" data-reveal>
            <p>把常备的东西放在手边，这件事本身就不该难。</p>
          </blockquote>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { PROBLEMS } from '../data/site';
</script>

<style scoped>
.issue__rail {
  grid-column: 1 / span 2;
  position: sticky;
  top: calc(var(--nav-h) + 28px);
  align-self: start;
}

.issue__rail-note {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.issue__body {
  grid-column: 4 / span 8;
}

.issue__title {
  max-width: 17em;
}

.issue__lead {
  max-width: 33em;
  margin-top: 20px;
}

.issue__text {
  max-width: 33em;
  margin-top: 12px;
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-3);
}

.issue__list {
  margin-top: clamp(28px, 3.4vw, 42px);
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: var(--surface-1);
  box-shadow: var(--shadow-1);
  overflow: hidden;
}

.issue__item {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 14px;
  padding: 18px 20px;
  border-top: 1px solid var(--stroke);
  transition: background-color 0.15s var(--ease);
}

.issue__item:first-child {
  border-top: 0;
}

.issue__item:hover {
  background: rgba(255, 255, 255, 0.025);
}

.issue__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-top: 1px;
  border: 1px solid var(--accent-line);
  border-radius: var(--r-sm);
  background: var(--accent-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--accent);
}

.issue__item-title {
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--text);
}

.issue__item-text {
  margin-top: 5px;
  font-size: 0.92rem;
  line-height: 1.8;
  color: var(--text-2);
  max-width: 36em;
}

.issue__quote {
  margin: clamp(24px, 3vw, 34px) 0 0;
  padding: 18px 22px;
  border: 1px solid var(--stroke);
  border-left: 3px solid var(--accent);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.022);
}

.issue__quote p {
  font-size: clamp(1.02rem, 1.5vw, 1.18rem);
  line-height: 1.75;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.01em;
}

@media (max-width: 1024px) {
  .issue__body {
    grid-column: 3 / span 10;
  }
}

@media (max-width: 760px) {
  .issue__rail {
    grid-column: 1 / span 12;
    position: static;
  }

  .issue__body {
    grid-column: 1 / span 12;
  }

  .issue__title {
    font-size: 1.7rem;
  }

  .issue__item {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .issue__item-text {
    font-size: 0.89rem;
  }
}
</style>
