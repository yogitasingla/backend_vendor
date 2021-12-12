class MessageUtil{

    static getMessage(){
         return {
        
         FORMAT_ERROR :"fill the details in correct format",
         allDetail:"please fill all the details",
         alexist:'error: user already exist,please fill the new details',
        userNE :'user not exist',
        loginS:'login sucessfull'

           }
    }

    static get(){
        if(arguments.length < 1)
        return '';
       let key = this.getMessage()[arguments["0"]];
       for(let i in arguments){
        if(i != "0")
         key = key.replace("@ARGU@",arguments[i]);
       }
       return key;
    }

}

module.exports = MessageUtil;
