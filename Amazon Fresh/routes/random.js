/**
 * New node file
 */
var mongo = require('mongodb');
var Grid = require('gridfs-stream');

// create or use an existing mongodb-native db instance
var db = new mongo.Db('amazondb', new mongo.Server("127.0.0.1", 27017));
var gfs = Grid(db, mongo);
var fs = require('fs');

exports.getVideo = function(request, response) {
	var readstream = gfs.createReadStream({
		filename : '9.jpg'
	});
	readstream.on('error', function(err) {
		console.log('An error occurred!', err);
		throw err;
	});
	readstream.pipe(response);
	response.send("done");
};

exports.postVideo = function(request, response) {
	var writestream = gfs.createWriteStream({
		filename : request.files.sairam.name
	});
	fs.createReadStream(request.files.sairam.path).pipe(writestream);
	response.send("done");
};