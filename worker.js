addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // 获取请求的 URL 路径
    const url = new URL(request.url);
    const path = url.pathname;

    // 从 KV 获取数据（假设 KV 命名空间绑定为 KV_NAMESPACE）
    const ipv6Data = await KV_NAMESPACE.get('ipv6');
    const ipv4Data = await KV_NAMESPACE.get('ipv4');
    const ipv6time = await KV_NAMESPACE.get('ipv6time');
    const ipv4time = await KV_NAMESPACE.get('ipv4time');
    
    // 检查数据是否存在
    if (!ipv6Data && !ipv4Data) {
      return new Response('错误：未找到键 "ipv6" 或 "ipv4" 的数据', { 
        status: 404,
        headers: { 'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0' }
      });
    }

    // 处理 /bestipv4 路径 - 返回纯文本的 IPv4 地址列表
    if (path === '/bestipv4') {
      if (!ipv4Data) {
        return new Response('错误：未找到 IPv4 数据', { 
          status: 404,
          headers: { 'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0' }
        });
      }
      
      // 解析数据并提取所有 IP 地址
      const rows = ipv4Data.split('&').map(row => row.split(','));
      const ipList = rows.map(row => row[0]).join('\n');
      
      return new Response(ipList, {
        headers: { 
          'Content-Type': 'text/plain',
          'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0'
        },
        status: 200
      });
    }
    
    // 处理 /bestipv6 路径 - 返回纯文本的 IPv6 地址列表
    if (path === '/bestipv6') {
      if (!ipv6Data) {
        return new Response('错误：未找到 IPv6 数据', { 
          status: 404,
          headers: { 'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0' }
        });
      }
      
      // 解析数据并提取所有 IP 地址
      const rows = ipv6Data.split('&').map(row => row.split(','));
      const ipList = rows.map(row => row[0]).join('\n');
      
      return new Response(ipList, {
        headers: { 
          'Content-Type': 'text/plain',
          'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0'
        },
        status: 200
      });
    }

    // 解析 IPv6 数据
    let ipv6TableRows = '';
    if (ipv6Data) {
      const rows = ipv6Data.split('&').map(row => row.split(','));
      for (const row of rows) {
        if (row.length >= 6) { // 兼容6、7、8字段格式
          // 根据 IP 地址检测数据中心
          const dataCenterInfo = detectDataCenter(row[0]);
          // 检测是否为 Cloudflare 原生 IP
          const ipTypeInfo = isCloudflareIP(row[0]);
          
          // 根据字段数量确定各字段位置
          let regionCode, updateTime;
          if (row.length === 8) {
            // 8字段格式：IP,已发送,已接收,丢包率,平均延迟,下载速度,地区码,更新时间
            regionCode = row[6];
            updateTime = row[7];
          } else if (row.length === 7) {
            // 7字段格式：IP,已发送,已接收,丢包率,平均延迟,下载速度,更新时间
            regionCode = '未知';
            updateTime = row[6];
          } else {
            // 6字段格式：IP,已发送,已接收,丢包率,平均延迟,下载速度
            regionCode = '未知';
            updateTime = '未知';
          }
          
          ipv6TableRows += `
            <tr class="transition-colors duration-200 hover:bg-gray-50 border-b border-gray-200">
              <td class="py-2 px-3 font-mono text-xs">${row[0]}</td>
              <td class="py-2 px-3"><span class="px-2 py-1 rounded-full text-xs ${ipTypeInfo.isNative ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${ipTypeInfo.text}</span></td>
              <td class="py-2 px-3">${dataCenterInfo}</td>
              <td class="py-2 px-3"><span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">${regionCode}</span></td>
              <td class="py-2 px-3"><span class="px-2 py-0.5 rounded-full text-xs ${parseFloat(row[3]) > 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">${row[3]}%</span></td>
              <td class="py-2 px-3">${row[4]} <span class="text-gray-500 text-xs">ms</span></td>
              <td class="py-2 px-3"><span class="font-medium ${parseFloat(row[5]) > 10 ? 'text-green-600' : parseFloat(row[5]) > 5 ? 'text-blue-600' : 'text-gray-600'}">${row[5]}</span> <span class="text-gray-500 text-xs">MB/s</span></td>
              <td class="py-2 px-3"><span class="text-xs text-gray-500">${updateTime || '未知'}</span></td>
            </tr>
          `;
        }
      }
    }

    // 解析 IPv4 数据
    let ipv4TableRows = '';
    if (ipv4Data) {
      const rows = ipv4Data.split('&').map(row => row.split(','));
      for (const row of rows) {
        if (row.length >= 6) { // 兼容6、7、8字段格式
          // 根据 IP 地址检测数据中心
          const dataCenterInfo = detectDataCenter(row[0]);
          // 检测是否为 Cloudflare 原生 IP
          const ipTypeInfo = isCloudflareIP(row[0]);
          
          // 根据字段数量确定各字段位置
          let regionCode, updateTime;
          if (row.length === 8) {
            // 8字段格式：IP,已发送,已接收,丢包率,平均延迟,下载速度,地区码,更新时间
            regionCode = row[6];
            updateTime = row[7];
          } else if (row.length === 7) {
            // 7字段格式：IP,已发送,已接收,丢包率,平均延迟,下载速度,更新时间
            regionCode = '未知';
            updateTime = row[6];
          } else {
            // 6字段格式：IP,已发送,已接收,丢包率,平均延迟,下载速度
            regionCode = '未知';
            updateTime = '未知';
          }
          
          ipv4TableRows += `
            <tr class="transition-colors duration-200 hover:bg-gray-50 border-b border-gray-200">
              <td class="py-2 px-3 font-mono text-xs">${row[0]}</td>
              <td class="py-2 px-3"><span class="px-2 py-1 rounded-full text-xs ${ipTypeInfo.isNative ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${ipTypeInfo.text}</span></td>
              <td class="py-2 px-3">${dataCenterInfo}</td>
              <td class="py-2 px-3"><span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">${regionCode}</span></td>
              <td class="py-2 px-3"><span class="px-2 py-0.5 rounded-full text-xs ${parseFloat(row[3]) > 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">${row[3]}%</span></td>
              <td class="py-2 px-3">${row[4]} <span class="text-gray-500 text-xs">ms</span></td>
              <td class="py-2 px-3"><span class="font-medium ${parseFloat(row[5]) > 10 ? 'text-green-600' : parseFloat(row[5]) > 5 ? 'text-blue-600' : 'text-gray-600'}">${row[5]}</span> <span class="text-gray-500 text-xs">MB/s</span></td>
              <td class="py-2 px-3"><span class="text-xs text-gray-500">${updateTime || '未知'}</span></td>
            </tr>
          `;
        }
      }
    }

    // 检测是否为 Cloudflare 原生 IP 的函数
    function isCloudflareIP(ip) {
      // Cloudflare 官方 IP 范围列表
      const cloudflareRanges = [
        // IPv4 CIDR 块
        { start: '103.21.244.0', end: '103.21.247.255' },
        { start: '103.22.200.0', end: '103.22.203.255' },
        { start: '103.31.4.0', end: '103.31.7.255' },
        { start: '104.16.0.0', end: '104.31.255.255' },
        { start: '108.162.192.0', end: '108.162.255.255' },
        { start: '131.0.72.0', end: '131.0.75.255' },
        { start: '141.101.64.0', end: '141.101.127.255' },
        { start: '162.158.0.0', end: '162.159.255.255' },
        { start: '172.64.0.0', end: '172.71.255.255' },
        { start: '173.245.48.0', end: '173.245.63.255' },
        { start: '188.114.96.0', end: '188.114.127.255' },
        { start: '190.93.240.0', end: '190.93.255.255' },
        { start: '197.234.240.0', end: '197.234.243.255' },
        { start: '198.41.128.0', end: '198.41.255.255' }
      ];
      
      // IPv6 前缀检查
      if (ip.includes(':')) {
        // Cloudflare 官方 IPv6 前缀列表
        const cf_ipv6_prefixes = [
          '2400:cb00:', '2405:8100:', '2405:b500:', '2606:4700:', 
          '2803:f800:', '2a06:98c0:', '2a06:98c1:', '2c0f:f248:'
        ];
        
        // 检查 IP 是否以任一前缀开头
        const isCloudflareNative = cf_ipv6_prefixes.some(prefix => ip.startsWith(prefix));
        
        return {
          isNative: isCloudflareNative,
          text: isCloudflareNative ? 'CF 原生' : '代理节点'
        };
      }
      
      // IPv4 检查
      const ipNum = ipToNum(ip);
      for (const range of cloudflareRanges) {
        const startNum = ipToNum(range.start);
        const endNum = ipToNum(range.end);
        if (ipNum >= startNum && ipNum <= endNum) {
          return {
            isNative: true,
            text: 'CF 原生'
          };
        }
      }
      
      return {
        isNative: false,
        text: '代理节点'
      };
    }
    
    // 辅助函数：将 IP 地址转换为数值以便于比较
    function ipToNum(ip) {
      const parts = ip.split('.');
      return (parseInt(parts[0], 10) << 24) |
             (parseInt(parts[1], 10) << 16) |
             (parseInt(parts[2], 10) << 8) |
              parseInt(parts[3], 10);
    }

    // 添加检测数据中心的函数
    function detectDataCenter(ip) {
      // 简化的 CloudFlare 数据中心 IP 范围映射（仅保留区域级别）
      const dataCenterRegions = [
        { name: "北美地区", ranges: [
          { start: '103.21.244.0', end: '103.21.247.255' },
          { start: '103.22.200.0', end: '103.22.203.255' },
          { start: '104.16.0.0', end: '104.31.255.255' },
          { start: '108.162.192.0', end: '108.162.255.255' },
          { start: '131.0.72.0', end: '131.0.75.255' },
          { start: '141.101.64.0', end: '141.101.127.255' },
          { start: '162.158.0.0', end: '162.158.127.255' },
          { start: '172.64.0.0', end: '172.65.255.255' },
          { start: '173.245.48.0', end: '173.245.63.255' },
          { start: '198.41.192.0', end: '198.41.255.255' }
        ]},
        { name: "欧洲地区", ranges: [
          { start: '162.158.128.0', end: '162.158.255.255' },
          { start: '172.66.0.0', end: '172.67.255.255' },
          { start: '188.114.96.0', end: '188.114.127.255' },
          { start: '190.93.240.0', end: '190.93.255.255' }
        ]},
        { name: "亚太地区", ranges: [
          { start: '103.31.4.0', end: '103.31.7.255' },
          { start: '162.158.158.0', end: '162.158.159.255' },
          { start: '172.68.0.0', end: '172.69.255.255' },
          { start: '203.0.113.0', end: '203.0.113.255' }
        ]},
        { name: "大洋洲", ranges: [
          { start: '104.16.96.0', end: '104.16.127.255' },
          { start: '172.64.192.0', end: '172.64.223.255' }
        ]},
        { name: "非洲地区", ranges: [
          { start: '172.64.104.0', end: '172.64.111.255' },
          { start: '162.158.38.0', end: '162.158.39.255' }
        ]},
        { name: "南美地区", ranges: [
          { start: '172.64.16.0', end: '172.64.31.255' }
        ]}
      ];
      
      // IPv6 数据中心处理（仅区域级别）
      if (ip.includes(':')) {
        // 北美地区
        if (ip.startsWith('2606:4700:')) return '北美地区';
        // 欧洲地区
        if (ip.startsWith('2a06:98c0:')) return '欧洲地区';
        // 亚太地区
        if (ip.startsWith('2c0f:f248:')) return '亚太地区';
        // 大洋洲
        if (ip.startsWith('2400:cb00:')) return '大洋洲';
        // 南美地区
        if (ip.startsWith('2803:f800:')) return '南美地区';
        // 非洲地区
        if (ip.startsWith('2a06:98c1:')) return '非洲地区';
        
        // 其它 Cloudflare IPv6 前缀
        if (ip.startsWith('2405:8100:') || ip.startsWith('2405:b500:')) return '亚太地区';
        
        return '未知地区';
      }
      
      // IPv4 处理
      const ipNum = ipToNum(ip);
      for (const region of dataCenterRegions) {
        for (const range of region.ranges) {
          const startNum = ipToNum(range.start);
          const endNum = ipToNum(range.end);
          if (ipNum >= startNum && ipNum <= endNum) {
            return region.name;
          }
        }
      }
      
      // 一些特定 IP 段的简化处理
      if (ip.startsWith('1.0.0.') || ip.startsWith('1.1.1.')) return 'Cloudflare DNS';
      if (ip.startsWith('104.16.') || ip.startsWith('104.17.')) return '北美地区';
      if (ip.startsWith('104.18.') || ip.startsWith('104.19.')) return '亚太地区';
      if (ip.startsWith('104.20.') || ip.startsWith('104.21.')) return '欧洲地区';
      if (ip.startsWith('104.22.') || ip.startsWith('104.23.')) return '亚太地区';
      if (ip.startsWith('104.24.') || ip.startsWith('104.25.')) return '北美地区';
      if (ip.startsWith('162.158.')) return '全球多区域';
      if (ip.startsWith('172.64.') || ip.startsWith('172.65.')) return '全球多区域';
      
      // 无法识别的 IP 数据中心
      return '未知地区';
    }

    // 生成 HTML 页面
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CloudFlare BestIP</title>
      <link rel="shortcut icon" href="https://blog.loadke.tech/assets/img/favico1n.png">
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://jsdelivr.badking.pp.ua/gh/IonRh/Cloudflare-BestIP@main/static/styles.css">
    </head>
    <body>
      <div class="container">
        <!-- 标题居中 -->
        <div class="text-center mb-6">
          <h1 class="text-xl font-medium text-gray-900">CloudFlare BestIP</h1>
        </div>
        
        <!-- 使用说明和注意事项 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="info-card">
            <h2 class="info-title">
              <span class="icon bg-blue-500 text-white text-xs">使</span>
              使用说明
            </h2>
            <p class="text-sm text-gray-600">
              本站维护公共CNAME域名: <span class="code-block">*.cf.badking.pp.ua</span>，支持 IPv4 与 IPv6。
            </p>
            <p class="text-sm text-gray-600 mt-2">
              可自定义 CNAME 地址来避免劫持蜘蛛情况的发生。
            </p>
            <p class="text-sm text-gray-600 mt-2">
              例如: 自定义<span class="code-block">xxxxx.cf.badking.pp.ua</span>
            </p>
            <p class="text-sm text-gray-600 mt-2">
              优选IP列表：<a class="underline hover:text-blue-700" href="https://bestip.badking.pp.ua/bestipv4" target="_blank">IPv4</a><span>   </span><a class="underline hover:text-blue-700" href="https://bestip.badking.pp.ua/bestipv6" target="_blank">IPv6</a>
            </p>
          </div>
          
          <div class="info-card">
            <h2 class="info-title">
              <span class="icon bg-yellow-500 text-white text-xs">注</span>
              注意事项
            </h2>
            <p class="text-sm text-gray-600">
              提供Best CloudFlare 节点 IP，每10分钟检测一次，数据波动较大时更新。
            </p>
            <p class="text-sm text-gray-600 mt-2">
              当检测无变化时，24小时强制刷新解析。本站不提供任何CDN服务。
            </p>
            <p class="text-sm text-gray-600 mt-2">
              严禁用户从事任何违法犯罪活动或被他人网络信息犯罪行为!!!
            </p>
            <p class="text-sm text-gray-600 mt-2">
              本站使用项目：<a href="https://github.com/kwxos/CF-Ali-DNSpod-ddns-IP" class="underline hover:text-blue-700" target="_blank">BestIP for CF-Ali-DNSpod</a>
            </p>
          </div>
        </div>
        
        <!-- 标签切换 + 更新时间（左对齐，时间在右侧） -->
        <div class="flex items-center mb-6">
          <div class="tab-container">
            <button onclick="showTab('ipv4')" class="tab-btn active" id="ipv4-tab">IPv4</button>
            <button onclick="showTab('ipv6')" class="tab-btn" id="ipv6-tab">IPv6</button>
            <button onclick="showTab('others')" class="tab-btn" id="others-tab">其他</button>
          </div>
          <div class="time-badge" id="update-time-display">
            更新时间: <span id="update-time">${ipv4time || '未知'}</span>
          </div>
        </div>
    
        <!-- 表格卡片 -->
        <div class="card mb-6">
          <!-- IPv4 表格 -->
          <div id="ipv4-content" class="tab-content">
            ${ipv4TableRows ? `
              <div class="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>IP 地址</th>
                      <th>IP 类型</th>
                      <th>数据中心</th>
                      <th>地区码</th>
                      <th>丢包率</th>
                      <th>平均延迟</th>
                      <th>下载速度</th>
                      <th>更新时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ipv4Data.split('&').map(row => {
                      const cols = row.split(',');
                      if (cols.length >= 6) { // 兼容6、7、8字段
                        const dataCenterInfo = detectDataCenter(cols[0]);
                        const ipTypeInfo = isCloudflareIP(cols[0]);
                        
                        // 根据字段数量确定各字段位置
                        let regionCode, updateTime;
                        if (cols.length === 8) {
                          regionCode = cols[6];
                          updateTime = cols[7];
                        } else if (cols.length === 7) {
                          regionCode = '未知';
                          updateTime = cols[6];
                        } else {
                          regionCode = '未知';
                          updateTime = '未知';
                        }
                        
                        return `
                          <tr>
                            <td class="font-mono">${cols[0]}</td>
                            <td><span class="px-2 py-1 rounded-full text-xs ${ipTypeInfo.isNative ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${ipTypeInfo.text}</span></td>
                            <td><span class="px-2 py-1 rounded-full text-xs ${ipTypeInfo.isNative ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${dataCenterInfo}</span></td>
                            <td><span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">${regionCode}</span></td>
                            <td>
                              <span class="badge ${parseFloat(cols[3]) > 5 ? 'badge-error' : 'badge-success'}">${cols[3]}%</span>
                            </td>
                            <td>${cols[4]} <span class="text-gray-400">ms</span></td>
                            <td>
                              <span class="${parseFloat(cols[5]) > 10 ? 'text-green-600' : parseFloat(cols[5]) > 5 ? 'text-blue-600' : 'text-gray-600'} font-medium">${cols[5]}</span>
                              <span class="text-gray-400">MB/s</span>
                            </td>
                            <td>
                              <span class="text-xs text-gray-400">${updateTime || '未知'}</span>
                            </td>
                          </tr>
                        `;
                      }
                      return '';
                    }).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<div class="py-16 text-center text-gray-500"><svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p>暂无 IPv4 数据</p></div>'}
          </div>
    
          <!-- IPv6 表格 -->
          <div id="ipv6-content" class="tab-content hidden">
            ${ipv6TableRows ? `
              <div class="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>IP 地址</th>
                      <th>IP 类型</th>
                      <th>数据中心</th>
                      <th>地区码</th>
                      <th>丢包率</th>
                      <th>平均延迟</th>
                      <th>下载速度</th>
                      <th>更新时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ipv6Data.split('&').map(row => {
                      const cols = row.split(',');
                      if (cols.length >= 6) { // 兼容6、7、8字段
                        const dataCenterInfo = detectDataCenter(cols[0]);
                        const ipTypeInfo = isCloudflareIP(cols[0]);
                        
                        // 根据字段数量确定各字段位置
                        let regionCode, updateTime;
                        if (cols.length === 8) {
                          regionCode = cols[6];
                          updateTime = cols[7];
                        } else if (cols.length === 7) {
                          regionCode = '未知';
                          updateTime = cols[6];
                        } else {
                          regionCode = '未知';
                          updateTime = '未知';
                        }
                        
                        return `
                          <tr>
                            <td class="font-mono">${cols[0]}</td>
                            <td><span class="px-2 py-1 rounded-full text-xs ${ipTypeInfo.isNative ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${ipTypeInfo.text}</span></td>
                            <td><span class="px-2 py-1 rounded-full text-xs ${ipTypeInfo.isNative ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${dataCenterInfo}</span></td>
                            <td><span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">${regionCode}</span></td>
                            <td>
                              <span class="badge ${parseFloat(cols[3]) > 5 ? 'badge-error' : 'badge-success'}">${cols[3]}%</span>
                            </td>
                            <td>${cols[4]} <span class="text-gray-400">ms</span></td>
                            <td>
                              <span class="${parseFloat(cols[5]) > 10 ? 'text-green-600' : parseFloat(cols[5]) > 5 ? 'text-blue-600' : 'text-gray-600'} font-medium">${cols[5]}</span>
                              <span class="text-gray-400">MB/s</span>
                            </td>
                            <td>
                              <span class="text-xs text-gray-400">${updateTime || '未知'}</span>
                            </td>
                          </tr>
                        `;
                      }
                      return '';
                    }).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<div class="py-16 text-center text-gray-500"><svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p>暂无 IPv6 数据</p></div>'}
          </div>

          <!-- 其他内容 -->
          <div id="others-content" class="tab-content hidden">
            <div class="p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">其他依赖优选项目</h2>
              <h2 class="text-lg font-medium text-gray-900 mb-4">所属项目，皆为Cloudflare worker免费额度,请友善使用谢谢。</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="https://blog.loadke.tech" target="_blank" class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-shrink-0 mr-3">
                    <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Mr.阿布白的博客</h3>
                    <p class="text-xs text-gray-500 mt-1">访问作者的技术博客-依赖CloudFlare BestIP优选IP</p>
                  </div>
                </a>
                
                <a href="https://jsdelivr.badking.pp.ua" target="_blank" class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-shrink-0 mr-3">
                    <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">jsdelivr反代</h3>
                    <p class="text-xs text-gray-500 mt-1">jsdelivr反代-依赖CloudFlare BestIP优选IP</p>
                  </div>
                </a>
                
                <a href="https://ghproxy.badking.pp.ua" target="_blank" class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-shrink-0 mr-3">
                    <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">GitHub代理</h3>
                    <p class="text-xs text-gray-500 mt-1">GitHub代理-依赖CloudFlare BestIP优选IP</p>
                  </div>
                </a>
                <a href="https://translate.badking.pp.ua" target="_blank" class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex-shrink-0 mr-3">
                  <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Google翻译</h3>
                  <p class="text-xs text-gray-500 mt-1">Google翻译-依赖CloudFlare BestIP优选IP</p>
                </div>
              </a>
                <a href="https://t.me/IonMagic" target="_blank" class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-shrink-0 mr-3">
                    <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">交流讨论</h3>
                    <p class="text-xs text-gray-500 mt-1">有问题可以通过此群聊联系我</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 页脚 -->
        <div class="footer">
          <p>© ${new Date().getFullYear()} CloudFlare 优选IP · <a href="https://blog.loadke.tech" >Mr.阿布白</a>
          </p>
        </div>
      </div>
    
      <!-- 标签切换的 JavaScript -->
      <script>
        // 初始显示IPv4标签
        document.addEventListener('DOMContentLoaded', function() {
          showTab('ipv4');
        });
        
        function showTab(tabName) {
          // 隐藏所有 tab 内容
          document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('fade-in');
          });
          
          // 显示选中的 tab 内容
          const activeContent = document.getElementById(tabName + '-content');
          activeContent.classList.remove('hidden');
          
          // 应用淡入动画
          setTimeout(() => {
            activeContent.classList.add('fade-in');
          }, 10);

          // 更新 tab 按钮样式
          document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          document.getElementById(tabName + '-tab').classList.add('active');
          
          // 更新时间显示（仅在IPv4和IPv6标签显示更新时间）
          if (tabName === 'ipv4' || tabName === 'ipv6') {
            document.getElementById('update-time-display').classList.remove('hidden');
            document.getElementById('update-time').textContent = tabName === 'ipv4' ? '${ipv4time || '未知'}' : '${ipv6time || '未知'}';
          } else {
            document.getElementById('update-time-display').classList.add('hidden');
          }
        }
      </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html',
        'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0'
      },
      status: 200
    });
  } catch (error) {
    return new Response(`错误：${error.message}`, { 
      status: 500,
      headers: { 'X-BestIP-Original': 'CloudFlare-BestIP-IonRH-v2.0' }
    });
  }
}
