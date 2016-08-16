'use strict';


exchangeApp.directive("currenciesList", function ($compile) {
	return function (scope, element, attrs) {      
				var content='<table>'+
					'<tr>'+
						'<th></th>'+
						'<th></th>'+
						'<th>Покупка</th>'+
						'<th>Продажа</th>'+
					'</tr>'+
					'<tr class="currencies_items" ng-repeat="currency in dataDB.currencies | filter: {active:\'1\'} | limitTo:4">'+
						'<td class="icon"><img ng-src="img/flags/{{currency.icon}}.png" /></td>'+
						'<td class="currency_title">{{currency.title}} </td>'+
						'<td class="purchase">'+
							'<div ng-hide="currency.special_price.length">'+
								'{{currency.price_purchase}} '+
							'</div>'+
							'<div class="special_price" ng-show="currency.special_price.length">'+
								'<div ng-repeat="spec in currency.special_price">'+
									'<table><td class="spec_title">{{spec.title}}</td><td>{{spec.price_purchase}}</td></table></div> '+
								'</div> '+
						'</td>'+
						'<td class="sale">'+
							'<div ng-hide="currency.special_price.length">'+
							'	{{currency.price_sale}} '+
							'</div>'+
							'<div class="special_price" ng-show="currency.special_price.length">'+
							'	<div ng-repeat="spec in currency.special_price">'+
							'		<table><td class="spec_title">{{spec.title}}</td><td>{{spec.price_sale}}</td></table></div> '+
							'</div> '+
						'</td>'+
					'</tr>'+
				'</table>';
			var answersElem = angular.element(content);
			var compileFn = $compile(answersElem);
			compileFn(scope);
			element.append(answersElem);
    }
});
