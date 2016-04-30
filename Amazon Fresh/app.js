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
  , billing = require('./routes/billing')
  , farmers = require('./routes/farmer')
  , http = require('http')
  , path = require('path')
  , random = require('./routes/random');

var https = require('https');
/*
 * Session Management and Session Store using Passport JS
 * */
var mongoSessionURL = "mongodb://localhost:27017/login";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo")(expressSessions);
var cookieParser = require('cookie-parser');
var passport = require('passport');
require('./routes/passport')(passport);

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
//app.use(express.static(__dirname + '/public'));


/*Session Data
 * */
app.use(express.cookieParser());
app.use(expressSessions({
  secret: "CMPE273_passport",
  resave: false,
  saveUninitialized: false,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 6 * 1000,
  store: new mongoStore({
    url: mongoSessionURL
  })
}));
app.use(passport.initialize());

app.use(app.router);
app.use('/', function(request, response) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
	if(request.session) {
		if(request.session.profile) {
			if(request.session.profile[0].role === 'customer') {
				console.log("role == customer: ");
				response.sendfile(__dirname + '/public/customer.html');
			}
			else if(request.session.profile[0].role === 'admin') {
				console.log("role == admin: ")
				response.sendfile(__dirname + '/public/admin.html');
			}
			else if(request.session.profile[0].role === 'farmer') {
				console.log("role == farmer: ");
				response.sendfile(__dirname + '/public/farmer.html');
			}
		}
		else {
			console.log("No Profile: ");
			response.sendfile(__dirname + '/public/customer.html');
		}
	}
	else {
		console.log("NO session: ");
		response.sendfile(__dirname + '/public/customer.html');
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
/*************** General API *****************/
app.get('/api/zipcode/:zip', function(request, response) {
	
    var containsObject = function(array, object, success, failure) {
    	for(var index = 0; index < array.length; index++) {
    		if(array[index] == object) {
				success();
			}
    	}
    	failure();
    };
	
	var zipCodes = [ 94089, 95002, 95013, 95050, 95054, 95110, 95111, 95112, 95113, 
	                 95116, 95118, 95119, 95120, 95121, 95122, 95123, 95126, 95129, 
	                 95130, 95131, 95134, 95135, 95136, 95138, 95139, 95140, 95148];
	
	containsObject(
			zipCodes, 
			request.params.zip, 
			function() {
				response.send({
					"status" : 200,
					"availability" : true
				});
			}, function() {
				response.send({
					"status" : 200,
					"availability" : false
				});
			});
});

app.post('/api/convertToLatLng', function(request, response) {

    var options = {
        host: 'maps.googleapis.com',
        path: '/maps/api/geocode/json?address=' +
            encodeURIComponent(request.body.address.trim()) +
            encodeURIComponent(request.body.location.trim()) +
            encodeURIComponent(request.body.state.trim()) +
            encodeURIComponent(request.body.zipcode.trim()) +
            '&key=AIzaSyAedFlNKrewiALWjKTQfNHB6Y7yjRbDaoU'
    };

    https.get(options, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function(chunk) {
            console.log('BODY: ' + chunk);
            body += chunk;
        });
        res.on('end', function() {
            console.log("body: " + body)

            var parsedBody = JSON.parse(body);
            var geometry = parsedBody.results[0].geometry;

            response.send({
                "status": 200,
                "geometry": geometry
            });
        });
    }).end();
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
});

/*************** Authentication API *****************/
app.post('/api/login', function(req, res, next) {
	  passport.authenticate('login', function(err, user, info) {
	    if(err) {
	      return next(err);
	    }

	    if(!user) {
	      return res.redirect('/');
	    }

	    req.logIn(user, {session:false}, function(err) {
	      if(err) {
	        return next(err);
	      }
	      console.log(req.session);
	      req.session.profile=user;
	      console.log("session initilized");
	      return res.send({profile:user});
	    })
	  })(req, res, next);
	});

	app.get('/api/login', isAuthenticated, function(req, res) {
		console.log(req.session);
		return res.send({user:req.session.username});
	});

	function isAuthenticated(req, res, next) {
	  if(req.session.user) {
	     console.log(req.session.user);
	     return next();
	  }
	  console.log(req.session);
	  res.redirect('/');
	};
	
app.post('/api/logout',function(request,response){
	request.session.destroy();
	response.redirect('/');
});

app.get('/api/getSessionInfo',function(request,response){
	//console.log(request.session);
	response.send(request.session);
});
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
app.get('/api/farmers/:puid/video', farmers.getVideoForFarmerByPuid);
app.post('/api/farmers/:puid/video', farmers.postVideoForFarmerByPuid);
app.get('/api/farmers/:puid/images', farmers.getImageUrlsForFarmerByPuid);
app.get('/api/farmers/images/:imageName', farmers.getImageByImageUrl);
app.post('/api/farmers/:puid/images', farmers.postImagesForFarmerByPuid);
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
app.get('/api/product',product.getAllProducts);
app.get('/api/product/:product_id',product.getProductByProductId);
app.get('/api/product/category/:category_id',product.getAllProductsByCategoryId);
app.get('/api/product/subcategory/:subcategory_id', product.getProductBySubcategoryId);
app.get('/api/product/category/:category_id/subcategory/:subcategory_id',product.getProductsByCAtegoryIdAndSubCategoryId);
app.post('/api/product/:product_id/update',product.updateProductByProductId);
//app.post('api/product/:product_id/delete',product.deleteProductByProductId);
app.get('/api/product/:product_id/ratings',product.getProductRatingsByProductId);
app.post('/api/product/:product_id/delete',product.deleteProductByProductId);

app.post('/api/product/:product_id/updateQuantity', product.updateQuantityByProductId);

app.get('/api/products/:product_id/images', product.getImageUrlsForProductByProductId);
app.post('/api/products/:product_id/images', product.postImagesForProductByProductId);
app.get('/api/products/images/:imageName', product.getImageByImageUrl);

/*************** Trips API *****************/
app.post('/api/admin/trips/createTrip',trips.createTrip);
app.post('/api/admin/trips/deleteTrip',trips.deleteTrip);
app.get('/api/admin/trips/getTrips',trips.getTrips);
app.get('/api/admin/trips/getPendingTrips',trips.getPendingTrips);
app.get('/api/admin/trips/availableDrivers',trips.availableDrivers);
app.get('/api/admin/trips/availableTrucks',trips.availableTrucks);
app.get('/api/admin/trips/getBills',trips.getBills);
app.get('/api/admin/trips/locationStats',trips.locationStats);
app.get('/api/admin/trips/revenueStats',trips.revenueStats);

/*************** Billing API *****************/
app.post('/api/billing/create', billing.createNewBill);

/*************** Billing API *****************/
app.post('/api/billing/create', billing.createNewBill);

/*************** End Backend API *****************/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;