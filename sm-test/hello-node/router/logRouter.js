const companyRouter = require("./companyRouter");

module.exports = function(app, logDAO, sessionDAO)
{
// not secured by token
     app.get('/loglist',function(req,res){
      logDAO.find((err, logs)=>{
         if(err) return res.status(500).send({error: 'database failure'})
         res.json({logs})
      })
     });

// for user
     app.post('/log/add', function(req,res){
      if(req.session.logined){
         let log_val = req.body.log
         logDAO.create(log_val)
         .then(d=>{
            res.json({"msg":"ok"})
         })
         .catch(e=>{
            console.log(e)
            res.json({"msg":"fail"})
         })
      }
      else{
         res.json({"msg":"login first"})
     }
  })

// for transaction
     app.post('/log/grant', function(req, res){
        if(req.session.lock!=undefined && req.session.lock!="0"){
         return res.json({"msg":"release first"})
        }

         if(req.session.logined){
            
            if(req.session.lock!=undefined && req.session.lock!="0"){
               req.session.lock = "0"
            }

            let target = req.body.target
            
            
            sessionDAO.find((err, sessions)=>{
               if(err) return res.status(500).send({error: 'database failure'})
                  let lockList=[]
                  sessions.map(data=>{
                     if(JSON.parse(data.session).lock!=undefined && JSON.parse(data.session).lock!="0"){
                        lockList.push(JSON.parse(data.session).lock)
                     }   
                  })
                  let locked = false;

                  lockList.map(lock =>{
                     if(lock==target){
                        locked = true
                        return res.json({"msg":"locked"})
                     }
                  })
                  
                  if(!locked){
                     req.session.lock = target;
                     return res.json({"msg":"granted"})
                  }
               }).exec()
         }
         else{
            return res.json({"msg":"login first"})
       }
     })

     app.get('/log/release', function(req, res){
      if(req.session.logined){
         if(req.session.lock!=undefined && req.session.lock!="0"){
            req.session.lock = "0"
            res.json({"msg":"released"})
         }
         else{
            res.json({"msg":"grant first"})
         }
      }
      else{
         res.json({"msg":"login first"})
   }
  })


  app.post('/log/delete', function(req, res){
     console.log(req.session)
      if(req.session.logined){
            let target = req.body.target
            if(req.session.lock!=undefined && req.session.lock==target){


               logDAO.findOne({"_id":target})
               .then(logData=>{
                  if(logData!=null){
                     logDAO.deleteOne({"_id":target})
                     .then(d =>{
                           res.json({"msg":"ok"})
                     })
                     .catch(e=>{
                           console.log(e)
                           res.json({"msg":"fail"})
                     })
                  }
                  else{
                     res.json({"msg":"notExist"})
                  }
               })
               .catch(e=>{
                  console.log(e)
                  res.json({"msg":"fail"})
               })
               
               
            }
            else{
               res.json({"msg":"grant first"})
            }
      }
      else{
            res.json({"msg":"login first"})
      }
   })
   app.put('/log/update', function(req, res){
      console.log(req.session)
      if(req.session.logined){
         let target = req.body.target
         let data = req.body.log
         if(req.session.lock!=undefined && req.session.lock==target){
               logDAO.updateOne({"_id":target}, {$set: {...data}})
               .then(result =>{
                  //console.log(result)
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
         res.json({"msg":"grant first"})
         }
      }
      else{
         res.json({"msg":"login first"})
   }
   })

     
}