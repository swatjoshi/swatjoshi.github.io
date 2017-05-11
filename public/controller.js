var app=angular.module('myApp',['ngRoute','leaflet-directive']);
app.config(function($routeProvider){
	$routeProvider
		.when('/home', {
			templateUrl: 'home.html',
			controller : 'mainController',
			resolve: {
			coordinates: function (myCoordinates) {
				return myCoordinates;
			}
		}
			
		})
		.when('/req_user', {
			templateUrl: 'Req_user.html',
			controller : 'reqUserController'
			
		})
		.when('/req_agent', {
			templateUrl: 'Req_agent.html',
			controller : 'reqAgentController'
			
		})
				
				
				
				 
					.otherwise({
			redirectTo: '/home'
		});
});
app.factory('saveMeService',['$rootScope',function($rootScope){
	var service={};
	var userData=[];
	service.setUserData=function(userInfo){
		userData=userInfo;
	};
	service.getUserData=function(){
		return userData;
	};
	
	return service;
}]);
app.factory('myCoordinates', ['$q', '$http','$rootScope', function myCoordinates($q,$http,$rootScope) {
	
	var deferred = $q.defer();
	var address=[];

		var myCoordinates = {};
		$http.get('http://ip-api.com/json').then(function(coordinates) {
			
			console.log(coordinates.data);
			$rootScope.address=coordinates.data;
			console.log(coordinates.data +" "+coordinates.data.lon+" "+coordinates.data.city);
			myCoordinates.lat = coordinates.data.lat;
			myCoordinates.lng = coordinates.data.lon;
			myCoordinates.city = coordinates.data.city;
			myCoordinates.regionName=coordinates.data.regionName;
			deferred.resolve(myCoordinates);
			//address=myCoordinates;
			//console.log(address);
			console.log($rootScope.address);
		});
		return deferred.promise;
	
	


	
	

}]);

app.controller('mainController',['$scope','$http','$location','myCoordinates','coordinates','saveMeService','$rootScope',function($scope,$http,$location,myCoordinates,coordinates,saveMeService,$rootScope){
	console.log('hello from controller');
	
		var isUserOpen=false;
		var isAgentOpen=false;
		
		console.log($rootScope.address);
		$scope.user=function(){
			$scope.isUserOpen=true;
		};
		$scope.agent=function(){
			$scope.isAgentOpen=true;
		};
		$scope.ambulance=function(){
			$rootScope.requestType='ambulance';
			var requestDetails= {requestType :$rootScope.requestType,username :'swati',address:{latitude: $rootScope.address.lat,longitude: $rootScope.address.lon,city : $rootScope.address.city,regionName:$rootScope.address.regionName}};
			console.log(requestDetails);			
			$http.post('/reqPost',{requestDetails:requestDetails}).then(function(response){
			console.log(response.data);
			saveMeService.setUserData(response.data);
				console.log(saveMeService.getUserData());
			});
			$location.path('/req_user');
	
		};
		
		
		
	
		$scope.fire=function(){
			$rootScope.requestType='fire';
			var requestDetails= {requestType :$rootScope.requestType,username :'swati',address:{latitude: $rootScope.address.lat,longitude: $rootScope.address.lon,city : $rootScope.address.city,regionName:$rootScope.address.regionName}};
			console.log(requestDetails);			
			$http.post('/reqPost',{requestDetails:requestDetails}).then(function(response){
			console.log(response.data);
			saveMeService.setUserData(response.data);
				console.log(saveMeService.getUserData());
			});
		};
		$scope.police=function(){
			//alert('this is police request');
			$rootScope.requestType='police';
			var requestDetails= {requestType :$rootScope.requestType,username :'swati',address:{latitude: $rootScope.address.lat,longitude: $rootScope.address.lon,city : $rootScope.address.city,regionName:$rootScope.address.regionName}};
			console.log(requestDetails);			
			$http.post('/reqPost',{requestDetails:requestDetails}).then(function(response){
			console.log(response.data);
			saveMeService.setUserData(response.data);
				console.log(saveMeService.getUserData());
			});
		};
		$scope.ambAgent=function(){
		//alert('agent side');
			$rootScope.agent='ambulance';
			$location.path('/req_agent');
		};
		$scope.fireAgent=function(){
		//alert('agent side');
			$rootScope.agent='fire';
			$location.path('/req_agent');
		};
		$scope.policeAgent=function(){
		//alert('agent side');
			$rootScope.agent='police';
			$location.path('/req_agent');
		};
		$scope.map = {
			center :{
			lat: myCoordinates.lat,
			lng: myCoordinates.lng,
			zoom: 14
			}
		};
		$scope.userRequestStatus=function(){
			//alert('from request status ');
			$location.path('/req_user');
		};
}]);
app.controller('reqUserController',['$scope','$http','$location','saveMeService',function($scope,$http,$location,saveMeService){
	 //console.log(saveMeService.getUserData().username);
		$http.post('/userReqTillNow',{username:'swati'}).then(function(response){
			console.log(response.data);
			$scope.requestStack=response.data;
			console.log(response.data.statusOfReq);
			if(response.data.statusOfReq=='approved')
			document.getElementById('quote').innerHTML='Your requested vehicle is on the way....';
			if($scope.reqQueue.statusOfReq=='rejected')
			document.getElementById('quote').innerHTML='Your request has been denied....';
		});
			//saveMeService.setUserData(response.data);

			//console.log(saveMeService.getUserData());
	 /*$scope.rara='swati';
	console.log('inside reqUserController');
	console.log(saveMeService.getUserData());
	//angular.copy(saveMeService.getUserData(),$scope.requestStack);
	//$scope.requestStack=saveMeService.getUserData();
	//console.log($scope.requestStack);
	$scope.assignCurrent=function(){
		//angular.copy(saveMeService.getUserData(),$scope.requestStack);
		$scope.requestStack=saveMeService.getUserData();
		
		console.log($scope.requestStack);
	};*/
	
}]);
app.controller('reqAgentController',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
	console.log($rootScope.agent);
	$scope.reqQueue=[];
	$http.post('/reqForReview',{requestType:$rootScope.agent}).then(function(response){
		console.log(response.data);
		$scope.reqQueue=response.data;
		
		
	});
	
	/*$scope.reqQueue=[];
	console.log('hello from agent controller');
	$scope.reqQueue=saveMeService.getUserData();
	console.log($scope.reqQueue);*/
	$scope.acceptReq=function(id){
		alert('request is approved by agent...');
		console.log('accept is called');
		console.log(id);
		$http.post('/reqUpdateApprove',{Object_id:id}).then(function(response){
			console.log(response.data);
			
		});
		
		document.getElementById('accept').innerHTML='Approved';
		//$scope.showReject=false;
	};
	$scope.rejectReq=function(id){
		alert('request is rejected by agent...');
		console.log('reject is called');
		console.log(id);
		$http.post('/reqUpdateReject',{Object_id:id}).then(function(response){
			console.log(response.data);
		});
		document.getElementById('reject').innerHTML='Rejected';
		//$scope.showAccept=false;
	};
}]);