
var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');


//approve farmer


exports.approvefarmer = function(request, response) {
	try {
		//if(request.session) {
			//if(request.session.profile) {
				var puid = request.body.puid;
				var sqlQuery = sqlQueryList.approvefarmer(puid);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({"status" : 200,
									"message": "Succesfully approved farmer!!"
									//sets the farmer status to active which was initially pending
							})},
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
	    		"status" : 403,
	    		"message" : "Error: Cannot find session"
	    	});
		}
	}*/ 
	catch (err) {
		response.send({
			"status" : 500,
			"errmsg" : "Error: Internal server error, Cannot connect to mysql server: " + err
		});
	}
};

//approve product
//not sure of this let me know if any chage is required

exports.approveproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				//var puid = request.body.puid;
				var product_id = request.body.product_id;
				var sqlQuery = sqlQueryList.approveproduct(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({"status" : 200,
									"message": "Succesfully approved product!!"
									//sets the product status to approve which was initially pending
							})},
						function(error){
							//  failure callback
							response.send({
								"status" : 400, 
								"errmsg" : "Failed to Approve product!!" 
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
exports.getProductsPending = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var sqlgetProductsPending = sqlQueryList.sqlgetProductsPending();
				dbHelper.executeQuery(
						sqlgetProductsPending, 
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


