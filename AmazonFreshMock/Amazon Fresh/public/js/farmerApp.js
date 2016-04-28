/**
 * New node file
 */
var farmerApp = angular.module('farmer', [ 'ngRoute' ]);

farmerApp.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider, $routeParams) {
			$routeProvider.when('/', {
				templateUrl : 'farmer.html',
				controller : 'mainController'
			});
			$locationProvider.html5Mode(true);
		} 
]);

farmerApp.controller('mainController', function($scope, $http) {
	
});