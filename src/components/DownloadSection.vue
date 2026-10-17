<template>
  <section id="download" class="section section--line dl" aria-labelledby="dl-title">
    <div class="container">
      <div class="grid12">
        <div class="dl__rail">
          <p class="section-label section-label--line">04 / 下载</p>
          <p class="dl__rail-note">Windows 安装包</p>
        </div>

        <div class="dl__body">
          <h2 id="dl-title" class="h2 dl__title" data-reveal>
            下这一个文件就够了。
          </h2>

          <p class="lead dl__lead" data-reveal>
            单文件 exe，不需要预装 Python 或运行库。版本号直接从 GitHub 的 Releases 接口读，
            下面的数字和仓库里的一模一样。
          </p>

          <div class="dl__panel" data-reveal>
            <div class="dl__facts" aria-live="polite">
              <p class="dl__state" v-if="status === 'loading'">
                <span class="dl__pulse" aria-hidden="true"></span>
                正在读取最新版本…
              </p>

              <p class="dl__state dl__state--error" v-else-if="status === 'error'">
                没能连上 GitHub 的接口，可能是网络或访问限制。
                <a :href="RELEASES" target="_blank" rel="noopener noreferrer">直接去 Releases 页</a>
                看也一样。
              </p>

              <dl v-else class="dl__grid">
                <div class="dl__fact">
                  <dt>最新版本</dt>
                  <dd class="dl__version">
                    {{ release.version }}
                    <span v-if="release.channel" class="dl__channel">{{ release.channel }}</span>
                  </dd>
                </div>
                <div class="dl__fact">
                  <dt>发布日期</dt>
                  <dd class="dl__value">{{ release.date }}</dd>
                </div>
                <div class="dl__fact">
                  <dt>文件大小</dt>
                  <dd class="dl__value">{{ release.size }}</dd>
                </div>
                <div class="dl__fact">
                  <dt>适用平台</dt>
                  <dd class="dl__value">Windows 10 / 11（64 位）</dd>
                </div>
              </dl>
            </div>

            <div class="dl__actions">
              <a
                v-if="status === 'ready'"
                :href="release.windows"
                class="btn btn--primary btn--lg btn--block dl__main"
                download
              >
                <AppIcon name="download" :size="17" />
                <span class="dl__main-text">
                  <span>下载 Windows 版</span>
                  <span class="dl__main-file">{{ release.fileName }}</span>
                </span>
              </a>

              <a
                v-else
                :href="RELEASES"
                class="btn btn--primary btn--lg btn--block dl__main"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppIcon name="external" :size="16" />
                打开 Releases 页
              </a>

              <a :href="RELEASES" class="btn btn--ghost btn--block" target="_blank" rel="noopener noreferrer">
                全部历史版本
              </a>

              <button
                type="button"
                class="dl__refresh"
                :disabled="status === 'loading'"
                @click="loadRelease"
              >
                <AppIcon name="refresh" :size="13" />
                重新读取版本
              </button>
            </div>
          </div>

          <div class="dl__notes" data-reveal>
            <h3 class="dl__notes-title">装之前，三件事</h3>
            <ol class="dl__notes-list">
              <li>
                <strong>Windows 可能弹「已保护你的电脑」。</strong>
                没有代码签名证书的中文软件大多会这样。点「更多信息」，再点「仍要运行」。
                这是打包工具常见的误报，不是病毒；不放心就把安装包传到 VirusTotal 自己扫一遍。
              </li>
              <li>
                <strong>安装路径别带中文和空格。</strong>
                PyInstaller 打出来的程序对路径比较挑，放在 <code>D:\SWABox</code> 这类目录下最稳。
              </li>
              <li>
                <strong>下载后如果打不开，先解除锁定。</strong>
                在文件上右键 →「属性」，底部有个「解除锁定」的勾，勾上再确定。
              </li>
            </ol>
          </div>

          <p class="dl__foot" data-reveal>
            许可 MIT · 源码与更新日志在
            <a :href="REPO_APP" target="_blank" rel="noopener noreferrer">GitHub</a>
            · 本页面不发任何安装包，链接直接指向 Releases
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppIcon from './AppIcon.vue';
import { RELEASES, REPO_APP } from '../data/site';

const API = 'https://api.github.com/repos/SWABox/SWABox/releases/latest';

const status = ref('loading');
const release = ref({
  version: '',
  channel: '',
  date: '',
  size: '',
  windows: RELEASES,
  fileName: 'SWABox.exe',
});

let controller = null;

function parseTag(tag = '') {
  const match = tag.match(/^([A-Za-z]+)?[_-]?v?(\d+(?:\.\d+)*)/);
  if (!match) return { channel: '', version: tag.replace(/^v/, '') };
  return { channel: match[1] || '', version: match[2] };
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '未知';
  if (bytes >= 1024 * 1024 * 1024) return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  return (bytes / 1024 / 1024).toFixed(0) + ' MB';
}

