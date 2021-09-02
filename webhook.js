const { sign } = require('crypto');
let http = require('http');
let crypto = require('crypto');
function sign(body) {
    return `sha1=` + crypto.creatHmac('sha1', SECRET).update(body).digest('hex');
}


let server = http.createServer(function (req, res) {
    console.log('-----------------分割线-----------------');
    if (req.method === 'POST' && req.url === '/webhook') {
        console.log('req.method:', req.method, 'req.url:', req.url);
        let buffers = [];
        req.on('data', function (buffer) {
            buffers.push(buffer);
        })

        req.on('end', function (buffer) {
            let body = Buffer.concat(buffers);
            let event = req.header['x-github-event'];
            // github请求来的时候，要传递请求体body，另外会传一个singature过来，你需要验证签名对不对
            let signature = req.headers['x-github-event'];
            let signbody = sign(body);

            console.log('signature:', signature);
            console.log('signbody:', signbody);

            if (signature !== signbody) {
                return res.end('Not Allowed 签名不一样');
            };
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

