# 🎨 简历模板编辑器

> **零后端 · 零构建 · 单文件分发** — 把 `index.html` 发给任何人，双击就能用。

---

## ✨ 核心特性

| 维度 | 规模 |
|------|------|
| 📐 简历模板 | **31 套** （6 大设计系列：分栏/横幅/卡片/简约/深色/新风格） |
| 🖼 头像样式 | **22 种** （几何/水墨国风/粒子光效/黑胶唱片主题特效） |
| 🎨 主题配色 | **7 色** + 无限自定义颜色（自动派生 8 色协调板） |
| 📝 数据模块 | **10 大模块** （基本信息/求职/教育/工作/项目/技能/证书/语言/爱好/自评） |
| 📤 导出格式 | **5 种** （PDF / 网页 HTML / 打印 / JSON 备份 / TXT 纯文本） |
| 📥 导入格式 | **3 种** （JSON / TXT / 图片头像） |
| ⌨️ 快捷键 | **10 组** （Ctrl+S/Z/Y/E/I/P/0/+-） |
| 🔧 交互 | 拖拽排序 / 富文本编辑 / 撤销重做双栈 / 输入防抖 / 自动分页 |
| 📄 纸张 | A4（国际标准）/ Letter（北美） 双尺寸 |
| 🔒 协议 | **完美支持 file:// 本地直开**（无需搭建 Web 服务） |

---

## 🚀 快速开始

### 方式 1 · 本地使用（最简单）

1. 下载项目 → 双击打开 **`index.html`**
2. 就可以开始编辑简历了！
3. 浏览器建议：Chrome / Edge / Brave（Chromium 内核获得最佳 PDF 导出效果）

> 💡 不需要装 Node.js、不需要 npm install、不需要启动本地服务器。零依赖。

### 方式 2 · 部署到 GitHub Pages（获得在线链接分享给朋友）

详见 👉 **[DEPLOY.md](./DEPLOY.md)** — 4 步获得免费的 `https://你的用户名.github.io/resume-templates/` 永久访问链接。

也支持一键部署到 **Vercel / Netlify / Cloudflare Pages / Gitee**。

---

## 🗂 项目结构

```
简历模板项目/
├── index.html                     ⭐ 主程序（单文件，~1.5MB）
│                                    包含全部：HTML结构 + CSS样式 + JavaScript
│                                    内嵌：html2canvas + jsPDF（PDF 导出）
│                                    外链：FontAwesome 6.5 图标（CDN）
│
├── README.md                        ✅ 本文件（项目说明）
├── DEPLOY.md                        ✅ GitHub/其他平台部署指南
│
└── resume-project-analysis/         📊 可选 · 完整项目分析报告
    ├── resume-project-analysis.html    14 章详细分析文档
    │                                  （架构图5张 / 数据表11张 / 函数索引50+条）
    ├── _shared/                        报告依赖资源（字体/图表库）
    └── source-copy/index.html          分析时的源代码快照备份
```

---

## 🎯 功能快速导航

### 📋 编辑器界面 6 Tab 分组

| Tab | 图标 | 能做什么 |
|-----|------|---------|
| 模板 | 🎨 | 6 系列 31 套模板缩略图卡片选择，分类折叠面板 |
| 样式 | 🎚️ | 自定义颜色（主色自动派生）+ 12 炫彩预设 + 图案 + 字体 + **22 款头像样式选择 + 缩放滑块** + 恢复默认 |
| 基础 | 👤 | 基本信息 9 字段 / 求职意向 5 字段 / 自我评价（300字计数）/ 头像上传（可拖拽） |
| 经历 | 💼 | 教育背景 / 工作经历 / 项目经验（增删、上下移、拖拽排序、富文本描述） |
| 能力 | 🛠 | 技能（进度条滑块 or 标签 2 模式）/ 证书 / 语言 / 兴趣 |
| 其他 | ⋯ | 设置（字号4档 / 纸张A4Letter / 7主题色）/ 模块显示开关 / 简历分析评分 / 快捷键说明 |

### ⌨️ 快捷键

| 键 | 功能 |
|----|------|
| `Ctrl + S` | 立即保存（实际一直在自动保存，心理安慰按钮） |
| `Ctrl + Z` | 撤销 |
| `Ctrl + Shift + Z` / `Ctrl + Y` | 重做 |
| `Ctrl + E` | 导出菜单 |
| `Ctrl + I` | 导入文件 |
| `Ctrl + P` | 预览打印模式 |
| `Ctrl + 0` | 预览缩放 100% |
| `Ctrl + + / -` | 预览区放大/缩小 |

