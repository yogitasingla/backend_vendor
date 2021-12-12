const config = require('../common/config-util');
const UserService = require('../services/vendor-service');

    

class WebhookController {
    constructor(config) {
        this.userService = new UserService(config);
      
      
        
        this.execute=this.execute.bind(this);

     
    }
      
        async execute(req,res){
         res.set("Access-Control-Allow-Origin", "*");
         res.set("Access-Control-Allow-Headers", "X-Requested-With");
         try {
          let response={}
      
          response={
            msg:`sucess`,
            status:'sucess'
          
        }
     
          res.setHeader('Content-Type', 'application/json');
           res.send(response);
         res.end();  
         }catch(e){
          console.log("eeeeeeeeeeeeeeeee",e)
           res.setHeader('Content-Type', 'application/json');
           res.send(this.nlpHandler.fetchUnableProcessResponse());
           res.end();
         }
        }
   
       
}

module.exports = WebhookController;
