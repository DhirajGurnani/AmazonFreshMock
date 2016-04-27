
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
  , farmers = require('./routes/farmer')
  , http = require('http')
  , path = require('path')
  , random = require('./routes/random');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.use('/',function(request, response) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
	if(request.session) {
		if(request.session.profile) {
			if(request.session.profile.role === 'customer') {
				console.log("role == customer: ");
				response.sendfile(__dirname + '/public/index.html');
			}
			else if(request.session.profile.role === 'admin') {
				console.log("role == admin: ")
				response.sendfile(__dirname + '/public/admin.html');
			}
			else if(request.session.profile.role === 'farmer') {
				console.log("role == farmer: ");
				response.sendfile(__dirname + '/public/farmer.html');
			}
		}
		else {
			console.log("No Profile: ");
			response.sendfile(__dirname + '/public/index.html');
		}
	}
	else {
		console.log("NO session: ");
		response.sendfile(__dirname + '/public/index.html');
	}
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', routes.index);
//app.get('/users', user.list);

/*************** Start Backend API *****************/

/*************** Authentication API *****************/
//app.post('/signup', twittercore.signUp);


/*************** Farmers API *****************/
/*****Farmers*****/
app.get('/api/farmers', farmers.getFarmers);
app.get('/api/farmers/:puid', farmers.getFarmerByPuid);
app.post('/api/farmers/:puid/update', farmers.updateFarmer);
app.post('/api/farmers/:puid/delete', farmers.deleteFarmerByPuid);
app.post('/postvideo', farmers.postVideo);
app.get('/video', farmers.getVideo);
app.get('/video/get', random.getVideo);
app.post('/video/post', random.postVideo);
/*****Farm Info*****/

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