const MongoDB = require('../common/mongo-util');
const DateUtil = require('../common/date-util');
const MailUtil = require('../common/mail-util');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const randToken = require('rand-token');

class AuthService{
    constructor(config){

        this.config = config;
        this.mongoDB = new MongoDB(config.get('builder:mongodb:adminUrl'));
        this.mailUtil = new MailUtil(config);
        this.comparePasswords=this.comparePasswords.bind(this);
        this.createAuthenticationToken=this.createAuthenticationToken.bind(this);
        this.createEncryptedPassword=this.createEncryptedPassword.bind(this);
        this.createRandomToken=this.createRandomToken.bind(this);
        
    }


    async comparePasswords (inputPassword,hashPassword){
        console.log("MATCH PASSWORDS");
        console.log(inputPassword,hashPassword)
        return new Promise(
            (resolve, reject) => {
                bcrypt.compare(inputPassword, hashPassword, function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
    };

    async createAuthenticationToken (user) {
        console.log("CREATING AUTH TOKEN");
        console.log("-------------- asterisk",asterisk);
   
        return new Promise(
            (resolve, reject) => {
                const payload = {
                    phone: user.phone,
                    fullName: user.fullName,
                    email: user.email,
                    roles: user.roles,
                   
                };
                let token = jwt.sign(payload,this.config.get('builder:token:secret'), {
                    expiresIn: this.config.get('builder:token:expires')
                });
                resolve(token);
            });
    };

    async createEncryptedPassword (password){
        console.log("CREATING ENCRYPTED PASSWORD");
        return new Promise(
            (resolve, reject) => {
                bcrypt.hash(password, 10, function(err, hash) {
                    if(err){
                        reject(err);
                    }else{
                        resolve(hash);
                    }
                });
            });
    };

    async createRandomToken(bit) {
        console.log("FETCHING RANDOM TOKEN");
        return new Promise(
            (resolve, reject) => {
                let bits = bit ? bit : 32;
                let token = randToken.generate(bits);
                resolve(token);
            });
    };

    async verifyAccount (params) {
        console.log("VERIFYING ACCOUNT");
        try {
            let query = {verificationToken : params.token};
            let values = {
                $set: {
                    status : 'Active',
                    verificationToken: '',
                    modifiedOn: DateUtil.getCurrentDate()
                }
            };
            let result = await this.mongoDB.updateRecord("users",query,values);
            return result;
        } catch(err) {
            throw new Error(err)
        }
    };


    async sendVerificationLink (token, email) {
        console.log("SENDING VERIFICATION LINK TO CUSTOMER' ADMIN EMAIL");
        try {
            const link = this.config.get('builder:verificationLink') +  token;
            const subject = "Please confirm your Dukaan app account";
            const body = `Click the following link to verify your account:
                          <br>
                          <a href=${link} target="_blank">Verify</a>`;
            let result =  await this.mailUtil.sendMail(subject,body,email);
            return result;
        } catch(err) {
            throw new Error(err)
        }
    };

    async sendVerificationToResetPassword (token, email) {
        console.log("SENDING VERIFICATION LINK TO RESET PASSWORD");
        try {
            const link = this.config.get('builder:resetVerificationLink') +  token;
            console.log("Link****************"+link);
            const subject = "Please confirm your Dukaan account";
            const body = `Click the following link to reset your password:
                          <br>
                          <a href=${link} target="_blank">Reset</a>`;

            let result =  await this.mailUtil.sendMail(subject,body,email);
            return result;
        } catch(err) {
            throw new Error(err)
        }
    };



   

  

}

module.exports = AuthService;
