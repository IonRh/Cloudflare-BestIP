#!/bin/bash

export TZ='Asia/Shanghai'

# 检查/root是否有config.json文件
if [ -f /root/config.json ]; then
    # 有文件则执行BestIP
    cd /root && ./BestIP
else
	# 无文件则移动/app/到/root
	mv /app/config.json /root/
    mv /app/BestIP /root/
    cd /root/
    echo "修改config.json重启Docker后，正常运行"
    # ./BestIP > /dev/null 2>&1 &
fi

tail -f /dev/null
