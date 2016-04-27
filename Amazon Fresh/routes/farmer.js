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
//var mongoURL = "mongodb://localhost:27017/amazondb";
//var mongoDbHelper = require('./mongo-db-helper');

//var busboy = require('connect-busboy'); //middleware for form/file upload
//var path = require('path');     //used for file path
//var fs = require('fs-extra');       //File System - for file manipulation

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
            assert.ifError(error);
            response.send("error");
        }).
        on('finish', function() {
            console.log('done!');
            //response.send("done");
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