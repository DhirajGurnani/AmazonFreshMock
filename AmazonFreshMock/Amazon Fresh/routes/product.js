var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');


//createproduct

exports.createproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_name = request.body.product_name;
				var price = request.body.price;
				var description = request.body.description;
				
				var sqlQuery = sqlQueryList.createproduct(product_name,price,description);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({
								"status" : 201							
								
							})},
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


//List all products

exports.listallproducts = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.listallproducts();
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({
								"status" : 200							
								
							})},
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

//show a particular product

exports.showparticularproducts = function(request, response) {	
	try {
		if(request.session) {
			if(request.session.profile) {
				var productid = request.param("product_id");  // value is got from the url api/product/:pid
				var sqlQuery = sqlQueryList.showparticularproducts(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({
								"status" : 200							
								
							})},
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


//listallproductsbycategoryid

exports.listproductsbycategoryid = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var category_id = request.param("category_id"); // value got from api/product/:category_id
				var sqlQuery = sqlQueryList.listproductsbycategoryid(category_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send(rows			
								)},
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



//listallproductsbysubcategoryid

exports.listproductsbysubcategoryid = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var subcategory_id = request.param("subcategory_id");
				var category_id = request.param("category_id");  // value got from  api///product/:category_id/:subcategory_id:
				var sqlQuery = sqlQueryList.listproductsbysubcategoryid(category_id,subcategory_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send(rows						
								)},
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


//Update product:

exports.updateproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				 var product_id = request.param("product_id");// value got from url api/product/:pid/update
				 var input = JSON.parse(JSON.stringify(req.body));
				 
				 var productname = input.product_name;
				 var price = input.price;
				 var description = input.description;
				
				var sqlQuery = sqlQueryList.updateproduct(productname,price,description,product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({
								"status" : 200													
								
							})},
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


//Product ratings


exports.productratings = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.param("product_id"); // value for from the url api/product/:pid/ratings
				var sqlQuery = sqlQueryList.productratings(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send(
								rows						
								
							)},
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

//product reviews

exports.productreview = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.param("product_id");// value got from url api/product/:pid/reviews
				var sqlQuery = sqlQueryList.productreview(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send(rows							
								)},
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

//delete product

exports.deleteproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.param("product_id");// value got from api/product/:pid/delete
				var sqlQuery = sqlQueryList.deleteproduct(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							//	success callback
							response.send({
									"status" : 200,
									"message" : " the product is deleted "									
								
								
							})},
						function(error){
							//  failure callback
							
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
