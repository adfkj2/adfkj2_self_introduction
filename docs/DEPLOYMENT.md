# 备案完成后的静态部署

网站已由用户在 Ubuntu 24.04 / 阿里云 ECS 上部署上线。正式域名为 `adfkj2.cloud`，公网 IP 为 `8.156.74.43`，ICP备案号为 `蜀ICP备2026064847号-1`。以下保留手动部署流程；日常自动发布请按 [GitHub Actions 配置说明](GITHUB_ACTIONS.md) 完成一次性设置。

1. 在 `src/data/site.ts` 填写备案号、可公开的联系方式与真实简历路径。确认项目状态和正式文章。
2. 确认 `PUBLIC_SITE_URL=https://adfkj2.cloud`，执行 `npm run check`、`npm run build`、`npm run verify`。构建在本机或 CI 完成即可，2 核 2G ECS 不需要运行 Node 服务。
3. 将 `dist/` 的内容上传到独立版本目录，例如 `/var/www/personal-site/releases/日期编号/`。只上传静态产物，不上传 `.env`、源码、node_modules 或本地实验数据。
4. 备份原配置，安装 Nginx，参考本项目 `ops/nginx.conf.example` 创建独立站点配置。示例域名已填写 `adfkj2.cloud`，确认目录后将 `current` 指向新版本。
5. 使用 `nginx -t` 检查配置后再重载。确认域名解析、HTTPS 证书、80/443 入站规则和备案相关要求；仅在获得明确授权后处理服务器配置。
6. 检查首页、四个项目页、Writing、About、404、RSS、Sitemap、robots、分享图和简历。核对 Canonical 与 RSS 不再出现 localhost。
7. 保留上一版本目录。如需回滚，把 `current` 链接指回上一版本，然后重新验证。

## HTTPS 与缓存

配置示例只展示 HTTP 静态站点结构。实际部署需要给 `adfkj2.cloud` 签发证书，再由 Nginx 提供 HTTPS，并将 HTTP 重定向到 HTTPS。证书工具与阿里云规则请在部署当天参考对应官方文档；当前配置并不表示证书或 DNS 已就绪。

`/_astro/` 中带内容 hash 的资源可缓存一年。HTML、RSS 与 robots 使用短缓存或重新验证，避免文章或 SEO 配置更新后迟迟不生效。磁盘保留合理数量的历史版本即可，运行时主要消耗来自 Nginx。

## 发布前仍需补齐

- 希望公开的简历 PDF。
- 正式技术文章，以及可公开的项目三仓库。
- 项目实验的具体版本、环境、命令与原始证据。
- 真实生产 URL 下的 Lighthouse 与链接检查（本地 PNG 分享图已生成）。
