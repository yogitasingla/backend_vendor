

const UserService = require('../services/user-service');
// const CustomerService = require('../services/customer-service');
const AuthService = require('../services/auth-service');
const DateUtil = require('../common/date-util');
// const ConstantUtil = require('../../../common/utils/constant-util');
const MessageUtil = require('../common/message-util');
const MailUtil = require('../common/mail-util');
// const {body,validationResult} =  require('express-validator');
// const Validation = require("../../../common/utils/validator");
// const ApiLogger = require('../../../common/utils/api-logger');
const RestUtil = require('../common/rest-util');
const cryptoSecret = "c5320eba2ec9cf89abfdcd35cc0d8b7208bd526b8185e3440df4ecb6d66edc19"
const CryptoJS = require('crypto-js');
// const { warning } = require('../../../common/utils/message-util');
let globalLoginContainer=[];
let loginAttempts=3;
let loginThreshold=10000;

class AuthController {
    constructor(config) {
        this.config = config;
        this.userService = new UserService(config);
        // this.customerService = new CustomerService(config);
        this.authService = new AuthService(config);
        this.mailUtil = new MailUtil(config);
        this.restUtil = new RestUtil();
        // this.publishUrl = config.get('dapr_middleware_pubsub_url');
        this.verify = this.verify.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.Logout=this.Logout.bind(this)
        this.generateRandomToken = this.generateRandomToken.bind(this);
        this.reset = this.reset.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    async register(req, res) {
          console.log(req.body)
          let json = {};
        try {
           
            const user = req.body.user;

            //Check if UserName, UserEmail Exists
          
            const r2 = this.userService.findUserByPhone(user.phone);
            const r3 = this.userService.findUserByEmail(user.email);
            const [userPhoneRecord, userEmail] = await Promise.all([r2, r3]);

            if ((userPhoneRecord && userPhoneRecord[0]) ||
                (userEmail && userEmail[0])) {
                json = {
                    "response": MessageUtil.response().ERROR,
                    "message": userPhoneRecord[0] ?
                            MessageUtil.error().USER_PHONE_EXIST : MessageUtil.error().USER_EMAIL_EXIST
                };
              
                res.send(json);
                res.end();
                return;
            }

            const timestamp = DateUtil.getCurrentDate();
             //CREATE USER
           
                const token = await this.authService.createRandomToken(64);
                user.password = await this.authService.createEncryptedPassword(user.password);
                user.verificationToken = token;
                user.customerId = customerId;
                user.createdOn = timestamp;
                user.modifiedOn = timestamp;
                const userResp = await this.userService.createUser(user);

                //Send Verification Link to Customer Email
                await this.authService.sendVerificationLink(
                    token,
                    user.email
                );
            

            json = {
                "response": MessageUtil.response().SUCCESS
            };
                
            res.send(json);
            res.end();
         
        } catch (e) {
            console.log('Error!', e);
          
            json = {
                "response": MessageUtil.response().ERROR,
                "message": MessageUtil.error().ERROR_OCCURRED
            };
           
            res.send(json);
            res.end();
        }
    }

    async login(req, res) {
        console.log("req.body login",req.body)
        
        let json = {};
        try {
            console.log("INSIDE LOGIN");
           
            const identity = req.body.username
            const password = req.body.password
            //Check if User Exists
            console.log("login identity",identity,password)
            const userRecord = await this.userService.findUserByEmailOrPhone(identity);
            console.log("user Rescode login".userRecord)
            if (!userRecord || !userRecord[0]) {
                console.log("inside if login")
                json = {
                    "response": MessageUtil.response().ERROR,
                    "message": MessageUtil.error().AUTHENTICATION_USER_NOT_FOUND
                };
                 
                res.send(json);
                res.end();
                return;
            }

            //Check for Active Record
            if (userRecord[0].status  ===  ConstantUtil.constants().STATUS.INACTIVE) {
                console.log("line 186 login")
                json = {
                    "response": MessageUtil.response().ERROR,
                    "message": MessageUtil.error().ACCOUNT_NOT_ACTIVE
                };
                 
                res.send(json);
                res.end();
                return;
            }

            console.log("-------inside login");

            //Match password
            const passwordMatched = await this.authService.comparePasswords(password, userRecord[0].password);
            if (!passwordMatched) {
                console.log("inside psswrd match")
                let findData = globalLoginContainer.findIndex(a => a.userIdentity === userRecord[0].email);
                if(findData === -1){
                 
                    let data = {
                        userIdentity:userRecord[0].email,
                        count:1,
                        lastLogin:new Date()
                    };
                    globalLoginContainer.push(data);
                   
                    json = {
                        "response": MessageUtil.response().ERROR,
                        "message": MessageUtil.error().AUTHENTICATION_WRONG_PASSWORD
                    };
                     
                }else {
                    ++ globalLoginContainer[findData].count;
                    if(globalLoginContainer[findData].count === loginAttempts)
                    {
                        let timeDifference = (new Date()).getTime()-(globalLoginContainer[findData].lastLogin).getTime();
                        console.log(timeDifference);
                        if(timeDifference <=  loginThreshold){
                    let deactivateUsers = this.userService.deactivateUser(userRecord[0].email);
                    globalLoginContainer.splice(findData, 1);
                    
                            json = {
                                "response": MessageUtil.response().ERROR,
                                "message": MessageUtil.error().MULTIPLE_ATTEMPTS_LOGIN
                            };
                             
                        }else{
                            globalLoginContainer.splice(findData, 1);
                            json = {
                                "response": MessageUtil.response().ERROR,
                                "message": MessageUtil.error().AUTHENTICATION_WRONG_PASSWORD
                            };
                             
                        }
                    }
                    else {
                       
                    json = {
                        "response": MessageUtil.response().ERROR,
                        "message": MessageUtil.error().AUTHENTICATION_WRONG_PASSWORD
                    };
                         
                }}
                res.send(json);
                res.end();
                return;
            }else if(passwordMatched){
                console.log("else passwrd matched")
                let findData = globalLoginContainer.findIndex(a => a.userIdentity === userRecord[0].email);
                globalLoginContainer.splice(findData, 1);
            }
     
            //Update Last Login, Create Token, Send Response
            const r1 = this.userService.updateUserLogin(identity);
          
            const [updateLastLogin] = await Promise.all([r1]);

          
           let token = await this.authService.createAuthenticationToken(userRecord[0]);

            json = {
                "response": MessageUtil.response().SUCCESS,
                "token": token,
                "phone": userRecord[0].phone,
                "fullName": userRecord[0].fullName,
                "email": userRecord[0].email,
                "roles": userRecord[0].roles,
                
                };
          
            res.send(json);
            res.end();
        } catch (e) {
            console.log('Error!', e);
            
            json = {
                "response": MessageUtil.response().ERROR,
                "message": MessageUtil.error().ERROR_OCCURRED
            };
          
            res.send(json);
            res.end();
        }
    }


    async Logout(req, res) {
        
      console.log('req------------',req.body);

        let json = {};
        try {
            req.body.logout_time=new Date()
            req.body.timestamp=new Date()
            //under work-------------------------------
            json = {"response": MessageUtil.response().SUCCESS, "data": data};
           
            res.send(json);
            res.end();
        }
        catch (e) {
            console.log('Error!', e);
            
            json = {
                "response": MessageUtil.response().ERROR,
                "message": MessageUtil.error().ERROR_OCCURRED
            };
           
            res.send(json);
            res.end();
        }
    }
    async generateRandomToken(req, res) {
       

        let json = {};
        try {
            const token = await this.authService.createRandomToken(req.body.bits);
            const data = {
                "token": token
            };
            json = {"response": MessageUtil.response().SUCCESS, "data": data};
             
            res.send(json);
            res.end();
        }
        catch (e) {
            console.log('Error!', e);
              
            json = {
                "response": MessageUtil.response().ERROR,
                "message": MessageUtil.error().ERROR_OCCURRED
            };
             
            res.send(json);
            res.end();
        }
    }

    async verify(req, res) {
        
        let json = {};
        try {
            const result = await this.authService.verifyAccount(req.params);
            if(result && result.modifiedCount!==1){
                json = {"response": MessageUtil.response().ERROR,  "message":MessageUtil.error().RECORD_NOT_FOUND};
                 
                res.send(json);
                res.end();
                return;
            }

            json = {"response": MessageUtil.response().SUCCESS};
           
             
            res.send(json);
            res.end();
        }
        catch (e) {
            console.log('Error!', e);
              
            json = {
                "response": MessageUtil.response().ERROR,
                "message": MessageUtil.error().ERROR_OCCURRED
            };
             
            res.send(json);
            res.end();
        }
    }

    async resetPassword(req, res) {
       
        console.log("Inside Reset Password controller");
        let json = {};
        try {
             const password = req.body.password;
            // const password = CryptoJS.AES.decrypt(req.body.password, cryptoSecret).toString(CryptoJS.enc.Utf8);
            console.log(password);
            let token = req.params.token;

            let result = await  this.userService.findUserByToken(token);
            if(result[0]){
                let encryptedPassword = await this.authService.createEncryptedPassword(password);
                let saveChangedPassword = await  this.userService.updateResetPassword(encryptedPassword,token);

                json = {
                    "response": MessageUtil.response().SUCCESS,
                    "message": MessageUtil.error().INVALID_URL
                };
                 
                res.send(json);
                res.end();
            }else{
                json = {
                    "response": MessageUtil.response().ERROR
                };
                 
                res.send(json);
                res.end();
            }
        }
        catch (e) {
            console.log('Error!', e);
              
            json = {
                "response": MessageUtil.response().ERROR,
                "message": MessageUtil.error().ERROR_OCCURRED
            };
             
            res.send(json);
            res.end();
        }
    }

    async reset(req, res){
       
     console.log("Inside Reset controller");
     let json = {};
     try {
         let emailId = req.body.emailId;

         let result = await this.userService.findUserByEmail(emailId);
         if(!result[0]){
             json = {
                 "response": MessageUtil.response().ERROR,
                 "message": MessageUtil.error().USER_NOT_EXIST
             };
              
             res.send(json);
             res.end();
         }

         if(result[0] && result[0].status  ===  'Active'){
             const token = await this.authService.createRandomToken(64);
             result[0].verificationToken = token;
             let userResp = await this.userService.updateUserToken(emailId,result[0].verificationToken);
             let mail = await this.authService.sendVerificationToResetPassword(token, emailId);

             json = {
                 "response": MessageUtil.response().SUCCESS
             };
              
             res.send(json);
             res.end();
         }
         else{
             json = {
                 "response": MessageUtil.response().ERROR,
                 "message": MessageUtil.error().ACCOUNT_INACTIVE
             };
              
             res.send(json);
             res.end();
         }

     } catch (e) {
         console.log('Error!', e);
           
         json = {
             "response": MessageUtil.response().ERROR,
             "message": MessageUtil.error().ERROR_OCCURRED
         };
          
         res.send(json);
         res.end();

     }
    }

}

module.exports = AuthController;
