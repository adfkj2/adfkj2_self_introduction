# GitHub Actions 自动部署

仓库：<https://github.com/adfkj2/adfkj2_self_introduction>。正式网站：<https://adfkj2.cloud>，服务器为 `8.156.74.43` / Ubuntu 24.04。

## 每次发布会发生什么

- 向 `main` 提交代码，或在 `main` 手动运行 **Build and deploy personal site**：安装锁定的依赖，检查源码，测试部署脚本，构建并检查页面，然后通过 SSH 发布。
- 向 `main` 发起 PR：运行相同检查与构建，部署步骤跳过。
- 构建显式设置 `PUBLIC_SITE_URL=https://adfkj2.cloud`，不依赖未提交的本地 `.env`。
- 服务器只接收 `dist/` 和发布脚本。在独立目录解压、核对版本，再原子切换 `current` 链接。Nginx 无需重载，已有 HTTPS 配置继续使用。
- 切换后通过本机 Nginx 的 HTTPS 首页和提交版本标记检查发布结果；失败自动恢复上一个链接，工作流报错。旧版本保留，便于回滚。

配置文件：`.github/workflows/deploy.yml`、`scripts/deploy-via-ssh.sh`、`ops/deploy-release.sh`。

## 1. 在本机生成专用部署密钥

在 PowerShell 执行：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.ssh" | Out-Null
ssh-keygen -t ed25519 -C 'github-actions-personal-site' -f "$env:USERPROFILE\.ssh\personal-site-actions"
```

遇到两次 passphrase 提示时都直接回车，这把专用密钥供无人值守部署使用。若同名文件已存在，不要覆盖，使用另一名称并在后续命令中保持一致。

查看 `.pub` 公钥，下一步只将这一行添加到服务器：

```powershell
Get-Content "$env:USERPROFILE\.ssh\personal-site-actions.pub"
```

## 2. 在服务器建立 deploy 账号

以你目前能登录服务器的管理员账号，在 Ubuntu 终端执行：

```bash
id deploy >/dev/null 2>&1 || sudo adduser --disabled-password --gecos '' deploy

sudo install -d -o deploy -g deploy -m 755 /var/www/personal-site
sudo install -d -o deploy -g deploy -m 755 /var/www/personal-site/releases
sudo install -d -o deploy -g deploy -m 700 /var/www/personal-site/incoming
sudo install -d -o deploy -g deploy -m 700 /home/deploy/.ssh

sudo touch /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo nano /home/deploy/.ssh/authorized_keys
```

在文件末尾添加刚才的完整公钥，行首加上 `restrict `。一行的结构是 `restrict ssh-ed25519 公钥内容 github-actions-personal-site`。保存退出。不需要给 `deploy` 配置 sudo 权限。

确认当前站点入口确实是原来的版本链接：

```bash
readlink -f /var/www/personal-site/current
test -L /var/www/personal-site/current && echo 'current is a symlink'
curl -I --resolve adfkj2.cloud:443:127.0.0.1 https://adfkj2.cloud/
```

第一条应指向 `/var/www/personal-site/releases/` 下的已有版本；第二条应输出提示；第三条应成功响应。如果当前站点是直接放在 `current` 实体目录中，先迁移到版本目录并恢复链接结构，工作流会拒绝替换实体目录。

## 3. 保存服务器身份信息

在服务器终端执行：

```bash
awk '{print "8.156.74.43 " $1 " " $2}' /etc/ssh/ssh_host_ed25519_key.pub
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

第一条输出用于下一步的 `SSH_KNOWN_HOSTS`。这是服务器公钥，来自你已登录的服务器。第二条输出指纹，可用于核对新连接的提示。

在本机测试专用账号：

```powershell
ssh -i "$env:USERPROFILE\.ssh\personal-site-actions" -o IdentitiesOnly=yes deploy@8.156.74.43 'test -w /var/www/personal-site && echo deploy-ready'
```

