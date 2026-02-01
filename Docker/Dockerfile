FROM frolvlad/alpine-glibc:latest
RUN apk add --no-cache curl bash sed busybox tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone
WORKDIR /root
RUN ls && mkdir /app && cd /app && curl -sL https://ghproxy.badking.pp.ua/https://raw.githubusercontent.com/IonRh/Cloudflare-BestIP/main/BestIP.sh | bash
COPY Docker/main.sh /app/main.sh
RUN chmod +x /app/main.sh && export TZ='Asia/Shanghai'
# 校准时钟
RUN busybox ntpd -q -p ntp.aliyun.com
ENTRYPOINT ["/app/main.sh"]
