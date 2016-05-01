/**
 * http://usejsdoc.org/
 * 
 * @Author :: Vimal Nair 
 * 
 * @Module :: Trip
 * 
 */
var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');
var redis = require('redis');
//var client = redis.createClient(); 

exports.getBillsRedis = function(request,response){
	
}

exports.createTrip = function(request,response){
	try {
		
		//if(request.session) {
			//if(request.session.profile) {
				/*
				 * Variable Decleration for Trips
				 */
				var driverId =request.body.driverId;
				var truckId = request.body.truckId;
				var location = request.body.location;
				var billId = request.body.billing_id;
				var adminId = request.body.adminId;
				var comment = request.body.comment;
				var tripId;
				/*
				 * Queries for Updating Trips,TripInfo,Driver, Truck
				 */
				var sqlQueryTrip  = sqlQueryList.getTripId(driverId,truckId,location,adminId,comment);
				console.log(sqlQueryTrip);
				var sqlQueryTruck = sqlQueryList.updateTruck(truckId);
				var sqlQueryDriver = sqlQueryList.updateDriver(driverId);
				dbHelper.executeQuery(
						sqlQueryTrip, 
						function(success) {
							var truckStatus;
							var driverStatus;
							var tripInfo;
							var billing;
							tripId = success.insertId;
							dbHelper.executeQuery(sqlQueryTruck,function(truck){
								truckStatus=truck;
							},function(error){
								truckStatus=error;
							});
							dbHelper.executeQuery(sqlQueryDriver,function(truck){
								driverStatus=truck;
							},function(error){
								driverStatus=error;
							});
							for (var i=0; i < billId.length; i++){
								var updateTripInfo = sqlQueryList.updateTripInfoQuery(tripId,billId[i]);
								dbHelper.executeQuery(updateTripInfo,function(tripInfo){
									tripInfo=tripInfo;
								},function(error){
									tripInfo=error;
								});
								var updateBilling = sqlQueryList.updateBillingQuery(driverId,billId[i]);
								dbHelper.executeQuery(updateBilling,function(billing){
									tripInfo=tripInfo;
								},function(error){
									tripInfo=error;
								});
							}
							response.send({
								"status" : 200, //or 201 for creation,
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
		
	} 
	*/
		catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};


exports.deleteTrip = function(request,response){
	try {
		//if(request.session) {
			//if(request.session.profile) {
				/*
				 * Variable Decleration for Trips
				 */
				var driverId;
				var truckId; 
				var location;
				var billId;
				var adminId;
				var comment;
				var bills;
				var tripId = request.body.trip_id;
				/*
				 * Queries for Updating Trips,TripInfo,Driver, Truck
				 */
				var sqlQueryTrip  = sqlQueryList.getTripId(driverId,truckId,location,adminId,comment);
				var sqlQueryTruck = sqlQueryList.updateTruck(truckId);
				var sqlQueryDriver = sqlQueryList.updateDriver(driverId);
				
				var getTripDetails = sqlQueryList.getTripQuery(tripId);
				dbHelper.executeQuery(
						getTripDetails, 
						function(success) {
							if(success.length>0){
								driverId=success[0].driver_id;
								truckId=success[0].truck_id;
								var sqlQueryDriver = sqlQueryList.updateDriverAvailable(driverId);
								var sqlQueryTruck  = sqlQueryList.updateTruckAvailable(truckId);
								console.log(sqlQueryDriver);
								console.log(sqlQueryTruck);
								var getBillId = sqlQueryList.getBillId(tripId);
								dbHelper.executeQuery(
										getBillId,function(success){											
											console.log(success.length);
											for (var i = 0; i< success.length;i++)
												{
												var temp =success[i].billing_id;
												var billUpdateQuery = sqlQueryList.billUpdateQuery(temp);
												dbHelper.executeQuery(
														billUpdateQuery,function(success){
															console.log("success");
														},function(error){														
														});			
												}
											
										},function(error){
									
								}); 
					
								var deleteTrips = sqlQueryList.deleteTrips(tripId);
								var deleteTripInfo = sqlQueryList.deleteTripInfo(tripId);
								dbHelper.executeQuery(sqlQueryTruck,function(success){
									dbHelper.executeQuery(sqlQueryDriver,function(success){
										dbHelper.executeQuery(deleteTripInfo,function(sucess){
											dbHelper.executeQuery(deleteTrips,function(sucess){
												response.send({
													"status":200,
													"message":success,
													"result":"Detele Operation Sucessfull"
												})
											},function(error){
												
											});
											
										},function(error){
											response.send({
												"status":400,
												"errMessage":error
											})
										});
									},function(error){
										response.send({
											"status":400,
											"errMessage":error
										})
									});
								},
								function(error){
									response.send({
										"status":400,
										"errMessage":error
									})

								});
										
							}
							
							response.send({
								"status" : 200, //or 201 for creation,
								"message": "Delete Sucessful"
								// or id for creation and data for get
							});
						}, 
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : error ,
								"result" : "Unable to Fetch Trip Details"
							});
						});
			}	
			/*
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
	} 
	*/
		catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};

exports.getTrips = function(request,response){
	try {
		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlGetTrip = sqlQueryList.getAllTrips();
				dbHelper.executeQuery(
						sqlGetTrip, 
						function(success) {
							response.send({
								"status" : 200, //or 201 for creation,
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
			}
	/*
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
		
	} 
	*/
		catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};
exports.getPendingTrips = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlGetPendingTrip = sqlQueryList.getAllPendingTrips();
				dbHelper.executeQuery(
						sqlGetPendingTrip, 
						function(success) {
							response.send({
								"status" : 200, //or 201 for creation,
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
exports.availableTrucks = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlAvailableTruck = sqlQueryList.sqlAvailableTruck();
				dbHelper.executeQuery(
						sqlAvailableTruck, 
						function(success) {
							response.send({
								"status" : 200, //or 201 for creation,
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
exports.availableDrivers = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlAvailableDriver = sqlQueryList.sqlAvailableDriver();
				dbHelper.executeQuery(
						sqlAvailableDriver, 
						function(success) {
							response.send({
								"status" : 200, //or 201 for creation,
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

exports.getBills = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlGetBills = sqlQueryList.sqlGetBills();
				dbHelper.executeQuery(
						sqlGetBills, 
						function(success) {
							response.send({
								"status" : 200, //or 201 for creation,
								"bills" : success // or id for creation and data for get
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

exports.getTruckTrips = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
		        var TruckId =request.body.driverId;
				var sqlGetTruckTrips = sqlQueryList.sqlGetTruckTrips();
				dbHelper.executeQuery(
						sqlGetTruckTrips, 
						function(success) {
							response.send({
								"status" : 200, //or 201 for creation,
								"bills" : success // or id for creation and data for get
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

exports.locationStats = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqllocationStats = sqlQueryList.sqllocationStats();
				dbHelper.executeQuery(
						sqllocationStats, 
						function(success) {
							response.send({ //or 201 for creation,
								"datapoints" : success // or id for creation and data for get
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

exports.revenueStats = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlRevenueStats = sqlQueryList.sqlRevenueStats();
				dbHelper.executeQuery(
						sqlRevenueStats, 
						function(success) {
							response.send({ //or 201 for creation,
								"datapoints" : success // or id for creation and data for get
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
/*
exports.getBills = function(request,response){	
	var bar = {"product_id":100,"redis":"OK"};	
	client.set("foo", JSON.stringify(bar), redis.print);
	client.get("voo", function (err, reply) {
		var json = JSON.parse(reply);
		if(json==={}){
			console.log("Empty");
		}
	    response.send(json);
	});
}
*/
exports.getBills = function(request, response) {
    try {

        //if(request.session) {
        //if(request.session.profile) {
        var sqlGetBills = sqlQueryList.sqlGetBills();
        dbHelper.executeQuery(
            sqlGetBills,
            function(success) {
                response.send({ //or 201 for creation,
                    "message": success // or id for creation and data for get
                });
            },
            function(error) {
                //  failure callback
                response.send({
                    "status": 400,
                    "errmsg": error
                });
            });

    }
    /*
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
            "status": 500,
            "errmsg": "Error: Internal server error, Cannot connect to mysql server: " + err
        });

    }
};

exports.getFarmersPending = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlgetFarmersPending = sqlQueryList.sqlgetFarmersPending();
				dbHelper.executeQuery(
						sqlgetFarmersPending, 
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
exports.getDeliverySlots = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var getDeliverySlots = sqlQueryList.getDeliverySlots();
				dbHelper.executeQuery(
						getDeliverySlots, 
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