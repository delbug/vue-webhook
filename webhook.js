let http = require('http');
let { createHmac } = require('crypto');
let SECRET = '123456';
let { spawn } = require('child_process');
let sendMail = require('./sendmail.js');

function sign(body) {
    return `sha1=` + createHmac('sha1', SECRET).update(body).digest('hex');
}


let server = http.createServer(function (req, res) {
    console.log('-----------------分割线------------------------------');
    if (req.method === 'POST' && req.url === '/webhook') {
        console.log('req.method:', req.method, '；req.url:', req.url);

        let buffers = [];
        req.on('data', function (buffer) {
            buffers.push(buffer);
        })

        req.on('end', function (buffer) {
            let body = Buffer.concat(buffers);
            let event = req.headers['x-github-event'];
            console.log('event====:', event);
            // github请求来的时候，要传递请求体body，另外会传一个singature过来，你需要验证签名对不对
            let signature = req.headers['x-hub-signature'];
            let signbody = sign(body);

            console.log('signature=====:', signature);
            console.log('signbody======:', signbody);

            // res.setHeader("Content-Type", "application/json;charset=utf-8");

            if (signature !== signbody) {
                console.log('Not Allowed 签名不一样');
                return res.end('Not Allowed 签名不一样');
            };

            let str = JSON.stringify({ ok: true });
            res.end(str)

            if (event == 'push') {
                console.log('已经push=====');
                // 开始部署
                let payload = JSON.parse(body)
                let child = spawn('sh', [`./${payload.repository.name}.sh`]);
                let buffers = [];

                child.stdout.on('data', function (buffer) {
                    buffers.push(buffer)
                })

                child.stdout.on('end', function (buffer) {

                    let log = buffers.concat(buffer).toString()

                    sendMail(`
                    <h1>部署日期：${new Date()}</h1>
                    <h2>部署人:${payload.pusher.name}</h2>
                    <h2>部署邮箱:${payload.pusher.email}</h2>
                    <h2>提交信息:${payload.head_commit && payload.head_commit['message']}</h2>
                    <h2>部署日志:${log.replace("\r\n", "<br/>")}</h2>
                    `)
                })
            }
        });

        res.setHeader('Content-Type', 'application/json');
        let str = JSON.stringify({ ok: true });
        console.log('str:', str);
        res.end(str);
    } else {
        res.end('Not Found');
    }
})

server.listen(4000, () => {
    console.log('webhook服务在4000端口上启动');
})

