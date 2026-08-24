# 古四文化咨询工作室官网 - 静态站点 + API 反代
FROM nginx:1.27-alpine

# 自定义 nginx 配置（静态托管 + 反代 /api 到 backend 容器）
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 复制整个站点到 nginx 默认根目录（.dockerignore 已排除 .env 等敏感文件）
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
