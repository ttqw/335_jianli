# 🚀 GitHub 部署指南（零成本在线访问）

因为本项目是**纯静态单文件前端应用**（无后端、无数据库、无构建步骤），所以部署极其简单。

## ⚡ 最快路线：GitHub Pages（推荐）

### 1. 创建 GitHub 仓库

1. 打开 <https://github.com> → 登录/注册
2. 右上角 **+** → **New Repository**
3. 填写：
   - **Repository name**：`resume-templates`（或随意）
   - **Public** ✅ 必须选公开（Private 要付费才能用 Pages）
   - **不要**勾选 Add README / Add .gitignore / Choose a license
4. **Create repository**

---

### 2. 上传代码（2 选 1）

#### 🅰 方式 A：浏览器直接拖（零命令，非开发者）

1. 空仓库页面点 **"...or upload an existing file"**
2. 打开本文件夹，把以下内容拖到网页上传区：
   - `index.html` **（必须，主程序）**
   - `resume-project-analysis/`（可选，分析报告）
   - `README.md`（可选，项目介绍）
   - `DEPLOY.md`（可选，本文件）
3. 底部 Commit message 写 `Initial commit` → **Commit changes**

#### 🅱 方式 B：Git 命令行（开发者，方便后续更新）

先确保装了 Git：<https://git-scm.com/download/win>（Windows 一路 Next 即可）

```powershell
# 进入本项目文件夹
cd "d:\Users\T\Documents\muban\简历模板项目"

# 初始化仓库
git init
git add -A
git commit -m "Initial commit: 简历编辑器 v2.0"
git branch -M main

# 关联到 GitHub（把 你的用户名 换成实际 GitHub 用户名）
git remote add origin https://github.com/你的用户名/resume-templates.git

# 推送到 GitHub
git push -u origin main
```

---

### 3. 开启 GitHub Pages

1. 仓库页面 → 顶部 **Settings**（齿轮）
2. 左侧菜单滚到底 → **Pages**
3. 配置：
   - **Source**：`Deploy from a branch`
   - **Branch**：`main` + `/ (root)` → **Save**
4. 等待 30 秒 ~ 2 分钟，刷新 Settings → Pages 页面：
   > 🟢 **Your site is live at https://你的用户名.github.io/resume-templates/**
5. 点链接 → 简历编辑器在线运行！

分享这个链接给朋友，他们打开就能用。

---

### 4. 后续更新代码

改完本地文件后：

```powershell
git add -A
git commit -m "修复：xxx 问题 / 新增：xxx 功能"
git push
```

GitHub Pages 会在 1 分钟内自动重新部署。

---

## 🌟 其他免费部署选项（一键导入更快）

| 平台 | 特点 | 操作 |
|------|------|------|
| **GitHub Pages** | 最稳定，无流量限制 | 按上面 4 步 |
| **Vercel** | 全球 CDN 极速，国内访问快 | <https://vercel.com/new> → Import Project → 选 GitHub 仓库 → Deploy（完全自动） |
| **Netlify** | 同 Vercel，拖文件夹即部署 | <https://app.netlify.com/drop> → 直接把 `简历模板项目` 文件夹拖到页面里，3 秒给链接 |
| **Cloudflare Pages** | 国内速度优秀 | <https://pages.cloudflare.com> → Connect to Git → 选仓库 → Save and Deploy |
| **Gitee Pages** | 国内访问最快（国内服务器） | 把代码推到 gitee.com → 服务 → Gitee Pages → 启动 |

> 💡 **国内用户建议**：推一份到 **Gitee**（国内访问速度比 GitHub 快 10 倍），再推一份到 GitHub 作为备份。

---

## 🔒 隐私与数据注意

- **所有简历数据保存在使用者浏览器的 localStorage 中**，**不会上传到 GitHub / 任何服务器**（本项目纯前端，零后端）。
- 如果多人共用同一个 GitHub Pages 链接，**彼此的简历数据完全隔离**（各存各的浏览器本地）。
- 备份/迁移个人简历：使用编辑器顶部 **导出 → 导出数据备份 (JSON)** → 换电脑后 **导入 → 导入 JSON 数据**。
- 不建议在公共仓库中提交包含个人真实信息的 `localStorage` 导出文件。

---

## 📁 建议提交到仓库的文件清单

```
简历模板项目/
├── index.html                     ✅ 必须（主程序 ~1.5MB）
├── README.md                      ✅ 推荐（项目介绍）
├── DEPLOY.md                      ✅ 推荐（本部署指南）
└── resume-project-analysis/       ⭕ 可选
    ├── resume-project-analysis.html
    ├── _shared/js/echarts.min.js      ← 报告用图表库（~1MB）
    ├── _shared/js/mermaid.min.js      ← 报告用流程图库（~2MB）
    ├── _shared/fonts/*.ttf            ← 报告字体
    └── source-copy/index.html         ← 源代码快照副本
```

> 报告文件夹 `resume-project-analysis/` 总大小约 5MB，如不需要可不上传，只传 `index.html` + README 也完全能用。

如果 GitHub 提示 **"this file is larger than 100MB"** 错误 → 说明误传了大文件。报告的 _shared 库加起来才 ~4MB，正常不会触发。

---

## 🎯 自定义域名（可选，可选域名）

如果想使用 `简历.你的域名.com` 这种个人域名访问：

1. 购买域名（阿里云/腾讯云/Cloudflare Registrar 均可）
2. 域名 DNS 解析添加 4 条 A 记录：
   ```
   @ → 185.199.108.153
   @ → 185.199.109.153
   @ → 185.199.110.153
   @ → 185.199.111.153
   ```
3. 仓库根目录新建空文件，文件名 `CNAME`，内容写一行：`你的域名.com`（不带 https）
4. Push 到 GitHub → Settings → Pages → 勾选 **Enforce HTTPS**
