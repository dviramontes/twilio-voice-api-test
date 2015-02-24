
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//require the Twilio module and create a REST client
var twilio = require('twilio');

var app = express();
var message = "";

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/makecall', function(req,res,next){
  message = req.query.msg;
  console.log(message);
  var client  = new twilio(process.env.twilio_accountSid, process.env.twilio_authToken);
  client.calls.create({
    to: process.env.my_cell_number,
    from: process.env.my_twilio_number,
    method: "GET",
    fallbackMethod: "GET",
    statusCallbackMethod: "GET",
    record: "false",
    url:"https://39b20d26.ngrok.com/callmeback"
  }, function(err, call) {
    if(err){
      console.error(err);
      res.status(500).end('server error:' + err.message);
    }else {
      console.log(call);
      res.status(200).end("now making call..");
    }
  });
});

app.get('/callmeback', function(req,res,next){
  var resp = new twilio.TwimlResponse();
  resp.say("Welcome to s6-voice whatever app..");
  resp.say('Here is your message ' + message, {
    voice:'woman',
    language:'en-gb'
  });
  res.type('text/xml').status(200).end(resp.toString());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