确认服务器指纹后，应该输出 `deploy-ready`。如果超时，检查 ECS 安全组的 SSH 端口是否也允许 GitHub 托管 runner 连接；只允许本机 IP 的规则不能用于 GitHub 自动部署。

## 4. 在 GitHub 添加两个 Secrets

打开 [仓库的 Actions Secrets 设置](https://github.com/adfkj2/adfkj2_self_introduction/settings/secrets/actions)，依次添加：

| Secret 名称       | 内容                                                          |
| ----------------- | ------------------------------------------------------------- |
| `SSH_PRIVATE_KEY` | 第 1 步生成的私钥全文，包含 BEGIN / END 行，文件名没有 `.pub` |
| `SSH_KNOWN_HOSTS` | 第 3 步第一条命令输出的完整一行                               |

私钥直接填入 GitHub Secret，不提交到仓库。可以在自己的 PowerShell 将它复制到剪贴板，再粘贴到 GitHub：

```powershell
Get-Content -Raw "$env:USERPROFILE\.ssh\personal-site-actions" | Set-Clipboard
```

默认连接地址为 `8.156.74.43`，用户名为 `deploy`，SSH 端口为 `22`。需要更改时，在同一个设置区域的 **Variables** 页添加 `DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_PORT`。非 22 端口的 known_hosts 地址格式也要对应改成 `[8.156.74.43]:端口`。

## 5. 将网站代码合入 main 并首次运行

本地已配置 `origin` 为指定仓库。远程原有 GitHub 入门教程，本地网站使用独立的 Astro 初始提交，两者没有共同历史。首次同步时保留远程历史和已有文件，不使用强制推送。

如果代码通过 PR 提交，先等待构建检查通过，完成上面的服务器和 Secrets 设置后再合并。合入 `main` 会自动部署。

也可以在仓库 **Actions → Build and deploy personal site → Run workflow**，选择 `main` 手动运行。手动重跑会生成新的发布目录，不覆盖旧版本。

成功后查看 <https://adfkj2.cloud/deploy-version.txt>，内容应是这次发布的完整 Git 提交 SHA。浏览器再确认首页、项目页、文章页和备案号。

只有 GitHub 中真实运行成功，才代表自动部署已经启用；仅保存工作流文件不会配置服务器账号或仓库 Secrets。

## 常见失败与回滚

- `Add the SSH_PRIVATE_KEY/SSH_KNOWN_HOSTS repository secret`：缺少对应 Secret。
- `Host key verification failed`：核对服务器公钥、IP 和端口，不关闭主机身份校验。
- `Permission denied (publickey)`：核对专用账号、公钥和私钥是否配对，以及 `.ssh` / `authorized_keys` 权限。
- SSH 超时：检查服务器 SSH 端口、ECS 安全组和系统防火墙。
- 提示 `current must ...`：当前 Nginx 根目录必须使用 `/var/www/personal-site/current` 这个链接，目标位于 `releases/`。
- HTTPS 检查失败：新版本自动回退；检查 Nginx 根目录、443 监听、证书和工作流日志。脚本从本机回环地址验证证书，不依赖服务器通过公网 IP 访问自己。

部署成功日志会给出上一版本的完整路径。需要手动回滚时，在服务器用真实的旧版本目录替换下面的 `旧版本目录名`：

```bash
sudo -u deploy bash -c '
  set -e
  root=/var/www/personal-site
  previous="$root/releases/旧版本目录名"
  test -s "$previous/index.html"
  exec 9> "$root/.deploy.lock"
  flock -w 60 9
  ln -sfnT "$previous" "$root/.manual-rollback"
  mv -Tf "$root/.manual-rollback" "$root/current"
'
```

历史版本不会被脚本自动删除。确认不再回滚后，可自行清理不用的版本目录，保留 `current` 指向的版本与上一版。

参考：[GitHub Actions Secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)、[工作流并发控制](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)、[Astro 部署](https://docs.astro.build/en/guides/deploy/)。
