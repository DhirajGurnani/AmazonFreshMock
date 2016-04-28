/**
 * New node file
 */
var adminApp = angular.module('admin', [ 'ngRoute' ]);

adminApp.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider, $routeParams) {
			$routeProvider
			.when('/', {
				templateUrl : 'amazon_admin_create.html',
				controller : 'createController'
			}).when('/pendingTrips', {
				templateUrl : 'amazon_admin_pending.html',
				controller : 'pendingController'
			}).when('/completedTrips', {
				templateUrl : 'amazon_admin_completed.html',
				controller : 'completedController'
			}).when('/analyseTrips', {
				templateUrl : 'amazon_admin_analysis.html',
				controller : 'analysisController'
			}).when('/trackingTrips', {
				templateUrl : 'amazon_admin_tracking.html',
				controller : 'trackingController'
			});
			$locationProvider.html5Mode(true);
		} 
]);

adminApp.controller('createController', function($scope, $http) {
	var getDriverDetails = function() {
		var getDriverDetailsResponse = $http.get('/api/admin/trips/availableDrivers');
		getDriverDetailsResponse.success(function(driver){
			$scope.drivers = driver.message;
		});
	};
	var getTruckDetails = function() {
		var getTruckDetailsResponse = $http.get('/api/admin/trips/availableTrucks');
		getTruckDetailsResponse.success(function(truck){
			$scope.trucks = truck.message;
			console.log(truck.message);
		});
	};
	getTruckDetails();
	getDriverDetails();
	
});

adminApp.controller('pendingController', function($scope, $http) {
	var getPendingTrips = function() {
		var getPendingTripsResponse = $http.get('api/admin/trips/getPendingTrips');
		getPendingTripsResponse.success(function(pTrips){
			$scope.pendingTrips = pTrips.message;
			console.log(pTrips.message);
		});
	}
	getPendingTrips();
});

adminApp.controller('completedController', function($scope, $http) {

});

adminApp.controller('analysisController', function($scope, $http) {

});

adminApp.controller('trackingController', function($scope, $http) {

});