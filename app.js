//jshint esversion:6
require('dotenv').config(); //this doesnt need const and must always beat TOP
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption'); ///this was removed because its just level2 security
// const md5 = require('md5');//this is level 3 security
const bcrypt = require('bcrypt'); //this is level 4 security
const saltRounds = 10; /// 10 means how many times u want passwords to be bcrypted/secured
//below 4 const passport passport-local passport-local-mongoose express-sess
//ion are for cookies


const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));// tells express to use our css in public folder

// connect mongDB(blogDB) database url
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({ /// we added new mongoose.Schema() to mongoose bcos we want to use password encryption
  email: String,
  password: String
});
/// direct below is const for our long encryption and how to use it
//const secret = 'this const was moved to env forsecurity reasons'; // u can use any long text u want
// const secret = process.env.SECRET; //the SECRET is from .env file, process.env.PROCESS is how to use it
// userSchema.plugin(encrypt,{secret: secret, encryptedFields: ['password'] });
//////////the 2above funcs were removed because its just level2 security

const User = new mongoose.model('User', userSchema);
//////////// app.get section/////////////////
app.get('/', function(req,res){
  res.render('home');
  });

  app.get('/register', function(req,res){
    res.render('register');
  });

  app.get('/login', function(req,res){
    res.render('login');
  });
  /////  !!! we dont have app.secrets page, because user can only see it when they login /register
////////////// user register section/////////////
// app.get('/reqister',function(req,res){
//   res.render('register');
// });
app.post('/register',function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //level 4 security(auto salting and hasshing)
    // Store hash in your password DB.
    // here we create the new user with the info they passed in
    const newUser = new User({
      email: req.body.username,
      // password: md5(req.body.password)///// here we added md5 level 3 security
    password: hash  /// level 4 security
    });
    ///then save user into database
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        console.log(newUser);
        res.render('secrets');
      }
    });
});

});
////// user login section
app.post('/login',function(req,res){
  const username = req.body.username;
  // const password = md5(req.body.password);///// here we added md5 level 3 security
  const password= req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        // then check to see if foundUsers password is the same that user entered during registeration
        // if(foundUser.password === password){
        bcrypt.compare(password, foundUser.password, function(err, result) {
         if (result == true){
         /// if passward matches with one in users database password, then
          res.render('secrets');
          }
        });

      }
    }
  });
});

////// user logout section









//app dot listen section
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;}

app.listen(port, function() {
  console.log("Server have started Successfully.");
});
