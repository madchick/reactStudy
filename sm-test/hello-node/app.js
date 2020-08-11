var fs = require('fs');
var express = require('express')
var session = require('express-session');
var https = require('https');
var MongoStore = require('connect-mongo')(session);

var app = express()
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({ origin:true, credentials:true, exposedHeaders: ["set-cookie"] }));


var routesArray = ['/'];
app.use( session({
  name : 'token',
  secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: "mongodb://127.0.0.1/maintenance",
    collection: "sessions"
  }),
  cookie:{
    expires : false,
    maxAge : 60 * 60 * 1000
    //sameSite : 'none',
    //secure: 'true'
  }
}));


var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/maintenance');


var company = require('./models/company');
var log = require('./models/log');
var user = require('./models/user');
var session = require('./models/session');


var companyRouter = require('./router/companyRouter')(app, company);
var logRouter = require('./router/logRouter')(app, log, session);
var userRouter = require('./router/userRouter')(app, user);


// const options = {
// 	key: fs.readFileSync('./keys/private.pem'),
// 	cert: fs.readFileSync('./keys/public.pem')
// };


var port = process.env.PORT || 8081;
var server = app.listen(port, function(){
  console.log("Express server has started on port 8081")
})

// https.createServer(options, app).listen(443, function(){
//     console.log("https Express server has started on port 443")
// })


var cron = require('node-cron');

cron.schedule('5 1 * * *', function(){
  session.remove({},()=>{});

  
  console.log('node-cron 실행 테스트');
});

//새벽 1시 5분마다 실행됨