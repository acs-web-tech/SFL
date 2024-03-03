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

   // constructor(data,secretkey){
    
   //  this.privateKey = secretkey
   // }
   generateToken(hash_data,secret){
     
     return this.jwt.sign({ encdata:hash_data }, secret);
    
   }
   decryptToken(hash,secret){
      let decoded = this.jwt.verify(hash, secret);
      return decoded
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
   
   select(processname,tablename,fields,conditions=[],condvalue=[],iscarry){
     
      
     let formatQuery = `select ${fields}  from ${tablename}   `
     
     if(conditions.length>0){
      let conditionKey = Object.keys(conditions);
      let formatString = '';
      
      conditionKey.forEach((value, index) => {
        if (index == 0) {
          formatString += ` where ${conditions[value]}='${condvalue[index]}'`;
        } else {
          formatString += ` and ${conditions[value]}='${condvalue[index]}'`;
        }
      });
      formatQuery+=formatString
     }
    return new Promise(function(res,rej){
    this.connection.execute(formatQuery,function(err,result){
       
           if(!err){
              this.currentProgress = {processname,status:2,data:result}
              res(iscarry?result[iscarry]:"")
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
 SingleColumnMultiValue(processname,tablename,fields,conditions=[],condvalue=[],rules){
   let formatQuery = `select ${fields}  from ${tablename}    `
   let formatString = ``
   let condvalueFormat = `${condvalue}`
   condvalueFormat = condvalueFormat.split(",").toString()
   
   console.log(condvalueFormat)
    
   formatString += ` where ${conditions[0]} in (${condvalueFormat})`;
   formatQuery += formatString
   console.log(formatQuery)
   return new Promise(function(res,rej){
      this.connection.execute(formatQuery,function(err,result){
         
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
}
let myutil = new Utils()


module.exports.Utils = Utils