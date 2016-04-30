/**
 * New node file
 */
var mysqlDbHelper = require('./mysql-db-helper');
var sqlQueryList = require('./sqlQueries');

var mongo = require("./mongo");
var mongodb = require('mongodb');
var fs = require('fs');
var http = require('http');
var util = require('util');
var mongoURL = 'mongodb://localhost:27017/amazondb';
var dbHelper = require('./mongo-db-helper');
var uuid = require('node-uuid');

exports.getVideoForFarmerByPuid = function(request, response) {
	mongo.connect(mongoURL, function() {
		var farmers = mongo.collection('farmers');
		dbHelper.doesExistInDb(farmers, {
			"puid": request.params.puid
		}, function() {
			response.setHeader('Content-type', 'video/mp4');
		    mongodb.MongoClient.connect(mongoURL, function(error, db) {
		    	var bucket = new mongodb.GridFSBucket(db, {
		      	  	chunkSizeBytes: 1024,
		    		bucketName: 'videos'
		      	});
		        bucket.openDownloadStreamByName(request.params.puid + '.mp4').
		        pipe(response).
		        on('error', function(error) {
		        }).
		        on('finish', function() {
		        });
		    });
		}, function() {
			response.send({
				"status" : 404,
				"errmsg" : "Error: No videos found for farmer in db with puid: " + request.params.puid
			});
		});
	});
};

exports.postVideoForFarmerByPuid = function(request, response) {
	mongo.connect(mongoURL, function() {
		var farmers = mongo.collection('farmers');
		dbHelper.doesExistInDb(farmers, {
			"puid": request.params.puid
		}, function() {
			//already present in db
			var searchData = {};
			searchData.puid = request.params.puid;
			var postData = {};
			var videoKey = request.params.puid + ".videos"
			var setData = {};
			setData[videoKey] = request.params.puid + ".mp4";
			postData['$set'] = setData;
			dbHelper.updateCollection(farmers, searchData, postData, function() {
				mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
			        var bucket = new mongodb.GridFSBucket(db, {
			        	  chunkSizeBytes: 1024,
			        	  bucketName: 'videos'
			        	});
			        fs.createReadStream(request.files.video.path).
			        pipe(bucket.openUploadStream(request.params.puid + '.mp4')).
			        on('error', function(error) {
			            if(error) {
			            	response.send({
			            		"status" : 500,
			            		"errmsg" : "Error: Cannot upload video: " + error
			            	});
			            }
			        }).
			        on('finish', function() {
			            console.log('done!');
			            response.send({
			        		"status" : 200,
			        		"message" : "Video uploaded successfully for farmer with puid: " + request.params.puid
			        	});
			        });
			    });
			});
		}, 
		function() {
			var puidData = {};
			puidData.images = [];
			puidData.videos = request.param.puid + ".mp4";
			var postData = {};
			postData.puid = request.params.puid;
			postData[request.params.puid] = puidData;
			dbHelper.insertIntoCollection(farmers, postData , function() {
				mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
			        var bucket = new mongodb.GridFSBucket(db, {
			        	  chunkSizeBytes: 1024,
			        	  bucketName: 'videos'
			        	});
			        fs.createReadStream(request.files.video.path).
			        pipe(bucket.openUploadStream(request.params.puid + '.mp4')).
			        on('error', function(error) {
			            if(error) {
			            	response.send({
			            		"status" : 500,
			            		"errmsg" : "Error: Cannot upload video: " + error
			            	});
			            }
			        }).
			        on('finish', function() {
			            console.log('done!');
			            response.send({
			        		"status" : 200,
			        		"message" : "Video uploaded successfully for farmer with puid: " + request.params.puid
			        	});
			        });
			    });
			});
		});
	});	
};

