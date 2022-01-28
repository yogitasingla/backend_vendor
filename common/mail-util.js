const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

class MailUtil {
    constructor(config){
        this.token=config.get('builder:token:secret')
        const host = config.get('mail:host');
        const port = config.get('mail:port');
        const service = config.get('mail:service');
        const user = config.get('mail:user');
        const password = config.get('mail:password');
        this.from = config.get('mail:from');
        this.to = config.get('mail:to');

        if(service){
            this.transporter = nodemailer.createTransport({
                service: service,
                auth: {
                    user: user,
                    pass: password
                }
            });
        }else{
            this.transporter = nodemailer.createTransport({
                host: host,
                port: port,
                secure: false,
                auth: {
                    user: user,
                    pass: password
                }
            });
        }
    }   
    sendMail (subject,body,to) {
        console.log("TOOOOO", to);
        if(!to){
            to = this.to;
        }
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from:this.from,
                to: to,
                subject: subject,
                text: body,
                html: body,
            };
            this.transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve('Email sent: ' + info.response);
                }
            });           
        });
    };

   
}

module.exports = MailUtil;