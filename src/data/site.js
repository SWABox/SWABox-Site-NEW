// 站点的硬信息集中在这里：改仓库地址、邮箱或工具清单时只改这一处。

export const REPO_APP = 'https://github.com/SWABox/SWABox';
export const REPO_SITE = 'https://github.com/SWABox/SWABox-site';
export const RELEASES = REPO_APP + '/releases/latest';
export const ISSUES = REPO_APP + '/issues';
export const SITE_URL = 'https://swabox.cc.cd';
export const EMAIL = 'content@swabox.cc.cd';
export const LICENSE_URL = 'https://opensource.org/licenses/MIT';

// 与客户端主界面上的入口一一对应，改动前先对一遍截图。
export const TOOLS = [
  {
    no: '01',
    name: '优化工具',
    summary: '白板卡顿、触控不跟手、显示发虚，先从这里挑一个试试。',
    tag: '跳转官网',
    tone: 'net',
  },
  {
    no: '02',
    name: '修复工具',
    summary: '修复脚本和已知问题的处理办法，装在机房里随取随用。',
    tag: '跳转官网',
    tone: 'net',
  },
  {
    no: '03',
    name: '实用软件',
    summary: '机房里常备的那几个小程序，省得每次临时去搜索引擎找。',
    tag: '跳转官网',
    tone: 'net',
  },
  {
    no: '04',
    name: '维护文件',
    summary: '系统镜像、驱动、说明文档。重装一台机器时最先要用的东西。',
    tag: '跳转官网',
    tone: 'net',
  },
  {
    no: '05',
    name: '紧急工具',
    summary: '360 急救箱放在本地。网线拔了、系统崩了，它照样能打开。',
    tag: '本地内置',
    tone: 'local',
  },
  {
    no: '06',
    name: '前往白板官网',
    summary: '希沃官网直达，驱动和固件都在那里，不用自己拼网址。',
    tag: '快捷入口',
    tone: 'link',
  },
];

export const PROBLEMS = [
  {
    mark: 'A',
    title: '群文件会过期',
    text: '上学期传上去的工具，这学期打不开；重新要一份，还得等群主上线。',
  },
  {
    mark: 'B',
    title: '地址记不住',
    text: '希沃官网、驱动下载、修复脚本，各是一个网址，收藏夹越堆越乱。',
  },
  {
    mark: 'C',
    title: '断网就停摆',
    text: '机房断网的那几分钟，恰恰是最需要急救箱的时候。',
  },
];

export const SPECS = [
  { label: '运行平台', value: 'Windows 10 / 11' },
  { label: '语言', value: 'Python 3' },
  { label: '界面', value: 'PySide6 · Qt' },
  { label: '许可', value: 'MIT' },
];

export const BUILD_SPECS = [
  { label: '语言', value: 'Python 3' },
  { label: '界面框架', value: 'PySide6（Qt for Python）' },
  { label: '无线检测', value: 'pywifi' },
  { label: '日志', value: 'logging，写入安装目录的 log/' },
  { label: '打包', value: 'PyInstaller 单文件 exe' },
  { label: '许可', value: 'MIT' },
];

export const ROADMAP = [
  { name: '运行日志生成', state: '计划中', note: 'README 里还挂着，没做完。' },
  { name: '数据存储迁移到数据库', state: '计划中', note: '现在还是配置文件。' },
  { name: '界面里直接添加本地工具', state: '开发中', note: 'Tool 目录已经能用，界面入口还没做。' },
  { name: '镜像站与在线下载', state: '看资金', note: '服务器要钱，有钱就做。' },
];

export const DONE = ['工具分类', '内置急救箱', '界面改版', '打包成 exe'];
