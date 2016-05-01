var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');

//Update Customer:

exports.updatecustomer = function(request, response) {
	try {
		//if(request.session) {
			//if(request.session.profile) {
				var firstname = request.body.first_name;
				var lastname = request.body.last_name;
				var birthday = request.body.birthday;
				var address = request.body.address;
				var location = request.body.location;
				var state = request.body.state;
				var zipcode = request.body.zipcode;
				var phone = request.body.phone;				
				var puid = request.body.puid;
				var sqlQuery = sqlQueryList.updatecustomer(firstname,lastname,birthday,address,location,state,zipcode,phone,puid);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							if(rows.affectedRows>0){
								var profile = sqlQueryList.getProfile(puid);
								dbHelper.executeQuery(
										profile,function(success){
											request.session.profile = success;
											response.send({
												profile:request.session.profile[0]
											})										
										},function(error){
											
										}); 	
							}
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
	    		"status" : 403,
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

//Delete Customer

exports.deletecustomer = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var puid = request.param("puid");
				var sqlQuery = sqlQueryList.deletecustomer(puid);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({
								"status" : 200,
								"message" :"Customer deleted successfully!!"
								
							})},
						function(error){
							
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

