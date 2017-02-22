// First we need to load the node libraries we need in this example, 
// namely node’s own http library plus the express and mongoose packages we already installed on our EC2 instance.

var http      = require('http');
var mongoose  = require('mongoose');
var express   = require('express');

// We need to define variables to represent our express application and our database
var app    = express();
var db;

// Next we need to define the configuration of the other server instance hosting our database. replace the HOST in the following variable definition with your database instance’s public DNS.

var config = {
      "USER"    : "",           
      "PASS"    : "",
      "HOST"    : "ec2-54-237-213-105.compute-1.amazonaws.com",  
      "PORT"    : "27017", 
      "DATABASE" : "my_example"
    };


    var dbPath  = "mongodb://"+config.USER + ":"+
    config.PASS + "@"+
    config.HOST + ":"+
    config.PORT + "/"+
    config.DATABASE;
var standardGreeting = 'Hello World!';


var greetingSchema = mongoose.Schema({
  sentence: String
}); 
var Greeting= mongoose.model('Greeting', greetingSchema);

db = mongoose.connect(dbPath);


mongoose.connection.once('open', function() {
  var greeting;
  Greeting.find( function(err, greetings){
   if( !greetings ){     
      greeting = new Greeting({ sentence: standardGreeting }); 
      greeting.save();
    } 
  }); 
});


app.get('/', function(req, res){
  Greeting.findOne(function (err, greeting) {
    res.send(greeting.sentence);
  });
});

app.use(function(err, req, res, next){
  if (req.xhr) {
    res.send(500, 'Something went wrong!');
  }
  else {
    next(err);
  }
});

console.log('starting the Express (NodeJS) Web server');
app.listen(8080);
console.log('Webserver is listening on port 8080');
