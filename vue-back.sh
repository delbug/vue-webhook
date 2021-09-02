#! /bin/bash
WORK_PATH="/root/user/projects/vue-back"
# /root/user/projects/vue-webhook
# /root/user/projects/vue-back

cd $WORK_PATH
echo "先清除老代码"
git reset --head origin/main
git clean -f
echo '拉取最近代码'
git pull
echo '开始执行构建'
# 1:01:19
docker build -t vue-back .

