
/**
 * New node file
 */
var customerApp = angular.module('customer', [ 'ngRoute' ]);

customerApp.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider, $routeParams) {
			$routeProvider
			.when('/', {
				templateUrl : 'amazon_welcome.html',
				controller : 'mainController'
			}).when('/doLogin', {
				templateUrl : 'amazon_login.html',
				controller : 'loginController'
			}).when('/home', {
				
				templateUrl : 'amazon_home.html',
				controller : 'homeController'
			}).when('/doSignup', {
				templateUrl : 'amazon_signup.html',
				controller : 'signupController'
			}).when('/product_category', {
				templateUrl : 'amazon_product_category.html',
				controller : 'product_categoryController'
			}).when('/go_customer_profile', {
				templateUrl : 'amazon_customer_profile.html',
				controller : 'product_categoryController'
			});
			$locationProvider.html5Mode(true);
		} ]);

customerApp.controller('mainController', function($scope, $http) {
	$scope.checkForZipCode = function() {
		var zipCodeResponse = $http.get('/api/zipcode/' + $scope.zipcode);
		zipCodeResponse.success(function(data) {
			if (data.status === 200) {
				if (data.availability === true) {
					window.location = "/home";
				} else {
					alert("not found");
				}
			}
		});
	};
	$scope.go_to_loginpage = function() {
		// alert("login");
		// console.log("in home");
		window.location = "/doLogin";
	};

	
});

customerApp.controller('homeController', function($scope, $http) {
	$scope.go_to_loginpage = function() {
		// alert("login");
		// console.log("in home");
		window.location = "/doLogin";
	};
	$scope.go_to_product_cayegory = function() {
		 //alert("login");
		// console.log("in home");
		
		window.location = "/product_category";
	};
	$scope.logout_from_account = function() {
		// alert("login");
		// console.log("in home");
		window.location = "/doLogin";
	};$scope.go_to_homepage = function() {
		// alert("login");
		// console.log("in home");
		window.location = "/home";
	};$scope.go_to_customer_profile = function() {
		// alert("login");
		// console.log("in home");
		window.location = "/go_customer_profile";
	};


});

customerApp.controller('loginController', function($scope, $http) {
	$scope.go_to_signup = function() {
		window.location = "/doSignup";
	};

	$scope.checklogin = function() {
		// alert("went");
		$http({
			method : 'POST',
			url : 'api/login',
			data : {
				"username" : $scope.email,
				"password" : $scope.password
			},
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			console.log("success");
			console.log(data + "success");
			alert(data);
			window.location = "/home";
			
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
			// alert(data+"fail");
		});

	};
});

customerApp.controller('signupController', function($scope, $http) {
	$scope.go_to_loginpage = function() {
		//alert("signup");
		window.location = "/doLogin";
	};
	$scope.go_to_signup_operation = function() {
//		alert("aaya");
		$http({
			method : 'POST',
			url : 'api/register',
			data : {
				"first_name" : $scope.firstname,
				"last_name" : $scope.lastname,
				"email" : $scope.email,
				"birthday" : $scope.birthday,
				"address" : $scope.address,
				"location" : $scope.location,
				"state" : $scope.state,
				"zipcode" : $scope.zipcode,
				"phone" : $scope.phone,
				"role" : $scope.role,
				"password" : $scope.password,
				"status" : "pending"
			},
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			console.log("success");
			console.log(data + "success");
//			alert(data);
			window.location = "/doLogin";
			
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
			// alert(data+"fail");
		});
	
	};


});

customerApp.controller('product_categoryController', function($scope, $http) {
	

});
