---
title: 本地开发从Ngrok 转到Cloudflare Tunnel
date: 2026-02-19 10:49:34
tags:
---
# CloudFlare Tunnel 实现本地开发转外网域名

这是一个非常明智的选择。**Cloudflare Tunnel (即 `cloudflared`)** 是 Ngrok 的绝佳替代品，最大的优势在于：

1.  **完全免费**：没有带宽限制，也不限制连接时长。
2.  **更难被屏蔽**：如果你绑定自己的域名（Custom Domain），在 "Build" 系统（如 CI/CD 环境、防火墙）看来，这只是一个正常的 HTTPS 流量，不会像 `*.ngrok-free.app` 那样被当作潜在的垃圾域名直接拦截。

以下是 **下载、安装及配置 Cloudflared** 的完整教程，分为**快速模式**（临时）和**自定义域名模式**（推荐，防屏蔽）。

---

### 第一步：下载与安装 (Install)

根据你的操作系统选择安装方式：

#### macOS (使用 Homebrew)
```bash
brew install cloudflared
```

#### Windows (使用 Winget 或下载 exe)
打开 PowerShell 运行：
```powershell
winget install Cloudflare.cloudflared
```
*或者* 去 [Github Releases](https://github.com/cloudflare/cloudflared/releases) 下载 `.exe` 文件，改名为 `cloudflared.exe` 并放入环境变量路径中。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/zywfrank001/blog-assets@main/img/download_cloudflared.png" width="80%">
    <p>这里还可以写图片注脚</p>
</div>



#### Linux (Debian/Ubuntu)
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

---

### 第二步：使用 Cloudflared (两种方式)

#### 方式 A：快速隧道 (Quick Tunnel) - *无需账号*
类似于 Ngrok 的免费模式，它会给你分配一个 `*.trycloudflare.com` 的随机域名。

**命令：**
假设你的本地项目运行在 `8000` 端口：
```bash
cloudflared tunnel --url http://localhost:8000
```

**输出：**
终端会显示一个类似下面的链接：
`https://romantic-structure-123.trycloudflare.com`

> **注意**：虽然比 Ngrok 好用，但 `trycloudflare.com` 这个后缀也有可能被某些严格的 Build 系统屏蔽。如果这个也被屏蔽了，请务必使用 **方式 B**。

---

#### 方式 B：绑定自定义域名 (Authenticated Tunnel) - *强烈推荐* 🌟

这是解决屏蔽问题的终极方案。你需要一个已经托管在 Cloudflare 上的域名（例如 `example.com`）。

**1. 登录 Cloudflare**
在终端运行：
```bash
cloudflared tunnel login
```
*   这会弹出一个浏览器窗口。
*   选择你要使用的域名进行授权。
*   授权后，证书会下载到本地（通常在 `~/.cloudflared/cert.pem`）。

**2. 创建隧道 (Create Tunnel)**
给隧道起个名字，比如 `my-build-tunnel`：
```bash
cloudflared tunnel create my-build-tunnel
```
*   记下输出中的 **Tunnel ID** (例如 `uuid-1234-5678...`)。

**3. 配置 DNS 路由 (Route DNS)**
将你的子域名（例如 `dev.example.com`）指向这个隧道。
```bash
# 语法: cloudflared tunnel route dns <隧道名或ID> <你想用的域名>
cloudflared tunnel route dns my-build-tunnel dev.example.com
```
*   这样，访问 `https://dev.example.com` 就会走这个隧道。

**4. 启动隧道 (Run)**
将隧道连接到你本地的端口（例如 8000）：
```bash
cloudflared tunnel run --url http://localhost:8000 my-build-tunnel
```

---

### 为什么方式 B 能解决你的问题？

*   **白名单机制**：大多数 CI/CD 或 Build 系统不会屏蔽你自己购买的私有域名（如 `api.yourcompany.com`）。
*   **企业级信誉**：Cloudflare 的 IP 信誉通常比 Ngrok 的共享 IP 池要好。
*   **固定域名**：Ngrok 免费版每次重启域名都会变，导致你每次都要去改 Build 里的配置。使用 Cloudflare 方式 B，你的域名永远是 `dev.example.com`，不用改配置。

### 进阶提示 (配置文件)

如果你不想每次敲长命令，可以创建一个配置文件 `config.yml` (通常放在 `~/.cloudflared/` 下)：

```yaml
tunnel: <你的-Tunnel-ID>
credentials-file: /Users/你的用户名/.cloudflared/<你的-Tunnel-ID>.json

ingress:
  - hostname: dev.example.com
    service: http://localhost:8000
  - service: http_status:404
```

然后只需要运行：
```bash
cloudflared tunnel run my-build-tunnel
```

### Windows 命令行进阶
    如果避免每次都敲命令行，太麻烦，设置成bat 文件，新建一个bat 文件 startCloudFlared.bat

```bash

@echo off
title cloudflared-dev-proxy
cloudflared tunnel run my-build-tunnel

```

 再创建 一个 vps 文件 start-cloudflared.vbs

```bash
set ws=wscript.createobject("wscript.shell")
ws.run "start-cloudflared.bat",0

```
这样的效果是实现没有命令行出现，多清爽！

PS 当然 Linux 都是命令行，也就不用这些了。
