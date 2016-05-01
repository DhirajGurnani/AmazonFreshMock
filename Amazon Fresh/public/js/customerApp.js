/**
 * New node file
 */
var customerApp = angular.module('customer', ['ngRoute']);

customerApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider, $routeParams) {
        $routeProvider
            .when('/', {
                templateUrl: 'amazon_welcome.html',
                controller: 'mainController'
            }).when('/doSignup', {
                templateUrl: 'amazon_signup.html',
                controller: 'signupController'
            }).when('/doLogin', {
                templateUrl: 'amazon_login.html',
                controller: 'loginController'
            }).when('/home', {
                templateUrl: 'amazon_home.html',
                controller: 'homeController'
            }).when('/cart', {
                templateUrl: 'amazon_cart.html',
                controller: 'cartController'
            }).when('/product_category/:category_id', {
                templateUrl: 'amazon_product_category.html',
                controller: 'product_categoryController'
            }).when('/product_sub_category/:sub_category_id', {
                templateUrl: 'amazon_product_types.html',
                controller: 'product_sub_categoryController'
            }).when('/product/:product_id', {
                templateUrl: 'amazon_product.html',
                controller: 'productController'
            }).when('/customer_profile', {
                templateUrl: 'amazon_profile.html',
                controller: 'customer_profileController'
            }).when('/customer_orders', {
                templateUrl: 'amazon_orders.html',
                controller: 'customer_ordersController'
            });
        $locationProvider.html5Mode(true);
    }
]);

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
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log(data);
        });
    };
});

customerApp.controller('homeController', function($scope, $http) {
	var categoryResponse = $http.get('/api/product/category/get');
	categoryResponse.success(function(categoryData) {
		$scope.categories = categoryData.category;
		var categories = [];
		$scope.categories.forEach(function(category) {
			var subCategoryResponse = $http.get('/api/product/category/' + category.category_id + '/subcategory');
			subCategoryResponse.success(function(subCategoryData) {
				category.subCategories = subCategoryData.subcategory;
				categories.push(category);
				$scope.categories = categories;
			});
		});
	});
	
	var loadFiveProducts = function() {
		var getFiveProductsResponse = $http.get('/api/getFiveProducts');
		getFiveProductsResponse.success(function(data) {
			$scope.products = data.products;
			var products = []
			data.products.forEach(function(product) {
				var imageUrlResponse = $http.get('/api/products/' + product.product_id + '/images');
				imageUrlResponse.success(function(urlData) {
					//imageUrl
					console.log(urlData.urls);
					if(urlData.urls) {
						product.imageUrl = urlData.urls[0];
						products.push(product);
						$scope.products = products;
					}
				});
			});
		});
	};
	loadFiveProducts();

    var sessioninfo = $http.get('/api/getsessioninfo');
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };

    $scope.go_to_product_category = function() {
        window.location = "/product_category";
    };
});

customerApp.controller('loginController', function($scope, $http) {
    $scope.go_to_signup = function() {
        window.location = "/doSignup";
    };
    $scope.checklogin = function() {
        $http({
            method: 'POST',
            url: 'api/login',
            data: {
                "username": $scope.email,
                "password": $scope.password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
    $scope.go_to_homepage = function() {
        window.location = "/home";
    };
});

customerApp.controller('signupController', function($scope, $http) {
    $scope.go_to_loginpage = function() {
        window.location = "/doLogin";
    };
    $scope.go_to_signup_operation = function() {
 
    	var firstname= $scope.firstname;
		var last_name = $scope.lastname;
		var email = $scope.email;
		var birthday = $scope.birthday;
		var address = $scope.address;
		var location = $scope.location;
		var state = $scope.state;
		var zipcode =$scope.zipcode;
		var phone = $scope.phone;
		var role = $scope.role;
		var password = $scope.password;
		console.log($scope.password);
	//	alert($scope.password);	
		if($scope.firstname == undefined ||
				$scope.lastname == undefined ||
				$scope.email == undefined ||
				$scope.birthday == undefined ||
				$scope.address == undefined ||
				$scope.location == undefined ||
				$scope.state == undefined ||
				$scope.zipcode == undefined ||
				$scope.phone == undefined ||
				$scope.role == undefined ||
				$scope.password == undefined ){
		
	alert("Error");
		} else{

			alert("aaya");
			$http({
				method : 'POST',
				url : 'api/validEmail',
				data:{
					
					"email" : $scope.email,
					
				},
				headers : {
					'Content-Type' : 'application/json'
				}
		
		}).success(function(data) {
		//	console.log("success");
			//alert(data + "success");
			//console.log(data);
//			alert(data);
			//window.location = "/";
			if(data==true){
				alert("user already exist");
			} else {
		
		//	alert("gaya");
		
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
	//		console.log("success");
		//	console.log(data + "success");
//			alert(data);
			window.location = "/doLogin";
			
			
		}).error(function(data) {
			console.log("failure");
			console.log(data);
			// alert(data+"fail");
		});
			}
		});
	}
	}
});

customerApp.controller('customer_ordersController', function($scope, $http) {
	var sessioninfo = $http.get('/api/getsessioninfo');
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
});

customerApp.controller('product_categoryController', function($scope, $http) {
	var sessioninfo = $http.get('/api/getsessioninfo');
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
});

customerApp.controller('product_sub_categoryController', function($scope, $http) {
	var sessioninfo = $http.get('/api/getsessioninfo');
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
});

customerApp.controller('productController', function($scope, $http, $routeParams) {
	alert($routeParams.product_id);
	
	var sessioninfo = $http.get('/api/getsessioninfo');
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.add_to_cart = function(){
    	  $http({
              method: 'POST',
              url: 'api/logout',
              headers: {
                  'Content-Type': 'application/json'
              }
          }).success(function(data) {
              window.location = "/doLogin";
          }).error(function(data) {
              console.log("failure");
              console.log(data);
          });
    
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
});

customerApp.controller('customer_profileController', function($scope, $http) {
    var sessioninfo = $http.get('/api/getsessioninfo');
    console.log(sessioninfo);
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
            $scope.loggedIn = false;
            $scope.loggedOff = true;
        }
        $scope.first_name = data.profile[0].first_name;
        $scope.last_name = data.profile[0].last_name;
        $scope.address = data.profile[0].address;
        $scope.location = data.profile[0].location;
        $scope.state = data.profile[0].state;
        $scope.zipcode = data.profile[0].zipcode;
        $scope.phone = data.profile[0].phone;
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
        });
        var customer_details = $http.get('/api/getsessioninfo');
        customer_details.success(function(data) {
            if (data.profile) {
                $scope.Loggedin = false;
                $scope.Loggedoff = true;
                $scope.first_name = data.profile[0].first_name;

            }
        });
        $scope.edit_customer_profile = function() {
            alert("signup");
            window.location = "/edit_customer_information";
        };
    }
});

customerApp.controller('cartController', function($scope, $http) {
	var sessioninfo = $http.get('/api/getsessioninfo');
    sessioninfo.success(function(data) {
        if (data.profile) {
            $scope.loggedIn = true;
            $scope.loggedOff = false;
            $scope.username = data.profile[0].first_name;
        } else {
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
    $scope.go_to_customer_orders = function(){
    	window.location = "/customer_orders"
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart"
    };
    $scope.logout_from_account = function() {
        $http({
            method: 'POST',
            url: 'api/logout',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/doLogin";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
});
