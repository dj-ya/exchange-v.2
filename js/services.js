'use strict';


var exchangeServices = angular.module('exchangeServices', ['ngResource']);

exchangeServices.factory('DatabaseService', ['$resource',
  function($resource){
    return $resource('database.json', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
}]);
