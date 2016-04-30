/**
 * New node file
 */
var farmerApp = angular.module('farmer', [ 'ngRoute' ]);

farmerApp.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider, $routeParams) {
			$routeProvider.when('/', {
				templateUrl : 'amazon_farmer_profile.html',
				controller : 'mainController'
			}).when('/go_to_newproduct', {
				templateUrl : 'amazon_new_product.html',
				controller : 'newProductController'
			});
			$locationProvider.html5Mode(true);
		} 
]);
farmerApp.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

farmerApp.controller('mainController', function($scope, $http, $location) {
	
	var farmer_details = $http.get('/api/getsessioninfo');
	farmer_details.success(function(data) {
		if(data.profile){
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
			var puid = data.profile[0].puid;
			var get_pictures = $http.get('/api/farmers/'+puid+'/images');
			get_pictures.success(function(data){
				var imageUrls = [];
				for(i = 0;i < data.urls.length; i++){
					imageUrls[i]= $location.$$absUrl + data.urls[i];
				}
				$scope.imageUrls = imageUrls;
			});
			$scope.videoUrls = $location.$$absUrl + 'api/farmers/'+puid+'/video';
		}
	});

	var filesInfo;
	$scope.uploadFile = function(files) {
		filesInfo = files;
	};
	
	$scope.upload_image = function(){
		var farmer_details = $http.get('/api/getsessioninfo');
		farmer_details.success(function(data) {
			var puid = data.profile[0].puid;
			var reqData = new FormData();
			reqData.append("image", filesInfo[0]);
			$http({
						method : 'POST',
						url : '/api/farmers/'+ puid + '/images',
						data : reqData,
						headers : {
							'Content-Type' : undefined
						},
						transformRequest : angular.identity
					}).success(
					function(data) {
						 console.log(data);
						 alert(data);
						// console.log(data.buildInfo);
						// console.log(pack(data.buildInfo));
					});
			});
	};
	$scope.go_to_newproduct = function(){
		window.location="/go_to_newproduct";
	}
});


farmerApp.controller('newProductController', function($scope, $http, $location) {
	
	var categoryResponse = $http.get('/api/product/category/get');
	categoryResponse.success(function(categoryData) {
		$scope.categories = categoryData.category;
		console.log($scope.categories);
	});
	
	$scope.updateSubCategory = function() {
		if($scope.selectedCategory !== null || $scope.selectedCategory !== undefined) {
			var subCategoryResponse = $http.get('/api/product/category/' + $scope.selectedCategory + '/subcategory');
			subCategoryResponse.success(function(subCategoryData) {
				$scope.subCategories = subCategoryData.subcategory;
				console.log($scope.subCategories);
			});
		}
	};
	
	$scope.createNewProduct = function(){
		var farmer_details = $http.get('/api/getsessioninfo');
		farmer_details.success(function(data) {
			var puid = data.profile[0].puid;
		
		console.log($scope.selectedCategory);
		//alert("aaya");
		
		var dattaaaa = {
				"product_name":$scope.product_name,
				"quantity":$scope.product_quantity,
				"puid": puid,
				"price":$scope.product_price,
				"description":$scope.message,
				"category_id":$scope.selectedCategory,
				"subcategory_id":$scope.selectedSubCategory
			};
		
		console.log(dattaaaa);
		$http({
			method : 'POST',
			url : '/api/product/create',
			data : {
				"product_name":$scope.product_name,
				"quantity":$scope.product_quantity,
				"puid": puid,
				"price":$scope.product_price,
				"description":$scope.message,
				"category_id":$scope.selectedCategory,
				"subcategory_id":$scope.selectedSubCategory
			},
			headers : {
				'Content-Type' : 'application/json'
			},
//			transformRequest : angular.identity
		}).success(
		function(data) {
			 console.log(data);
			 alert(data);
		});
		});
	}
});

