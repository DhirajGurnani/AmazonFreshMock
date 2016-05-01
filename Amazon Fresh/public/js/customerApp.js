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
            }).when('/checkout', {
                templateUrl: 'amazon_checkout.html',
                controller: 'checkoutController'
            }).when('/shipping', {
                templateUrl: 'amazon_shippingdetails.html',
                controller: 'shippingController'
            }).when('/product_category/:category_id', {
                templateUrl: 'amazon_product_category.html',
                controller: 'product_categoryController'
            }).when('/product_category/:category_id/product_sub_category/:sub_category_id', {
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
            }).when('/farmer/:puid', {
                templateUrl: 'amazon_customer_farmer_view.html',
                controller: 'customer_farmer_viewController'
            }).when('/customer_order_confirmation', {
                templateUrl: 'amazon_order_confirmation.html',
                controller: 'customer_order_confirmationController'
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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
    var billsResponse = $http.get('/api/billing/getOrders');
    billsResponse.success(function(data){
    	$scope.bills = data.message;
    });
    
});

customerApp.controller('customer_order_confirmationController', function($scope, $http) {
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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
    var loadOrders = function(){
    	sessioninfo.success(function(data) {
    		$scope.order_price = parseInt(0);
            $scope.products = data.products;
            $scope.delivery_date = data.shipping.delivery_date;
            for(var i=0;i<data.products.length;i++){
            	$scope.order_price = $scope.order_price + parseInt(data.products[i].price)*parseInt(data.products[i].quantity);
            }
        });
    	$http.get('/api/clearSessionData');
    };
    loadOrders();
    
});