async function loadRelease() {
  if (controller) controller.abort();
  controller = new AbortController();
  status.value = 'loading';

  try {
    const response = await fetch(API + '?_=' + Date.now(), {
      headers: { Accept: 'application/vnd.github.v3+json' },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('GitHub 返回 ' + response.status);

    const data = await response.json();
    const asset = (data.assets || []).find((item) => /\.exe$/i.test(item.name || ''));

    if (!asset) throw new Error('这个版本里没有 exe 文件');

    const { channel, version } = parseTag(data.tag_name);

    release.value = {
      version: version || data.tag_name,
      channel,
      date: (data.published_at || '').split('T')[0] || '未知',
      size: formatSize(asset.size),
      windows: asset.browser_download_url,
      fileName: asset.name,
    };
    status.value = 'ready';
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.warn('[SWABox] 读取版本失败：', error.message);
    status.value = 'error';
  }
}

onMounted(loadRelease);

onBeforeUnmount(() => {
  if (controller) controller.abort();
});
</script>

<style scoped>
.dl__rail {
  grid-column: 1 / span 2;
  position: sticky;
  top: calc(var(--nav-h) + 28px);
  align-self: start;
}

.dl__rail-note {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.dl__body {
  grid-column: 4 / span 9;
}

.dl__title {
  max-width: 14em;
}

.dl__lead {
  margin-top: 18px;
  max-width: 35em;
}

.dl__panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(230px, 0.6fr);
  gap: clamp(22px, 3vw, 40px);
  margin-top: clamp(26px, 3.2vw, 38px);
  padding: clamp(22px, 2.8vw, 34px);
  border: 1px solid var(--stroke-strong);
  border-radius: var(--r-xl);
  background:
    radial-gradient(520px 220px at 8% 0%, rgba(63, 190, 135, 0.11), transparent 70%),
    var(--surface-1);
  box-shadow: var(--shadow-2);
  overflow: hidden;
}

.dl__state {
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-2);
}

.dl__state--error {
  color: var(--warn);
  max-width: 34em;
}

.dl__state--error a {
  color: var(--warn);
  border-bottom: 1px solid rgba(213, 171, 109, 0.5);
}

.dl__pulse {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: blink 1.4s var(--ease) infinite;
  vertical-align: middle;
}

.dl__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 22px;
  margin: 0;
}

.dl__fact dt {
  font-size: 11.5px;
  color: var(--text-3);
}

.dl__fact dd {
  margin: 5px 0 0;
}

.dl__version {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  font-size: clamp(1.7rem, 2.4vw, 2.15rem);
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.dl__channel {
  padding: 3px 8px;
  border: 1px solid var(--accent-line);
  border-radius: 999px;
  background: var(--accent-soft);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.dl__value {
  font-size: 0.94rem;
  font-weight: 500;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.dl__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: center;
}

.dl__main {
  gap: 10px;
  height: auto;
  min-height: 52px;
  padding: 9px 16px;
  font-size: 0.92rem;
}

.dl__main-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  line-height: 1.3;
}

.dl__main-file {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 400;
  letter-spacing: 0;
  opacity: 0.72;
  word-break: break-all;
  text-align: left;
}

.dl__refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 2px;
  padding: 7px 0;
  border-radius: var(--r-sm);
  font-size: 12px;
  color: var(--text-3);
  transition:
    background-color 0.15s var(--ease),
    color 0.15s var(--ease);
}

.dl__refresh:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.dl__refresh:disabled {
  opacity: 0.45;
  cursor: default;
}

.dl__notes {
  margin-top: clamp(28px, 3.4vw, 42px);
}

.dl__notes-title {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--text);
}

.dl__notes-list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: note;
  max-width: 62ch;
}

.dl__notes-list li {
  position: relative;
  padding: 14px 0 14px 32px;
  border-top: 1px solid var(--stroke);
  font-size: 0.9rem;
  line-height: 1.85;
  color: var(--text-2);
}

.dl__notes-list li::before {
  counter-increment: note;
  content: counter(note, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 15px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
}

.dl__notes-list strong {
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
  color: var(--text);
}

.dl__notes-list code {
  font-size: 0.86em;
  padding: 2px 6px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-xs);
  background: var(--surface-1);
  color: var(--accent);
}

.dl__foot {
  margin-top: 20px;
  font-size: 12px;
  line-height: 1.8;
  color: var(--text-3);
}

.dl__foot a {
  color: var(--text-2);
  border-bottom: 1px solid var(--stroke-strong);
}

.dl__foot a:hover {
  color: var(--accent);
}

@media (max-width: 1024px) {
  .dl__body {
    grid-column: 3 / span 10;
  }

  .dl__panel {
    grid-template-columns: 1fr;
  }

  .dl__actions {
    align-self: stretch;
  }
}

@media (max-width: 760px) {
  .dl__rail {
    grid-column: 1 / span 12;
    position: static;
  }

  .dl__body {
    grid-column: 1 / span 12;
  }

  .dl__title {
    font-size: 1.7rem;
  }

  .dl__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>
