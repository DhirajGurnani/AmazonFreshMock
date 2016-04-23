// Create product

var dbHelper = require('./db-helper');
var sqlQueryList = require('./sqlQueries');
var encryption = require('./encryption-helper');

exports.createproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.createproduct(product_name,price,description);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200							
								
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


exports.createproduct = function(product_name,price,description) 
			{
	return "Insert into products (product_name, price, description) values ('"
			+ product_name
			+ "','"
			+ price
			+ "','"
			+ description
			 "')";
};


Update product:

exports.updateproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				 var product_id = request.session.product_id;
				 var input = JSON.parse(JSON.stringify(req.body));
				 
				 var productname = input.product_name;
				 var price = input.price;
				 var description = input.description;
				
				var sqlQuery = sqlQueryList.updateproduct(productname,price,description,product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200							
								
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

exports.updateproduct = function(productname,price,description) {
	return "UPDATE product set product_name = '" + productname + "' , price = '" + productname + "', decription = '" + productname + "' where product_id = '" + product_id + "'";
};


//List all products

exports.listallproducts = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var sqlQuery = sqlQueryList.listallproducts();
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200							
								
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

exports.listallproducts = function() {
	return "select * from products";
};


/Listparticularproductinformation

exports.listallproducts = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.session.product_id;
				var sqlQuery = sqlQueryList.listparticularproduct(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200							
								
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

exports.listparticularproduct = function(product_id) {
	return "select * from product where product_id = '" + product_id + "'";
};

//delete product

exports.deleteproduct = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.session.product_id;
				var sqlQuery = sqlQueryList.deleteproduct(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								"status" : 200,
								"message" : " the product is deleted 											successfuly"
								
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

exports.deleteproduct = function(puid) {
	return "delete from product where product_id = '" + product_id + "'";
};


//Product ratings


exports.productratings = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.session.product_id;
				var sqlQuery = sqlQueryList.productratings(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({
								rows
								
								
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

exports.productratings = function(product_id) {
	return "select rating from products pro inner join Ratings rat  on pro.product_id = rat.product_id where product_id = '" + product_id + "'";
};


//product reviews

exports.productreview = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var product_id = request.session.product_id;
				var sqlQuery = sqlQueryList.productreview(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({rows
								
								
								
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

exports.productreviews = function(product_id) {
	return "select review from products pro inner join Ratings rat  on pro.product_id = rat.product_id where product_id = '" + product_id + "'";
};


//listallproductsbycategoryid

exports.listproductsbycategoryid = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var category_id = request.session.category_id;
				var sqlQuery = sqlQueryList.listproductsbycategoryid(category_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({rows
								
								
								
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


exports.listproductsbycategoryid = function(category_id) {
	return "select * from product where category_id = '" + category_id + "'";
};



//listallproductsbysubcategoryid

exports.listproductsbysubcategoryid = function(request, response) {
	try {
		if(request.session) {
			if(request.session.profile) {
				var subcategory_id = request.session.subcategory_id;
				var sqlQuery = sqlQueryList.listproductsbysubcategoryid(subcategory_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function() {
							//	success callback
							response.send({rows
								
								
								
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


exports.listproductsbysubcategoryid = function(subcategory_id) {
	return "select * from product where subcategory_id = '" + subcategory_id + "'";
};

