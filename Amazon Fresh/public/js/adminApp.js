/**
 * New node file
 */
var adminApp = angular.module('admin', [ 'ngRoute' ]);

adminApp.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider, $routeParams) {
			$routeProvider.when('/', {
				templateUrl : 'admin.html',
				controller : 'mainController'
			});
			$locationProvider.html5Mode(true);
		} 
]);

adminApp.controller('mainController', function($scope, $http) {
	
});