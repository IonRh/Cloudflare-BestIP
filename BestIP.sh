#!/bin/bash

API_URL="https://api.github.com/repos/IonRh/Cloudflare-BestIP/releases/latest"

# 获取最新版本号
if [ -z "$1" ]; then
  VERSION=$(curl -s "$API_URL" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
  if [ -z "$VERSION" ]; then
    echo "无法获取最新版本号"
    exit 1
  fi
else
  VERSION="$1"
fi

# 检测系统和架构
OS=$(uname | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
  linux)
    case "$ARCH" in
      x86_64)   PKG="BestIP-linux-amd64.tar.gz" ;;
      aarch64)  PKG="BestIP-linux-arm64.tar.gz" ;;
      armv7l)   PKG="BestIP-linux-armv7.tar.gz" ;;
      *)        echo "不支持的 Linux 架构: $ARCH"; exit 1 ;;
    esac
    ;;
  darwin)
    case "$ARCH" in
      x86_64)   PKG="BestIP-darwin-amd64.tar.gz" ;;
      arm64)    PKG="BestIP-darwin-arm64.tar.gz" ;;
      *)        echo "不支持的 macOS 架构: $ARCH"; exit 1 ;;
    esac
    ;;
  *)
    echo "不支持的操作系统: $OS"
    exit 1
    ;;
esac

REPO_URL="https://ghproxy.badking.pp.ua/https://github.com/IonRh/Cloudflare-BestIP/releases/download"
URL="$REPO_URL/$VERSION/$PKG"

echo "下载: $URL"
curl -L -o "$PKG" "$URL"
if [ $? -ne 0 ]; then
  echo "下载失败"
  exit 1
fi

echo "解压: $PKG"
if [ -f config.json ]; then
    echo "config.json 已存在，更新 BestIP"
    tar -xzvf "$PKG" BestIP --overwrite
else
    tar -xzvf "$PKG" --overwrite
fi
chmod +x BestIP
echo "删除压缩包: $PKG"
rm -f "$PKG"
echo "完成，请修改 BestIP 的配置文件: config.json"
echo "之后再次运行: ./BestIP"
echo "后台运行可输入：nohup ./BestIP > /dev/null 2>&1 &"
rm -f "BestIP.sh"
