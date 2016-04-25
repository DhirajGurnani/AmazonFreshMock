
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , trips = require('./routes/trips')
  , authentication = require('./routes/authentication')
  , customer = require('./routes/customer')
  , product = require('./routes/product')
  , admin = require('./routes/admin')
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
app.post('/api/customers/:puid/update',customer.updatecustomer);
app.post('/api/customer/:puid/delete',customer.deletecustomer);

/*************** Admin API *****************/
app.post('/api/admin/approveFarmer',admin.approvefarmer);
app.post('/api/admin/approveProduct',admin.approveproduct);


/*************** Products API *****************/
app.post('/api/register',authentication.signup);
app.post('/api/product/create',product.createproduct);
app.get('/api/products',product.listallproducts);
app.get('/api/product/:product_id',product.showparticularproducts);
app.post('/api/product/:categoryid',product.listproductsbycategoryid);
app.post('/api/product/:categoryid/:subcategoryid',product.listproductsbysubcategoryid);
app.post('api/product/:product_id/update',product.updateproduct);
app.get('/api/product/:product_id/ratings',product.productratings);
app.get('/api/product/:product_id/reviews',product.productreview);
app.post('/api/product/:product_id/delete',product.deleteproduct);


/*************** Trips API *****************/
app.post('/api/admin/trips/createTrip',trips.createTrip);
app.post('/api/admin/trips/deleteTrip',trips.deleteTrip);
app.get('/api/admin/trips/getTrips',trips.getTrips);
app.get('/api/admin/trips/getPendingTrips',trips.getPendingTrips);
app.get('/api/admin/trips/availableDrivers',trips.availableDrivers);
app.get('/api/admin/trips/availableTrucks',trips.availableTrucks);

/*************** End Backend API *****************/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;