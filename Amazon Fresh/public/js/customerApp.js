
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
			}).when('/customer_profile', {
				templateUrl : 'amazon_profile.html',
				controller : 'customer_profileController'
			}).when('/edit_customer_information', {
				templateUrl : 'amazon_edit_customer_profile.html',
				controller : 'edit_customer_profileController'
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
	
	var sessioninfo = $http.get('/api/getsessioninfo');
	sessioninfo.success(function(data) {
		if(data.profile){
			$scope.loggedIn = true;
			$scope.loggedOff = false;
			$scope.username = data.profile[0].first_name;
			}
		else{
			$scope.loggedIn = false;
			$scope.loggedOff = true;
		}
	});
	
	$scope.go_to_homepage = function() {
			window.location = "/home";
		};
		
	$scope.go_to_loginpage = function() {
		window.location = "/doLogin";
	};
	
	$scope.go_to_customer_profile = function() {
		window.location = "/customer_profile";
	};
	
	$scope.logout_from_account = function() {
		$http({
			method : 'POST',
			url : 'api/logout',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			
			window.location = "/doLogin";
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
		});

	};
	
});

customerApp.controller('homeController', function($scope, $http) {
	var sessioninfo = $http.get('/api/getsessioninfo');
	sessioninfo.success(function(data) {
		if(data.profile){
			$scope.loggedIn = true;
			$scope.loggedOff = false;
			$scope.username = data.profile[0].first_name;
			}
		else{
			$scope.loggedIn = false;
			$scope.loggedOff = true;
		}
	});
	
	$scope.go_to_homepage = function() {
		window.location = "/home";
	};
	
	$scope.go_to_loginpage = function() {
		window.location = "/doLogin";
	};

	$scope.go_to_customer_profile = function() {
		window.location = "/customer_profile";
	};
	

	$scope.logout_from_account = function() {
		$http({
			method : 'POST',
			url : 'api/logout',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			
			window.location = "/doLogin";
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
		});

	};
	
	$scope.go_to_product_cayegory = function() {
		 //alert("login");
		// console.log("in home");
		
		window.location = "/product_category";
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
			console.log(data);
			//alert(data);
			//if(data.)
			window.location = "/	";
			
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
			// alert(data+"fail");
		});

	};$scope.go_to_homepage = function() {
		 //alert("login");
			// console.log("in home");
			window.location = "/home";
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
			window.location = "/";
			
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
			// alert(data+"fail");
		});
	
	};


});

customerApp.controller('product_categoryController', function($scope, $http) {
	

});


customerApp.controller('customer_profileController', function($scope, $http) {
	var sessioninfo = $http.get('/api/getsessioninfo');
	sessioninfo.success(function(data) {
		if(data.profile){
			$scope.loggedIn = true;
			$scope.loggedOff = false;
			$scope.username = data.profile[0].first_name;
			}
		else{
			$scope.loggedIn = false;
			$scope.loggedOff = true;
		}
	});
	
	$scope.go_to_homepage = function() {
			window.location = "/home";
		};
		
	$scope.go_to_loginpage = function() {
		window.location = "/doLogin";
	};
	
	$scope.go_to_customer_profile = function() {
		window.location = "/customer_profile";
	};
	
	$scope.logout_from_account = function() {
		$http({
			method : 'POST',
			url : 'api/logout',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			
			window.location = "/doLogin";
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
		});

<<<<<<< Updated upstream
	var customer_details = $http.get('/api/getsessioninfo');
	customer_details.success(function(data) {
		/*/alert("aaya");
		console.log(data);
		alert(data.profile);
		*/if(data.profile){
			$scope.Loggedin = false;
			$scope.Loggedoff = true;
			$scope.first_name = data.profile[0].first_name;
			$scope.last_name = data.profile[0].last_name;
			$scope.birthday = data.profile[0].birthday;
			$scope.address = data.profile[0].address;
			$scope.location = data.profile[0].location;
			$scope.state = data.profile[0].state;
			$scope.zipcode = data.profile[0].zipcode;
			$scope.phone = data.profile[0].phone;
			$scope.status = data.profile[0].status;
			$scope.created_at = data.profile[0].created_at;
			$scope.updated = data.profile[0].updated_at;

		}
	});
	$scope.edit_customer_profile = function() {
		alert("signup");
		window.location = "/edit_customer_information";
	};
	

});
customerApp.controller('edit_customer_profileController', function($scope, $http) {
	alert("aaya");
	var customer_edit_details = $http.get('/api/getsessioninfo');
	customer_edit_details.success(function(data) {
		/*/alert("aaya");
		console.log(data);
		alert(data.profile);
		*/if(data.profile){
			$scope.Loggedin = false;
			$scope.Loggedoff = true;
			$scope.first_name = data.profile[0].first_name;
			$scope.last_name = data.profile[0].last_name;
			$scope.birthday = data.profile[0].birthday;
			$scope.address = data.profile[0].address;
			$scope.location = data.profile[0].location;
			$scope.state = data.profile[0].state;
			$scope.zipcode = data.profile[0].zipcode;
			$scope.phone = data.profile[0].phone;
			$scope.status = data.profile[0].status;
			$scope.created_at = data.profile[0].created_at;
			$scope.updated = data.profile[0].updated_at;
=======
	};
>>>>>>> Stashed changes

		}
		
	});
});
