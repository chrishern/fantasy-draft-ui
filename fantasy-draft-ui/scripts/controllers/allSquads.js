'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('SquadsCtrl', 

	function ($scope, $http) {

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/team/league').success(function (data) {
			$scope.squads = data;
		});

		$scope.getPlayerWeeklyPoints = function (player) {
			if (player.weeklyPointsScored == null) {
				return "-";
			}

			return player.weeklyPointsScored;
		}

		$scope.getPlayerTableRoleStyle = function (player) {
			var style = "";

			if (player.startingTeamStatus == 'CAPTAIN') {
				style = "success";
			} else if (player.startingTeamStatus == 'VICE_CAPTAIN') {
				style = "info";
			} else if (isSub(player)) {
				style = "danger";
			}

			return style;
		}

		function isSub (player) {
			if (player.startingTeamStatus == 'SUB_1' || player.startingTeamStatus == 'SUB_2' || player.startingTeamStatus == 'SUB_3' ||
				player.startingTeamStatus == 'SUB_4' || player.startingTeamStatus == 'SUB_5') {
				return true;
			}

			return false;
		}
	}
);