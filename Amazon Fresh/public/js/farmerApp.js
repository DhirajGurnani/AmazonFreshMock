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
				controller : 'mainController'
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
			var puid = data.profile[0].puid;
			var get_pictures = $http.get('/api/farmers/'+puid+'/images');
			get_pictures.success(function(data){
//				alert(data);
//				console.log('$location',$location.$$absUrl);
//				console.log(data);
				var imageUrls = [];
				for(i = 0;i < data.urls.length; i++){
					imageUrls[i]= $location.$$absUrl + data.urls[i];
				}
	//			console.log(imageUrls);
				$scope.imageUrls = imageUrls;
			
			});
			$scope.videoUrls = $location.$$absUrl + 'api/farmers/'+puid+'/video';
			/*var get_video = $http.get('/api/farmers/'+puid+'/video');
			get_video.success(function(data){
//				alert(data);
			//	console.log('$location',$location.$$absUrl);
				console.log(data);
				var videoUrls = [];
				for(i = 0;i < data.urls.length; i++){
					imageUrls[i]= $location.$$absUrl + data.urls[i];
				}
				console.log(videoUrls);
				$scope.videoUrls = videoUrls;
			});*/
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
			
			console.log(filesInfo[0]);
			
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
		alert("aaya");
		window.location="/go_to_newproduct";
	}
});