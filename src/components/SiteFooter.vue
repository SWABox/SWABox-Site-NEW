<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <p class="footer__brand-line">
            <img src="/logo-nobg.png" alt="" width="26" height="26" class="footer__logo" />
            <span class="footer__name">SWABox</span>
          </p>
          <p class="footer__desc">
            一个给电教委用的小工具箱。开源、免费、没有账号，
            也不需要在别人的服务器上存任何东西。
          </p>
        </div>

        <nav class="footer__col" aria-label="站内导航">
          <p class="footer__head">站内</p>
          <router-link :to="{ path: '/', hash: '#tools' }">盒子清单</router-link>
          <router-link :to="{ path: '/', hash: '#why' }">为什么做</router-link>
          <router-link :to="{ path: '/', hash: '#build' }">构建记录</router-link>
          <router-link :to="{ path: '/', hash: '#download' }">下载</router-link>
        </nav>

        <nav class="footer__col" aria-label="代码仓库">
          <p class="footer__head">仓库</p>
          <a :href="REPO_APP" target="_blank" rel="noopener noreferrer">客户端源码</a>
          <a :href="REPO_SITE" target="_blank" rel="noopener noreferrer">本站源码</a>
          <a :href="ISSUES" target="_blank" rel="noopener noreferrer">问题反馈</a>
          <a :href="LICENSE_URL" target="_blank" rel="noopener noreferrer">MIT 许可证</a>
        </nav>

        <div class="footer__col">
          <p class="footer__head">联系</p>
          <a :href="'mailto:' + EMAIL">{{ EMAIL }}</a>
          <span class="footer__static">{{ SITE_URL.replace('https://', '') }}</span>
          <span class="footer__static footer__static--dim">静态站点，无后端数据库</span>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">© 2026 SWABox · MIT</p>
        <p class="footer__legal">
          <router-link to="/privacy">隐私政策</router-link>
          <span aria-hidden="true">·</span>
          <router-link to="/terms">用户协议</router-link>
        </p>
        <p class="footer__built">手工写的页面，没有模板</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { EMAIL, ISSUES, LICENSE_URL, REPO_APP, REPO_SITE, SITE_URL } from '../data/site';
</script>

<style scoped>
.footer {
  margin-top: clamp(36px, 4.4vw, 60px);
  padding-block: clamp(32px, 4.2vw, 52px) 28px;
  border-top: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.012), transparent 60%);
}

.footer__top {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) repeat(3, minmax(0, 0.8fr));
  gap: clamp(24px, 3.4vw, 48px);
}

.footer__brand-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer__logo {
  width: 26px;
  height: 26px;
  border-radius: var(--r-sm);
  object-fit: contain;
}

.footer__name {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text);
}

.footer__desc {
  margin-top: 12px;
  max-width: 26em;
  font-size: 0.87rem;
  line-height: 1.8;
  color: var(--text-3);
}

.footer__col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.footer__head {
  margin-bottom: 2px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-3);
}

.footer__col a,
.footer__static {
  font-size: 0.87rem;
  color: var(--text-2);
  transition: color 0.15s var(--ease);
}

.footer__col a:hover {
  color: var(--accent);
}

.footer__static--dim {
  color: var(--text-3);
  font-size: 0.82rem;
  line-height: 1.6;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 24px;
  margin-top: clamp(28px, 3.4vw, 42px);
  padding-top: 16px;
  border-top: 1px solid var(--stroke);
  font-size: 12px;
  color: var(--text-3);
}

.footer__legal {
  display: inline-flex;
  gap: 8px;
  color: var(--text-3);
}

.footer__legal a:hover {
  color: var(--text);
}

.footer__built {
  margin-left: auto;
  color: var(--text-3);
}

@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .footer__top {
    grid-template-columns: 1fr 1fr;
    gap: 26px;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }

  .footer__built {
    margin-left: 0;
  }
}
</style>
