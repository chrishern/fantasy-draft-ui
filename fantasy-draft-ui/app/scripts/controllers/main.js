'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('MainCtrl', 
  /**
	*function ($scope) {
	*	$scope.todos = ['Item 1', 'Item 2', 'Item 3'];
	*}
	*/
	
	function ($scope, $http) {
		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/players/', 
		{headers : {'Access-Control-Allow-Origin' : '*', 
		'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT', 
		'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'}}).
			success(function(data) {
				$scope.players = data;
			});
	}
);