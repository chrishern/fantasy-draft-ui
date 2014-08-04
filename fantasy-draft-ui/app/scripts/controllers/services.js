'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('ServicesCtrl', 
  
	function ($scope, $http) {
		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/players/').success(function(data) {
			$scope.players = data;
		});

		$scope.postTeamSelection = function () {
			$http.put('http://localhost:8080/fantasy-draft-api/fantasydraft/players/', $scope.fullTeam).success(function(data) {
				$scope.teamSelectionStatus = "done";
			});
		}
	}
);
