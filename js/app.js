'use strict';


var exchangeApp = angular.module('exchangeApp', [
  'exchangeServices'
]);

	
exchangeApp.controller('appCtrl', ['$scope' , 'DatabaseService', '$interval', '$http',  function($scope, DatabaseService, $interval,$http) {
		$scope.dataDB = {};
		$scope.test = "TEST!";
		var getInformation = function()
		{
		$http({method: 'GET', url: 'database.json?_dc='+new Date().getTime()}).
		  success(function(data, status, headers, config) {	
				data.currencies.sort(function(obj1, obj2) {
				  // Сортировка по возрастанию по полю "сортировка"
				  return obj1.sort-obj2.sort;
				});	
				$scope.dataDB = data;
				$scope.date = (new Date()).getTime();
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.dataDB = {};
		  });
		}
		
		
		getInformation();
		$interval(  function() {getInformation()} , 5000);
		
}]);
	
exchangeApp.run();