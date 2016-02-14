'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('DraftResultsCtrl', 

	function ($scope, $http) {

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/auction/results/1').success(function (data) {
			$scope.allResults = data;
		});

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/summary/1').success(function (data) {
			$scope.transferWindowSummary = data;
		});
	}
);