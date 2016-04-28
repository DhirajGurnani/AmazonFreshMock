/**
 * New node file
 */
var customerApp = angular.module('customer', [ 'ngRoute' ]);

customerApp.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, $routeParams) {
	$routeProvider.when('/', {
		templateUrl : 'amazon_welcome.html',
		controller : 'mainController'
	}).when('/login',{
		templateUrl : 'amazon_login.html',
		controller : 'loginController'
	}).when('/home', {
		templateUrl : 'amazon_home.html',
		controller : 'homeController'
	}).when('/signup', {
		templateUrl : 'amazon_signup.html',
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
	$scope.go_to_loginpage = function(){
		//alert("login");
		//console.log("in home");
		window.location = "/login";
	};
	$scope.go_to_product_cayegory = function(){
		//alert("login");
		//console.log("in home");
		window.location = "/login";
	};

});

customerApp.controller('loginController', function($scope, $http) {
	$scope.go_to_signup = function(){
		window.location = "/signup";
	};
	$scope.checklogin = function(){
		//alert("went");
		$http({
			method : 'POST',
			url : '/api/login',
			data : {"username" : $scope.email,
					"password" : $scope.password},
			headers : {
					'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			alert(data+"success");
		}).error(function(data){
			
			alert(data);
		});
		
	};
});