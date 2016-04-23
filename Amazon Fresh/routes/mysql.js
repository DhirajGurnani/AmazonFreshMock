var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 600,
    host     : '54.187.39.124',
    user     : 'amazondbadmin',
    password : 'marias@1234',
    port	 : 3306,
    database : 'amazondb'
});

exports.getConnection = function(success,failure) {
	pool.getConnection(function(err, connection) {
		if (!err) {
			console.log("Database is connected");
			success(connection);
		} else {
			connection.release();
			console.log("Error connecting database");
			failure("Error connecting database");
		}
    });
};
