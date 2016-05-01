/**
 * http://usejsdoc.org/
 */
var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');

exports.postRating = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var product_id = request.body.product_id;
				var ratings = request.body.ratings;
				var reviews = request.body.reviews;
				var postRating = sqlQueryList.postRating(product_id,ratings,reviews);
				console.log(postRating);
				dbHelper.executeQuery(
						postRating, 
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
exports.getRating = function(request,response){
	try {		
		//if(request.session) {
			//if(request.session.profile) {
				var product_id = request.body.product_id;
				var getRating = sqlQueryList.getRating(product_id);
				var getReview = sqlQueryList.getReview(product_id);
				var rating;
				dbHelper.executeQuery(
						getRating, 
						function(success) {
							rating = success;
							console.log(success);
							if (success[0].average>0){
								dbHelper.executeQuery(
										getReview, 
										function(success) {
											response.send({
												"rating":rating[0].average,
												"review":success
											})
										},
										function(error){
											response.send({"error":error});
										});							
							}
							else{
								response.send({ //or 201 for creation,
									"message" : "No Rating so far!" // or id for creation and data for get
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