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
			}).when('/openMaps', {
				templateUrl: 'amazon_map.html',
				controller: 'mapController'
			}).when('/deleteCustomer', {
				templateUrl: 'amazon_customer_delete.html',
				controller: 'deleteCustomerController'
			});
			$locationProvider.html5Mode(true);
		} 
]);

adminApp.controller('deleteCustomerController', function($scope, $http) {
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
		
		$http({
			method : 'POST',
			url : '/api/admin/trips/createTrip',
			data : {"billing_id" : $scope.selectedBill, "driverId" : $scope.selectedDriver, "truckId" : $scope.selectedTruck, "adminId":"100004", "comments":"Created trip"},
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
	$scope.remove = function(){
		$scope.name= true;
	};
	getTruckDetails();
	getDriverDetails();
	getBillDetails();
});

adminApp.controller('mapController', function($scope, $http){
	
});

adminApp.controller('createController', function($scope, $http) {
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
		
		$http({
			method : 'POST',
			url : '/api/admin/trips/createTrip',
			data : {"billing_id" : $scope.selectedBill, "driverId" : $scope.selectedDriver, "truckId" : $scope.selectedTruck, "adminId":"100004", "comments":"Created trip"},
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
			//console.log(location);
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
			  zoom:12,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
			  };
			  
			var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
			
			var myData = [{
				"points": "yr{bFp||fVhBzEdBtEsBpAmGlE{GhEuAz@yB`B`AfCdCxG|BhGLZaA`AyA|AY^iAtBoD|GSf@U~@M`AAdALrAP|@FTkNxGgAj@mBlAiB~A_CfCqBvCuAhCiAfCq@bB}@~Bm@tAqAfBqAvAgBzAwA|@MLTb@?@R^NXVR~AbClAhBnB~CzL|RJp@A\\Oh@g@b@aBdB}AvB{DnF}@pAuDfFoCvDi@bA_D|HwAjDqBxFKp@eBjEsBnFUl@]Z]|@gEjKiCxGIl@Uj@w@nBe@nA[lAUrBI|GKnCIt@WtAmAzC[Vy@bB?Rs@pBs@zBO~@Av@HdATz@P^Zb@VTbAj@hAj@bAv@l@r@`B~Ap@n@HTL^Hj@@ZEh@IlA@bAJnAPp@r@`BJNRLP^\\bA^vAhDxMnAjFxAjFhBnHVbBTtC@vDkGxCs@\\"
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~TkI`SIRmH|PyChHiBpFeAhEa@xB]hCYhCQnCGjACrBClB?jDBjMQx@MjFQxCM|Ak@bEALAJ?Ha@?}D@_BAaF@s_@FeQ@yW@uH?yBAuCEgGEoA@qCDcFFgDE_JM}O?kG@_ADYDw@PeAd@o@`@]^}@pAoApCaDrHy@jBe@t@m@f@]Vu@\\q@Na@Di@@uCBg@Cq@ERsB"
			},
			{
				"points": "{~`cFr_dgVaDdKa@x@W^YHI@I@MEIIk@o@uAiB}CwDeFkG{BiCkFgGMu@Cw@Ac@zBwNHq@DS[TmAz@YRgAr@}@p@UCO@OGOIQSKUCUA]Bk@He@LYR[NOXIV?VJTTLZBb@K~B@r@@XIbAg@dGc@zEoAnQWdC{@tFaJtm@mA`ImD~ZoAnLwGzj@SjBuBrQuBrOi@nDsChO_ExScD|PcGb[{@lEeHv_@aCjLm@~CoJpg@uBrLeJpf@}A`IkBtISt@]dBuCvN{AfIsAzGcAtF_AfFkFf\\a@lC{BvPmAdJi@zDaFp_@iHhi@Kx@MbAOLWj@QZONOHQBSASISSQi@?e@Ha@R]\\MhBChAT~@PtI`BjE`AxDv@nATdE~@lHdBbH|A^D~BTtCRvBTnGrAjCl@rA^jB`@lDx@rCl@xDz@rEfAdAZ|Bl@jB^hDd@bBTjBXd@HnBl@x@T~C~@fCl@~J`ChH|AtAX~G~AhHbBZyC"
			},
			{
				"points": "ssqbFbjigVFzT@dDHXB|M?rG?vBMP?|FQ^KHq@PcBGiBAmPXiMTeFDqBFgBJ}@NuCx@wB`AgCdB_CnBgFfE_@XaB~@kBd@k@Fq@Dg@AeMc@aZ{AkAMaEu@uDs@yBSqAAsADaBPeGjAiFdAgCZs@FBpBB|J@BHN?xA?pJ@hKDnHDvF?hIApAAx@u@i@yCoB]Wc@]eCqBoAiAO^E`@_@~BEp@Bf@Ld@bApCPx@FxAGpBAh@H`AQhDE|CC~DBzV?zRGxCOvBc@tDs@bEa@dBw@jCwBrFyFvMmK~VsKhWmBhEkDnIsCvGwT`i@wHpQyChHiBpFeAhEa@xB]hCYhCQnCGjACrBClBBvRQx@EjBOtEW`Dm@fEAT?Ha@?}D@gG?}H@}`@F}N?qWBqECiLMuEHcFFgDE_JM}O?kG@_ADYDw@PeAd@o@`@]^}@pA_ArB_BxDkCbGe@t@m@f@]Vu@\\q@Na@D_EDyAIRsB"
			},
			{
				"points": "ssqbFbjigVT??]yD?cF@SL_BAcJBqJ@U@OKGAoA?[WIKKU@wA?kIA_CAiGCaA?mEAmMAcLEmCAuC?kCZuANYROTE^FTNP^F`@Ch@KXk@j@IFKRiBt@qAl@wQjHqD|@aCRy@@cLB_NJ}FE}E?cKDoGA_EAOOKE}CK{V{@o@EaAWi@Ym@g@s@aAYk@Qg@Mi@Ko@GcACgCEe@Sc@?iEFuEDcBHwBt@uK^mGJeDBmDCcF?_DEmQ?yDAmGCwCBiCRuD@OJcAb@cCZcB\\sA~CwKZkAZoAj@yCRcBLoBBoBA}CEwAQyBUcBWqAo@mCyCeIuB_GuCuHi@iA{@{AiA_BkAwAmBqBcH_G}@aAqAmBC]_AmBcAeC_@gAe@iB_@mBMiAIm@CqAGOIuBSsFY_BWs@Wk@i@s@aAy@w@_@g@Ms@Ks@?m@Hi@Lw@\\m@d@sBlB}AvAw@p@WL_@l@m@f@gAx@UN{@d@_ExAk@VuEdBo@POCUBG@[F_ANqIvASBm@_B{@}BWs@MGcHiRsFaOoHyR"
			},
			{
				"points": "ymnjF~jpdVxCbAbB{FkBq@}Ag@sAlFi@|CyFv[wBhKcC~GjKnDxFfBxL|LtF|DnOvFhIrAtLx@dGjE~ArIa@rEuC~FqPjSqSbYmCrPAzCjGbe@nBrOj@zz@U~pAmApfAtIbjA~fArqKrY~gDzPtnAbKjm@vE|^tLf`A~\\||BjKbWn[|a@rYj_@nO|XnHjZnHzf@`Nt_@jN|ShxAv~AvoBdwBr`CnbDxkEjfGboF|yH`fBpeCjs@hdA~c@bk@`Xv_@zUxc@fMzUtMnO`QdSrGnO`q@l_CrLpj@|HjS|NzPh}@hg@pa@bVra@~]pRhJpf@zEjp@b@vj@x@jMhFn{EvyDj]|XdHjJhKdb@bx@lbC~o@|oBpW|q@fa@tu@~JrWtDpC~Eh@le@Fng@f@rl@Ujm@mAjSwHrdAwe@z`Aiv@bm@se@ze@yOrc@wMlTK|V|CjJc@r_@qNxo@uFzRoAh`@`@pRqDtOcIdLsBpKT~PrD|v@nQlKxEvLnJnf@zc@`N`O~n@jg@xk@dc@jOnBrXyH~KYdPvCrGLrLiC~O{JtgAwz@xKsF`MSrLeBdIaHxKk[x[}dAfEwMjF}H~j@aj@|gAonA~\\ad@jKqHnJiC`p@aIf_@qFpNcG`_Aer@pZuMfJgBnOtCnrAfe@vL~ClJj@~k@Yvk@dChNvC`TzHbOlM`N`Gta@nK``@bG|`@fEhFeBjF_G`]y}@tEiHlQcLbXaZpWaRl\\a[tv@gi@bUcXdg@uVrZoBtMcE|Vk[vUa^xRa`@`n@cjAzPgZrH{HnL{F|JyA`p@H~LiBz~@qZrc@cXbm@{Tdl@{WddAwa@pUqLneA_m@~gAyl@vfAkr@nxBq`Bdj@mc@jK{Fjt@gTl{Ck|@|VmHpOgHbUcRtVwWxeAshA|TwT`L{CrS?tMeDnRaMtJsCfIi@l[u@df@aRjeAw]rFg@dHz@tDzAjJfD~IApLoFfKwHlGaBjKz@hDzAzi@dUnJrEjFlF`PnVpI`^dQf[bk@rnAxO|RtD~LjFzTbIbL`^tU~^fNzMx@xKrF`UtWjKlR`[ju@f\\dp@nHtGzMnBzNiFlSgR~x@}a@`VqL|\\s]hf@ik@zXyWhf@mZdn@sOhKuBxKqC`RuJzg@q_@fgA}}@rL_GrHiB|a@aFfg@sGfT{Gvx@m[npB{`@vl@gMhQ{G|MmKnf@mi@ri@ml@djAqiAjq@}]fX}MxMoCfHX`MzEjd@bl@pd@jy@|l@ziApEtP@`CmABmd@nZkT|NqKhH_@fCdBpEdEfL|CjIbBtE"
			},
			{
				"points": "ymnjF~jpdVxCbAbB{FkBq@}Ag@sAlFi@|CyFv[wBhKcC~GjKnDxFfBxL|LtF|DnOvFhIrAtLx@dGjE~ArIwDrMqPjSqSbYmCrPAzCjGbe@nBrOj@zz@U~pAmApfAtIbjA~fArqKrY~gDzPtnAbKjm@vE|^tLf`A~\\||BjKbWn[|a@rYj_@nO|XnHjZnHzf@`Nt_@jN|ShxAv~AvoBdwBr`CnbDxkEjfGboF|yH`fBpeCjs@hdA~c@bk@`Xv_@zUxc@fMzUtMnO`QdSrGnO`q@l_CrLpj@|HjS|NzPh}@hg@pa@bVra@~]pRhJpf@zEjp@b@vj@x@jMhFn{EvyDj]|XdHjJhKdb@bx@lbC~o@|oBpW|q@fa@tu@~JrWtDpC~Eh@le@Fng@f@rl@Ujm@mAjSwHrdAwe@z`Aiv@bm@se@ze@yOrc@wMlTK|V|CjJc@r_@qNxo@uFzRoAh`@`@pRqDtOcIdLsBpKT~PrD|v@nQlKxEvLnJnf@zc@`N`O~n@jg@xk@dc@jOnBrXyH~KYdPvCrGLrLiC~O{JtgAwz@xKsF`MSrLeBdIaHxKk[x[}dAfEwMjF}H~j@aj@|gAonA~\\ad@jKqHnJiC`p@aIf_@qFpNcG`_Aer@pZuMfJgBnOtCnrAfe@vL~ClJj@~k@Yvk@dChNvC`TzHbOlM`N`Gta@nK``@bG|`@fEhFeBjF_G`]y}@tEiHlQcLbXaZpWaRl\\a[tv@gi@bUcXdg@uVrZoBtMcE|Vk[vUa^xRa`@`n@cjAzPgZrH{HnL{F|JyA`p@H~LiBz~@qZrc@cXbm@{Tdl@{WddAwa@pUqLneA_m@~gAyl@vfAkr@nxBq`Bdj@mc@jK{Fjt@gTl{Ck|@|VmHpOgHbUcRtVwWxeAshA|TwT`L{CrS?tMeDnRaMtJsCfIi@l[u@df@aRjeAw]rFg@dHz@tDzAjJfD~IApLoFfKwHlGaBjKz@hDzAzi@dUzQ`M`PnVpI`^dQf[bk@rnAxO|RtD~LjFzTbIbL`^tU~^fNzMx@xKrF`UtWjKlR`[ju@f\\dp@nHtGzMnBzNiFlSgR~x@}a@`VqL|\\s]jUiVpQeHnDn@zOxO~HhMpO`NzM~TjErBrEH|_@gSd|A_n@z\\cLld@sFneByRrX_BbQaEhOmGpwAg]fkAgSbuDwi@lO_BzH`@jJdCdL`Ina@ta@dUnUvq@ndAtNtNxw@fhA|HzInGpCzQv@~WQpb@}A|M\\p}@h@la@GtNqClCe@~DMdEhAXjv@AvEhBA|@ArPQzTL"
			},
			{
				"points": "ymnjF~jpdVxCbAbB{FkBq@}Ag@sAlFi@|CyFv[wBhKyBnDInBjKnDxFfBxL|LtF|DnOvFhIrAtLx@dGjE~ArIa@rEuC~FqPjS}MzOsDfHmCrPAzCjGbe@nBrOj@zz@U~pAmApfAtIbjA~fArqKrY~gDzPtnAbKjm@vE|^tLf`A~\\||BjKbWn[|a@rYj_@nO|XnHjZnHzf@`Nt_@jN|ShxAv~AvoBdwBt\\hc@|bBd~BxkEjfGboF|yHpw@zgAnm@t|@js@hdA~c@bk@`Xv_@zUxc@fMzUtMnO`QdSrGnO`q@l_CrLpj@|HjS|NzPh}@hg@pa@bVra@~]pRhJpf@zEjp@b@vj@x@jMhFn{EvyDj]|XdHjJhEtM~DnSfa@|mAzUns@~o@|oBpW|q@vS|`@nLvS~JrWtDpC~Eh@le@Fng@f@rl@Ujm@mAjSwHrdAwe@xc@g]`\\aXbm@se@ze@yOrc@wMzHk@pJ^|V|CjJc@r_@qNxo@uFzRoAh`@`@dIs@jH}BtOcIdLsBpKT~PrD|v@nQlKxEvLnJjUxQbP`Q`N`O~n@jg@xk@dc@`GbBhGJ`Ek@pRmG~KYdPvCrGLrLiC~O{JtgAwz@xKsF`MSrLeBdIaHxKk[x[}dAfEwMjF}H~j@aj@|gAonA~\\ad@jKqHnJiC`p@aIf_@qFpNcG`_Aer@pZuMfJgBjFXbHzBnrAfe@vL~ClJj@~k@Yvk@dChNvC`TzHbOlM`N`Gta@nK``@bGvSrCdLr@hFeBjF_G`]y}@tEiHlQcLbXaZpWaRl\\a[tv@gi@dNoR|EsDdg@uVrZoBtMcEpG_GjNkSvUa^xRa`@`n@cjAzPgZrH{HnL{F|JyA`p@H~LiBz~@qZrc@cXbm@{Tdl@{WddAwa@pUqLneA_m@~gAyl@vfAkr@xbAms@tt@cl@dj@mc@jK{Fjt@gTl{Ck|@|VmHpOgHbUcRtVwWxeAshA|TwT`L{CrS?tMeDnRaMtJsCfIi@l[u@df@aRlp@}T|SyGrFg@dHz@tDzAjJfD~IApLoFfKwHlGaBjKz@hDzAzi@dUnJrEjFlFnMbQpAjDpI`^dQf[bk@rnAxO|RtD~LjFzTbIbL`P~L~LtG|V|K`GhAzMx@xKrF`UtWjKlR`[ju@dN`[`MbTnHtGzMnBrGsAfFuClSgR~x@}a@`VqLlBqAnYa[~c@wh@hAqAvPuQbGcEhf@mZdn@sOhKuBxKqC`RuJzg@q_@fgA}}@rL_GrHiB|a@aFpXuBtI_@`LxBzBlCdH~g@~@zJ"
			},
			{
				"points": "sracF`fzgVn@eGRyAX_Bl@eC@u@AGCCOQq@UcMwCg@MHPHl@?T]jC{AnLYhCsBg@yBo@oGqAoDw@mGyAmAYeA_@m@W_@IiBc@qBYcCYyB_@gDq@mEeAaBc@iIoBaB_@iHcBsMwC_Da@gDWsBQkB[yIqBsEiAsDy@kAWcCg@aDo@cKeB_AOgLwBcEy@{AYISCCOCa@Q]_@Qg@aCkPQmAIUoL_z@cGsb@eAkHwA{KaAmH_AuHeBwMqBeOaEa[aAqHs@uEs@kEuAaHkCoKiD_LsDgLwFgQ_HkTeAkDkByFq@gCg@eCa@yCQwBIeDSkR[{V]_LMqDSyH?}P@ao@?mMMyAYgCkC_RG]{Ek]mBkNi@aFq@oKk@sNUyDB_AWiD]oCqBuKo@yGSeA]{A]cAk@iAsBkDc@}@Uo@Qk@_@qB]iBqAaHoBmJi@iDk@iDOg@_@}@_@k@e@g@e@]c@QyA[oBYqA]m@_@g@i@wCcEk@}@c@_Aw@gCYsAU_BK}AOyCy@aPM_DWmDUoEUF"
			},
			{
				"points": "u}dcFrnchVd@XXLHQnA_DlB_FfDkItF{NxCuHzEsLdBqEY[kBwAqEqDcAy@i@m@m@y@e@_Ay@iBu@kBcBwDSg@k@qA}BoFi@sA}@yDc@wCOwBGoAEiEK_FMoBYiBScAa@{Ag@sAuCqFm@gA_NiVaNmVmAwBaCeEyDkGs@kAuAsBoCkEqAeCgB{DuLqY{AmDqD{IqAwDiBsGeAqE{@sEoCaQkB_MSgBSeBcB}Ra@yC}CoT{Fea@iCyQmCsRaDaVqAyJo@oFiAqIuByOwF{b@kA{H_A{Es@oDuCkLcC_IgAiDqCyImFuPaHmTmAwDmBeGo@eCg@uCYcCO}BGsC]_ZSiP[mJUoGI_DCaE@sU@es@EyAOcB}CsToHuh@m@uEg@kFq@cLa@}KUyDB_AIuAc@}DSkAsAcH]eCk@{Fm@kCY}@i@gAAAmAqBiAwBi@eBiAgGy@mE_AiEy@aE[sBm@wDQy@Wu@_@q@k@s@q@i@iA]cEs@y@Wq@e@g@m@_DqE_@m@e@mAs@}BYyAUqBk@_Lq@qNi@yICc@UF"
			},
			{
				"points": "mazbFjm}fVKOYI[e@a@{@Je@f@i@v@cAbC}CfCcDtLvPl@lAnEwCR?LFJRn@nE|@nDv@~CRhALh@|@tHzAlKLr@V\\~@zEr@bCp@pBh@pAp@|A`@t@`CnDnApApD`DxEjErA|ApAhBrAjCdCdGjCfHfBvEv@~Bf@nBXxATpBN~BDbB?jBCvAInACV_@fD[bBi@pBYbA{CfKs@dDk@`ECLQzCGrC?|EBvKBvSBvIErDe@~JEl@G~@c@~GO~EEvF?|OH`FDrA\\xLp@bTVvL@`O?fHPpIh@jPH~KKv_@@xA\\t^BpDEjCI~BOjBO`B]hCk@vC{@|DgBjIa@xC[rEOlIBdk@GvFOvBUvB_@dCq@lDk@zBs@rBs@hBaGfNO\\Uj@qKfWuGvOgFrLsD~IwIpS_DtHa@d@OR_CpEWZYT}@\\iAZcA\\c@Vg@^[b@QZOd@Ov@AT@R|C@fD@r@?tBFnDDlE@nDAvEIhCIbDGtECBdJ?lB@rXB~i@@l["
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~Ti@l@OZmBrDUZYXWP}@ZsBl@]Ni@\\c@b@OXOZQj@Ir@?\\|GBnB?rBHrDBvI@bGM`DKdIGB~QBzn@Bxk@"
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~Ti@l@OZmBrDUZYXWP}@ZsBl@]Ni@\\c@b@OXOZQj@Ir@?\\|GBnB?rBHrDBvI@bGM`DKdIGB~QBzn@Bxk@"
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~TkI`SIRmH|PyChHiBpFeAhEa@xB]hCYhCQnCGjACrBClB?jDBjMQx@MjFQxCM|Ak@bEALAJD~@pB?tBCnA?dIGhMA~`@?rJ@jQCrMC`M?nKC~G@tG@bAA`KAbF@vECn@Ap@?Bl@?nA"
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~Ti@l@OZmBrDUZYXWP}@ZsBl@]Ni@\\c@b@OXOZQj@Ir@?\\|GBnB?rBHrDBvI@bGM`DKdIGB~QBzn@@`K?hCX?jC@Z@`A\\d@X^\\vAxBX^h@d@VPZJl@JTB~BAzD@AbBMHEFCP@lD"
			},
			{
				"points": "yu~bFdljgVm@Tq@Nk@F{@?k@Gc@MqAs@b@qATy@He@Dw@@w@Aw@OaA_AyDjCoArEqBlGyCzMiG~DiBxDmBvDiBfBu@`SeJhOaH~C{AkCuQq@qC`CiAxIcEnEuBbHcDj@Yx@UNCHCFJFFD@d@?rEM`@Fd@VVAtCfEZ^nAhBdBtBhAbAtAdAfAl@fAb@h@Tp@NfAVzARdBHtF?lABvL@~HMbBKdDWZJx@?xFMdABp@Ff@FbAZjB|@xAlAh@p@d@t@Vd@^|@Tn@Rz@XbBn@nJDTN\\VvL@`O?fHPpIh@jPH~KKv_@@xA\\t^BpDEjCI~BOjBO`B]hCk@vC{@|DgBjIa@xC[rEOlIBdk@GvFOvBUvB_@dCq@lDk@zBs@rBs@hBaGfNO\\Uj@qKfWuGvOgFrLsD~IwIpS_DtHa@d@OR_CpEWZYT}@\\iAZcA\\c@Vg@^[b@QZOd@Ov@AT@R|C@fD@r@?tBFnDDlE@nDAvEIhCIbDGtECBdJ?lB@rXB~i@pDB\\Df@PXNd@Z`@d@rAtBj@l@p@^n@Nx@DbH?AbBIDGFCJ?vD"
			},
			{
				"points": "yu~bFdljgVm@Tq@Nk@F{@?k@Gc@MqAs@b@qATy@He@Dw@@w@Aw@OaA_AyDoCnAmB|@m@PeAPq@\\wEjDkAx@e@Zu@h@W^KNYv@iC~HKr@En@?pG?~@AfB?fBOrCS`Bk@fCQl@yAnDs@vBaBfFy@rCYx@IRKPm@ZG@K@a@IIAOCa@_@u@g@iB_AyBo@gAOmBMw@AqIL}BByBJgN`AyBNiABiHA{IAmEEsEe@aEoAyAc@iAg@{E{A_CaAoCcAGO]_@KWC[Fm@NYTMREP?ZLHHNb@BTCb@S|AA@G`@Gb@cDdQWfA[nB_@pCCR?PDNiAfG}AhIW\\Qt@u@dD{@nCq@vAk@p@mArAg@b@_@`@OHE@]f@u@`AWNe@DkAM[EM@IBOC_@G_AGsCGsCB{BL_C^wBh@yAf@mAh@qBx@aEnAqCl@uBZcDZoCLoA@yBAgDKmHYcDIsKCMqMEaBWaD]aCW{ASiAy@iDwA}EaBqE`@_@dEwCb@m@TM"
			},
			{
				"points": "ikhcFz|lgVQJY\\STw@f@{C|Bo@p@lDnJp@bCR`ARdAVhBVxEJ~CFz@DbA@bC@pEaD?cDBmJ?mFCsGGmNK_NI{FIQAmACc@CVn@ZhAz@`Cj@zAlAbD`GvOHFNBtChJdBvFz@hDnAfG`AxFh@dD~AtL~Gph@~D`[dBfMbG~b@l@`FbFh]tEr\\TjAl@tFjAvMTbBPdBbB~KtAvIpAdIj@zCv@rDbBbGJZZfA`AlCfDhIlMzZbDzHbA|BtBrDlDrFlGdK~BbEtMzUpBvDbJbPr@rAhApBtAdCZv@`@lAd@jBXvBN~AJvFH|ERpDFd@^zBXtAz@pCv@nB@TdA|Cd@lATf@Pb@Pn@Al@K\\WZYJY?UGSQOWESA_@Hm@PYXQ~@MZEVS|@Gp^mBlBIr@CvCDx@DdHh@hB@r@AbBMfB[p@OfA_@vAo@zKyF~RcKbB{@pB}@bBi@fB_@vBYpBGt\\L`EKhD]`BWbB]hD{@zDsArGgCjBq@xC{@fBa@jB]tBYjBOjCOlBEjb@CbI?rIA|DEdBKlAOx@U^DrDu@jMqCjBe@n@W|@e@hA_Ah@q@j@{@n@qAh@}Ab@cCLwABgACsACiAIu@c@uBKc@_A{BuD}Gq@_BQk@[{AQgAGKOKYkCk@iFQoCIqCIeEE{PAqF?kP?sEJm@@O?iFHqEB_@TiCt@}GbGGdNAlT?nM?tG@lOAnDA?c@@kDAcLzD@AbBMHEFCP@lD"
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~Ti@l@OZmBrDUZYXWP}@ZsBl@]Ni@\\c@b@OXOZQj@Ir@?\\|GBnB?rBHrDBvI@bGM`DKdIGB~QBzn@@`K?hCX?jC@Z@`A\\d@X^\\vAxBX^h@d@VPZJl@JTB~BAzD@AbBMHEFCP@lD"
			},
			{
				"points": "yr{bFp||fVhBzEdWaQrKiHjDeCfGcElA{@|B}APQLK^SREf@B\\JTTVh@l@`Bh@tAZLXv@rBnFbBxEfAlEj@zC^fCtBtQpAxKLdAnApK^nD\\dDd@bCNv@T|@x@lCb@rAbAxBRj@`@t@`CnDnApA~GdG|C|ChAxAdAfBv@zAlAtC`BhEbCxG~AbEr@dCZtAZvBN`BHlADxB?|BM`CUzBWdBk@lCUt@o@vBsAlEoAbF_AdGCRQ|DCnE@nH@hGFv[?jAQxGc@zHUtCWdFMxEAnPDhIFlB@n@H~Bb@nOl@`SJbG@tJ?lA?|FDdGh@xPJdDDdEBxEClLC`HCjIBtFZzVBbFAxAI~CKtBM|AWxBa@hCmBzIuA|Ga@bDI|AQhDI|IBvj@GxCOvBc@tDs@bEa@dBw@jCc@lAsAdD_FdLUh@_K`VWp@yHxQsAbDmBhEkDnIsCvGkJ~Ti@l@OZmBrDUZYXWP}@ZsBl@]Ni@\\c@b@OXOZQj@Ir@?\\|GBnB?rBHrDBvI@bGM`DKdIGB~QBzn@Bxk@"
			},
			{
				"points": "ikhcFz|lgVQJY\\STw@f@{C|Bo@p@lDnJp@bCR`ARdAVhBVxEJ~CFz@DbA@bC@pEaD?cDBmJ?mFCsGGmNK_NI{FIQAmACc@CVn@ZhAz@`Cj@zAlAbD`GvOHFNBtChJdBvFz@hDnAfG`AxFh@dD~AtL~Gph@~D`[dBfMbG~b@l@`FbFh]tEr\\TjAl@tFjAvMTbBPdBbB~KtAvIpAdIj@zCv@rDbBbGJZZfA`AlCfDhIlMzZbDzHbA|BtBrDlDrFlGdK~BbEtMzUpBvDbJbPr@rAhApBtAdCZv@`@lAd@jBXvBN~AJvFH|ERpDFd@^zBXtAz@pCv@nB@TdA|Cd@lATf@Pb@Pn@Al@K\\WZYJY?UGSQOWESA_@Hm@PYXQ~@MZEVS|@Gp^mBlBIr@CvCDx@DdHh@hB@r@AbBMfB[p@OfA_@vAo@zKyF~RcKbB{@pB}@bBi@fB_@vBYpBGt\\L`EKhD]`BWbB]hD{@zDsArGgCjBq@xC{@fBa@jB]tBYjBOjCOlBEjb@CbI?rIA|DEdBKlAOzDiApBw@jAi@vBqAjAy@~@w@~A}AbFiFrG{GhEmExC{CzAuAl@e@hDyBxBiAhAc@vC}@^Gz@B~AOxCOdBEvGQ@yB?m@CiFCsD?cC@qUAyC@kGEyM?}V?gK?eD@o@_@?"
			}];
			myData.forEach(function(jsonData) {
				var path1 = google.maps.geometry.encoding.decodePath(jsonData.points);
					  
				var myTrip=[stavanger,amsterdam,london];
				var flightPath=new google.maps.Polyline({
				  path: path1,
				  strokeColor:"#0000FF",
				  strokeOpacity:0.8,
				  strokeWeight:2
				  });

				flightPath.setMap(map);
			});
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
	}
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