customerApp.controller('product_categoryController', function($scope, $http, $routeParams) {
	$scope.category_id = $routeParams.category_id;
	//alert($routeParams.category_id);
	var subcategory_info = $http.get('/api/product/category/'+ $routeParams.category_id +'/subcategory');
	subcategory_info.success(function(data){
//		console.log(data.subcategory);
		$scope.subcategories = data.subcategory;
		
//		$scope.subcategories.category_id = $routeParams.category_id;
	});
	
	var category_info = $http.get('/api/product/category/get');
	category_info.success(function(data){
	//	console.log(data);
		$scope.categories = data.category;
	});
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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

customerApp.controller('product_sub_categoryController', function($scope, $http, $routeParams) {
	//alert($routeParams.category_id);
	//alert($routeParams.sub_category_id);
	var category_info = $http.get('/api/product/category/get');
	category_info.success(function(data){
	//	console.log(data);
		$scope.categories = data.category;
	});
	var product_get_info = $http.get('/api/product/category/'+$routeParams.category_id+'/subcategory/'+$routeParams.sub_category_id);
	product_get_info.success(function(data){
		console.log(data.products);
		$scope.products = data.products;
        var products = [];
        
        data.products.forEach(function(product) {
        	var get_pictures = $http.get('/api/products/' + product.product_id + '/images');
            get_pictures.success(function(data2) {
            	console.log(data2);
            	if(data2.status == 200) {
            		product.imageUrls = "http://localhost:3000/" + data2.urls[0];
                    products.push(product);
                    $scope.products = products;
            	}
                //console.log($scope.products);
            });
        });
		
	//	$scope.categories = data.category;
	});
	
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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

customerApp.controller('productController', function($scope, $http, $routeParams, $location) {
	var category_info = $http.get('/api/product/category/get');
	category_info.success(function(data){
	//	console.log(data);
		$scope.categories = data.category;
	});

	//alert($routeParams.product_id);
	var get_product_response = $http.get('/api/product/'+$routeParams.product_id);
	get_product_response.success(function(data){
		$scope.options = [1,2,3,4,5];
		console.log(data.product[0]);
		$scope.product_name = data.product[0].product_name;
		$scope.product_price = data.product[0].price;
		$scope.puid = data.product[0].puid;
		$scope.product_description = data.product[0].description;
		var get_pictures = $http.get('/api/products/' + $routeParams.product_id + '/images');
        get_pictures.success(function(data) {
        	console.log(data);
        	if(data.status == 200) {
        		var imageUrls = [];
                for (i = 0; i < data.urls.length; i++) {
                    imageUrls[i] = "http://localhost:3000/" + data.urls[i];
                }
                console.log($location.$$absUrl);
                $scope.imageUrls = imageUrls;
        	}
        });
	});
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
    };
    $scope.add_to_cart = function(){
    	var get_product_response = $http.get('/api/product/'+$routeParams.product_id);
    	get_product_response.success(function(data){
    		console.log(data);
    		alert($scope.prod_Quantity);
    		$scope.product_name = data.product[0].product_name;
    		$scope.product_price = data.product[0].price;
    		$scope.product_description = data.product[0].description;
    		$http({
              method: 'POST',
              url: 'api/addToCart',
              data:{
            	  "product_id":$routeParams.product_id,
            	  "product_name":data.product[0].product_name,
            	  "quantity":$scope.prod_Quantity,
            	  "price":data.product[0].price,
            	  "puid":data.product[0].puid
              },
              headers: {
                  'Content-Type': 'application/json'
              }
          }).success(function(data) {
        	  alert("successful_insertion");
              //window.location = "/doLogin";
          }).error(function(data) {
              console.log("failure");
              console.log(data);
          });
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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
    }
});

customerApp.controller('shippingController', function($scope, $http) {
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
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
    $scope.go_to_checkout = function(){
    	$http({
            method: 'POST',
            url: 'api/addToShipping',
            data: {
                "address": $scope.address1,
                "location": $scope.city,
                "state": $scope.state,
                "zipcode": $scope.zip,
                "phone": $scope.phone,
                "delivery_date": $scope.date,
                "delivery_id": $scope.time_slot,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/checkout";
        }).error(function(data) {
            console.log("failure");
            console.log(data);
        });
    };
});

customerApp.controller('checkoutController', function($scope, $http) {
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
    };
    $scope.go_to_orders = function(){
    	window.location = "/customer_order_confirmation";
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
        console.log(data.products);
        var temp_product_name = [ ]
        var temp_product_total_price = [ ]
        for(i = 0; i < data.products.length; i++){
        	//temp_product_name[i]=data.products[i].product_name;
        	temp_product_total_price[i] = data.products[i].quantity*data.products[i].price;
        }
        $scope.product_addition_amounts = 0;
        for(i = 0; i < data.products.length; i++){
        	$scope.product_addition_amounts=$scope.product_addition_amounts+temp_product_total_price[i];
        }
        
        
       // $scope.product_price = temp_product_price;
        $scope.product_total_bill_amount = $scope.product_addition_amounts + 6;
        var imageUrls = [];
        var products = [];
        
        data.products.forEach(function(product) {
        	var get_pictures = $http.get('/api/products/' + product.product_id + '/images');
            get_pictures.success(function(data2) {
            	//console.log(data2);
            	product.imageUrls = "http://localhost:3000/" + data2.urls[0];
                products.push(product);
                $scope.products = products;
                //console.log($scope.products);
            });
        });
        
        for (i = 0; i < data.products.length; i++){
        
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
    	window.location = "/customer_orders";
    };
    $scope.go_to_cart = function(){
    	window.location = "/cart";
    };
    $scope.go_to_shipping = function(){
    	console.log($scope.product_total_bill_amount);
    	if($scope.product_total_bill_amount !== undefined) {
    		$http({
                method: 'POST',
                url: 'api/addTotalPrize',
                data: {
                	"total_price": $scope.product_total_bill_amount
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data) {
            	sessioninfo.success(function(data1){
            		if(data1.profile){
            			window.location = "/shipping";
            		}else{
            			window.location = "/doLogin";
            		}
            	});
            }).error(function(data) {
                console.log("failure");
                console.log(data);
            });
    	}
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
customerApp.filter("trustUrl", ['$sce', function($sce) {
    return function(recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);
customerApp.controller('customer_farmer_viewController', function($scope, $http, $routeParams, $location) {
	//alert("aaya");
 console.log($routeParams.puid);
	var farmer_details = $http.get('/api/farmers/'+ $routeParams.puid);
    farmer_details.success(function(data) {
    	console.log(data.farmers[0].first_name);
        if (data.farmers) {
            $scope.Loggedin = false;
            $scope.Loggedoff = true;
            $scope.first_name = data.farmers[0].first_name;
            $scope.last_name = data.farmers[0].last_name;
            $scope.birthday = data.farmers[0].birthday;
            $scope.address = data.farmers[0].address;
            $scope.location = data.farmers[0].location;
            $scope.state = data.farmers[0].state;
            $scope.zipcode = data.farmers[0].zipcode;
            $scope.phone = data.farmers[0].phone;
            $scope.status = data.farmers[0].status;
            $scope.created_at = data.farmers[0].created_at;
            $scope.updated = data.farmers[0].updated_at;
            var puid = data.farmers[0].puid;
            var get_pictures = $http.get('/api/farmers/' + puid + '/images');
            get_pictures.success(function(data) {
                var imageUrls = [];
                for (i = 0; i < data.urls.length; i++) {
                    imageUrls[i] = "http://localhost:3000/" + data.urls[i];
                }
                console.log(imageUrls);
                $scope.imageUrls = imageUrls;
            });
            $scope.videoUrls = 'http://localhost:3000/api/farmers/' + puid + '/video';
        }
    });

});
