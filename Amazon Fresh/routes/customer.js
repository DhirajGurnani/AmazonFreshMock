var dbHelper = require('./db-helper');
var sqlQueryList = require('./sqlQueries');
var encryption = require('./encryption-helper');


//Delete Customer

exports.deletecustomer = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.deletecustomer(puid);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200, //or 201 for creation,
								"message" : "customer is deleted successfully" // or id for creation and data for get
							});
						function(){
							//  failure callback
							response.send({
								"status" : 400, 
								"errmsg" : "random" 
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


exports.deletecustomer = function(puid) {
	return "delete from Users where puid = '" + puid + "'";
};

//List all the customers

exports.listallcustomers = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.listallcustomers();
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({rows,
								"status" : 200, //or 201 for creation,
								
							});
						function(){
							//  failure callback
							response.send({
								"status" : 400, 
								"errmsg" : "random" 
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

exports.listallcustomers = function() {
	return "select * from users";
};


// Update Customer:

exports.updatecustomer = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.updatecustomer();
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200//or 201 for creation,
								
							});
						function(){
							//  failure callback
							response.send({
								"status" : 400, 
								"errmsg" : "random" 
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


