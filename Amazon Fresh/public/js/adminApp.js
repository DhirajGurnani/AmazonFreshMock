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
			}).when('/tripStatistics', {
				templateUrl : 'amazon_admin_statistics.html',
				controller : 'statisticsController'
			}).when('/revenueStatistics', {
				templateUrl : 'amazon_admin_revenue.html',
				controller : 'revenueController'
			}).when('/adminBills', {
				templateUrl : 'amazon_admin_bills.html',
				controller : 'billController'
			}).when('/farmerApproval', {
				templateUrl : 'amazon_admin_fApproval.html',
				controller : 'approveFarmerController'
			}).when('/productApproval', {
				templateUrl : 'amazon_admin_pApproval.html',
				controller : 'approveProductController'
			}).when('/doLogin', {
				templateUrl: 'amazon_login.html',
                controller: 'loginController'
			});
			$locationProvider.html5Mode(true);
		} 
]);

adminApp.controller('createController', function($scope, $http) {
	var routes = [];
	var myCenter;
	var index = 0;
	var map;

	var getRouteData = function(bill, success) {
        $http({
            method: 'POST',
            url: '/api/convertToLatLng',
            data: {
                "address": bill.address,
                "location": bill.location,
                "state": bill.state,
                "zipcode": bill.zipcode
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            var latLng = {};
            latLng.lat = data.geometry.location.lat;
            latLng.lng = data.geometry.location.lng;
            latLng.billing_id = bill.billing_id;
            success(latLng);
        });
    };

	var initialize = function() {
	    var mapProp = {
	        center: myCenter,
	        zoom: 14,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	    var markers = [];
	    routes.forEach(function(oneroute) {
	    	myCenter = new google.maps.LatLng(oneroute.lat, oneroute.lng);
	        var marker = new google.maps.Marker({
	            position: myCenter,
	            animation:google.maps.Animation.BOUNCE,
	            label : oneroute.billing_id,
	            map: map
	        });
	        markers.push(marker);
	    });
	};

	$scope.loadCustomerDataInMap = function() {
	    var getBillDetailsResponse = $http.get('/api/admin/trips/getBills');
	    getBillDetailsResponse.success(function(bill) {
	    	bill.bills.forEach(function(eachBill) {
	    		getRouteData(eachBill, function(latlng) {
	    			routes.push(latlng);
	    			if(routes.length === bill.bills.length) {
	    	    		console.log(JSON.stringify(routes));
	    				myCenter = new google.maps.LatLng(routes[routes.length / 2].lat, routes[routes.length / 2].lng);
	    				google.maps.event.addDomListener(window, 'load', initialize);
	    			}
	    		});
	    	});
	    });
	};

	$scope.doLogout = function(){
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
	
	var getDriverDetails = function() {
		var getDriverDetailsResponse = $http.get('/api/admin/trips/availableDrivers');
		getDriverDetailsResponse.success(function(driver){
			$scope.drivers = driver.message;
		});
	};
	var getTruckDetails = function() {
		var getTruckDetailsResponse = $http.get('/api/admin/trips/availableTrucks');
		getTruckDetailsResponse.success(function(truck){
			$scope.trucks = truck.message;
		});
	};
	var getBillDetails = function() {
		var getBillDetailsResponse = $http.get('/api/admin/trips/getBills');
		getBillDetailsResponse.success(function(bill){
			$scope.bills = bill.message;
		});
	};
	$scope.tripCreate = function(){
		
		var billingIds = [];
		for(var index = 0; index < $scope.bills.length; index++) {
			if($scope.bills[index].checked) {
				billingIds.push($scope.bills[index].billing_id)
			}
		}
		$http({
			method : 'POST',
			url : '/api/admin/trips/createTrip',
			data : {"billing_id" : billingIds, "driverId" : $scope.selectedDriver, "truckId" : $scope.selectedTruck, "adminId":"100001", "comments":"Created trip"},
			headers : {
					'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			if(data.status === 200) {
				window.location = '/';
			}
			else {				
			}
		});
	};
	getTruckDetails();
	getDriverDetails();
	getBillDetails();
});

adminApp.controller('pendingController', function($scope, $http) {
	

	
	var getPendingTrips = function() {
		var getPendingTripsResponse = $http.get('api/admin/trips/getPendingTrips');
		getPendingTripsResponse.success(function(pTrips){
			$scope.pendingTrips = pTrips.message;
			//console.log(pTrips.message);
		});
	}
	getPendingTrips();
	
	$scope.doLogout = function(){
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
	
	$scope.tripDelete = function(trip_Id){
		$http({
			method : 'POST',
			url : '/api/admin/trips/deleteTrip',
			data : {"trip_id" : trip_Id},
			headers : {
					'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			console.log('success read');
			if(data.status === 200) {
				console.log('Success');
				window.location = '/pendingTrips';
			}
			else {				
			}
		});
	}
});

adminApp.controller('statisticsController', function($scope, $http) {
	
	var dataResponse = $http.get('/api/admin/getMapData');
	dataResponse.success(function(data) {
		var x=new google.maps.LatLng(37.333305,-121.9134345);
		var finalData = [];
		//console.log(data);
		data[0].forEach(function(location) {
			console.log(location);
			finalData.push(new google.maps.LatLng(location.start_location.lat,location.start_location.lng));
		});
		
		if(finalData.length === data[0].length) {
			console.log(finalData);
			var stavanger=new google.maps.LatLng(37.3323574,-121.9122916);
			var amsterdam=new google.maps.LatLng(37.3364937,-121.898496);
			var london=new google.maps.LatLng(37.3364937,-121.898496);

			function initialize()
			{
			var mapProp = {
			  center:x,
			  zoom:14,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
			  };
			  
			var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

			var myTrip=[stavanger,amsterdam,london];
			var flightPath=new google.maps.Polyline({
			  path:finalData,
			  strokeColor:"#0000FF",
			  strokeOpacity:0.8,
			  strokeWeight:2
			  });

			flightPath.setMap(map);
			}

			google.maps.event.addDomListener(window, 'load', initialize);
		}
	});
	
	var getTripLocations = function() {
		var getTripLocationsResponse = $http.get('api/admin/trips/locationStats');
		getTripLocationsResponse.success(function(tLocation){
			$scope.tripLocations = tLocation.datapoints;
			var chartData = $scope.tripLocations;
			console.log($scope.tripLocations);
			var chart = AmCharts.makeChart( "chartdiv", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": chartData,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "Count"
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "Location",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );
		});
	}
	getTripLocations();
	
	$scope.doLogout = function(){
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

adminApp.controller('revenueController', function($scope, $http) {
	var getRevenueStats = function() {
		var getRevenueStatsResponse = $http.get('api/admin/trips/revenueStats');
		getRevenueStatsResponse.success(function(rStats){
			$scope.revenueStats = rStats.datapoints;
			
			var chartData = $scope.revenueStats;

			console.log($scope.revenueStats);

			var chart = AmCharts.makeChart( "chartdiv", {
			  "type": "serial",
			  "theme": "light",
			  "dataProvider": chartData,
			  "valueAxes": [ {
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "y"
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "label",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );
		});
	}
	getRevenueStats();
	
	$scope.doLogout = function(){
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


adminApp.controller('billController', function($scope, $http) {
	var getAdminBills = function() {
		var getAdminBillsResponse = $http.get('/api/admin/trips/getBills');
		getAdminBillsResponse.success(function(adminBill){
			$scope.adminBills = adminBill.message;
		});
	};
	getAdminBills();
	
	$scope.doLogout = function(){
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

adminApp.controller('approveFarmerController', function($scope, $http) {
	var getFarmerPending = function() {
		var getFarmerPendingResponse = $http.get('/api/admin/trips/getFarmersPending');
		getFarmerPendingResponse.success(function(farmer){
			$scope.farmers = farmer.message;
		});
	};
	getFarmerPending();
	$scope.fApprove = function(id){
		$http({
			method : 'POST',
			url : '/api/admin/approveFarmer',
			data : {"puid" : id},
			headers : {
					'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			console.log('success read');
			if(data.status === 200) {
				console.log('Success');
				window.location = '/farmerApproval';
			}
			else {				
			}
		});
		$scope.doLogout = function(){
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
	}
});

adminApp.controller('approveProductController', function($scope, $http) {
	var getProductPending = function() {
		var getProductPendingResponse = $http.get('/api/admin/getProductsPending');
		getProductPendingResponse.success(function(product){
			$scope.products = product.message;
		});
	};
	getProductPending();
	$scope.get_dynamic_prize = function(category_id,subcategory_id){
			console.log(category_id);
			console.log(subcategory_id);
			$http({
				method : 'GET',
				url : '/dpa/category/category_id/subcategory/subcategory_id',
				headers : {
						'Content-Type' : 'application/json'
				}
			}).success(function(data) {
				console.log(data);
				$scope.averagePrice = data.averagePrice;
				$scope.maxprice = data.maxprice;
				$scope.minprice = data.minprice;
				$scope.quantityPresent = data.quantityPresent;
				$scope.quantitysold = data.quantitysold;
			});
	};
	$scope.doLogout = function(){
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
	$scope.pApprove = function(id,price){
		$http({
			method : 'POST',
			url : '/api/admin/approveProduct',
			data : {
				"product_id" : id,
				"price" : parseInt(price)
			},
			headers : {
					'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			console.log('success read');
			if(data.status === 200) {
				console.log('Success');
				window.location = '/productApproval';
			}
			else {	
				console.log('error');
			}
		});
	}
});