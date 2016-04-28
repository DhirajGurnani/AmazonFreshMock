/**
 * New node file
 */
var customerApp = angular.module('customer', [ 'ngRoute' ]);

customerApp.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, $routeParams) {
	$routeProvider.when('/', {
		templateUrl : 'amazon_welcome.html',
		controller : 'mainController'
	}).when('/home', {
		templateUrl : 'amazon_home.html',
		controller : 'homeController'
	});
	$locationProvider.html5Mode(true);
}]);

customerApp.controller('mainController', function($scope, $http) {
	$scope.checkForZipCode = function() {
		var zipCodeResponse = $http.get('/api/zipcode/' + $scope.zipcode);
		zipCodeResponse.success(function(data) {
			if(data.status === 200) {
				if(data.availability === true) {
					window.location = "/home";
				}
				else {
					alert("not found");
				}
			}
		});
		
	};
});

customerApp.controller('homeController', function($scope, $http) {
	$scope.checkForZipCode = function() {
		window.location = "/home";
	};
});