var dbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');

var mongo = require("./mongo");
var mongoURL = 'mongodb://localhost:27017/amazondb';
var mongoDbHelper = require('./mongo-db-helper');
var uuid = require('node-uuid');
var mongodb = require('mongodb');
var fs = require('fs');
var http = require('http');
var util = require('util');


/**
 * @author: Vaisham
 * 
 * Stores images in db for product
 * 
 */
/***************************************************************************************************************/
exports.postImagesForProductByProductId = function(request, response) {
	mongo.connect(mongoURL, function() {
		var products = mongo.collection('products');
		mongoDbHelper.doesExistInDb(products, {
			"product_id": request.params.product_id
		}, function() {
			// already present in db
			mongoDbHelper.readOne(products, {"product_id":request.params.product_id}, null, function(data) {
				var imageID = uuid.v4() + ".png";
				var productid = request.params.product_id;
				data[productid].images.push(imageID);
				console.log("data");
				console.log(data);
				//already present in db
				var searchData = {};
				searchData.product_id = request.params.product_id;
				var postData = {};
				var imageKey = {};
				imageKey[productid] = data[productid];
				postData['$set'] = imageKey;

				console.log("postData");
				console.log(JSON.stringify(postData));

				mongoDbHelper.updateCollection(products, searchData, postData, function() {
					mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
				        var bucket = new mongodb.GridFSBucket(db, {
				        	  chunkSizeBytes: 1024,
				        	  bucketName: 'images'
				        	});
				        fs.createReadStream(request.files.image.path).
				        pipe(bucket.openUploadStream(imageID)).
				        on('error', function(error) {
				            if(error) {
				            	response.send({
				            		"status" : 500,
				            		"errmsg" : "Error: Cannot upload image: " + error
				            	});
				            }
				        }).
				        on('finish', function() {
				            console.log('done!');
				            response.send({
				        		"status" : 200,
				        		"message" : "image uploaded successfully for product with product_id: " + request.params.product_id
				        	});
				        });
				    });
				});
			});
		}, 
		function() {
			var puidData = {};
			var postData = {};
			//console.log("farmerpuid: " + farmerpuid);
			var imageID = uuid.v4() + ".png";
			puidData.images = [];
			puidData.images.push(imageID);
			postData.product_id = request.params.product_id;
			postData[request.params.product_id] = puidData; 
			mongoDbHelper.insertIntoCollection(products, postData, function() {
				mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
			        var bucket = new mongodb.GridFSBucket(db, {
			        	  chunkSizeBytes: 1024,
			        	  bucketName: 'images'
			        	});
			        fs.createReadStream(request.files.image.path).
			        pipe(bucket.openUploadStream(imageID)).
			        on('error', function(error) {
			            if(error) {
			            	response.send({
			            		"status" : 500,
			            		"errmsg" : "Error: Cannot upload image: " + error
			            	});
			            }
			        }).
			        on('finish', function() {
			            console.log('done!');
			            response.send({
			        		"status" : 200,
			        		"message" : "Image uploaded successfully for product with product_id: " + request.params.product_id
			        	});
			        });
			    });
			});
		});
	});	
};

exports.getImageUrlsForProductByProductId = function(request, response) {
	mongo.connect(mongoURL, function() {
		var products = mongo.collection('products');
		mongoDbHelper.doesExistInDb(products, {
			"product_id" : request.params.product_id
		}, function() {
			mongoDbHelper.readOne(products, {"product_id": request.params.product_id}, null, function(data) {
				//uuid.v4();
				console.log(JSON.stringify(data));
				var imageUrls = [];
				for (var index = 0; index < data[request.params.product_id].images.length; index++) {
					var imageUrl = '/api/products/images/' + data[request.params.product_id].images[index];
					imageUrls.push(imageUrl);
				}
				response.send({
					"status" : 200,
					"urls" : imageUrls
				});
			});
		}, function() {
			response.send({
				"status" : 404,
				"errmsg" : "Error: No images found for product in db with product_id: " + request.params.product_id
			});
		});
	});
};

exports.getImageByImageUrl = function(request, response) {
	response.setHeader('Content-type', 'image/png');
    mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
    	var bucket = new mongodb.GridFSBucket(db, {
      	  	chunkSizeBytes: 1024,
    		bucketName: 'images'
      	});
        bucket.openDownloadStreamByName(request.params.imageName).
        pipe(response).
        on('error', function(error) {
        }).
        on('finish', function() {
        });
    });
};
/***************************************************************************************************************/

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
