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
    cookie: { secure: true }
  }))
app.use(express.json())
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
let Utils = new crud.Utils()
app.post("/admincreate",(req,res)=>{
   
    let fields = Utils.defragmentBody(req.body)
    Utils.insert("DATA_INSERT","admin_create",[...fields])
    .then((e)=>{
      res.end(JSON.stringify(Utils.currentProgress))
    })

   
})
app.post("/registerstudent",(req,res)=>{
    let fields = Utils.defragmentBody(req.body)
    Utils.insert("DATA_INSERT","learner_reg",[...fields])
    .then((e)=>{
        res.end(JSON.stringify(Utils.currentProgress))
    })

   
})

app.post("/role_create",(req,res)=>{
    let fields = Utils.defragmentBody(req.body)
    Utils.insert("DATA_INSERT","role_create",[...fields])
    .then((e)=>{
        res.end(JSON.stringify(Utils.currentProgress))
    })

   
})
app.post("/module_create",(req,res)=>{
    let fields = Utils.defragmentBody(req.body)
    Utils.insert("DATA_INSERT","module_create",[...fields])
    .then((e)=>{
        res.end(JSON.stringify(Utils.currentProgress))
    })

   
})
app.post("/list_login",(req,res)=>{
    console.log(req.body)
    Utils.select("DATA_INSERT","register",[...req.body.selection])
    .then((e)=>{
    
        res.end(JSON.stringify(Utils.currentProgress))
    })

   
})
app.listen(8080)
