	var exchangeControllers = angular.module('exchangeControllers', []);
	



	exchangeControllers.controller('headerCtrl', [ '$scope',   function($scope) {
		
		console.log($scope.dataDB);


	}]);
	
	 exchangeControllers.controller('currenciesCtrl', ['$scope', function($scope) {
		//$scope.data = DatabaseService.query();
		//$interval( function(){ $scope.getHeader(); }, 5000);

	}]); 