# 学术主页

通过 GitHub Pages 部署的个人学术主页：[yiqian7a.github.io](https://yiqian7a.github.io)

## 页面布局

宽屏（≥ 900px）采用左右分栏：

- **左侧栏**（固定）：头像、简介、链接、最新动态
- **右侧栏**：关于我、论文发表、教育背景、经历、项目、荣誉、联系方式

窄屏下自动变为单列，按阅读顺序纵向排列。

右侧栏模块顺序：关于我 → **论文发表** → 教育背景 → …

## 目录结构

```text
├── index.html          # 页面骨架
├── css/style.css       # 样式
├── js/content.js       # 双语内容（主要编辑此文件）
├── js/main.js          # 渲染与语言切换
├── assets/photo.svg    # 头像占位图
└── favicon.svg         # 站点图标
```

## 本地预览

无需构建，直接用浏览器打开 `index.html`，或启动本地服务器：

```bash
# Python
python -m http.server 8000

# Node.js（如已安装 npx）
npx serve .
```

然后访问 `http://localhost:8000`。

## 更新内容

所有可编辑文案集中在 [`js/content.js`](js/content.js)：

| 变量 | 说明 |
|------|------|
| `SITE` | 姓名、邮箱、头像路径、社交链接、简历 |
| `CONTENT.en` | 英文版各模块内容 |
| `CONTENT.zh` | 中文版各模块内容 |

### 关于我（About Me）

在 `about` 字段中编辑：

```javascript
about: {
  text: "个人介绍正文……",
  tagsLabel: "研究方向",      // 标签上方的小标题
  tags: ["具身智能", "大语言模型"],
},
```

### 添加论文

在 `en` 和 `zh` 的 `publications` 数组中各添加一条：

```javascript
{
  year: "2026",
  title: "Paper Title",
  authors: "Your Name, Co-author",
  tldr: "一句话概括论文核心贡献与方法。",
  badges: [
    { text: "CVPR 2026", type: "venue" },   // 会议标签
    { text: "投稿中", type: "status" },      // 状态标签
    // { text: "已接收", type: "accepted" }, // 录用可用 accepted
  ],
  links: [
    { label: "PDF", url: "https://..." },
    { label: "Code", url: "https://github.com/..." },
  ],
}
```

`badges` 为可选字段。`type` 支持 `venue`（会议，蓝色）、`status`（投稿中等，橙色）、`accepted`（已接收，绿色）；省略 `type` 时使用默认样式。中英文版本的 `badges.text` 可分别填写（如英文 "Under Review"、中文 "投稿中"）。

### 启用可选模块

在 `content.js` 中填入 `news`、`experience`、`projects`、`awards` 数组。有内容时自动显示，为空时显示「即将更新」占位。

### 头像与简历

1. 将 `assets/photo.svg` 替换为你的照片（如 `assets/photo.jpg`）
2. 更新 `SITE.photo` 为对应文件名
3. 将简历 PDF 放到 `assets/cv.pdf`，并设置 `SITE.cvAvailable = true`

## GitHub Pages 部署

本仓库对应 `username.github.io`，是最简单的 GitHub Pages 方案。

1. **推送到 GitHub**

   ```bash
   git add .
   git commit -m "Initial academic homepage"
   git push -u origin main
   ```

   若默认分支为 `master`，将 `main` 替换为 `master`。

2. **启用 GitHub Pages**

   - 进入仓库 **Settings → Pages**
   - Source 选择 **Deploy from a branch**
   - Branch 选择 `main`（或 `master`）/ **/(root)**
   - 点击 **Save**

3. **访问站点**

   等待 1–2 分钟后访问：`https://yiqian7a.github.io`

无需 GitHub Actions 或构建步骤。

### 自定义域名（可选）

在仓库根目录添加 `CNAME` 文件并写入域名，再在域名服务商处配置 DNS。

## 模块说明

### 必要模块

- **Hero**（左侧）— 姓名、身份、简短简介、链接
- **About Me**（右侧顶部）— 个人介绍 + 研究方向标签
- **Education** — 学历时间线
- **Publications** — 论文列表及链接
- **Contact** — 邮箱与社交链接

### 可选模块（留空时显示占位）

- **News** — 最新动态
- **Experience** — 研究与工业经历
- **Projects** — 工程 / 开源项目
- **Awards** — 荣誉与奖学金

## 许可

内容为个人所有，代码结构可自由复用。
