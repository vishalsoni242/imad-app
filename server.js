var config = {
    user: 'vishalhari24',
    database: 'vishalhari24',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: 'db-vishalhari24-16682'
};
var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/article-one',function(req,res) {
   res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

var counter = 0;
app.get('/counter',function(req,res) {
   counter = counter + 1;
   res.send(counter.toString());
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

function hash(input,salt) {
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return hashed.toString('hex');
}

app.get('/hash/:input' , function(req,res) {
   var hashedstring = hash(req.params.input , 'this-is-random-string');
   res.send(hashedstring);
});
var pool = new pool(config);
app.post('/create-user',function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
   var salt = crypto.getRandomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query ('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result) {
      if(err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created  '+ username);
         
      }
   });
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
