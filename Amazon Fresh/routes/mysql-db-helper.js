/**
 *	db-helper.js
 *	@author Vaishampayan Reddy
 */
var mysql = require('./mysql');
var connection;

exports.executeQuery = function(queryString, successCallBack, failureCallBack) {
	connection = mysql.getConnection(function(connection) {
		connection.query(queryString, function(error, rows, fields) {
			console.log("query: " + queryString);
			if (!error) {
				console.log("Response obtained for query: " 
						+ queryString
						+ " from db: " 
						+ JSON.stringify(rows));
				successCallBack(rows);
			} else {
				console.log("error obtained" + error);
				failureCallBack("error obtained" + error);
			}
		});
	}, function(error) {
		throw "Error: error in connection to db: " + error;
	});
};

exports.closeConnection = function() {
	try {
		connection.release();
		console.log("closed connection");
	}
	catch(err) {
		throw "ERROR: Error in closing connection: " + err;
	}
};
