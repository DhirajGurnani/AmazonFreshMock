/**
 * New node file
 */
var farmerApp = angular.module('farmer', [ 'ngRoute' ]);

farmerApp.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider, $routeParams) {
			$routeProvider.when('/', {
				templateUrl : 'amazon_farmer_profile.html',
				controller : 'mainController'
			});
			$locationProvider.html5Mode(true);
		} 
]);

farmerApp.controller('mainController', function($scope, $http) {
	
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
				alert(data);
				console.log(data);
				var urls = data.urls.length;
				console.log(urls);
				var urs = [ ];
				for(i=0;i<urls;i++){
					urs[i]=data.urls[i];
				}
				$scope.no_of_image = urls;
				$scope.image_urls = urs;
			});

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
});