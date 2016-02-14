'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('AdminFunctionsCtrl', 

	function ($scope, $http) {

		$scope.showSpinner = false;
		$scope.showCalculateScoresButton = true;

		$scope.calculateGameweekScores = function() {

			$scope.showCalculateScoresButton = false;
			$scope.feedbackMessage = "Calculating.....";
			$scope.showSpinner = true;

			$http.put('http://localhost:8080/fantasy-draft-api/fantasydraft/gameweek/scores').success(function (data) {
				$scope.feedbackMessage = "Gameweek scores calculated.";
				$scope.showSpinner = false;
			}).error(function (data) {
				$scope.feedbackMessage = "ERROR CALCULATING GAMEWEEK SCORES.";
				$scope.showSpinner = false;
			});
		}
	}
);