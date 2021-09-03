#! /bin/bash
WORK_PATH="/root/user/projects/vue-back"

cd $WORK_PATH
echo "先清除老代码"
git reset --head origin/main
git clean -f
echo '拉取最近代码'
git pull
echo '开始执行构建'
docker build -t vue-back .
echo '停止旧容器并删除旧容器'
docker stop vue-back-container
docker rm vue-back-container
echo "启动新容器"
docker container run -p 3000:3000 --name vue-back-container -d vue-back
# 01:07:55