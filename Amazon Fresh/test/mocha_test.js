/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Location Statistics API', function(done){
		http.get('http://localhost:3000/api/admin/trips/locationStats', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Revenue Statistics API', function(done){
		http.get('http://localhost:3000/api/admin/trips/revenueStats', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Get Passport Session', function(done){
		http.get('http://localhost:3000/api/getSessionInfo', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Get Pending Trips', function(done){
		http.get('http://localhost:3000/api/admin/trips/getPendingTrips', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Get Bills', function(done){
		http.get('http://localhost:3000/api/admin/trips/getBills', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
});