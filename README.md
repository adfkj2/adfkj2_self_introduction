# adfkj2 · Developer Portfolio & Engineering Journal

基于现有 Astro Blog Starter 重构的静态个人站点。Java Backend × AI Agent，深色编辑式视觉、SVG 工程图形、中文长文阅读。没有 React 运行时、远程字体或线上服务依赖。

## 本地开发

要求 Node.js `>=22.23.4`。已安装依赖时直接运行：

```powershell
npm install
npm run dev -- --background
npm run dev:status
npm run dev:logs
npm run dev:stop
```

默认本地地址 `http://localhost:4321/`，以启动输出为准。开发服务器按 AGENTS.md 要求使用后台模式。

```powershell
npm run check
npm run build
npm run verify
```

内容发布与域名 SEO 的集成检查可单独执行 `npm run verify:content`。它会创建临时测试文章，构建并验证后自动清理，再重建正常站点；请先停止开发服务器，避免缓存竞争。

检查和构建按顺序运行，避免同时写入 Astro 内容与 Vite 缓存。在受限执行环境遇到 Astro 遥测目录权限错误时，可先设置 `$env:ASTRO_TELEMETRY_DISABLED='1'`；npm 缓存可使用 `--cache .cache/npm`。普通本机开发通常不需要这些设置。

## 页面与结构

| 路径 / 文件                                    | 职责                                                   |
| ---------------------------------------------- | ------------------------------------------------------ |
| `/`                                            | Hero、工程记忆拓扑、精选项目、技术方向、写作与个人介绍 |
| `/projects/`                                   | 四个项目，按 AI / Backend / Exploration 筛选           |
| `/projects/{dive,medical,tickets,better-one}/` | 独立项目详情、架构、取舍、实验与局限                   |
| `/writing/`                                    | 真实文章列表，未发布时展示空状态                       |
| `/writing/tags/{backend,database,ai,systems}/` | 主题浏览                                               |
| `/writing/examples/reading-experience/`        | 明确标注、noindex 的 MDX 阅读示例                      |
| `/about/`                                      | 教育、理念、项目方向与简历状态                         |
| `/rss.xml`、`/robots.txt`、`/404.html`         | 订阅、爬虫与错误页                                     |
| `src/data/site.ts`                             | 个人资料、导航、主题、备案入口                         |
| `src/data/projects.ts`                         | 项目状态、内容、来源与独立详情数据                     |
| `src/content.config.ts`                        | Content Collection frontmatter 校验                    |
| `src/utils/posts.ts`                           | 统一发布过滤、排序、链接与估算阅读时间                 |
| `src/styles/global.css`                        | 设计 tokens、布局、深浅主题与响应式                    |
| `src/styles/article.css`                       | 中文长文、代码、引用、表格、图注                       |
| `docs/starter-archive/`                        | 隔离保留的五篇官方示例，不参与构建                     |
| `docs/DEPLOYMENT.md`                           | 备案完成后，ECS + Nginx 部署说明                       |

## 补充个人资料

编辑 `src/data/site.ts`：真实姓名、邮箱、手机号、简历 PDF 路径、ICP 备案号。未填写的联系方式不显示；没有简历时展示说明，不生成虚假的下载按钮。默认昵称与 GitHub 为本人已提供的 `adfkj2`。手机号码填写后会作为公开信息显示，请只填写愿意公开的号码。

项目三的仓库、项目四的原型、实验报告、实习或获奖经历都未虚构。D.I.V.E. 和 Medical QA 内容参考本人需求与各仓库 README；项目页注明了当前实现、历史实验和产品构想的边界。公开源码可能继续变化，发布前应复核项目数据。

## 发布文章

在 `src/content/blog/` 新建 Markdown 或 MDX，例如 `my-first-note.md`：

```yaml
---
title: '真实文章标题'
description: '简洁准确的摘要'
pubDate: '2026-10-23'
category: 'Engineering Notes'
tags: ['backend', 'database']
draft: true
example: false
---
```

