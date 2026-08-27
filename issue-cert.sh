#!/usr/bin/env bash
#
# 古四文化咨询工作室官网 - Let's Encrypt 正式证书签发脚本
# 用法：bash issue-cert.sh <域名>      （例：bash issue-cert.sh slceleto.qzz.io）
#
# 说明：
#   1) 本脚本使用 certbot 签发正式可信证书（浏览器无警告），输出到 ./certs/（deploy.sh 已挂载）
#   2) 请确保域名 DNS 已解析到本机，且 80 端口可被公网访问（HTTP-01 验证用）
#   3) 证书 90 天有效期；本脚本会写入 cron 自动续期，续期后无需手动操作
#   4) deploy.sh 在证书缺失时会自动生成自签测试证书，签发正式证书后运行 deploy.sh 即可生效
#
set -euo pipefail

DOMAIN="${1:-slceleto.qzz.io}"
CERT_DIR="${CERT_DIR:-./certs}"
WEBROOT="${WEBROOT:-./acme-webroot}"
mkdir -p "$CERT_DIR" "$WEBROOT"

echo "=== 为 ${DOMAIN} 签发 Let's Encrypt 正式证书 ==="

# 1) certbot 检查 / 安装
if ! command -v certbot >/dev/null 2>&1; then
  echo "--- 未检测到 certbot，尝试安装 ---"
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -qq && sudo apt-get install -y -qq certbot
  elif command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y certbot
  elif command -v yum >/dev/null 2>&1; then
    sudo yum install -y certbot
  else
    echo "✗ 无法自动安装 certbot，请手动安装后重试： https://certbot.eff.org/instructions"
    exit 1
  fi
fi

# 2) 域名解析检查（提示用，不阻断）
echo "--- 域名解析检查 ---"
if command -v dig >/dev/null 2>&1; then
  dig +short "$DOMAIN" | head -3 || true
elif command -v nslookup >/dev/null 2>&1; then
  nslookup "$DOMAIN" | tail -4 || true
else
  getent hosts "$DOMAIN" || true
fi
echo "（请确认以上 IP 与本机公网 IP 一致，否则 HTTP-01 验证可能失败）"

# 3) 签发证书（webroot 方式：宿主机 ./acme-webroot 已挂载进 nginx 为 /var/www/acme，
#    容器 nginx 通过 80 端口提供 /.well-known/acme-challenge/ 验证文件；请确保 80 端口暴露公网）
#    若域名走 Cloudflare 代理（橙云），验证流量到不了源站，需先临时关闭代理或用 DNS-01
sudo certbot certonly \
  --webroot -w "$(realpath "$WEBROOT")" \
  --email admin@$(echo "$DOMAIN" | sed 's/^[^.]*\.//') \
  --agree-tos --non-interactive \
  --cert-name "$DOMAIN" \
  --domains "$DOMAIN" \
  --preferred-challenges http \
|| {
  echo "⚠ HTTP-01 验证失败（常见原因：域名走 Cloudflare 代理 / 80 端口未开放 / DNS 未解析到本机）。"
  echo "  备选方案 1：Cloudflare 面板把该域名记录改为 DNS only（灰云），再重试本脚本"
  echo "  备选方案 2：直接使用 deploy.sh 生成的自签证书（浏览器有警告，但功能完整）"
  exit 1
}

# 4) 复制到 ./certs（deploy.sh 挂载路径）
echo "--- 复制证书到 ./certs/ ---"
LIVE="/etc/letsencrypt/live/$DOMAIN"
if [ ! -f "$LIVE/fullchain.pem" ]; then
  LIVE="/etc/letsencrypt/live/${DOMAIN//./_}"   # certbot 有时用下划线
fi
if [ ! -f "$LIVE/fullchain.pem" ]; then
  echo "✗ 未找到证书文件，请检查 /etc/letsencrypt/live/ 目录"
  exit 1
fi
sudo cp "$LIVE/fullchain.pem" "$CERT_DIR/fullchain.pem"
sudo cp "$LIVE/privkey.pem"   "$CERT_DIR/privkey.pem"
sudo chown "$(whoami):$(whoami)" "$CERT_DIR/fullchain.pem" "$CERT_DIR/privkey.pem"
chmod 644 "$CERT_DIR/fullchain.pem"
chmod 600 "$CERT_DIR/privkey.pem"

# 5) 自动续期钩子：续期成功后重新复制证书（无需重启，nginx 容器挂载是实时读取）
if [ ! -d /etc/letsencrypt/renewal-hooks/deploy ]; then
  sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
fi
cat > /tmp/renew-copy-cert.sh <<EOF
#!/usr/bin/env bash
cp "$LIVE/fullchain.pem" "$(pwd)/certs/fullchain.pem"
cp "$LIVE/privkey.pem"   "$(pwd)/certs/privkey.pem"
chmod 644 "$(pwd)/certs/fullchain.pem"
chmod 600 "$(pwd)/certs/privkey.pem"
EOF
sudo cp /tmp/renew-copy-cert.sh /etc/letsencrypt/renewal-hooks/deploy/copy-cert.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/copy-cert.sh

# 6) cron 每天检查续期（certbot 自带 timer 的话会自动跑；双保险）
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
  ( crontab -l 2>/dev/null; echo "17 3 * * * sudo certbot renew --quiet --deploy-hook /etc/letsencrypt/renewal-hooks/deploy/copy-cert.sh" ) | crontab -
  echo "--- 已添加每日 03:17 自动续期检查 (cron) ---"
fi

echo ""
echo "✅ 正式证书已就绪： ./certs/fullchain.pem + privkey.pem"
echo "   > 运行 bash deploy.sh 重新部署即可生效（https://${DOMAIN} 无警告）"