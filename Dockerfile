# 古四文化咨询工作室官网 - 静态站点 Docker 镜像
# 基于 nginx:alpine 提供高性能静态文件服务
FROM nginx:1.27-alpine

# 复制整个站点到 nginx 默认根目录（.dockerignore 已排除开发垃圾）
COPY . /usr/share/nginx/html

# 开放 80 端口
EXPOSE 80

# 前台运行，便于容器管理
CMD ["nginx", "-g", "daemon off;"]
