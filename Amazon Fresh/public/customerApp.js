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
		window.location = "/home";
	};
});

customerApp.controller('homeController', function($scope, $http) {
	$scope.checkForZipCode = function() {
		window.location = "/home";
	};
});