exports.postImagesForFarmerByPuid = function(request, response) {
	mongo.connect(mongoURL, function() {
		var farmers = mongo.collection('farmers');
		dbHelper.doesExistInDb(farmers, {
			"puid": request.params.puid
		}, function() {
			dbHelper.readOne(farmers, {"puid":request.params.puid}, null, function(data) {
				var imageID = uuid.v4() + ".png";
				var farmerpuid = request.params.puid;
				data[farmerpuid].images.push(imageID);
				console.log(data);
				//already present in db
				
				var searchData = {};
				searchData.puid = request.params.puid;
				var postData = {};
				var imageKey = {};
				imageKey[farmerpuid] = data[farmerpuid];
				postData['$set'] = imageKey;
				dbHelper.updateCollection(farmers, searchData, postData, function() {
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
				        		"message" : "image uploaded successfully for farmer with puid: " + request.params.puid
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
			puidData.videos = "";
			postData.puid = request.params.puid;
			postData[request.params.puid] = puidData; 
			dbHelper.insertIntoCollection(farmers, postData, function() {
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
			        		"message" : "Image uploaded successfully for farmer with puid: " + request.params.puid
			        	});
			        });
			    });
			});
		});
	});	
};

exports.getImageUrlsForFarmerByPuid = function(request, response) {
	mongo.connect(mongoURL, function() {
		var farmers = mongo.collection('farmers');
		dbHelper.doesExistInDb(farmers, {
			"puid" : request.params.puid
		}, function() {
			dbHelper.readOne(farmers, {"puid": request.params.puid}, null, function(data) {
				//uuid.v4();
				console.log(JSON.stringify(data));
				var imageUrls = [];
				for (var index = 0; index < data[request.params.puid].images.length; index++) {
					var imageUrl = 'api/farmers/images/' + data[request.params.puid].images[index];
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
				"errmsg" : "Error: No images found for farmer in db with puid: " + request.params.puid
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

exports.getVideo2 = function(request, response) {
    console.log("Uploading: ");
    console.log("request: " + JSON.stringify(request.files));
    mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
        var bucket = new mongodb.GridFSBucket(db, {
        	  chunkSizeBytes: 1024,
        	  bucketName: 'videos'
        	});
        fs.createReadStream(request.files.sairam.path).
        pipe(bucket.openUploadStream(request.files.sairam.name)).
        on('error', function(error) {
            if(error) {
            	response.send({
            		"status" : 500,
            		"errmsg" : "Error: Cannot upload video: " + error
            	});
            }
        }).
        on('finish', function() {
            console.log('done!');
            response.send({
        		"status" : 200,
        		"message" : "Video uploaded successfully"
        	});
        });
    });
};

exports.postVideo = function(request, response) {
    console.log("Uploading: ");
    console.log("request: " + JSON.stringify(request.files));
    mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
        var bucket = new mongodb.GridFSBucket(db, {
        	  chunkSizeBytes: 1024,
        	  bucketName: 'videos'
        	});
        fs.createReadStream(request.files.sairam.path).
        pipe(bucket.openUploadStream(request.files.sairam.name)).
        on('error', function(error) {
            if(error) {
            	response.send({
            		"status" : 500,
            		"errmsg" : "Error: Cannot upload video: " + error
            	});
            }
        }).
        on('finish', function() {
            console.log('done!');
            response.send({
        		"status" : 200,
        		"message" : "Video uploaded successfully"
        	});
        });
    });
};

exports.getVideo = function(request, response) {
	//response.setHeader('Content-disposition', 'filename=' + 'saibaba.mp4');
	response.setHeader('Content-type', 'video/mp4');
	//response.setHeader('Content-Length', 1024);
	//response.setHeader("Content-Range", "bytes "+off+"-"+to+"/"+data.length)
	//response.setHeader('Accept-Ranges' , 'bytes 0-40707512/40707513');
    mongodb.MongoClient.connect('mongodb://localhost:27017/amazondb', function(error, db) {
    	var bucket = new mongodb.GridFSBucket(db, {
      	  	chunkSizeBytes: 1024,
    		bucketName: 'videos'
      	});

        bucket.openDownloadStreamByName('saibaba.mp4').
        pipe(response).
        on('error', function(error) {
            //assert.ifError(error);
            response.send("error");
        }).
        on('finish', function() {
            console.log('done!');
            response.send("done");
            //process.exit(0);
        });
    });
};

exports.getFarmers = function(request, response) {
	try {
		var sqlQuery = sqlQueryList.getQueryForAllFarmers();
		mysqlDbHelper.executeQuery(sqlQuery, function(rows) {
			response.send({
				"status" : 200, // or 201 for creation,
				"farmers" : rows // or id for creation and data for get
			});
		}, function() {
			// failure callback
			response.send({
				"status" : 400,
				"errmsg" : "Error: Unable to get any farmers"
			});
		});
	}
	catch (err) {
		response.send({
				"status" : 500,
				"errmsg" : "Error: Internal server error, Cannot connect to mysql server: "	+ err
			});
	}
};

exports.getFarmerByPuid = function(request, response) {
	try {
		var sqlQuery = sqlQueryList.getQueryForFarmerByPuid(request.params.puid);
		mysqlDbHelper.executeQuery(sqlQuery, function(rows) {
			response.send({
				"status" : 200, // or 201 for creation,
				"farmers" : rows // or id for creation and data for get
			});
		}, function() {
			// failure callback
			response.send({
				"status" : 400,
				"errmsg" : "Error: unable to get any farmer by puid: " + request.param.puid
			});
		});
	}
	catch (err) {
		response.send({
				"status" : 500,
				"errmsg" : "Error: Internal server error, Cannot connect to mysql server: "	+ err
			});
	}
};

exports.updateFarmer = function(request, response) {
	if(request.session) {
		if(request.session.profile) {
			if(request.session.profile.puid === request.params.puid) {
				try {
					// order :- puid, first_name, last_name, birthday, address, location, state, zipcode, phone 
					var sqlQuery = sqlQueryList.getQueryForUpdateOfAFarmer(
							request.params.puid,
							request.body.first_name,
							request.body.last_name,
							request.body.birthday,
							request.body.address,
							request.body.location,
							request.body.state,
							request.body.zipcode,
							request.body.phone);
					mysqlDbHelper.executeQuery(sqlQuery, function(rows) {
						response.send({
							"status" : 200, // or 201 for creation,
							"message" : "Updated farmer info correctly" // or id for creation and data for get
						});
					}, function() {
						// failure callback
						response.send({
							"status" : 400,
							"errmsg" : "Error: unable to get any farmer by puid: " + request.param.puid
						});
					});
				}
				catch (err) {
					response.send({
							"status" : 500,
							"errmsg" : "Error: Internal server error, Cannot connect to mysql server: "	+ err
						});
				}
			}
			else {
				response.send({
		    		"status" : 403,
		    		"message" : "Error: No permissions to edit the user"
		    	});
			}
		}
		else {
			response.send({
	    		"status" : 403,
	    		"message" : "Error: Cannot find profile"
	    	});
		}
	}
	else {
		response.send({
    		"status" : 403,
    		"message" : "Error: Cannot find session"
    	});
	}
};

exports.deleteFarmerByPuid = function(request, response) {
	if(request.session) {
		if(request.session.profile) {
			if(request.session.profile.puid === request.params.puid) {
				var sqlQuery = sqlQueryList.getQueryForDeleteOfAFarmer(request.params.puid);
				mysqlDbHelper.executeQuery(sqlQuery, 
						function(rows) {
							response.send({
								"status" : 200,
								"message" : "Deleted User Successfully"
							});
						}, function(err) {
							response.send({
								"status" : 400,
								"errmsg" : "Error: Unable to delete user: " + err 
							});
						});
			}
			else {
				response.send({
					"status" : 403,
					"errmsg" : "Error: Permissions not found to delete user " 
				});
			}
		}
		else {
			response.send({
				"status" : 403,
				"errmsg" : "Error: Cannot find profile" 
			});
		}
	}
	else {
		response.send({
			"status" : 403,
			"errmsg" : "Error: Cannot find session" 
		});
	}
};