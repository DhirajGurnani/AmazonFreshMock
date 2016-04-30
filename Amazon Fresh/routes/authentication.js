/**
 * http://usejsdoc.org/
 * 
 * @Author :: Vimal Nair 
 * 
 * @Module :: Authentication
 * 
 */
var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');
var CryptoJS = require("crypto-js");

exports.signup = function(request,response){
	try {
		//if(request.session) {
			//if(request.session.profile) {
				/*
				 * Variable Decleration for Trips
				 */
				var first_name = request.body.first_name;
				console.log(first_name);
				var last_name = request.body.last_name;
				var birthday =request.body.birthday;
				var address = request.body.address;
				var location = request.body.location;
				var state = request.body.state;
				var zipcode = request.body.zipcode;
				var phone = request.body.phone;
				var role = request.body.role;
				var status = request.body.status;				
				var email = request.body.email;
				var password = CryptoJS.AES.encrypt(request.body.password, 'AMAZONFRESH');
				password = (password.toString());
				var sqlUserRegister = sqlQueryList.sqlUserRegister(email,password);
				var sqlQueryRegister;
				dbHelper.executeQuery(
						sqlUserRegister, 
						function(success) {
							var puid = success.insertId;
							sqlQueryRegister = sqlQueryList.sqlQueryRegister(puid,first_name,last_name,birthday,address,location,state,zipcode,phone,role,status);
							dbHelper.executeQuery(sqlQueryRegister,function(success){
								response.send({
									"status":200,
									"result":success
								});
							},function(error){
								response.send({
									"status":400,
									"message":"Bad Request",
									"ErrMsg":error
								});
							});
							response.send({
								"status" : 200, //or 201 for creation,
								"message" : success // or id for creation and data for get
							});
						}, 
						function(error){
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

exports.validEmail = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var email = request.body.email;
				var sqlValidEmail = sqlQueryList.sqlValidEmail(email);
				dbHelper.executeQuery(
						sqlValidEmail, 
						function(success) {
							if(success.length>0)
							response.send(true);
							else
							response.send(false);
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
