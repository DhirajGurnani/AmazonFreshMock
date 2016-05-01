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
					var imageUrl = 'api/products/images/' + data[request.params.product_id].images[index];
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

/**
 * creates new product
 * 
 */
exports.createproduct = function(request, response) {
	try {
		if(true) {
			if(true) {
				var puid = request.body.puid;
				var product_name = request.body.product_name;
				var quantity = request.body.quantity;
				var price = request.body.price;
				var description = request.body.description;
				var category_id = request.body.category_id;
				var subcategory_id = request.body.subcategory_id;
				var sqlQuery = sqlQueryList.getQueryForProductCreation(puid, product_name, quantity, price, description, category_id, subcategory_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 201,
								"product_id" : rows.insertId
							})},
						function(error){
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
 * fetches all products
 */
exports.getAllProducts = function(request, response) {
	try {
		if(true) {
			if(true) {
				var sqlQuery = sqlQueryList.getQueryForAllProducts();
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,						
								"products" : rows
							})},
						function(error){
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
 * fetches product by product_id
 */
exports.getProductByProductId = function(request, response) {	
	try {
		if(true) {
			if(true) {
				var product_id = request.params.product_id;  // value is got from the url api/product/:pid
				var sqlQuery = sqlQueryList.getQueryForProductByProductId(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,
								"product" : rows
							})},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: No product found for product_id: " + product_id + " : error: " + error
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
exports.getProductByFarmerId = function(request, response) {	
	try {
		if(true) {
			if(true) {
				var farmer_id = request.body.farmer_id;  // value is got from the url api/product/:pid
				var sqlQuery = sqlQueryList.getQueryForProductByFarmer(farmer_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,
								"product" : rows
							})},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: No product found for product_id: " + product_id + " : error: " + error
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
 * fetches products by category id
 */
exports.getAllProductsByCategoryId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var category_id = request.params.category_id; // value got from api/product/:category_id
				var sqlQuery = sqlQueryList.getQueryForProductsByCategoryId(category_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,
								"products" : rows
							});
							},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: cannot get products by categoryId: " + category_id + " : error: " + error
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
 * fetches products by subcategory_id
 */
exports.getProductBySubcategoryId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var subcategory_id = request.params.subcategory_id;
				var sqlQuery = sqlQueryList.getQueryForProductBySubcategoryId(subcategory_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status": 200,
								"products": rows
							});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to fetch product by product_id: " + product_id + " and subcategory_id: " + subcategory_id +" : error: " + error
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
 * fetches products by product_id and subcategory_id
 */
exports.getProductsByCAtegoryIdAndSubCategoryId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var subcategory_id = request.params.subcategory_id;
				var category_id = request.params.category_id;  // value got from  api///product/:category_id/:subcategory_id:
				var sqlQuery = sqlQueryList.getQueryForProductsByCategoryAndSubCategoryId(category_id,subcategory_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status": 200,
								"products": rows
							});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to fetch product by product_id: " + product_id + " and subcategory_id: " + subcategory_id +" : error: " + error
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
 * 
 * update product by product_id
 * 
 */
exports.updateProductByProductId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var product_id = request.params.product_id;
				var product_name = request.body.product_name;
				var quantity = request.body.quantity;
				var price = request.body.price;
				var description = request.body.description;
				var category_id = request.body.category_id;
				var subcategory_id = request.body.subcategory_id;
				var sqlQuery = sqlQueryList.getQueryForUpdateProductDetails(product_id, product_name, quantity, price, description, category_id, subcategory_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,
								"message" : "Updated Successfully"
							})},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to udpate: " + request.body + " error: " + error
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
 * get product ratings by product_id
 */
exports.getProductRatingsByProductId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var product_id = request.params.product_id;
				var sqlQuery = sqlQueryList.getProductRatingsByProductId(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,
								"ratings" : rows
							});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to get ratings: " + error 
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
 * 
 * 
 * 
 */
exports.deleteProductByProductId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var product_id = request.params.product_id;
				var sqlQuery = sqlQueryList.getQueryForDeleteOfAProductByProductId(product_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
							response.send({
									"status" : 200,
									"message" : "The product is deleted"									
							})},
						function(error){
								response.send({
									"status" : 400,
									"message" : "Error: Unable to delete product: " + error
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

exports.updateQuantityByProductId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var product_id = request.params.product_id;
				var updatedQuantity = request.body.quantity;
				var sqlQuery = sqlQueryList.getQueryForProductByProductId(product_id);
				dbHelper.executeQuery(sqlQuery, 
						function(rows) {
							rows[0].quantity = parseInt(rows[0].quantity) - parseInt(updatedQuantity);
							
							var product_id = rows[0].product_id;
							var product_name = rows[0].product_name;
							var quantity = rows[0].quantity;
							var price = rows[0].price;
							var description = rows[0].description;
							var category_id = rows[0].category_id;
							var subcategory_id = rows[0].subcategory_id;
							sqlQuery = sqlQueryList.getQueryForUpdateProductDetails(product_id, product_name, quantity, price, description, category_id, subcategory_id);
							dbHelper.executeQuery(
									sqlQuery, 
									function(rows) {
										response.send({
											"status" : 200,
											"message" : "Updated Successfully"
										})},
									function(error){
										response.send({
											"status" : 400, 
											"errmsg" : "Error: Unable to udpate: " + request.body + " error: " + error
										});
									});
							
							},
						function(error){
								response.send({
									"status" : 400,
									"message" : "Error: Unable to find product: " + error
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

exports.getProductCategoriesAndSubCategories = function(request, response) {
	try {
		if(true) {
			if(true) {
				var sqlQuery = sqlQueryList.getProductCategories();
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
								response.send({
									"status" : 200,
									"category" : rows
								});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to get ratings: " + error 
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
}

exports.getProductSubCategoriesByCategoryId = function(request, response) {
	try {
		if(true) {
			if(true) {
				var sqlQuery = sqlQueryList.getProductSubCategoriesByCategoryId(request.params.category_id);
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
								response.send({
									"status" : 200,
									"subcategory" : rows
								});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to get ratings: " + error 
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

exports.getFiveProducts = function(request, response) {
	try {
		if(true) {
			if(true) {
				var sqlQuery = sqlQueryList.getFiveProductsForHomePage();
				dbHelper.executeQuery(
						sqlQuery, 
						function(rows) {
								response.send({
									"status" : 200,
									"products" : rows
								});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to get products: " + error 
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

exports.getDynamicPriceForAProduct = function(request, response) {
	try {
		if(true) {
			if(true) {
				var category_id = request.params.category_id;
				var subcategory_id = request.params.subcategory_id;
				var sqlQuery = sqlQueryList.getQuantityAndPriceForProductsByCatAndSubCat(category_id, subcategory_id);
				dbHelper.executeQuery(sqlQuery, 
						function(quantityAndPrice) {
								var totalPrice = 0;
								var totalQuantity = 0;
								var averagePrice = 0;
								console.log(quantityAndPrice.length);
								for(var index = 0; index < quantityAndPrice.length; index++) {
									var quantity = quantityAndPrice[index].quantity;
									var price = quantityAndPrice[index].price;
									totalPrice += parseInt(quantity) * parseInt(price);
									totalQuantity += parseInt(quantity);
									console.log("#" + parseInt(quantity));
									console.log("#" + parseInt(price));
									console.log("#" + (parseInt(quantity) * parseInt(price)));
								}
								var sqlQuery2 = sqlQueryList.getQuantityOfProductSold(category_id, subcategory_id);
								dbHelper.executeQuery(sqlQuery2, 
										function(soldQuantityAndPrice){
											var soldTotalPrice = 0;
											var soldTotalQuantity = 0;
											var soldAveragePrice = 0;
											for(var index1 = 0; index1 < soldQuantityAndPrice.length; index1++) {
												var quantity = soldQuantityAndPrice[index1].quantity;
												var price = soldQuantityAndPrice[index1].price;
												soldTotalPrice += parseInt(quantity) * parseInt(price);
												console.log(parseInt(quantity));
												console.log(parseInt(price));
												console.log(parseInt(quantity) * parseInt(price));
												soldTotalQuantity += parseInt(quantity);
											}
											
											var sqlQuery3 = sqlQueryList.getMaxAndMinPriceOfProductInDatabase(category_id, subcategory_id);
											dbHelper.executeQuery(sqlQuery3,
													function(maxAndMin) {
														var maxprice = maxAndMin[0].max;
														var minprice = maxAndMin[0].min;
														averagePrice = totalPrice/totalQuantity;
														soldAveragePrice = soldTotalPrice/soldTotalQuantity;
														var finalAveragePrice = soldAveragePrice ? (averagePrice + soldAveragePrice)/2 : averagePrice;
														//console.log(totalPrice);
														//console.log(totalQuantity);
														var sqlQuery4 = sqlQueryList.getTotalQuantityPresentForAProductByCatAndSubCat(category_id, subcategory_id);
														dbHelper.executeQuery(sqlQuery4,
																function(totalQuantityPresent) {
																	response.send({
																		"averagePrice" : finalAveragePrice,
																		"maxprice" : maxprice,
																		"minprice" : minprice,
																		"quantityPresent" : totalQuantityPresent[0].sumOfQuantity,
																		"quantitysold" : soldTotalQuantity
																		});
																},
																function(error) {
																	response.send({
																		"averagePrice" : finalAveragePrice,
																		"maxprice" : maxprice,
																		"minprice" : minprice,
																		"quantitysold" : soldTotalQuantity
																		});
																});
										},
										function(error) {
											response.send({
												"averagePrice" : finalAveragePrice,
												"quantityPresent" : totalQuantityPresent[0].sumOfQuantity,
												});
										});
								},
								function(error) {
									var finalAveragePrice = totalQuantity/totalPrice;
									response.send({
										"averagePrice" : finalAveragePrice,
										});
								});
						},
						function(error){
							response.send({
								"status" : 400, 
								"errmsg" : "Error: Unable to get data: " + error 
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