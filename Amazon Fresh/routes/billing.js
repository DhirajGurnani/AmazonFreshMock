/**
 * @author: Vaisham
 * 
 * Billing Module
 */
var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');
var https = require('https');

exports.createNewBill = function(request, response) {
	if(true) {
		if(true) {
			try {
				var customer_id = request.body.customer_id;
				var address = request.body.address;
				var location = request.body.location;
				var state = request.body.state;
				var zipcode = request.body.zipcode;
				var phone = request.body.phone;
				var total_price = request.body.total_price;
				var delivery_date = request.body.delivery_date;
				var delivery_id = request.body.delivery_id;
				var status = "placed";
				
				var billing_id;
				
				var sqlQuery  = sqlQueryList.getQueryForBillingCreation(customer_id, address, location, state, zipcode, phone, total_price, delivery_date, delivery_id, status);
				dbHelper.executeQuery(sqlQuery, 
						function(success){
							console.log("success: " + success);
							billing_id = success.insertId;
  							console.log("billing_id: " + billing_id);
  							console.log(request.body.products);
							for(var index = 0; index < request.body.products.length; index++) {
								console.log("index: " + index);
 
								dbHelper.executeQuery(sqlQueryList.getQueryForBillingInfoCreation(billing_id, request.body.products[index].product_id, request.body.products[index].quantity), function(data) {
									console.log(data);
								}, function(error) {
									console.log("error: " + error);
								});
							}
							
							console.log("query2: " + sqlQueryList.getFarmerProfileByProductId(request.body.products[0].product_id));
							dbHelper.executeQuery(sqlQueryList.getFarmerProfileByProductId(request.body.products[0].product_id), 
									function(profile) {
								console.log(profile);
									var options = {
										  host: 'maps.googleapis.com',
										  path: '/maps/api/geocode/json?address=' + 
									  		encodeURIComponent(profile[0].address.trim()) +
									  		encodeURIComponent(profile[0].location.trim()) +
									  		encodeURIComponent(profile[0].state.trim()) +
									  		'&key=AIzaSyAedFlNKrewiALWjKTQfNHB6Y7yjRbDaoU'
										};
										console.log(options.path);
										https.get(options, function(res) {
										  console.log('STATUS: ' + res.statusCode);
										  console.log('HEADERS: ' + JSON.stringify(res.headers));
										  res.setEncoding('utf8');
										  var body = '';
										  res.on('data', function (chunk) {
										    console.log('BODY: ' + chunk);
										    body += chunk;
										  });
										  res.on('end', function() {
											  console.log("body: " + body)
									            // Data reception is done, do whatever with it!
											  
									            var parsedBody = JSON.parse(body);
											  console.log(parsedBody);
											  if(parsedBody.results.length == 0) {
												  response.send({
														"status" : 201,
														"message" : "New bill created successfully"
													});
											  }
											  else {
												  var geometry = parsedBody.results[0].geometry;
										            var current_location = geometry.location.lat + 
										            						":" + 
										            						geometry.location.lng;
										            var sqlQueryUpdate = sqlQueryList.getQueryForUpdateBillingWithCurrentLocation(billing_id, current_location);
										            dbHelper.executeQuery(sqlQueryUpdate, function(data) {
														if(data) {
															response.send({
																"status" : 201,
																"message" : "New bill created successfully",
																"bill_id":billing_id
															});
														}
													}, function(error) {
														response.send({
															"status" : 400,
															"message" : "Error: New bill not created successfully: " + error
														});
													}); 
											  }
									        });
										}).end();
									}, function(err) {
										
									});
							}, function(failure) {
								
							});
  			}
			catch (error) {
				response.send({
					"status" : 400, 
					"errmsg" : error 
				});
			}
		}
		else {
			response.send({
	    		"status" : 401,
	    		"message" : "Error: Cannot find profile"
	    	});
		}
	}
	else {
		response.send({
    		"status" : 401,
    		"message" : "Error: Cannot find session"
    	});
	}
};


exports.createBill2 = function(request, response) {
	if(request.session) {
		if(request.session.profile) {
			try {
				
			}
			catch (error) {
				response.send({
					"status" : 400, 
					"errmsg" : error 
				});
			}
		}
		else {
			response.send({
	    		"status" : 401,
	    		"message" : "Error: Cannot find profile"
	    	});
		}
	}
	else {
		response.send({
    		"status" : 401,
    		"message" : "Error: Cannot find session"
    	});
	}
};
exports.getOrders = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var customer_id = request.session.profile[0].puid; 
				var getOrders = sqlQueryList.getOrders(customer_id);
				dbHelper.executeQuery(
						getOrders, 
						function(success) {
							response.send({ //or 201 for creation,
								"message" : success // or id for creation and data for get
							});
						}, 
						function(error){
							//  failure callback
							response.send({
								"status" : 400, 
								"errmsg" : error 
							});
						});
			}/*
			else {
				response.send({
	        		"status": 403,
	        		"message": "Error: Cannot find user profile"
	        	});
			}
		}
		else {
			response.send({
	    		"status" : 401,
	    		"message" : "Error: Cannot find session"
	    	});
		}
		
	} */
		catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};

