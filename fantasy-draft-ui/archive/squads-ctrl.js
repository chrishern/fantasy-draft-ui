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

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/teams/1').success(function (data) {
			var teamsInLeague = data;

			$scope.orderedTeams = [];

			for (var i = 0; i < teamsInLeague.length; i++) {
				var gks = [];
				var defs = [];
				var mids = [];
				var strs = [];

				for (var j = 0; j < teamsInLeague[i].selectedPlayers.length; j++) {
					var position = teamsInLeague[i].selectedPlayers[j].position;

					if (position === 'GOALKEEPER') {
						gks.push(teamsInLeague[i].selectedPlayers[j]);
					} else if (position === 'DEFENDER') {
						defs.push(teamsInLeague[i].selectedPlayers[j]);
					} else if (position === 'MIDFIEDER') {
						mids.push(teamsInLeague[i].selectedPlayers[j]);
					} else {
						strs.push(teamsInLeague[i].selectedPlayers[j]);
					}
				}

				var orderedTeam = {
					name : teamsInLeague[i].teamName,
					cost: teamsInLeague[i].cost,
					goalkeepers: gks,
					defenders: defs,
					midfielders: mids,
					strikers: strs
				}

				$scope.orderedTeams.push(orderedTeam);
			}
		});

		$scope.getTeam = function (index) {
			return $scope.orderedTeams[index];
		}
	}
);