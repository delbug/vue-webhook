let http = require('http');
let server = http.createServer(function (req, res) {

    if (req.method === 'POST' && req.url === '/webhook') {
        console.log('req.method:', req.method, 'req.url:', req.url);

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

