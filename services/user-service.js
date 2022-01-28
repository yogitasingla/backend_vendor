const MongoDB = require('../common/mongo-util');
const DateUtil = require('../common/date-util');

class UserService {

    constructor(config) {
        this.mongoDB = new MongoDB(config.get('builder:mongodb:adminUrl'));

        this.findUserByEmailOrPhone = this.findUserByEmailOrPhone.bind(this);
        this.findUserByEmail = this.findUserByEmail.bind(this);
        this.findUserByPhone = this.findUserByPhone.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.filterUser = this.filterUser.bind(this);
        this.fetchUsersCount = this.fetchUsersCount.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.deleteUsers = this.deleteUsers.bind(this);
        this.updateUserLogin = this.updateUserLogin.bind(this);
      
        this.updateUserToken = this.updateUserToken.bind(this);
        this.findUserByToken = this.findUserByToken.bind(this);
        this.updateResetPassword = this.updateResetPassword.bind(this);
    }

 

    async findUserByEmailOrPhone(identity) {
        console.log("FIND USER BY PHONE OR EMAIL");
        try {
            let query = {$or: [{phone: identity}, {email: identity}]};
            let filter = {};
            let result = await this.mongoDB.findRecord("users", query, filter);
            return result;
        } catch (err) {
            throw new Error(err)
        }
    }

    async findUserByEmail(email) {
        console.log("FIND USER BY EMAIL");
        try {
            let query = {email: email};
            let filter = {};
            let result = await this.mongoDB.findRecord("users", query, filter);
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }

    async findUserByToken(token) {
        console.log("FIND USER BY TOKEN");
        try {
            let query = {verificationToken: token};
            let filter = {};
            let result = await this.mongoDB.findRecord("users", query, filter);
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }

    async findUserByPhone(phone) {
        console.log("FIND USER BY PHONE");
        try {
            let query = {phone: phone};
            let filter = {};
            let result = await this.mongoDB.findRecord("users", query, filter);
            return result;
        } catch (err) {
            throw new Error(err)
        }
    }

    async createUser(user) {
        console.log("-------------------------CREATING USER------------------------------");
        try {
            let result = await this.mongoDB.createRecord("users", user);
            console.log('----------------------result-----------------',result)
            return result;
        } catch (err) {
            console.log('err--------------',err)
            throw new Error(err)
        }
    }

    async updateUser(email, user) {
        console.log("UPDATING USER");
        try {
            let query = {"email": email};
            let updatedUser = {
                fullName: user.fullName,
                phone: user.phone,
                status: user.status,
                roles: user.roles,
               
                contactType: user.contactType,
                modifiedOn: user.modifiedOn,
                modifiedBy : user.modifiedBy
            };

            if(user.password){
                updatedUser.password = user.password;
            }

            let values = {$set:updatedUser};
            let result = await this.mongoDB.updateRecord("users", query, values);
            return result;
        } catch (err) {
            throw new Error(err)
        }
    }

    async updateUserToken(emailId,token){
        try {
            console.log("UPDATING USER VERIFICATION TOKEN");
            let query=({'email':emailId});
            let values=({$set:{'verificationToken':token}});
            let result = await this.mongoDB.updateRecord("users",query,values);
            return result;
        }catch (err) {
            console.log(err);
        }
    }

    async updateResetPassword(password,token){
        try {
            console.log("UPDATING NEW PASSWORD SERVICE");
            let query=({'verificationToken':token});
            let values=({$set:{'password':password}});
            let result = await this.mongoDB.updateRecord("users",query,values);
            return result;
        }catch (err) {
            console.log(err);
        }
    }

    async filterUser(customerId, searchTerm,customerName){
        console.log("FILTER USERS");
        try {
            let query;
            if (customerId && customerName !=='All'){
                query = {$and : [{customerId : customerId}, {fullName: { $regex: searchTerm,'$options' : 'i' }}]};
            } else if (customerName !=='All'){
                query = { $and : [{fullName : {$regex: searchTerm,'$options' : 'i'}},{customerName: customerName}]};
            }
            else query = {fullName : {$regex: searchTerm,'$options' : 'i'}};

            let fields ={
                _id : 0
            };

            let result = await this.mongoDB.findRecord("users", query, fields);
            return result;
        } catch (err) {
            throw new Error(err)
        }
    }

 

    async deleteUser(email,type) {
        console.log("DELETING USER");
        try {
            if(type==="SoftDelete"){
                let query = {email: email};
                let values = {$set:{status: 'Deleted'}};
                let result = await this.mongoDB.updateRecords("users",query,values);
                return result;
            }else{
                let query = {"email": email};
                let result = await this.mongoDB.deleteRecord("users", query);
                return result;
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async deleteUsers(customerId,type) {
        console.log("DELETING USERS");
        try {
            if(type==="SoftDelete"){
                let query = {customerId: parseInt(customerId)};
                let values = {$set:{status: 'Deleted'}};
                let result = await this.mongoDB.updateRecords("users",query,values);
                return result;
            }else{
                let query = {customerId: parseInt(customerId)};
                let result = await this.mongoDB.deleteRecords("users", query);
                return result;
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async updateUserLogin(identity) {
        console.log("UPDATING USER LOGIN");
        try {
            let query = {$or: [{phone: identity}, {email: identity}]};
            let values = {
                $set: {"lastLogin": DateUtil.getCurrentDate()}
            };
            let result = await this.mongoDB.updateRecord("users", query, values);
            return result;
        } catch (err) {
            throw new Error(err)
        }
    };
    

    async deactivateUser(email) {
        console.log("DEACTIVATING USER");
        try {
                let query = {email: email};
                let values = {$set:{status: 'Inactive'}};
                let result = await this.mongoDB.updateRecords("users",query,values);
                return result;

        } catch (err) {
            throw new Error(err)
        }
    }
}

module.exports = UserService;



