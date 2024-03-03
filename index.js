let express = require("express")
let app = express()
let cors = require("cors")
let crud = require("./utils/crud")
let session = require("express-session")
let uuid = require("uuid").v4
mysql = require("mysql2")
// let connection = mysql.createConnection({
//   host:"localhost",
//   user:"root",
//   password:"1234",
//   database:"acs"
// })

app.use(
   cors()
)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
app.use(express.json())
let Utils = new crud.Utils()
app.post("/getAuthenticity",(req,res)=>{
    if(Object.keys(req.session)){
       
    }
})
app.post("/login",(req,res)=>{
    
    let _rows = connection.execute('SELECT email,password FROM intern WHERE email = ?', [req.body.email],function(err,rest){
         console.log(err)
       
            if(!err){
                if(rest.length>0){
                  req.session.sesid= rest[0].password
                  res.end(JSON.stringify({auth:req.session.sesid}))
                }else{
                    res.end(JSON.stringify({error:400,message:"User not Found"})) 
               }
            }
    //      bcrypt.compare(req.body.password, rest[0].password, function(err, ec) {
           
    //    });
        
        else{
            res.end(JSON.stringify({error:400,message:"Someting went wrong"}))
           
        }
    })
    
})
// Current working updates
let secret = "454545445"
app.post("/getModule",(req,res)=>{

  let v =  Utils.connection.execute(`select * from module_create where module_id=${req.body.module_id}`,function(err,result){
           if(err){
            res.end(JSON.stringify({err:"Note found"}))
           } 
           else{
              res.end(JSON.stringify(result))
           }    
  })

   
})
app.post("/getLearner",(req,res)=>{

    let v =  Utils.connection.execute(`select * from learner_reg where learner_id=${req.body.learner_id}`,function(err,result){
             if(err){
              res.end(JSON.stringify({err:"Note found"}))
             } 
             else{
                res.end(JSON.stringify(result))
             }    
    })
  
     
  })
  app.post("/getProgramDetails",(req,res)=>{

    let v =  Utils.connection.execute(`select * from program_create where program_id=${req.body.program_id}`,function(err,result){
             if(err){
              res.end(JSON.stringify({err:"Note found"}))
             } 
             else{
                res.end(JSON.stringify(result))
             }    
    })
  
     
  })
app.post("/gentoken",(req,res)=>{
    
   Utils.select("DATA_SELECT","learner_reg",["learner_id"],["user_name","pass_word"],[req.body.username,req.body.password])
   .then((e)=>{
      let token = Utils.generateToken(Utils.currentProgress.data,secret)
       req.session.views = token 
       res.end(JSON.stringify({session:"open"}))
   })
  
})
app.post("/decrypt",(req,res)=>{
    let decrypt = Utils.decryptToken(req.session.views,secret)
    res.end(JSON.stringify({decrypted:decrypt}))
})
// app.post("/check",(req,res)=>{
//     console.log(req.session)
// })
app.post("/fetchprograms",(req,res)=>{
    if(Object.keys(req.session).includes("views") && Utils.decryptToken(req.session.views,secret)){
    Utils.select("DATA_SELECT","learner_reg",["learner_id"],["user_name","pass_word"],[req.body.username,req.body.password])
    .then((valueLearner)=>{
          
        Utils.select("DATA_SELECT","program_learn",["program_id","status"],["learner_id"],[Utils.currentProgress.data[0].learner_id],isCarry="status")

        .then((passby)=>{
            let passbySat = Utils.currentProgress.data.map((value)=>{
                return value.status
            })
           Utils.SingleColumnMultiValue("DATA_SELECT","program_create",["program_id","program_name"],["program_id"],[...Utils.currentProgress.data.map((value)=>{
                       return value.program_id;
           })],passby).then((valueLearner)=>{
             
              res.end(JSON.stringify([Utils.currentProgress,{continueStatus:passbySat}]))
           })


        })
        

    })
   
}else{
    res.end(JSON.stringify({auth:"Auth error"}))
}
   
})

// app.post("/registerstudent",(req,res)=>{
//     let fields = Utils.defragmentBody(req.body)
//     Utils.insert("DATA_INSERT","learner_reg",[...fields])
//     .then((e)=>{
//         res.end(JSON.stringify(Utils.currentProgress))
//     })

   
// })

// app.post("/role_create",(req,res)=>{
//     let fields = Utils.defragmentBody(req.body)
//     Utils.insert("DATA_INSERT","role_create",[...fields])
//     .then((e)=>{
//         res.end(JSON.stringify(Utils.currentProgress))
//     })

   
// })
// app.post("/module_create",(req,res)=>{
//     let fields = Utils.defragmentBody(req.body)
//     Utils.insert("DATA_INSERT","module_create",[...fields])
//     .then((e)=>{
//         res.end(JSON.stringify(Utils.currentProgress))
//     })

   
// })
// app.post("/list_login",(req,res)=>{
//     console.log(req.body)
//     Utils.select("DATA_INSERT","register",[...req.body.selection])
//     .then((e)=>{
    
//         res.end(JSON.stringify(Utils.currentProgress))
//     })

   
// })
app.listen(8080)
