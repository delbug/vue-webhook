const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secureConnection: true,
    auth: {
        user: '81692059@qq.com',
        pass: 'gersloyrczrqbjfh'
    }
})

function sendMail(message) {
    let mailOptions = {
        from: '"81692059" <81692059@qq.com>', // 发送地址
        to: '81692059@qq.com', // 接受者
        subject: '部署通知', // 主住
        html: message // 内容主体
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
        console.log('Message sent :', info.messageId);
    })

};

module.exports = sendMail;