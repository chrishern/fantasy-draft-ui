'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('TransfersCtrl', 

	function ($scope, $http, $route) {

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/team').success(function (data) {
			$scope.team = data;
			$scope.remainingBudget = data.remainingBudget;
			$scope.teamId = data.teamId;
		});

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/transferDetail').success(function (data) {
			$scope.teamTransferDetail = data;
		});

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/league/team/summaries').success(function (data) {
			$scope.teamSummaries = data;
			$scope.playersToBuyOptions = [];
		});

		$scope.getPlayerTableRoleStyle = function (player) {
			var style = "";

			if (player.selectedStatus != 'STILL_SELECTED') {
				style = "active";
			} else if (player.startingTeamStatus == 'CAPTAIN') {
				style = "success";
			} else if (player.startingTeamStatus == 'VICE_CAPTAIN') {
				style = "info";
			} else if (isSub(player)) {
				style = "danger";
			}

			return style;
		}

		$scope.playerStillInSquad = function (player) {
			if (player.selectedStatus == 'STILL_SELECTED') {
				return true;
			} 

			return false;
		}

		$scope.sellToPot = function (player) {
			var sellToPotData = {
				selectedPlayerId: player.selectedPlayerId,
				amount: player.sellToPotPrice
			}

			$http.put("http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/sellToPot", sellToPotData).success(function (data) {
	            updatePlayerSquadStatus(player.selectedPlayerId, "PENDING_SALE_TO_POT");
	            updateRemainingBudget(player);
	        });
		}

		$scope.acceptBid = function (transfer) {
			var url = "http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/bid/" + transfer.transferId + "/accept";

			$http.put(url).success(function (data) {
	            $route.reload();
	        });	
		}

		$scope.rejectBid = function (transfer) {
			var url = "http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/bid/" + transfer.transferId + "/reject";

			$http.put(url).success(function (data) {
	            $route.reload();
	        });	
		}

		$scope.teamToBuyFromChanged = function () {
			$scope.playersToBuyOptions = [];

			for (var i = 0; i < $scope.teamSummaries.length; i++) {
				if ($scope.teamSummaries[i].teamId == $scope.teamBuyingFrom.teamId) {
					var teamToGetPlayersFrom = $scope.teamSummaries[i]; 

					for (var j = 0; j < teamToGetPlayersFrom.players.length; j++) {
						$scope.playersToBuyOptions.push(teamToGetPlayersFrom.players[j]);
					}
				}
			}
		}

		$scope.getPlayerName = function (player) {		
			return player.forename + ' ' + player.surname;
		}

		$scope.submitBid = function() {
			var bid = {
				buyingTeam: $scope.teamId,
				sellingTeam: $scope.teamBuyingFrom.teamId,
				selectedPlayerSubjectOfBid: $scope.selectedPlayerToBuy.selectedPlayerId,
				amount: $scope.bidAmount
			}

			$http.put("http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/bid", bid).success(function (data) {
	            $route.reload();
	        });
		}

		$scope.allowedToSubmitBid = function() {

			if ($scope.bidAmount >= 0) {
				return $scope.bidAmount <= $scope.remainingBudget; 
			}

			return false;
		}

		function updateRemainingBudget (player) {
			$scope.remainingBudget = $scope.remainingBudget + player.sellToPotPrice;
		}

		function updatePlayerSquadStatus (selectedPlayerId, newStatus) {
			for (var i = 0; i < $scope.team.currentPlayers.length; i++) {
				if ($scope.team.currentPlayers[i].selectedPlayerId === selectedPlayerId) {
					$scope.team.currentPlayers[i].selectedStatus = newStatus;
				}
			}
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