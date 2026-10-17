<template>
  <div class="doc">
    <NavBar />

    <main id="main" class="doc__main">
      <div class="container">
        <header class="grid12 doc__head">
          <div class="doc__rail">
            <p class="section-label section-label--line">{{ kicker }}</p>
            <router-link to="/" class="doc__back">
              <AppIcon name="arrow-left" :size="14" /> 返回首页
            </router-link>
          </div>

          <div class="doc__heading">
            <h1 class="doc__title">{{ title }}</h1>
            <p class="doc__date">{{ updated }}</p>
          </div>
        </header>

        <div class="grid12 doc__body">
          <aside class="doc__aside" aria-label="文档信息">
            <dl class="doc__facts">
              <div class="doc__fact">
                <dt>域名</dt>
                <dd>swabox.cc.cd</dd>
              </div>
              <div class="doc__fact">
                <dt>许可</dt>
                <dd>MIT</dd>
              </div>
              <div class="doc__fact">
                <dt>相关</dt>
                <dd>
                  <router-link v-for="item in related" :key="item.to" :to="item.to" class="doc__link">
                    {{ item.label }}
                  </router-link>
                </dd>
              </div>
              <div class="doc__fact">
                <dt>联系</dt>
                <dd><a :href="'mailto:' + email" class="doc__link">{{ email }}</a></dd>
              </div>
            </dl>
          </aside>

          <article class="prose doc__article">
            <slot />
          </article>
        </div>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';
import NavBar from './NavBar.vue';
import SiteFooter from './SiteFooter.vue';

defineProps({
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  updated: { type: String, required: true },
  email: { type: String, required: true },
  related: { type: Array, default: () => [] },
});
</script>

<style scoped>
.doc__main {
  padding-top: calc(var(--nav-h) + clamp(32px, 4.6vw, 60px));
  padding-bottom: clamp(56px, 7vw, 92px);
}

.doc__head {
  align-items: end;
  padding-bottom: clamp(22px, 3vw, 34px);
  border-bottom: 1px solid var(--stroke);
}

.doc__rail {
  grid-column: 1 / span 3;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.doc__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  height: 30px;
  padding: 0 10px 0 8px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-sm);
  font-size: 12px;
  color: var(--text-2);
  transition:
    background-color 0.15s var(--ease),
    color 0.15s var(--ease);
}

.doc__back:hover {
  background: var(--surface-1);
  color: var(--text);
}

.doc__heading {
  grid-column: 4 / span 8;
}

.doc__title {
  font-size: clamp(1.9rem, 3.2vw, 2.7rem);
  font-weight: 650;
  line-height: 1.28;
  letter-spacing: -0.025em;
}

.doc__date {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-3);
  font-variant-numeric: tabular-nums;
}

.doc__body {
  padding-top: clamp(28px, 3.8vw, 44px);
}

.doc__aside {
  grid-column: 1 / span 3;
  position: sticky;
  top: calc(var(--nav-h) + 24px);
  align-self: start;
}

.doc__facts {
  margin: 0;
  padding: 4px 16px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.022);
}

.doc__fact {
  padding: 12px 0;
  border-top: 1px solid var(--stroke);
}

.doc__fact:first-child {
  border-top: 0;
}

.doc__fact dt {
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--text-3);
}

.doc__fact dd {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.65;
}

.doc__link {
  display: block;
  color: var(--text-2);
  transition: color 0.15s var(--ease);
}

.doc__link:hover {
  color: var(--accent);
}

.doc__article {
  grid-column: 4 / span 8;
}

@media (max-width: 1024px) {
  .doc__rail {
    grid-column: 1 / span 12;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    order: 2;
  }

  .doc__heading {
    grid-column: 1 / span 12;
    order: 1;
  }

  .doc__aside {
    grid-column: 1 / span 12;
    position: static;
    order: 1;
  }

  .doc__facts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
  }

  .doc__fact {
    border-top: 0;
  }

  .doc__article {
    grid-column: 1 / span 12;
    order: 2;
  }
}

@media (max-width: 560px) {
  .doc__facts {
    grid-template-columns: 1fr;
  }

  .doc__fact + .doc__fact {
    border-top: 1px solid var(--stroke);
  }
}
</style>
