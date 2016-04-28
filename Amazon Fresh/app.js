/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), trips = require('./routes/trips'), authentication = require('./routes/authentication'), customer = require('./routes/customer'), product = require('./routes/product'), admin = require('./routes/admin'), farmers = require('./routes/farmer'), http = require('http'), path = require('path'), random = require('./routes/random');

/*
 * Session Management and Session Store using Passport JS
 */
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
// app.use(express.static(__dirname + '/public'));

/*
 * Session Data
 */
app.use(express.cookieParser());
app.use(expressSessions({
	secret : "CMPE273_passport",
	resave : false,
	saveUninitialized : false,
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 6 * 1000,
	store : new mongoStore({
		url : mongoSessionURL
	})
}));
app.use(passport.initialize());

app.use(app.router);
app.use('/', function(request, response) {
	// Use res.sendfile, as it streams instead of reading the file into memory.
	if (request.session) {
		if (request.session.profile) {
			if (request.session.profile.role === 'customer') {
				console.log("role == customer: ");
				response.sendfile(__dirname + '/public/customer.html');
			} else if (request.session.profile.role === 'admin') {
				console.log("role == admin: ")
				response.sendfile(__dirname + '/public/admin.html');
			} else if (request.session.profile.role === 'farmer') {
				console.log("role == farmer: ");
				response.sendfile(__dirname + '/public/farmer.html');
			}
		} else {
			console.log("No Profile: ");
			response.sendfile(__dirname + '/public/customer.html');
		}
	} else {
		console.log("NO session: ");
		response.sendfile(__dirname + '/public/customer.html');
	}
});

app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);

/** ************* Start Backend API **************** */
/** ************* General API **************** */
app.get('/api/zipcode/:zip', function(request, response) {

	var containsObject = function(array, object, success, failure) {
		for (var index = 0; index < array.length; index++) {
			if (array[index] == object) {
				success();
			}
		}
		failure();
	};

	var zipCodes = [ 94089, 95002, 95013, 95050, 95054, 95110, 95111, 95112,
			95113, 95116, 95118, 95119, 95120, 95121, 95122, 95123, 95126,
			95129, 95130, 95131, 95134, 95135, 95136, 95138, 95139, 95140,
			95148 ];

	containsObject(zipCodes, request.params.zip, function() {
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

/** ************* Authentication API **************** */
app.post('/api/login', function(req, res, next) {
	passport.authenticate('login', function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			// return res.redirect('/');
		}

		req.logIn(user, {
			session : false
		}, function(err) {
			if (err) {
				console.log("err");
				return next(err);
			}
			// console.log(err);
			// console.log(req.session);
			req.session.profile = user;
			// console.log("session initilized");
			// console.log(user);
			res.send({
				"status" : 200,
				"profile" : user
			});

		})
	})(req, res, next);
});

function isAuthenticated(req, res, next) {
	if (req.session.user) {
		console.log(req.session.user);
		return next();
	}
	console.log(req.session);
	// res.redirect('/');
};

/** ************* Farmers API **************** */
/** ***Farmers**** */
app.get('/api/farmers', farmers.getFarmers);
app.get('/api/farmers/:puid', farmers.getFarmerByPuid);
app.post('/api/farmers/:puid/update', farmers.updateFarmer);
app.post('/api/farmers/:puid/delete', farmers.deleteFarmerByPuid);
app.post('/postvideo', farmers.postVideo);
app.get('/video', farmers.getVideo);
app.get('/video/get', random.getVideo);
app.post('/video/post', random.postVideo);
/** ***Farm Info**** */

/** ************* Customers API **************** */
app.post('/api/customers/:puid/update', customer.updatecustomer);
app.post('/api/customer/:puid/delete', customer.deletecustomer);

/** ************* Admin API **************** */
app.post('/api/admin/approveFarmer', admin.approvefarmer);
app.post('/api/admin/approveProduct', admin.approveproduct);

/** ************* Products API **************** */
app.post('/api/register', authentication.signup);
app.post('/api/product/create', product.createproduct);
app.get('/api/products', product.listallproducts);
app.get('/api/product/:product_id', product.showparticularproducts);
app.post('/api/product/:categoryid', product.listproductsbycategoryid);
app.post('/api/product/:categoryid/:subcategoryid',
		product.listproductsbysubcategoryid);
app.post('api/product/:product_id/update', product.updateproduct);
app.get('/api/product/:product_id/ratings', product.productratings);
app.get('/api/product/:product_id/reviews', product.productreview);
app.post('/api/product/:product_id/delete', product.deleteproduct);

/** ************* Trips API **************** */
app.post('/api/admin/trips/createTrip', trips.createTrip);
app.post('/api/admin/trips/deleteTrip', trips.deleteTrip);
app.get('/api/admin/trips/getTrips', trips.getTrips);
app.get('/api/admin/trips/getPendingTrips', trips.getPendingTrips);
app.get('/api/admin/trips/availableDrivers', trips.availableDrivers);
app.get('/api/admin/trips/availableTrucks', trips.availableTrucks);
app.get('/api/admin/trips/getBills', trips.getBills);

/** ************* End Backend API **************** */

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;