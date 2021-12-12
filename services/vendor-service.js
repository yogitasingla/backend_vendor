const RestUtil = require('../common/rest-util');
 const MongoDB = require('../common/mongo-util');
const  HTMLParser   =require('node-html-parser');
const axios = require('axios');

class UserService {
    constructor(config) {
        this.config = config;
        this.restUtil = new RestUtil();
         this.mongoDB = new MongoDB(config.get('mongodb:url'));
       
    }
  

    
}


module.exports = UserService;