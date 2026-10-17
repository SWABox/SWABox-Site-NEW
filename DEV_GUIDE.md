# SWABox 网站开发文档

本文档描述当前代码的实际结构。设计取舍与内容来源集中在 `src/data/site.js` 和 `src/style.css`。

## 快速开始

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 生产构建，输出 dist/
npm run preview    # 预览生产构建
```

Node 版本建议 20 及以上。构建只依赖 Vite 与 `@vitejs/plugin-vue`，没有额外的 CSS 或 UI 框架。

## 目录结构

```
src/
├── components/
│   ├── NavBar.vue            固定导航（桌面横排 / 移动抽屉）
│   ├── HeroSection.vue       首屏：标题 + 截图 + 参数条
│   ├── IssueSection.vue      01 为什么（问题清单）
│   ├── Features.vue          02 工具（六行账本表）
│   ├── TechStack.vue         03 做法（构建参数 + 路线图）
│   ├── DownloadSection.vue   04 下载（读 GitHub Releases API）
│   ├── SiteFooter.vue        页脚
│   ├── SiteShell.vue         首页骨架：跳过链接 + 条款 + 导航 + 五个区块 + 页脚
│   ├── DocLayout.vue         文档页骨架：隐私政策 / 用户协议
│   ├── TermsConsent.vue      首次访问的条款弹窗
│   ├── TurnstileChallenge.vue 人机验证面板
│   └── AppIcon.vue           内联 SVG 图标（Lucide 风格，无外部图标库）
├── views/
│   ├── Home.vue              首页：验证门禁 + SiteShell
│   ├── Privacy.vue           隐私政策
│   ├── Terms.vue             用户协议
│   ├── Challenge.vue         独立验证页
│   └── Error.vue             403 / 404 / 500 / 502 / 503
├── composables/useReveal.js  IntersectionObserver 入场动画
├── data/site.js              仓库地址、邮箱、工具清单、参数、路线图
├── router/index.js           路由、滚动行为、document.title
├── App.vue                   只有 router-view
├── main.js                   入口
└── style.css                 设计令牌 + 全局类
functions/api/verify-turnstile.js   Cloudflare Pages Function
_headers / _redirects        Cloudflare Pages 配置
public/                      图标、截图、自托管字体、app/ 下的独立条款页
```

字体文件：

```
public/fonts/swabox-sans.woff2   中文子集（Noto Sans SC，可变字重 300–800，约 218 KB）
public/fonts/inter-latin.woff2   拉丁字母与数字（Inter Variable，约 47 KB）
```

## 路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 需要人机验证通过 |
| `/privacy` | Privacy | 需要人机验证通过 |
| `/terms` | Terms | 需要人机验证通过 |
| `/challenge` | Challenge | 独立验证页，始终可访问 |
| `/error/:code` | Error | 403 / 404 / 500 / 502 / 503，始终可访问 |
| 其他 | — | 重定向到 `/error/404` |

标题由 `router.afterEach` 根据 `meta.title` 写入，首页用固定的 `HOME_TITLE`。

## 访问验证流程

1. 路由守卫检查 `localStorage['swabox_verified']`（JSON `{ valid: true, ts }`，24 小时内有效）；没有就跳到 `/challenge?redirect=原路径`。带 `meta.requiresAuth` 的页面（首页、隐私政策、用户协议）都走这一关，`/challenge` 与 `/error/*` 始终可访问。
2. 验证页渲染 Turnstile，拿到 token 后 `POST /api/verify-turnstile`，body 为 `{ token }`，由 Pages Function 调 `siteverify` 校验。开发服务器里这次请求由 `vite.config.js` 的代理直接返回 `{ "success": true, "message": "开发模式模拟成功" }`，不会真的校验 token。
3. 校验通过后写入：

| key | 值 | 有效期 |
|-----|-----|--------|
| `swabox_verified` | JSON `{ valid: true, ts: 时间戳 }` | 24 小时（守卫使用） |
| `swabox_terms_accepted` | `'true'` | 长期 |

4. 条款弹窗只在 `swabox_terms_accepted` 不存在时出现。点「不同意」不写入任何内容，直接关闭弹窗，不影响浏览。

**验证与协议弹窗由开关控制，不再按 `import.meta.env.DEV` 硬跳过。** 开关值集中从 `src/data/runtime.js` 的 `securityEnabled` 导出，其余代码只引用它：

- 生产构建（`npm run build`）：一定开启。
- 开发服务器（`npm run dev`）：默认关闭，直接进首页，方便调样式。
- 想在 dev 下完整走一遍验证：`VITE_ENABLE_SECURITY=true npm run dev`（PowerShell 用 `$env:VITE_ENABLE_SECURITY='true'; npm run dev`），此时 `/api/verify-turnstile` 由代理 mock 返回成功。

实现上有个坑：**vite 5 在 dev（serve）阶段不会把 `config.define` 写进模块源码**，只把这些值挂到全局（`/@vite/env` 的 `assign defines`），所以源码里直接引用注入名在 dev 下会 `ReferenceError`。本项目的做法：

- `vite.config.js` 里的 `swabox:site-mode` 插件在 serve 阶段把 `src/**` 里的标识符 `SITE_MODE_INJECTED` 换成 `'production'` / `'development'`（先处理 `typeof SITE_MODE_INJECTED`，再换标识符本身）。
- 构建阶段由 `define: { SITE_MODE_INJECTED: ... }` 交给 Rollup 做同样的整词替换。
- 两边都换完，产物里不会残留 `SITE_MODE_INJECTED`，构建后可在 `dist/assets/*.js` 里 grep 验证。

另外 `server.watch.ignored` 排除了 `.edge-profile`、`.shots` 等临时目录，否则截图脚本的浏览器配置会被 watcher 侦测并抛 `EBUSY`，把 dev 服务器直接打崩。

## Turnstile 配置

需要在 Cloudflare Turnstile 控制台做两件事：

1. 把站点域名加入该 Site Key 的允许域名（例如 `swabox.cc.cd`、`*.swabox.cc.cd`，本地调试加 `localhost`）。
2. 在 Cloudflare Pages 的环境变量里配置：

| 变量 | 用途 |
|------|------|
| `TURNSTILE_SITE_KEY` | 前端渲染用的 Site Key |
| `TURNSTILE_SECRET_KEY` | Pages Function 校验用的私钥 |
| `VITE_TURNSTILE_SITE_KEY` | 本地 `.env` 里覆盖前端 Site Key |

常见错误码：

- `110200`：域名未登记或验证域名不匹配，去 Turnstile 控制台补域名。
- `300010`：Site Key 的域名配置错误，或当前域名不在白名单里。
- 控制台报 `postMessage ... target origin` 不匹配：同样是域名配置问题。

如果验证面板一直转圈，先在浏览器控制台确认 `window.turnstile` 是否存在；`index.html` 里的脚本带 `render=explicit`，加载完成后会派发 `turnstile:ready` 事件。

## 设计系统

配色与尺寸令牌都定义在 `src/style.css` 的 `:root` 里，组件只引用变量。整体参照 WinUI / Fluent：分层的深色表面、1px 半透明描边、8px 圆角、克制的柔和阴影。

```css
--bg: #101413;          /* 页面底色 */
--surface-1: #1a1f1d;   /* 卡片 */
--surface-2: #202624;   /* 按钮、次级表面 */
--stroke: rgba(255,255,255,.075);       /* 常规描边 */
--stroke-strong: rgba(255,255,255,.14); /* 强调描边、面板外框 */
--text: #f3f2ee;        /* 正文 */
--text-2: #b8beb8;      /* 次级正文 */
--text-3: #8d958f;      /* 标签、注释 */
--accent: #3fbe87;      /* 强调色，取自 Logo 绿 */
--warn: #d5ab6d;        /* 提示与注意 */
--danger: #d38472;      /* 错误 */
--r-sm: 4px; --r-lg: 8px; --r-xl: 12px;  /* 圆角 */
```

- 旧的 `--ink / --paper / --sage` 等变量名保留并映射到新值，老样式不会读不到值，新代码不要再使用它们。
- 字体：`Inter` 吃拉丁字母和数字，中文落到自托管的 `SWABox Sans` 子集，兜底为 Segoe UI Variable / 苹方 / 雅黑。**没有 Google Fonts 请求**，字体文件和页面同源，CSP 只需要 `font-src 'self'`。
- 动效：12px 位移 + 淡入，缓动 `cubic-bezier(.16, 1, .3, 1)`；`prefers-reduced-motion` 下关闭。
- 图标来自 `src/components/AppIcon.vue` 的内联 SVG（Lucide 线稿），不使用 Emoji、不引外部图标 CDN。

### 中文子集字体怎么更新

子集是按页面实际用到的字符生成的（当前约 860 个字符）。**新增文案后如果要保证所有字都走自托管字体**，重新跑一次子集：

1. 下载 Noto Sans SC 可变字体 `NotoSansSC-VF.otf`（约 15 MB）。
2. 安装子集工具：`npm install --no-save subset-font`。
3. 用脚本收集 `src/**/*.{vue,js,html,css}` 与 `index.html` 的字符，调用 `subsetFont(buf, chars, { targetFormat: 'woff2' })`，输出到 `public/fonts/swabox-sans.woff2`。
4. 不要传 `variationAxes`：对这份 CFF2 可变字体做轴子集化后，Chrome 会判为 `Invalid font data`，字体加载失败。

缺字时浏览器会回退到系统字体，页面仍可读，只是字重和字形会有细微差异。

## 内容维护

- 仓库地址、邮箱、工具清单、参数、路线图全部在 `src/data/site.js`，改文案优先改这里。
- 下载区不写死版本号：`DownloadSection.vue` 请求 `https://api.github.com/repos/SWABox/SWABox/releases/latest`，取第一个 `.exe` 附件，显示版本、日期、体积。没有请求成功时显示错误文案并给出 Releases 链接，不会编造数字。
- 首页截图是 `public/app-main.png`，取自客户端仓库的 `res/img/Main_Page.png`；客户端界面改版后需要手动替换。

