// 行为开关集中在这里：开发服务器默认跳过人机验证与协议弹窗，生产构建一律开启。
//
// 取值由 vite.config.js 的 swabox:site-mode 插件（dev）与 define（build）把标识符
// SITE_MODE_INJECTED 整词替换成 'production' / 'development'。这里用 typeof 判断，
// 是因为未注入时这个标识符并不存在——直接引用会抛 ReferenceError。
export const securityEnabled = SITE_MODE_INJECTED !== 'development';
