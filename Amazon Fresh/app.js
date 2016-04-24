
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , trips = require('./routes/trips')
  , http = require('http')
  , path = require('path');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use('/',function(req, res) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
  res.sendfile(__dirname + '/public/index.html');
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/*************** Start Backend API *****************/
/*************** Authentication API *****************/
//app.post('/signup', twittercore.signUp);


/*************** Farmers API *****************/


/*************** Customers API *****************/


/*************** Admin API *****************/


/*************** Products API *****************/


/*************** Trips API *****************/
app.post('/api/admin/trips/createTrip',trips.createTrip);
app.post('/api/admin/trips/deleteTrip',trips.deleteTrip);

/*************** End Backend API *****************/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;