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
	getDriverDetails();
	console.log($scope.selectedDriver);
});

adminApp.controller('pendingController', function($scope, $http) {

});

adminApp.controller('completedController', function($scope, $http) {

});

adminApp.controller('analysisController', function($scope, $http) {

});

adminApp.controller('trackingController', function($scope, $http) {

});