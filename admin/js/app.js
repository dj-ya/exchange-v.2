'use strict';


var adminApp = angular.module('adminApp', ['ngRoute']);

	
adminApp.controller('currenciesCtrl', ['$scope',  '$interval', '$http',  function($scope, $interval,$http) {
	
	/***************************/
		$scope.dataDB = {};	
		$scope.getInformation = function()
		{
		$http({method: 'GET', url: '../database.json?_dc='+new Date().getTime()}).
		  success(function(data, status, headers, config) {
			  /* data.currencies.sort(function(obj1, obj2) {
				  // Сортировка по возрастанию по полю "сортировка"
				  return obj1.sort-obj2.sort;
				});	 */
				$scope.dataDB = data;
				$scope.date = (new Date()).getTime();
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		  });
		  
		}
		$scope.getInformation();
		$interval(  function() {$scope.getInformation()} , 5000);
	/*******************************/

	
	$scope.removeCurrency = function (id)
	{
		
			$http({method: 'POST', url: './main.php?f=del', data: {"id" : id}, headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}}).
			  success(function(data, status, headers, config) {
					$scope.getInformation();
			  }).
			  error(function(data, status, headers, config) {
				alert(data);
			});
	}
	
	$scope.saveSettings = function()
	{
		//Собираем все настройки с вкладки "настройки"
		var values= {};
		values.app_title = $scope.dataDB.app_title;
		values.app_running_string = $scope.dataDB.app_running_string;
		
		$http({method: 'POST', url: './main.php?f=save_settings', data: values, headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}}).
			  success(function(data, status, headers, config) {
					$scope.getInformation();
			  }).
			  error(function(data, status, headers, config) {
				alert(data);
			});
	}
}]);

adminApp.controller('oneCurrencyCtrl', ['$scope',  '$http', '$routeParams',  function($scope, $http, $routeParams) {	

	//Показываем иконки флагов. Вызывается сразу 
	$http({method: 'POST', url: './main.php?f=readdir', data: {"src" : "../img/flags/"}, headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  transformRequest: function(obj) {
			var str = [];
			for(var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			return str.join("&");
		}}).
		  success(function(data, status, headers, config) {
			 // console.log(data);
				$scope.flags_array = data;
		  }).
		  error(function(data, status, headers, config) {
			alert(data);
		});	
	
	$scope.title = $scope.code = $scope.icon = $scope.price_purchase = $scope.price_sale = "";
	$scope.special_price = [];
	angular.forEach(["title","price_purchase","price_sale"], function(value, key){
		for(var i=1; i<=3; i++) $scope.special_price[value+(i)] = "";
	});
	
	//Получаем данные о валюте для редактирвоания
	$scope.getCurrency = function(id)
	{
		$http({method: 'GET', url: '../database.json?_dc='+new Date().getTime()}).
		  success(function(data, status, headers, config) {
				for(var i in data.currencies)
				{
					if(data.currencies[i].id == id)
					{
						$scope.save_function = "edit";
						$scope.title = data.currencies[i].title;
						$scope.code = data.currencies[i].code;
						$scope.icon= data.currencies[i].icon;
						$scope.sort = parseInt(data.currencies[i].sort);
						$scope.active = data.currencies[i].active;
						$scope.price_purchase= data.currencies[i].price_purchase;
						$scope.price_sale = data.currencies[i].price_sale;
						
						
						if(data.currencies[i].special_price.length>0)
						{
							angular.forEach(["title","price_purchase","price_sale"], function(value, key){
								for(var j=1; j<=data.currencies[i].special_price.length; j++) 
								{
									$scope.special_price[value+(j)] = data.currencies[i].special_price[j-1][value];
								}
							});
						}
						break;
					}
				}
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		  });
		
	}
	//Сохраняем новую или отредактированную валюту
	$scope.saveCurrency = function()
	{
		var emptyFields = false;
		if($scope.title.length==0 || !angular.isDefined($scope.title)) emptyFields=true;
		if($scope.code.length==0 || !angular.isDefined($scope.code)) emptyFields=true;
		if($scope.icon.length==0 || !angular.isDefined($scope.icon)) emptyFields=true;
		if($scope.price_purchase.length==0 || !angular.isDefined($scope.price_purchase)) emptyFields=true;
		if($scope.price_sale.length==0 || !angular.isDefined($scope.price_sale)) emptyFields=true;
		if($scope.sort.length==0 || !angular.isDefined($scope.sort)) emptyFields=true;
		console.log(emptyFields);
		if(!emptyFields)
		{
			var values = {
				"title":$scope.title,
				"code":$scope.code,
				"icon":$scope.icon,
				"price_purchase":$scope.price_purchase,
				"price_sale":$scope.price_sale,
				"sort":$scope.sort,
				"active":$scope.active
			}
			values.special_price = "";
			for(var i=1; i<=3; i++)
			{
				var special_price_item = {};
				if($scope.special_price["title"+i]!="" && $scope.special_price["price_purchase"+i]!="" && $scope.special_price["price_sale"+i]!="")
				{
					special_price_item["title"] = $scope.special_price["title"+i];
					special_price_item["price_purchase"] = $scope.special_price["price_purchase"+i];
					special_price_item["price_sale"] = $scope.special_price["price_sale"+i];
					
					if(values.special_price.length > 1) values.special_price += ",";
					values.special_price += JSON.stringify(special_price_item);					
				}
				
			}
			//console.log(values.special_price);
			var _func = ($routeParams.currencyId ? 'edit&id='+$routeParams.currencyId: 'add');
			$http({method: 'POST', url: './main.php?f='+_func, data: values, headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}}).
			  success(function(data, status, headers, config) {
					console.log(data);
					location.href="../admin/";
			  }).
			  error(function(data, status, headers, config) {
				alert(data);
			});
		}
	}
	
	//устанавливает в в модель значений выбранного флага.
	$scope.setFlag = function(src) {
		src = src.substr(13);
		src = src.split('.');
		$scope.icon = src[0];
	}
	
	//Если нажали редактировать то получить с сервера данные о валюте	
	if(angular.isDefined($routeParams.currencyId))
	{
		$scope.getCurrency($routeParams.currencyId);
	}
	
}]);


	
adminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/settings.html',
        controller: 'currenciesCtrl'
      }).
       when('/currency-detail', {
        templateUrl: 'partials/currency-detail.html',
        controller: 'oneCurrencyCtrl'
      }). 
	   when('/currency-detail/:currencyId/', {
        templateUrl: 'partials/currency-detail.html',
        controller: 'oneCurrencyCtrl'
      }). 
      otherwise({
        redirectTo: '/'
      });
  }]);
  
adminApp.run();