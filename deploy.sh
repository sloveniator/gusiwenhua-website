#!/usr/bin/env bash
#
# 古四文化咨询工作室官网 - 一键部署脚本
# 用法：bash deploy.sh   （在仓库根目录执行；首次会提示填写 SMTP 凭证）
#
set -euo pipefail

echo "=== 古四文化咨询工作室官网 · 一键部署 ==="

# 1) 必须在仓库根目录（能找到 docker-compose.yml）
if [ ! -f docker-compose.yml ]; then
  echo "✗ 未找到 docker-compose.yml，请在项目根目录运行本脚本。"
  echo "  首次部署： git clone https://github.com/sloveniator/gusiwenhua-website.git && cd gusiwenhua-website"
  exit 1
fi

# 2) Docker / Compose 可用性检查
if ! command -v docker >/dev/null 2>&1; then
  echo "✗ 未检测到 docker，请先安装 Docker：https://docs.docker.com/get-docker/"
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "✗ 未检测到 docker compose v2，请安装：https://docs.docker.com/compose/install/"
  exit 1
fi

# 3) 准备 SMTP 凭证（仅本地 .env，不入库、不进镜像）
if [ ! -f backend/.env ]; then
  echo "⚠ 未检测到 backend/.env，已从模板创建。"
  cp backend/.env.example backend/.env
  echo "   请编辑 backend/.env，至少填入 SMTP_PASS（139 邮箱客户端授权码），然后重新运行："
  echo "      nano backend/.env"
  echo "      bash deploy.sh"
  exit 0
fi

# 4) 拉取最新代码（已存在仓库时）
if [ -d .git ]; then
  git pull --ff-only 2>/dev/null || echo "（git pull 跳过/失败，使用本地代码继续）"
fi

# 5) 证书检查：443 需要 fullchain.pem/privkey.pem（挂载自 ./certs，不入库）
#    优先用 Let's Encrypt（certbot 生成到 ./certs）；缺失时生成本地自签兜底，保证 https 可访问
CERT_DIR="${CERT_DIR:-./certs}"
if [ ! -f "$CERT_DIR/fullchain.pem" ] || [ ! -f "$CERT_DIR/privkey.pem" ]; then
  mkdir -p "$CERT_DIR"
  echo "⚠ 未检测到 TLS 证书（$CERT_DIR/fullchain.pem），生成自签测试证书…"
  openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
    -keyout "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" \
    -subj "/CN=slceleto.qzz.io" >/dev/null 2>&1 || {
      echo "✗ openssl 生成证书失败";
      exit 1;
    }
  echo "   已生成自签证书（有效期 825 天）。如需正式可信证书（Let's Encrypt），"
  echo "   请绑定域名后： bash issue-cert.sh"
fi

# 5b) 构建并启动双容器（web:80+443 + backend:8000）
echo "--- 构建并启动容器 ---"
docker compose up -d --build

# 6) 等待后端就绪并健康检查
#    注意：直接探 backend 容器真实 /health 接口，不要探 443/health —— 后者会被
#    nginx 的 try_files 静态兜底返回首页 HTML（永远 200），造成“假健康”。
echo "--- 等待服务就绪 ---"
for i in $(seq 1 15); do
  if docker compose exec -T backend python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if docker compose exec -T backend python -c "import urllib.request,sys; sys.exit(0 if b'\"ok\":true' in urllib.request.urlopen('http://127.0.0.1:8000/health').read() else 1)" >/dev/null 2>&1; then
  echo "✅ 部署成功！后端 /health 正常，站点可访问："
  echo "   HTTP ： http://<服务器IP>"
  echo "   HTTPS： https://<服务器IP>   （部署了正式证书后浏览器无警告）"
  echo "   域名 ： https://slceleto.qzz.io   （DNS 指向本机且签发证书后生效）"
  echo "   查看日志： docker compose logs -f"
  echo "   更新： bash deploy.sh   （会自动 git pull 后重建）"
else
  echo "⚠ 后端健康检查未通过，请排查："
  echo "   docker compose ps"
  echo "   docker compose logs backend"
  exit 1
fi
