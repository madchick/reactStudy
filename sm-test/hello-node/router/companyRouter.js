module.exports = function(app, companyDAO)
{
// not secured by token
     app.get('/companylist',function(req,res){
      companyDAO.find((err, companys)=>{
         if(err) return res.status(500).send({error: 'database failure'})
         res.json({companys})
      }).exec()
     });

     // for user
     app.post('/addcompany', function(req,res){
         if(req.session.logined){
            let companyName_val = req.body.companyName;
            let service_val = req.body.service;
            companyDAO.findOne({"companyName":companyName_val})
            .then(companyData=>{
                if(companyData==null){
                    companyDAO.create({companyName : companyName_val, service : service_val})
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
            res.json({"msg":"login first"})
        }
     })
     app.post('/deletecompany', function(req,res){
         console.log(req.session)
         console.log(req.body)
         if(req.session.logined){
            let companyName_val = req.body.companyName;

            companyDAO.findOne({"companyName":companyName_val})
            .then(companyData=>{
                if(companyData!=null){
                  companyDAO.remove({companyName: companyName_val})
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
            res.json({"msg":"login first"})
        }
     })
     app.put('/updatecompany', function(req,res){
         if(req.session.logined){
            let companyName_val = req.body.companyName;
            let new_service_val = req.body.service;
            
            companyDAO.updateOne({"companyName":companyName_val}, {$set: {"service" : new_service_val}})
            .then(result =>{
               console.log(result)
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
            res.json({"msg":"login first"})
        }
     })

}