正文使用 `##` / `###` 自动形成目录。确认内容可发布后设置 `draft: false`，重建网站。未来日期文章在构建时隐藏，需要在日期到达后重新构建。支持 `updatedDate`；`heroImage` 是相对于文章的本地图像路径，并必须提供 `heroAlt`，可选 `heroCaption`。正文图片建议使用 Astro Image 或显式声明宽高的本地图片，并用 `<figure>` / `<figcaption>` 添加图注。

`tags` 从 `backend`、`database`、`ai`、`systems` 中选择，可多选；显示名称集中维护。`category` 自由填写。示例必须设置 `example: true`，独立进入 `/writing/examples/`。草稿不会生成静态页面。示例和草稿不会进入首页、正式文章列表或 RSS。

阅读时间按中文约 400 字/分钟、英文约 220 词/分钟估算，去除围栏代码、图片与 HTML 标签；页面明确标注“约”，不视为阅读统计。代码复制在 HTTPS 或 localhost 的安全上下文可用，权限不可用时给出手动复制提示。表格和代码块可横向滚动，页面自身不应溢出。

## 域名与 SEO

正式域名已确认为 `adfkj2.cloud`。本地 `.env` 与可复制的 `.env.example` 已填写 `PUBLIC_SITE_URL=https://adfkj2.cloud`，不包含子路径。构建时自动用于 Canonical、OG、RSS 与 Sitemap。`.env` 不进入 Git；更换开发环境时可从 `.env.example` 复制。此配置不会部署网站，也不表示备案、DNS 或 HTTPS 证书已完成。

未配置域名时：不生成 Canonical、绝对 OG URL 与 Sitemap；robots 默认禁止索引，RSS 使用当前本地构建请求的 origin。域名配置后：自动启用 Canonical、绝对 OG 信息、Sitemap 与 robots 的 Sitemap 声明，RSS 使用真实域名。文章示例始终 noindex 且排除在 Sitemap 中。

`public/og-image.png` 是已生成的 1200×630 本地分享图，SVG 源文件一并保留。未配置域名时不会输出伪造的生产绝对地址。

## 依赖

保留 Astro、官方 MDX / RSS / Sitemap 和 Sharp。新增开发依赖 `@astrojs/check`、`typescript` 用于类型与模板诊断，`prettier` 与 `prettier-plugin-astro` 用于统一源码格式。没有增加运行时依赖。原生 CSS / SVG 完成动效、主题和视觉，客户端脚本仅处理导航、主题、筛选、复制与目录。

## 视觉系统

本轮改版实际使用已下载的 Anthropic `frontend-design` 和 Vercel `web-design-guidelines`。石墨黑与冰蓝构成基底，英文字体自托管 Manrope（24.8KB，许可保存在 `public/fonts/`），中文使用本机系统字体，不向外部字体服务发起请求。最大容器 1200px，长文约 780px，正文桌面17px / 手机16px。主案例、次案例与研发记录采用不同版式；桌面记忆概念图和手机紧凑流程分别设计。设计计划与自审见 [DESIGN-REFINEMENT.md](docs/DESIGN-REFINEMENT.md)。

交互支持键盘焦点、跳转主要内容、移动菜单 Escape 关闭、主题及浏览器栏颜色同步、记忆阶段切换、可分享的项目筛选URL与浏览器前进后退。尊重减少动态效果偏好，内容不依赖滚动淡入才能出现。浏览器视觉检查和可访问性测试结果见 `docs/VALIDATION.md`；没有实际运行 Lighthouse 时不声称分数达标。

网站已部署到 <https://adfkj2.cloud>。仓库为 <https://github.com/adfkj2/adfkj2_self_introduction>。

已添加 GitHub Actions：PR 自动检查，推送到 `main` 后检查、构建并通过 SSH 发布，发布健康检查失败时回到上一版本。首次启用需要创建服务器 `deploy` 账号并配置 `SSH_PRIVATE_KEY`、`SSH_KNOWN_HOSTS` 两个仓库 Secrets，步骤见 [GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md)。
