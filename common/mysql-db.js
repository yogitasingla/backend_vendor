const mysql = require('mysql');
// const config = require('../utils/config-util');
var async= require('async');

class MySqlDB {
    constructor(database) {
        this.connection = mysql.createPool({
            connectionLimit : 10,
           
            host     : "localhost",
            user     : "root",
            password : "",
            database : database,
            debug    :  false,
            timezone: 'utc+11'
        })
        // this.connection = mysql.createPool({
        //     connectionLimit : 10,
           
        //     host     : "54.205.244.13",
        //     user     : "root",
        //     password : "Huna$$123",
        //     database : database,
        //     debug    :  false,
        //     timezone: 'utc+11'
        // })
    }

  

    deleteRow(query) {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function(err, connection) {
                if (err) {
                    // connection.release();
                    reject(err);
                } else {
                    connection.query(query, function(err, res) {
                        if(err) {
                            reject(err);
                        }else {
                            connection.release();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

 
}
module.exports = MySqlDB;