var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 600,
    host     : '54.186.131.166',
    user     : 'amazondbadmin',
    password : 'marias@1234',
    port	 : 3306,
    database : 'amazondb'
});

exports.getConnection = function(success,failure) {
	pool.getConnection(function(err, connection) {
		if (!err) {
			console.log("Database is connected");
			connection.release();
			success(connection);
		} else {
			console.log("Error connecting database");
			failure("Error connecting database");
		}
    });
};