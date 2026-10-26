# 本地验收记录 · 2026-10-23

本次验证对象为实际 Astro 源码及最终 `dist/` 静态产物。没有连接 ECS、部署公网、提交或推送 Git。

## 构建与静态检查

- `npm run check`：35 个文件，0 errors / 0 warnings / 0 hints。
- `npm run build`：成功，静态输出，15 个 HTML 页面，另含 RSS 与 robots。
- `npm run verify`：成功，核对 15 个 HTML 文档、355 个站内链接与资源引用，以及必要路由、目录锚点、示例隔离、RSS。
- `git diff --check`：通过；Git 的 LF / CRLF 提示不影响构建。
- `npm run format`：已执行，全站 Astro、TypeScript、CSS 与维护脚本统一格式。

最初受限环境无法写入默认 npm 缓存及 Astro 遥测目录，分别使用工作区缓存与禁用遥测解决。最初并行构建与检查触发 Windows 缓存重命名冲突，关闭开发预览后顺序执行已通过。后续建议检查、构建与内容流程验证按顺序运行。

## 内容与 SEO 集成验证

`npm run verify:content` 实际创建四个临时内容条目，以保留测试域名 `https://site.test` 构建并核对：

- 两篇可发布文章生成独立详情、列表、主题列表与相邻文章导航。
- 草稿与未来日期文章不生成正式页面。
- RSS 收录正式文章，排除草稿、未来文章与阅读排版示例。
- 配置域名后 Canonical、Sitemap 与 robots 的 Sitemap 地址正确。
- 示例排除在 Sitemap 之外，始终带 noindex。

测试在 finally 阶段移除所有临时文章，并重新构建正常站点。交付源内容只有明确标记的阅读排版示例；正式文章数量为 0。当前没有真实域名，因此最终产物不启用生产 Canonical 与 Sitemap，robots 禁止索引，RSS 使用本地 origin。测试域名没有留在交付产物中。

## 浏览器与响应式

分别检查开发预览和最终静态预览。最终静态产物通过内置浏览器在 1440、1024、768、390、360px 宽度下检查了 10 个代表页面，共 50 个组合：

- 首页、项目列表、全部四个项目详情、Writing、AI 主题页、About、MDX 阅读示例。
- 所有组合均无页面横向溢出，且每页只有一个 h1。
- 实际查看了桌面首页、项目展示区、手机首页、项目筛选、浅色 About 与文章阅读界面。
- 移动导航展开、Escape 关闭、键盘 Tab 进入跳转主要内容链接与 Enter 跳转正常。
- 深浅主题切换与跨页持久化正常。
- AI 筛选显示 2 个项目，Backend 筛选显示 1 个项目。
- 代码复制显示“已复制”，表格与长代码在自身容器滚动。
- 中文 TOC 已验证滚动高亮；初次发现的 URL 编码匹配问题已修复。
- 浏览器控制台未发现 error / warn。

浏览器截图与 50 组尺寸检查记录保存在 `.qa/`，该目录已加入 gitignore。桌面截图为 `home-desktop.png`、项目区为 `selected-work.png`、手机截图为 `home-mobile.png`。

## 验证范围

- 没有运行 Lighthouse，因此不报告 Performance、Accessibility、Best Practices 或 SEO 分数。
- 没有进行跨浏览器、真实手机、屏幕阅读器或弱网实机测试；CSS 已支持 prefers-reduced-motion。
- 没有重新运行两个外部项目的模型、性能或并发测试。网站上的项目内容不是本次对这些项目的验收结论。
- 实际生产环境的 TLS、备案、Nginx 与服务器缓存仍需在后续获得授权后部署并验证。

## 域名配置更新 · 2026-10-23

本人确认域名为 `adfkj2.cloud` 后，已将本地 `.env` 与 `.env.example` 的 `PUBLIC_SITE_URL` 设置为 `https://adfkj2.cloud`，并更新 README、部署说明与 Nginx 本地示例。前文“没有真实域名”的描述记录首次验收时的状态。

重新执行 `npm run build` 成功，仍为 15 个 HTML 页面；`npm run verify` 通过，当前包含 368 个站内链接与资源引用。另逐项核对 14 个非重定向页面的 Canonical / OG URL、RSS 站点地址、Sitemap 与 robots 的 Sitemap 地址，均指向确认的域名。Sitemap 继续排除阅读示例。

此更新仅作用于本地配置和构建产物，没有登录阿里云控制台、连接 ECS、修改 DNS、申请证书、填入未知备案号或部署公网。

## 设计技能与改版验收 · 2026-10-26

已搜索并比较真实技能源码，下载、安装并使用 Anthropic `frontend-design` 与 Vercel `web-design-guidelines`。安装目录内的 SKILL.md 已通过 Git blob hash 核对，分别为 `a5333457c414d20d625f307df945842c0952ecc3` 与 `ceae92ab319216a68274168fba9b63b998b65997`。最终复核时重新取得 Vercel 规范，确认仍为 `3eb3a212b7b89493922ea418489d4c6f67ae8bd5`。计划、自审及实现说明见 `docs/DESIGN-REFINEMENT.md`。

- `npm run check`：36个文件，0错误、0警告、0提示。
- `npm run build`：成功，15个HTML页面，静态输出。
- `npm run verify`：成功，390个站内链接与资源引用有效。
- `npm run verify:content`：真实执行发布、草稿、未来文章、主题、相邻文章、RSS、Canonical、Sitemap与robots检查，临时内容清理完成。
- 修复内容测试收尾重建覆盖域名的问题；最终构建保留 `https://adfkj2.cloud` 与正式Sitemap，没有测试域名或测试文章残留。
- 最终静态预览：14种页面 × 5个固定视口，70个唯一组合全部通过，无页面横向溢出，每页一个h1。完整数据为 `.qa/refinement/production-responsive-checks.json`。
- 生产预览中的记忆阶段、移动导航/Escape、主题持久化与theme-color、筛选深链接/浏览器返回、代码复制均实际操作通过。代码禁止翻译标记生效，手机长文16px、代码12px，表格在自身容器滚动。
- 键盘跳转主要内容已验证：Enter后焦点进入 `main`。浏览器未发现error/warn。
- 独立视觉复核确认最终桌面、手机与浅色截图完整，无明显文字重叠、裁切或布局破损；旧版裁切截图不作为本轮证据。
- `git diff --check` 通过；未运行Lighthouse，不声明评分。

本轮没有增加运行时依赖，字体文件与许可证在本地提供。个人资料、项目阶段与实验边界继续保留。没有部署、公网发布、远程提交或服务器配置变更。
