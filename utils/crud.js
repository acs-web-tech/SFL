/*
   Status for  CRUD OPERATION 
   0 - Insert
   1 - update
   2 - select 
   3 - delete
   4 - Failure


*/
class Utils{
    jwt = require("jsonwebtoken")
    mysql = require("mysql2") 
    query = require("./querystring/querystr.js")
    connection  = this.mysql.createConnection({
        host:"localhost",
        password:"",
        user:"root",
        database:"sfl_db"
    })
    currentProgress = {processname:"nill",status:"nill",data:"nill"}
//    constructor(data,secretkey){
//     this.encdata = data 
//     this.privateKey = secretkey
//    }
   generateToken(validityOfHash){
     return this.jwt.sign({ encdata:this.encdata }, this.privateKey, { algorithm: 'RS256' });

   }
   insert(processname,tablename,fields,rules){
    return new Promise(function(res,rej){
        this.connection.execute(`insert into  ${tablename} values(${fields.map((value)=>"?")})`,[...fields],function(err,result){
           
               if(!err){
                  this.currentProgress = {processname,status:2,data:result}
                  res()
               }else{
                  this.currentProgress = {processname:"FAILURE",status:4,data:err}
                  rej(err)
               }
        }.bind(this))
    }.bind(this))
     }
   
   select(processname,tablename,fields,rules){
    return new Promise(function(res,rej){
    this.connection.execute(`select ${fields}  from ${tablename}`,function(err,result){
       
           if(!err){
              this.currentProgress = {processname,status:2,data:result}
              res()
           }else{
              this.currentProgress = {processname:"FAILURE",status:4,data:err}
              rej(err)
           }
    }.bind(this))
}.bind(this))
 }
 defragmentBody(body){
   let array = [] ;
   for(let value in body) array.push(body[value])
   console.log(array)
   return array
 }
}
module.exports.Utils = Utils