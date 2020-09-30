const crypto = require('crypto');
const secret = 'J_NE_$$AACC12SS_NSNESS$1$234';


module.exports = function(app, userDAO)
{

    

//for all
     app.post('/login', (req, res) => {

        let id_val = req.body.id;
        let pwd_val = crypto.createHmac('sha256', secret).update(req.body.pwd).digest('hex');
        
        if(req.session==null || req.session.logined==false || req.session.logined==undefined){
            userDAO.findOne({"id":id_val, "pwd":pwd_val})
            .then(d =>{
                if(d!=null){
                    req.session.logined = true;
                    req.session.user_id = req.body.id;
                    req.session.lock = "0";
                    if(id_val=="admin"){
                        res.json({"msg":"admin"})    
                    }
                    else{
                        res.json({"msg":"ok"})
                    }
                    
                }
                else{
                    res.json({"msg":"notExist"})
                }
            })
            .catch(e=>{
                res.json({"msg":"fail"})
            })
        }
        else{
            res.json({"msg":"logout first"})
        }

      });

      app.get('/logout', (req, res) => {
        if(req.session!=null && req.session.logined==true){
            req.session.destroy();
            res.clearCookie('token')
            res.json({"msg":"ok"})
        }
        else{
            res.json({"msg":"login first"})
        }
        
      });


//admin only
      app.get('/userlist',function(req,res){
        if(req.session.logined && req.session.user_id=='admin'){
            userDAO.find((err, users)=>{
            if(err) return res.status(500).send({error: 'database failure'})
            users = users.map(user=>{
                user.pwd="hidden"
                return user
            })

            res.json({users})
            }).exec()
        }
        else{
            res.json({"msg":"fail"})
        }
    });

      app.post('/pwdchange', (req, res) => {
        if(req.session.logined && req.session.user_id=='admin'){
            let id_val = req.body.id;
            let old_pwd_val = crypto.createHmac('sha256', secret).update(req.body.old_pwd).digest('hex');
            let new_pwd_val = crypto.createHmac('sha256', secret).update(req.body.new_pwd).digest('hex');
            

            userDAO.updateOne({"id":id_val, "pwd":old_pwd_val}, {$set: {"pwd" : new_pwd_val}})
            .then(result =>{
                if(result.n){
                    res.json({"msg":"ok"})
                }
                else{
                    res.json({"msg":"notExist"})
                }
            })
            .catch(e=>{
                res.json({"msg":"fail"})
            })
        }
        else{
            res.json({"msg":"fail"})
        }
    });  


    app.post('/register', (req, res) => {
        console.log(req.session);

        
        if(req.session.logined && req.session.user_id=='admin'){
            let id_val = req.body.id;
            let pwd_val = crypto.createHmac('sha256', secret).update(req.body.pwd).digest('hex');
            userDAO.findOne({"id":id_val})
            .then(userData=>{
                if(userData==null){
                    userDAO.create({id: id_val, pwd: pwd_val})
                    .then(d =>{
                        res.json({"msg":"ok"})
                    })
                    .catch(e=>{
                        console.log(e)
                        res.json({"msg":"fail"})
                    })
                }
                else{
                    res.json({"msg":"exist"})
                }
            })
            .catch(e=>{
                console.log(e)
                res.json({"msg":"fail"})
            })
        }
        else{
            res.json({"msg":"please admin"})
        }
    });

    app.post('/deleteuser', (req, res) => {
        if(req.session.logined && req.session.user_id=='admin'){
            let id_val = req.body.id;
            if(id_val=='admin'){
                res.json({"msg":"fail"})
                return
            }


            userDAO.findOne({"id":id_val})
            .then(userData=>{
                if(userData!=null){
                    userDAO.remove({id: id_val})
                    .then(d =>{
                        res.json({"msg":"ok"})
                    })
                    .catch(e=>{
                        console.log(e)
                        res.json({"msg":"fail"})
                    })
                }
                else{
                    res.json({"msg":"not exist"})
                }
            })
            .catch(e=>{
                console.log(e)
                res.json({"msg":"fail"})
            })
        }
        else{
            res.json({"msg":"fail"})
        }
    });
}