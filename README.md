## 项目介绍

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/IonRh/Cloudflare-BestIP/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/IonRh/Cloudflare-BestIP)](https://github.com/IonRh/Cloudflare-BestIP/releases)

**交流群聊：https://t.me/IonMagic**

Cloudflare BestIP 是一个高性能的 IP 优选自动化工具，使用 Go 语言重构开发。基于 [XIU2/CloudflareSpeedTest](https://github.com/XIU2/CloudflareSpeedTest) 测速引擎，提供智能 IP 优选和自动 DNS 更新服务。

### 🚀 核心特性

- **高效测速**: 基于 Go 语言的并发测速，支持自定义测速参数
- **多平台支持**: 支持 Cloudflare、阿里云、腾讯云 DNSPod、华为云 DNS 四大主流服务商
- **双栈支持**: IPv4 和 IPv6 双栈优选，支持混合模式 `ipv4&ipv6`
- **Web 展示**: 集成 Cloudflare Workers KV 存储，提供美观的 Web 界面展示
- **智能监控**: 定时健康检测，延迟/丢包超阈值自动更新
- **模块化架构**: 采用现代 Go 项目结构，代码清晰可维护
- **推送通知**: 支持 Telegram 等多种推送方式

**在线体验：[CloudFlare BestIP](http://bestip.badking.pp.ua/)** - 免安装免配置，一键体验

![BestIP 主界面](https://github.com/user-attachments/assets/5be11002-cf17-41af-a715-a1fe2c822134)


## ⚡ 快速开始

### 💾 一键安装（Linux/macOS）

```bash
curl -sL https://ghproxy.badking.pp.ua/https://raw.githubusercontent.com/IonRh/Cloudflare-BestIP/main/BestIP.sh | bash
```

### 🐳 Docker 运行

```bash
# 拉取并运行
docker run -d \
  --name BestIP \
  -e TZ="Asia/Shanghai" \
  -v "$(pwd)/BestIP:/root/" \
  kwxos/bestip:latest

# 查看日志
docker logs -f BestIP
```

### ⚙️ 配置和运行

1. **配置文件**: 根据需求修改 `config.json`（详见[配置说明](#-详细配置)）
2. **测试运行**: `./BestIP` 或 Windows 下直接双击 `BestIP.exe`
3. **后台运行**: `nohup ./BestIP > /dev/null 2>&1 &`

## 🛠️ 支持的功能

| 功能模块 | 描述 | 支持状态 |
|---------|------|---------|
| **IP 优选** | IPv4/IPv6 双栈测速优选 | ✅ 完整支持 |
| **DNS 更新** | Cloudflare / 阿里云 / DNSPod / 华为云 | ✅ 四大平台 |
| **健康监控** | 定时检测，异常自动更新 | ✅ 智能监控 |
| **Web 展示** | Cloudflare Workers KV 展示页 | ✅ 美观界面 |
| **消息推送** | Telegram 等多平台推送 | ✅ 实时通知 |
| **批量测试** | 并发测速，性能优异 | ✅ 高效处理 |
| **跨平台** | Linux / Windows / macOS | ✅ 全平台 |

## 📋 详细配置

配置文件 `config.json` 包含了所有功能的详细设置。以下是完整的配置说明：

### 🌍 基础配置

```json
{
  "IP_Type": "ipv4&ipv6",        // IP类型: ipv4 | ipv6 | ipv4&ipv6
  "IP_Number": 10,               // 更新的IP数量
  "IPv4_Url": "https://...",     // IPv4地址列表URL
  "Best_IPv4": "https://...",    // 最佳IPv4地址URL（可选）
  "IPv6_Url": "https://...",     // IPv6地址列表URL
  "Pushinfo": "https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=",
  "debug": false                 // 调试模式开关
}
```

**推送配置说明**：
- **Telegram**: `https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=`
- **其他服务**: 支持任何可通过URL参数传递消息的推送服务
- **留空**: 不进行推送通知

### ☁️ DNS 服务商配置

<details>
<summary><strong>🔸 Cloudflare 配置</strong></summary>

```json
"Cloudflare": {
  "Enabled": true,              // 是否启用
  "Domain": "example.com",      // 主域名  
  "SubDomainName": "cdn",       // 子域名
  "Email": "your@email.com",    // CF账户邮箱
  "ZoneID": "your_zone_id",     // 域名Zone ID
  "ApiKey": "your_api_key",     // CF API密钥
  "Proxy": false                // 是否启用CF代理
}
```
**获取方式**: [Cloudflare API 令牌](https://dash.cloudflare.com/profile/api-tokens)
</details>

<details>
<summary><strong>🔸 阿里云 DNS 配置</strong></summary>

```json
"Aliyun": {
  "Enabled": true,              // 是否启用
  "Domain": "example.com",      // 主域名
  "SubDomainName": "*.cf",      // 子域名（支持通配符）
  "TTL": "600",                 // DNS TTL值
  "AliDDNS_AK": "your_ak",      // AccessKey ID
  "AliDDNS_SK": "your_sk"       // AccessKey Secret
}
```
**获取方式**: [阿里云 AccessKey](https://ram.console.aliyun.com/profile/access-keys)
</details>

<details>
<summary><strong>🔸 腾讯云 DNSPod 配置</strong></summary>

```json
"Dnspod": {
  "Enabled": true,              // 是否启用
  "Domain": "example.com",      // 主域名
  "SubDomainName": "cdn",       // 子域名  
  "RecordLine": "默认",         // 解析线路
  "SecretId": "your_secret_id", // 密钥ID
  "SecretKey": "your_key"       // 密钥Key
}
```
**获取方式**: [DNSPod 密钥管理](https://console.dnspod.cn/account/token/apikey)
</details>

<details>
<summary><strong>🔸 华为云 DNS 配置</strong></summary>

```json
"HWDNS": {
  "Enabled": true,              // 是否启用
  "Domain": "example.com",      // 主域名
  "SubDomainName": "cdn",       // 子域名
  "HWDDNS_AK": "your_ak",       // 访问密钥ID
  "HWDDNS_SK": "your_sk"        // 访问密钥Key
}
```
**获取方式**: [华为云 访问密钥](https://console.huaweicloud.com/iam/?locale=zh-cn&region=cn-south-1#/mine/accessKey)
</details>


### 🚀 CloudflareST 测速配置

```json
"CloudflareST": {
  "Enabled": true,              // 是否启用CloudflareST测速
  "CFST_URL": "https://cf.xiu2.xyz/url",  // 测速目标URL
  "CFST_conf": "-t 2 -n 200 -dn 10 -dt 5 -tp 443 -tl 200 -tll 40 -tlr 0.2 -sl 1",  // 测速参数
  "ShowProgress": false         // 是否显示测速进度条
}
```

**详细参数说明**（基于 [XIU2/CloudflareSpeedTest](https://github.com/XIU2/CloudflareSpeedTest)）：

#### 🚀 测速性能参数
- **`-t 4`**: 延迟测速线程数 - 越多延迟测速越快，性能弱的设备请勿太高（默认 4，最多 1000）
- **`-n 200`**: 延迟测速次数 - 单个 IP 延迟测速的次数（默认 200 次）
- **`-dn 10`**: 下载测速数量 - 延迟测速排序后，从最低延迟起下载测速的数量（默认 10 个）
- **`-dt 10`**: 下载测速时间 - 单个 IP 下载测速最长时间，不能太短（默认 10 秒）

#### 🌐 网络连接参数
- **`-tp 443`**: 指定测速端口 - 延迟测速/下载测速使用的端口（默认 443）
- **`-url https://cf.xiu2.xyz/url`**: 指定测速地址 - 建议自建以保证可用性

#### 📊 过滤条件参数
- **`-tl 200`**: 平均延迟上限 - 只输出低于指定延迟的 IP（默认 9999ms）
- **`-tll 40`**: 平均延迟下限 - 只输出高于指定延迟的 IP（默认 0ms）
- **`-tlr 0.2`**: 丢包率上限 - 只输出低于指定丢包率的 IP，范围 0.00~1.00（默认 1.00）
- **`-sl 5`**: 下载速度下限 - 只输出高于指定下载速度的 IP（默认 0.00 MB/s）

#### 🔧 高级功能参数
- **`-httping`**: 启用HTTP测速模式 - 改为 HTTP 协议测速（默认 TCPing）
- **`-httping-code 200`**: 有效状态代码 - HTTPing 时的有效 HTTP 状态码（默认 200 301 302）
- **`-cfcolo HKG,NRT,LAX`**: 匹配指定地区 - IATA 机场码，仅 HTTPing 模式可用
- **`-dd`**: 禁用下载测速 - 结果按延迟排序（默认按速度排序）
- **`-allip`**: 测速全部IP - 对IP段中每个IP测速（默认每个/24段随机一个）
- **`-p 10`**: 显示结果数量 - 测速后显示的结果数量（默认 10 个）

**⚠️ 使用提示**：
- 性能弱的设备（如路由器）建议降低 `-t` 和 `-n` 参数
- HTTPing 模式可能被识别为网络扫描，建议降低并发数
- 自建测速地址可提高测速稳定性和准确性

### 🌐 Cloudflare KV 存储配置

```json
"CloudflareKV": {
  "Enabled": true,              // 是否启用KV存储
  "KVapiToken": "your_token",   // CF API Token
  "KVaccountID": "account_id",  // CF账户ID
  "KVnamespaceID": "namespace"  // KV命名空间ID
}
```

**设置步骤**：
1. 创建 [CF API Token](https://dash.cloudflare.com/profile/api-tokens)（权限：**Workers KV:编辑**）
2. 在 CF 控制台创建 KV 命名空间
3. 创建 Cloudflare Worker，粘贴本仓库的 `worker.js` 代码
4. 在 Worker 设置中绑定 KV 命名空间，变量名：`KV_NAMESPACE`

### 📊 智能监控配置

```json
"TestSetime": {
  "Enabled": true,                      // 是否启用定时监控
  "Test_domain": "cdn.example.com",    // 监控的域名
  "Test_latencyThreshold": "250",      // 延迟阈值(ms)
  "Test_packetLossThreshold": "10",    // 丢包率阈值(%)
  "Test_checkInterval": "15",          // 检查间隔(分钟)
  "Test_checknum": "10",               // 每次测试次数
  "Test_maxchecknum": "20",            // 强化测试最大次数
  "Test_maxTestInterval": "8"          // 强制测试间隔(小时)
},
```

**推送消息示例**：
```bash
# 监控消息
当前优选：ipv4 检测到问题IP
域名：cdn.example.com
IP 104.18.0.251 延迟超阈值: 354.60ms > 250.00ms
IP 104.18.1.205 延迟超阈值: 298.20ms > 250.00ms
```

## 🚀 使用指南

### 🖥️ 系统要求

- **操作系统**: Linux / Windows / macOS
- **网络要求**: 能够访问目标测速服务器
- **磁盘空间**: 最少 50MB 可用空间

### 🎯 常用场景

**场景一：定期优选IP**
```bash
# 添加到 crontab，每6小时执行一次
0 */6 * * * /path/to/BestIP > /dev/null 2>&1
```

**场景二：故障自动恢复**
```json
{
  "TestSetime": {
    "Enabled": true,
    "Test_checkInterval": "5",     # 5分钟检查一次
    "Test_latencyThreshold": "200" # 延迟超过200ms自动更新
  }
}
```

**场景三：多平台同步**
```json
{
  "Aliyun": { "Enabled": true },
  "Cloudflare": { "Enabled": true },
  "Dnspod": { "Enabled": true },
  "HWDNS": { "Enabled": true }
}
```

## 🌐 Web 展示界面

通过集成 Cloudflare Workers KV 存储，BestIP 提供了美观的 Web 界面来展示优选结果：

### 📊 主要展示内容

- **实时IP状态**: 当前优选IP列表及其性能数据
- **历史记录**: IP优选的历史趋势图表  
- **地理分布**: IP地址的全球分布可视化
- **性能对比**: 不同IP的延迟、速度对比
- **更新日志**: 自动记录每次优选更新

| 功能 | 描述 | 预览 |
|------|------|------|
| **实时状态** | 显示当前最优IP及性能指标 | ![主界面](https://github.com/user-attachments/assets/24a57a0e-42a1-4853-8268-3f545658fecc) |
| **数据分析** | IP性能趋势和统计图表 | ![数据分析](https://github.com/user-attachments/assets/7a94937a-3bde-4471-90da-7441017d1c6c) |
| **监控面板** | 健康状态和告警信息 | ![监控面板](https://github.com/user-attachments/assets/df0e6aa3-4cdd-458a-ba9e-7c640bcf56e8) |


### 常见问题

**Q: 测速失败或结果为空**
```bash
# 检查网络连接
curl -I https://cf.xiu2.xyz/url

# 检查配置文件格式
cat config.json | jq .

# 启用调试模式
./BestIP -debug=true
```

**Q: DNS更新失败**
```bash
# 验证API密钥
# 如：Cloudflare
curl -X GET "https://api.cloudflare.com/client/v4/zones" \
     -H "X-Auth-Email: your@email.com" \
     -H "X-Auth-Key: your_api_key"

# 检查域名Zone ID
dig your-domain.com NS
```

**Q: 监控不生效**
```json
{
  "debug": true,  // 开启调试看详细日志
  "TestSetime": {
    "Test_checkInterval": "1"  // 改为1分钟测试
  }
}
```

### 日志分析

```bash
# 实时查看日志
tail -f ./data/bestip.log

# 查看最近错误
grep "ERROR" ./data/bestip.log | tail -20

# 统计测速成功率
grep "测速完成" ./data/bestip.log | wc -l
```

## ⚠️ 重要注意事项

- **📊 性能考虑**:
  - 测速会产生网络流量，注意流量计费套餐限制
  - 不建议设置过高的检查频率，避免触发API限制
  - 大量IP测速时建议在业务低峰期进行

- **🌍 网络环境**:
  - 确保服务器能正常访问目标测速节点
  - 部分地区可能需要配置代理才能正常使用
  - 建议在稳定的网络环境下运行，避免因网络波动影响结果

- **⚖️ 合规使用**:
  - 遵守各平台API使用条款和频率限制
  - 不要用于商业目的的大规模自动化操作
  - 配置合理的请求间隔，做一个友好的API用户

## 🤝 社区与支持

### 📞 获取帮助

- **Telegram群组**: [https://t.me/IonMagic](https://t.me/IonMagic) - 实时交流讨论
- **GitHub Issues**: [提交Bug报告](https://github.com/IonRh/Cloudflare-BestIP/issues) - 问题反馈
- **GitHub Discussions**: [功能建议](https://github.com/IonRh/Cloudflare-BestIP/discussions) - 功能讨论

### 📋 路线图

- [ ] 支持更多DNS服务商（DNS.com、NameSilo等）
- [ ] 增加IPv6优选算法优化
- [ ] Web界面支持自定义主题
- [ ] 增加API接口供第三方集成
- [ ] 支持分布式多点测速
- [ ] 移动端适配和通知推送

## 📄 版权和许可

**BestIP for Cloudflare** © 2025 by [IonRh (AbBai)](https://github.com/IonRh)

- **开源仓库**: [https://github.com/IonRh/Cloudflare-BestIP](https://github.com/IonRh/Cloudflare-BestIP)
- **许可证**: MIT License
- **作者**: IonRh (阿布白)

### 🙏 致谢

- **[XIU2/CloudflareSpeedTest](https://github.com/XIU2/CloudflareSpeedTest)** - 提供了优秀的测速核心引擎
- **[Cloudflare](https://cloudflare.com)** - 提供了稳定可靠的CDN服务
- **社区贡献者** - 感谢所有提供反馈和建议的用户

---

### 💖 支持项目

如果这个项目对你有帮助，你可以通过以下方式支持：

- ⭐ 给项目点个星 Star
- 🐛 报告 Bug 和提出改进建议  
- 📢 向朋友推荐这个项目
- 💬 在社交媒体上分享

## 📈 Star History

<a href="https://github.com/IonRh/Cloudflare-BestIP/stargazers" target="_blank" style="display: block" align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://star-history.dera.page/svg?repos=IonRh/Cloudflare-BestIP&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://star-history.dera.page/svg?repos=IonRh/Cloudflare-BestIP&type=Timeline" />
    <img alt="Star History Chart" src="https://star-history.dera.page/svg?repos=IonRh/Cloudflare-BestIP&type=Timeline" />
  </picture>
</a>

---

> **免责声明**: 本工具仅供学习和个人使用，使用者需自行承担使用风险。请遵守相关法律法规和服务提供商的使用条款。