## 部署

Cloudflare Pages：

- 构建命令 `npm run build`，输出目录 `dist`。
- `_redirects` 把未知路径交给 `index.html`（`/* /index.html 200`），由前端路由接管。
- `_headers` 定义了生产环境的 CSP：脚本只允许自身、`'unsafe-inline'` 与 `challenges.cloudflare.com`；样式只允许自身与内联；连接只允许自身、`api.github.com` 与 Cloudflare 统计域。**新增第三方脚本前必须先改 CSP，否则线上会被拦掉。**
- `functions/api/verify-turnstile.js` 随 Pages 一起部署，无需单独的服务。

## 已知限制

- 本地 `vite dev` 没有 Pages Functions 环境，`vite.config.js` 里对 `/api/verify-turnstile` 做的是 `success: true` 的 mock，只用于跑通流程，不代表真实校验。
- 真实 Turnstile 校验、生产 CSP 生效情况、Pages Function 的线上行为都需要在 Cloudflare 环境验证，本地只能验证渲染与交互。
- `public/` 下仍留有旧的 `error-bg.jpg`、`icons.svg`、`logo.png`，当前页面没有引用，可按需删除。
- `public/app/privacy.html`、`public/app/terms.html` 是客户端安装包里用的独立条款页，纯静态 HTML。它们与站点共用同一套 Fluent 令牌（颜色、圆角、字体一致），但样式内联在各自文件里，不跟随 `src/style.css` 自动更新。

---

**最后更新**：2026-10-17（补充安全验证开关说明、静态条款页样式）