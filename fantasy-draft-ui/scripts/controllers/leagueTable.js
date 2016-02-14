'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('LeagueTableCtrl', 

	function ($scope, $http) {

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/league/table').success(function (data) {
			$scope.leagueTable = data;
		});
	}
);