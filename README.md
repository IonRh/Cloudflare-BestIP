```
    _    _     ____            _ 
   / \  | |__ | __ ) _   _  __(_)
  / _ \ | '_ \|  _ \| | | |/ _| |
 / ___ \| |_) | |_) | |_| | (_| |
/_/   \_\_.__/|____/ \__,_|\__,_|
```

## 项目介绍

交流群聊：https://t.me/IonMagic

Cloudflare BestIP 是一个高效的 IP 优选工具，通过Golang重构，借助 XIU2/CloudflareSpeedTest 的测速工具实现

支持 Cloudflare、阿里云和腾讯云 DNSPod 华为云DNS 的 DNS 记录更新，帮助用户优选IP。

本工具可以帮助用户找到最优的 IP 地址，并自动更新到您的域名解析记录中。

可访问[CloudFlare BestIP](http://bestip.badking.pp.ua/) 避免繁杂的部署体验

![image](https://github.com/user-attachments/assets/5be11002-cf17-41af-a715-a1fe2c822134)

## 主要功能

- 自动下载和测试 Cloudflare IP 速度
- 支持 IPv4 和 IPv6 两种模式
- 支持 Cloudflare、阿里云和腾讯云 DNSPod 华为云DNS 四种 DNS 服务商
- 可自定义测试参数和优选规则
- 支持 Cloudflare Workers KV 存储优选 IP 结果，并web展示
- 定时监控 DNS 解析状态，在延迟或丢包超过阈值时自动更新
- 支持消息推送通知（如 Telegram）

## Docker运行
```
docker run -d \
  --name BestIP \
  -e TZ="Asia/Shanghai" \
  -v "$(pwd)/BestIP:/root/" \
  kwxos/bestip:latest
```

## 配置文件参数详解

`config.json` 文件包含了所有配置参数，下面是详细的参数解释：

### 基本配置

- `IP_Type`: IP 优选类型，可选值：`ipv4`、`ipv6` 或 `ipv4&ipv6`
- `IP_Number`: 需要更新的 IP 数量
- `IPv4_Url`: IPv4 地址文件下载链接
- `Best_IPv4`: 最佳 IPv4 地址文件下载链接
  > 此文件，必须是访问网址就能直接获取IP的
- `IPv6_Url`: IPv6 地址文件下载链接
- `Pushinfo`: 消息推送 URL，支持 Telegram 等推送服务，为空则不推送
  > Pushinfo填写格式：`https://api.telegram.org/bot45xxxxxx:AAHxxxxxxxxxxxxxxxxx/sendMessage?chat_id=60xxxxxxxx&text=`

  > 不只是telegram，其他能够在连接后面添加信息的，都可推送

推送示例（未开单IP测试）:
```
当前优选：ipv4 将更新
延迟超过阈值: 域名 xxxxx.xxx.xxx 平均延迟 265.48ms 超过阈值 250.00ms
```

推送示例（开单IP测试）:
```
当前优选：ipv4 检测到问题IP
域名：xxxx.cf.badking.pp.ua
IP xxx.xx.xx.251 延迟超阈值: 54.60ms > 10.00ms
IP xxx.xx.xx.205 延迟超阈值: 54.20ms > 10.00ms
```

### 阿里云配置 (Aliyun)

- `Aliyun.Enabled`: 是否启用阿里云 DNS 更新，`true` 或 `false`
- `Aliyun.Domain`: 您的主域名
- `Aliyun.SubDomainName`: 子域名名称
- `Aliyun.TTL`: DNS 记录的 TTL 值（秒）
- `Aliyun.AliDDNS_AK`: 阿里云 AccessKey ID
- `Aliyun.AliDDNS_SK`: 阿里云 AccessKey Secret
  > AccessKey获取地址：https://ram.console.aliyun.com/profile/access-keys

### Cloudflare 配置

- `Cloudflare.Enabled`: 是否启用 Cloudflare DNS 更新，`true` 或 `false`
- `Cloudflare.Domain`: 您的主域名
- `Cloudflare.SubDomainName`: 子域名名称
- `Cloudflare.Email`: Cloudflare 账户邮箱
- `Cloudflare.ZoneID`: 域名的 Zone ID
- `Cloudflare.ApiKey`: Cloudflare API 密钥
- `Cloudflare.Proxy`: 是否启用 Cloudflare 代理，`true` 或 `false`
  > ApiKey获取地址：https://dash.cloudflare.com/profile/api-tokens

### DNSPod 配置

- `Dnspod.Enabled`: 是否启用腾讯云 DNSPod 更新，`true` 或 `false`
- `Dnspod.Domain`: 您的主域名
- `Dnspod.SubDomainName`: 子域名名称
- `Dnspod.RecordLine`: 记录线路，一般为 "默认"
- `Dnspod.SecretId`: 腾讯云 SecretId
- `Dnspod.SecretKey`: 腾讯云 SecretKey
  > SecretKey获取地址：https://console.dnspod.cn/account/token/apikey

### HWDNS 配置

- `HWDNS.Enabled`: 是否启用华为云DNS 更新，`true` 或 `false`
- `HWDNS.Domain`: 您的主域名
- `HWDNS.SubDomainName`: 子域名名称
- `HWDDNS_AK`: 华为云访问密钥ID
- `HWDDNS_SK`: 华为云访问密钥key
  > SecretKey获取地址：https://console.huaweicloud.com/iam/?locale=zh-cn&region=cn-south-1#/mine/accessKey


### CloudflareST 测速配置

- `CloudflareST.Enabled`: 是否启用 CloudflareST 测速，`true` 或 `false`
- `CloudflareST.CFST_URL`: 测速目标 URL
- `CloudflareST.CFST_conf`: CloudflareST 测速参数配置详情见https://github.com/XIU2/CloudflareSpeedTest

### Cloudflare KV 配置

- `CloudflareKV.Enabled`: 是否启用 Cloudflare Workers KV 存储，`true` 或 `false`
- `CloudflareKV.KVapiToken`: Cloudflare API Token
- `CloudflareKV.KVaccountID`: Cloudflare 账户 ID
- `CloudflareKV.KVnamespaceID`: KV 命名空间 ID
  > 如果不需要web展示，可不开启此配置 

  > API Token获取地址：https://dash.cloudflare.com/profile/api-tokens，需设置api使用区域为**KV编辑**

  > KV 命名空间 ID需在存储和数据库中创建KV，创建后即可看到ID

  > 然后创建Cloudflare worker，复制本仓库中的worker.js代码，粘贴进worker中

  > 然后点击worker的设置，绑定KV 命名空间，名称：`KV_NAMESPACE`,值为你所创建的kv库的名

### 测试监控配置

- `TestSetime.Enabled`: 是否启用定时监控，`true` 或 `false`
- `TestOnlyIP`: 是否启用单IP测试监控（更加准确），`true` 或 `false`
- `TestSetime.Test_domain`: 需要监控的域名（你推送到指定平台的指定域名）
- `TestSetime.Test_latencyThreshold`: 延迟阈值（毫秒）
- `TestSetime.Test_packetLossThreshold`: 丢包率阈值（百分比）
- `TestSetime.Test_checkInterval`: 检查间隔时间（分钟）
- `TestSetime.Test_checknum`: 每次每个IP的测试的次数
- `TestSetime.Test_maxchecknum`: 强化测试的每个IP的最大测试次数
- `TestSetime.Test_maxTestInterval`: 强制强化测试的时间间隔（小时）

### 调试配置

- `debug`: 是否启用调试模式，启用后会输出更详细的日志信息

## 如果有不清楚的地方，欢迎issues提问

## 使用方法

1. 执行：

```
curl -sL https://ghproxy.badking.pp.ua/https://raw.githubusercontent.com/IonRh/Cloudflare-BestIP/main/BestIP.sh | bash
```

2. 根据自己的需求修改 `config.json` 配置文件
3. 测试可执行文件 `./BestIP`
4. 后台运行可执行文件 `nohup ./BestIP > /dev/null 2>&1 &`

2. windwos运行

下载[releases](https://github.com/IonRh/Cloudflare-BestIP/releases) 中的BestIP-Windows.zip文件

配置好`config.json`

点击`BestIP.exe`文件,即可

## 展示页面示例

![image](https://github.com/user-attachments/assets/24a57a0e-42a1-4853-8268-3f545658fecc)

## 展示页面示例

![image](https://github.com/user-attachments/assets/7a94937a-3bde-4471-90da-7441017d1c6c)

![image](https://github.com/user-attachments/assets/df0e6aa3-4cdd-458a-ba9e-7c640bcf56e8)


小广告·[聚合流量号卡平台](https://haoka.loadke.tech/) 500余卡，选出卡中实惠

## 注意事项

- 请确保您的 API 密钥等敏感信息安全，不要泄露给他人
- 测速时可能会消耗一定的网络流量，请注意您的网络计划
- 本工具基于 XIU2/CloudflareSpeedTest，需要下载其测速组件才能正常工作
- 更新频率不建议设置过高，以免触发 API 调用限制
- 如果有任何bug问题，欢迎提issue，感谢支持

## 版权和许可

BestIP for CF-Ali-DNSpod 由 AbBai（阿布白）开发
源码仓库：[https://github.com/IonRh/Cloudflare-BestIP](https://github.com/IonRh/Cloudflare-BestIP)

感谢XIU2给大家提供的工具。 https://github.com/XIU2/CloudflareSpeedTest

<a href="https://github.com/IonRh/Cloudflare-BestIP/stargazers" target="_blank" style="display: block" align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=IonRh/Cloudflare-BestIP&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=IonRh/Cloudflare-BestIP&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=IonRh/Cloudflare-BestIP&type=Timeline" />
  </picture>
</a>