### 📤 导出

顶部工具栏「导出」下拉：
- **导出 PDF**（⭐ 推荐最终交付 HR）— 预览所见即所得
- **导出网页 HTML**（二次编辑 / 嵌入网站）
- **导出数据备份 JSON**（换电脑 / 跨浏览器迁移）
- **导出纯文本 TXT**（复制到 Word / 版本管理 diff）

---

## 🧠 架构亮点（想读代码的看这里）

### 分层架构
```
视图层 View（顶栏+侧栏6Tab+预览区A4纸）
    ↓ 用户输入
交互层 Interaction（快捷键/拖拽/RTE/防抖/Toast）
    ↓ 写入 D 对象
业务层 Business（31 模板注册表 / 六步渲染流水线 / 分页算法
                applyCustomStyle 上色 / buildAvatar 22样式
                rich() 4层XSS过滤 / 10段onclone修正）
    ↓ 持久化
状态层 State（D 单一数据源 + ID 计数器 + undo/redo双栈 + localStorage）
```

### 解决的 10+ 个技术坑（纯前端 WYSIWYG 难点）

| 坑 | 解决方案 |
|----|---------|
| PDF 导出比例被压缩 | onclone §1.5 强制 25 个模板容器 `overflow:hidden` 裁切伪元素溢出 |
| 头像在 PDF 中变黑 | 透明 PNG 头像 canvas 先画底色矩形再合成 jpeg |
| file:// 协议 Tainted Canvas | 所有装饰图 base64 内嵌 + 导出前 Image→dataURL 预转换 |
| vinyl 黑胶 mask 全黑 | 检测 mask-image:radial-gradient → 用 radial-gradient 圆环背景模拟 |
| 光影侧栏光斑导出白屏 | 禁用 radial-gradient 的 transparent 伪元素，保留深色渐变底 + 投射阴影 |
| 双栏模板分页把侧栏技能裁掉 | splitPages() 先检测双栏正则，只对主区 section 分页，侧栏每页 clone 保留 |
| Undo 每字一条历史记录爆栈 | JSON.stringify 对比去重 + saveDebounced 400ms 合并 |
| 撤销后主题切换无效 | applyCustomStyle 非自定义时 removeProperty 10 个 CSS 内联变量（优先级陷阱） |
| Letter 纸张导出变 A4 | paperPxWidth 单一数据源，jsPDF/onclone/分页/@page 全部读取同一函数 |
| TXT 导入后新增条目重复 ID | 导入结束从数组 max id 回填全局 ID，避免局部 `var ID` 遮蔽 |
| 富文本 XSS | rich() 四层过滤：闭合标签剥离 / 自闭合删 / on*事件移除 / 危险协议清除 |
| 自定义颜色乱配色 | syncDerivedFromPrimary 主色 → accent + 渐变 start/end 同色系派生 |

**完整 14 章项目分析报告**：[resume-project-analysis/resume-project-analysis.html](./resume-project-analysis/resume-project-analysis.html)

---

## 🔒 隐私与安全

- **零后端**：所有数据保存在你自己浏览器的 `localStorage`。简历内容永远不会上传到任何服务器。
- **多人共用隔离**：同一 Pages 链接，每个人的数据各存各的（浏览器隔离），互不干扰。
- **备份建议**：定期使用 **导出 → 导出数据备份 JSON** 存一份到网盘/邮箱。电脑重装也不怕丢。

---

## 📄 许可证

本项目用于个人简历制作，**可自由使用、修改、分发**。
第三方库授权（已内嵌/外链）：
- html2canvas / jsPDF（MIT License）
- FontAwesome 6 Icons（Font Awesome Free License）
- 设计风格参考 [bufancv.com examples](https://bufancv.com/examples)

---

## 🛠 扩展建议

想给项目加功能？参考分析报告第 14 章「未来扩展方向」：
- 📱 移动端 PWA 适配
- 🤖 接入 LLM 自动润色工作描述
- 👥 多份简历切换 + Git 风格版本对比
- 🧩 模板市场 & 自定义模板构建器
- 📄 DOCX / MD / PNG 更多导出格式
- 🌏 中英日韩多语言 i18n

---

**Enjoy!** 用 30 秒就能做出专业级简历 🔥
