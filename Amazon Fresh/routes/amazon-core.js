/**
 * amazon-core.js Constitutes the core part of Amazon backend code.
 * 
 * @author Vaishampayan
 */

var dbHelper = require('./db-helper');
var sqlQueryList = require('./sqlQueries');
var encryption = require('./encryption-helper');

exports.sample = function(request, response) {
	try {
		if(request.session) {
			var driverId =request.param("driverId");
			var truckId = request.param("truckId");
			var location = request.param("location");
			var adminId = request.param("adminId");
			var comment = request.param("comment");
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.getTripId(driverId,truckId,location,adminId,comment);
				dbHelper.executeQuery(
						sqlQuery, 
						function(result) {
							//	success callback
							response.send({
								"status" : 200, //or 201 for creation,
								"message" : result // or id for creation and data for get
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
			else {
				response.send({
	        		"status": 403,
	        		"message": "Error: Cannot find user profile"
	        	});
			}
		}
		else {
			response.send({
	    		"status" : 403,
	    		"message" : "Error: Cannot find session"
	    	});
		}
	} catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};

/**
 *  function for signup of a user
 */
exports.signup = function() {
	try {
		if(request.session) {
			if(request.session.profile) {
				//backend code goes here
			}
			else {
				response.send({
	        		"status": 403,
	        		"message": "Error: Cannot find user profile"
	        	});
			}
		}
		else {
			response.send({
	    		"status" : 403,
	    		"message" : "Error: Cannot find session"
	    	});
		}
	} catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};