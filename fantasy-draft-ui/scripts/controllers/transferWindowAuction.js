'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:YourTeamCtrl
 * @description
 * # YourTeamCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('TransferWindowAuctionCtrl', 

	function ($scope, $http, $rootScope, $modal) {

		$scope.filterRadioValue = 'goalkeeperFilter';
		$scope.sortRadioValue = 'team'; 

		$scope.numberOfConfirmedGoalkeepers = 0;
		$scope.numberOfConfirmedDefenders = 0;
		$scope.numberOfConfirmedMidfielders = 0;
		$scope.numberOfConfirmedStrikers = 0;

		$scope.remainingBudget = 0;
		$scope.initialRemainingBudget = 0;
		$scope.openDraftRound = true;
		$scope.madeBidsInOpenDraftRound = false;
		$scope.teamId = 0;

		$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/team').success(function (data) {
            $scope.teamDetails = data;

            $scope.amountSpentSoFar = 0;

            var tmpGoalkeeperList = [];
            var tmpDefenderList = [];
            var tmpMidfielderList = [];
            var tmpStrikerList = [];

			for (var i = 0; i < $scope.teamDetails.currentPlayers.length; i++) {
				if ($scope.teamDetails.currentPlayers[i].position === 'GOALKEEPER') {
					tmpGoalkeeperList.push($scope.teamDetails.currentPlayers[i]);
					$scope.numberOfConfirmedGoalkeepers = $scope.numberOfConfirmedGoalkeepers + 1;
				} else if ($scope.teamDetails.currentPlayers[i].position === 'DEFENDER') {
					tmpDefenderList.push($scope.teamDetails.currentPlayers[i]);
					$scope.numberOfConfirmedDefenders = $scope.numberOfConfirmedDefenders + 1;
				} else if ($scope.teamDetails.currentPlayers[i].position === 'MIDFIELDER') {
					tmpMidfielderList.push($scope.teamDetails.currentPlayers[i]);
					$scope.numberOfConfirmedMidfielders = $scope.numberOfConfirmedMidfielders + 1;
				} else {
					tmpStrikerList.push($scope.teamDetails.currentPlayers[i]);
					$scope.numberOfConfirmedStrikers = $scope.numberOfConfirmedStrikers + 1;
				} 
			}

			$scope.noOfSelectedGoalkeepers = 0;
			$scope.noOfSelectedDefenders = 0;
			$scope.noOfSelectedMidfielders = 0;
			$scope.noOfSelectedStrikers = 0;

			$scope.confirmedGoalkeepers = tmpGoalkeeperList;
			$scope.confirmedDefenders = tmpDefenderList;
			$scope.confirmedMidfielders = tmpMidfielderList;
			$scope.confirmedStrikers = tmpStrikerList;

			$scope.totalGoalkeepers = $scope.noOfSelectedGoalkeepers + $scope.numberOfConfirmedGoalkeepers;
			$scope.totalDefenders = $scope.noOfSelectedDefenders + $scope.numberOfConfirmedDefenders;
			$scope.totalMidfielders = $scope.noOfSelectedMidfielders + $scope.numberOfConfirmedMidfielders;
			$scope.totalStrikers = $scope.noOfSelectedStrikers + $scope.numberOfConfirmedStrikers;

			$scope.teamGoalkeepers = makeSquadList('Goalkeeper', 2 - $scope.numberOfConfirmedGoalkeepers);
			$scope.teamDefenders = makeSquadList('Defender', 5 - $scope.numberOfConfirmedDefenders);
			$scope.teamMidfielders = makeSquadList('Midfielder', 5 - $scope.numberOfConfirmedMidfielders),
			$scope.teamStrikers = makeSquadList('Strikers', 4 - $scope.numberOfConfirmedStrikers);

			$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/auctionPhase/team/status').success(function(data) {
				$scope.auctionDetails = data;

				$scope.remainingBudget = $scope.auctionDetails.remainingBudget;
				$scope.initialRemainingBudget = $scope.auctionDetails.remainingBudget;
				$scope.openDraftRound = $scope.auctionDetails.openTransferWindowForTeam;
				$scope.madeBidsInOpenDraftRound = $scope.auctionDetails.bidsSubmittedInCurrentWindow;
			});

			$scope.teamId = $scope.teamDetails.teamId;

			$scope.calculateRemainingBudget();

			$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/players?position=GOALKEEPER&selectionStatus=NOT_SELECTED').success(function(data) {
				$scope.poolGoalkeepers = data;
			});

			$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/players?position=DEFENDER&selectionStatus=NOT_SELECTED').success(function(data) {
				$scope.poolDefenders = data;
			});

			$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/players?position=MIDFIELDER&selectionStatus=NOT_SELECTED').success(function(data) {
				$scope.poolMidfielders = data;
			});

			$http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/players?position=STRIKER&selectionStatus=NOT_SELECTED').success(function(data) {
				$scope.poolStrikers = data;
			});
        });
		
		function makeSquadList (position, limit) {
			var tmpList = [];

			for (var i = 1; i <= limit; i++){
				tmpList.push(buildEmptySquadSelectionPlayer(position, i));
			}
			return tmpList;
		}

		function buildEmptySquadSelectionPlayer (position, index) {
			var selectionPlayer = {
				id: index,
				forename: 'Please',
				surname: 'Select',
				bidAmount : 0,
				squad: true
			};

			return selectionPlayer;
		}

		function getNextAvailableSquadPosition (squadList) {
			for (var i = 0; i < squadList.length; i++) {
				if (squadList[i].forename == 'Please') {
					return i;
				}
			}
		}

		function convertPoolPlayerToSelected(poolPlayer) {
			var selectedPlayer = {
				id: poolPlayer.id,
				forename: poolPlayer.forename,
				surname: poolPlayer.surname,
				bidAmount : 0,
				squad: true
			};

			return selectedPlayer;
		}

		if ($scope.bidsSubmitted != true) {
			$scope.bidsSubmitted = false;
		}

		$scope.fullTeam = [
			$scope.teamGoalkeepers,
			$scope.teamDefenders,
			$scope.teamMidfielders,
			$scope.teamStrikers
		]

		$rootScope.postTeamSelection = function () {
			var tmpPlayerList = [];

			tmpPlayerList = buildFullBidList(tmpPlayerList, $scope.teamGoalkeepers);
			tmpPlayerList = buildFullBidList(tmpPlayerList, $scope.teamDefenders);
			tmpPlayerList = buildFullBidList(tmpPlayerList, $scope.teamMidfielders);
			tmpPlayerList = buildFullBidList(tmpPlayerList, $scope.teamStrikers);

			var bidsRequest = {
				teamId: $scope.teamId,
				bids: tmpPlayerList
			}

			$http.post('http://localhost:8080/fantasy-draft-api/fantasydraft/transferWindow/auctionPhase/bid', bidsRequest).success(function(data) {
				$scope.bidsSubmitted = true;
			});
		}

		$scope.isTeamAboveBudget = function () {
			return $scope.remainingBudget < 0;
		}

		$scope.isTeamSelectionComplete = function () {
			var totalConfirmedPlayers = $scope.numberOfConfirmedGoalkeepers + $scope.numberOfConfirmedDefenders + $scope.numberOfConfirmedMidfielders + $scope.numberOfConfirmedStrikers;
			var totalPlayersPicked = $scope.totalGoalkeepers + $scope.totalDefenders + $scope.totalMidfielders + $scope.totalStrikers;
			var bidsMoreThanZero = $scope.allBidsMoreThanZero();

			if (!$scope.openDraftRound) {
				return false;
			} else if (totalConfirmedPlayers == 16) {
				return false;
			} else if ($scope.bidsSubmitted == true) {
				return false;
			} else {
				return totalPlayersPicked == 16 && $scope.remainingBudget >= 0 && bidsMoreThanZero; //&& $scope.teamDetails.team.status != "COMPLETE";
			}
		}

		$scope.canPickTeam = function () {
			return $scope.openDraftRound && !$scope.bidsSubmitted && !$scope.madeBidsInOpenDraftRound;
		}

		$scope.allBidsMoreThanZero = function() {
			var allBidsMoreThanZero = true;

			for (var i = 0; i < $scope.teamGoalkeepers.length; i++) {
				if ($scope.teamGoalkeepers[i].forename != "Please") {
					if ($scope.teamGoalkeepers[i].bidAmount < 1) {
						allBidsMoreThanZero = false;
					}
				}
			}

			for (var i = 0; i < $scope.teamDefenders.length; i++) {
				if ($scope.teamDefenders[i].forename != "Please") {
					if ($scope.teamDefenders[i].bidAmount < 1) {
						allBidsMoreThanZero = false;
					}
				}
			}

			for (var i = 0; i < $scope.teamMidfielders.length; i++) {
				if ($scope.teamMidfielders[i].forename != "Please") {
					if ($scope.teamMidfielders[i].bidAmount < 1) {
						allBidsMoreThanZero = false;
					}
				}
			}

			for (var i = 0; i < $scope.teamStrikers.length; i++) {
				if ($scope.teamStrikers[i].forename != "Please") {
					if ($scope.teamStrikers[i].bidAmount < 1) {
						allBidsMoreThanZero = false;
					}
				}
			}

			return allBidsMoreThanZero;
		}

		$scope.calculateRemainingBudget = function () {
			$scope.remainingBudget = $scope.initialRemainingBudget;

			for (var i = 0; i < $scope.teamGoalkeepers.length; i++) {
				if ($scope.teamGoalkeepers[i].forename != "Please") {
					$scope.remainingBudget = $scope.remainingBudget - $scope.teamGoalkeepers[i].bidAmount;
				}
			}

			for (var i = 0; i < $scope.teamDefenders.length; i++) {
				if ($scope.teamDefenders[i].forename != "Please") {
					$scope.remainingBudget = $scope.remainingBudget - $scope.teamDefenders[i].bidAmount;
				}
			}

			for (var i = 0; i < $scope.teamMidfielders.length; i++) {
				if ($scope.teamMidfielders[i].forename != "Please") {
					$scope.remainingBudget = $scope.remainingBudget - $scope.teamMidfielders[i].bidAmount;
				}
			}

			for (var i = 0; i < $scope.teamStrikers.length; i++) {
				if ($scope.teamStrikers[i].forename != "Please") {
					$scope.remainingBudget = $scope.remainingBudget - $scope.teamStrikers[i].bidAmount;
				}
			}
		}


		function buildFullBidList(fullBidList, positionBidList) {
			for (var i = 0; i < positionBidList.length; i++) {
				var selectionPlayer = {
					playerId: positionBidList[i].id,
					amount : positionBidList[i].bidAmount
				};

				fullBidList.push(selectionPlayer);
			}

			return fullBidList;
		}

		$scope.onGoalkeeperTypeaheadSelect = function ($item, $model, $label) {
			assignSelectedGoalkeeper($item);
		};

		$scope.selectGoalkeeper = function (forename, surname) {

			var selectedGoalkeeper;

			for (var i = 0; i < $scope.poolGoalkeepers.length; i++) {
				if ($scope.poolGoalkeepers[i].forename == forename && $scope.poolGoalkeepers[i].surname == surname) {
					selectedGoalkeeper = $scope.poolGoalkeepers[i];
					break;
				}
			}

			assignSelectedGoalkeeper(selectedGoalkeeper);
		}

		function assignSelectedGoalkeeper (item) {
			if ($scope.noOfSelectedGoalkeepers < 2) {
				if ($scope.teamGoalkeepers[$scope.noOfSelectedGoalkeepers].forename != 'Please') {
					var nextAvailablePosition = getNextAvailableSquadPosition($scope.teamGoalkeepers);
					$scope.teamGoalkeepers[nextAvailablePosition] = convertPoolPlayerToSelected(item);
				} else {
					$scope.teamGoalkeepers[$scope.noOfSelectedGoalkeepers] = convertPoolPlayerToSelected(item);
				}

				$scope.noOfSelectedGoalkeepers = $scope.noOfSelectedGoalkeepers + 1;
				$scope.totalGoalkeepers = $scope.noOfSelectedGoalkeepers + $scope.numberOfConfirmedGoalkeepers;
			}	
		}

		$scope.canGoalkeeperBeUnselected = function (index) {
			return $scope.teamGoalkeepers[index].forename != 'Please';
		}

		$scope.unselectGoalkeeper = function (index) {
			$scope.noOfSelectedGoalkeepers = $scope.noOfSelectedGoalkeepers - 1;
			$scope.totalGoalkeepers = $scope.noOfSelectedGoalkeepers + $scope.numberOfConfirmedGoalkeepers;
			$scope.teamGoalkeepers[index] = buildEmptySquadSelectionPlayer('Goalkeeper', index);
			$scope.calculateRemainingBudget();
		}

		$scope.onDefenderTypeaheadSelect = function ($item, $model, $label) {
			assignSelectedDefender($item);
		};

		$scope.selectDefender = function (forename, surname) {
			var selectedDefender;

			for (var i = 0; i < $scope.poolDefenders.length; i++) {
				if ($scope.poolDefenders[i].forename == forename && $scope.poolDefenders[i].surname == surname) {
					selectedDefender = $scope.poolDefenders[i];
					break;
				}
			}

			assignSelectedDefender(selectedDefender);
		}

		function assignSelectedDefender (item) {
			if ($scope.noOfSelectedDefenders < 6) {
				if ($scope.teamDefenders[$scope.noOfSelectedDefenders].forename != 'Please') {
					var nextAvailablePosition = getNextAvailableSquadPosition($scope.teamDefenders);
					$scope.teamDefenders[nextAvailablePosition] = convertPoolPlayerToSelected(item);
				} else {
					$scope.teamDefenders[$scope.noOfSelectedDefenders] = convertPoolPlayerToSelected(item);
				}

				$scope.noOfSelectedDefenders = $scope.noOfSelectedDefenders + 1;
				$scope.totalDefenders = $scope.noOfSelectedDefenders + $scope.numberOfConfirmedDefenders;
			}
		}

		$scope.unselectDefender = function (index) {
			$scope.noOfSelectedDefenders = $scope.noOfSelectedDefenders - 1;
			$scope.totalDefenders = $scope.noOfSelectedDefenders + $scope.numberOfConfirmedDefenders;
			$scope.teamDefenders[index] = buildEmptySquadSelectionPlayer('Defender', index);
			$scope.calculateRemainingBudget();
		}

		$scope.canDefenderBeUnselected = function (index) {
			return $scope.teamDefenders[index].forename != 'Please';
		}

		$scope.onMidfielderTypeaheadSelect = function ($item, $model, $label) {
			assignSelectedMidfielder($item);
		};

		$scope.selectMidfielder = function (forename, surname) {
			var selectedMidfielder;

			for (var i = 0; i < $scope.poolMidfielders.length; i++) {
				if ($scope.poolMidfielders[i].forename == forename && $scope.poolMidfielders[i].surname == surname) {
					selectedMidfielder = $scope.poolMidfielders[i];
					break;
				}
			}

			assignSelectedMidfielder(selectedMidfielder);
		}

		function assignSelectedMidfielder (item) {
			if ($scope.noOfSelectedMidfielders < 6) {
				if ($scope.teamMidfielders[$scope.noOfSelectedMidfielders].forename != 'Please') {
					var nextAvailablePosition = getNextAvailableSquadPosition($scope.teamMidfielders);
					$scope.teamMidfielders[nextAvailablePosition] = convertPoolPlayerToSelected(item);
				} else {
					$scope.teamMidfielders[$scope.noOfSelectedMidfielders] = convertPoolPlayerToSelected(item);
				}

				$scope.noOfSelectedMidfielders = $scope.noOfSelectedMidfielders + 1;
				$scope.totalMidfielders = $scope.noOfSelectedMidfielders + $scope.numberOfConfirmedMidfielders;
			}
		}

		$scope.unselectMidfielder = function (index) {
			$scope.noOfSelectedMidfielders = $scope.noOfSelectedMidfielders - 1;
			$scope.totalMidfielders = $scope.noOfSelectedMidfielders + $scope.numberOfConfirmedMidfielders;
			$scope.teamMidfielders[index] = buildEmptySquadSelectionPlayer('Midfielder', index);
			$scope.calculateRemainingBudget();
		}

		$scope.canMidfielderBeUnselected = function (index) {
			return $scope.teamMidfielders[index].forename != 'Please';
		}

		$scope.onStrikerTypeaheadSelect = function ($item, $model, $label) {
			assignSelectedStriker($item);
		};

		$scope.selectStriker = function (forename, surname) {

			var selectedStriker;

			for (var i = 0; i < $scope.poolStrikers.length; i++) {
				if ($scope.poolStrikers[i].forename == forename && $scope.poolStrikers[i].surname == surname) {
					selectedStriker = $scope.poolStrikers[i];
					break;
				}
			}

			assignSelectedStriker(selectedStriker);
		}

		function assignSelectedStriker (item) {
			if ($scope.noOfSelectedStrikers < 4) {
				if ($scope.teamStrikers[$scope.noOfSelectedStrikers].forename != 'Please') {
					var nextAvailablePosition = getNextAvailableSquadPosition($scope.teamStrikers);
					$scope.teamStrikers[nextAvailablePosition] = convertPoolPlayerToSelected(item);
				} else {
					$scope.teamStrikers[$scope.noOfSelectedStrikers] = convertPoolPlayerToSelected(item);
				}

				$scope.noOfSelectedStrikers = $scope.noOfSelectedStrikers + 1;
				$scope.totalStrikers = $scope.noOfSelectedStrikers + $scope.numberOfConfirmedStrikers;
			}
		}

		$scope.unselectStriker = function (index) {
			$scope.noOfSelectedStrikers = $scope.noOfSelectedStrikers - 1;
			$scope.totalStrikers = $scope.noOfSelectedStrikers + $scope.numberOfConfirmedStrikers;
			$scope.teamStrikers[index] = buildEmptySquadSelectionPlayer('Striker', index);
			$scope.calculateRemainingBudget();
		}

		$scope.canStrikerBeUnselected = function (index) {
			return $scope.teamStrikers[index].forename != 'Please';
		}

		/**
		* Submit bids modal
		*/
		$scope.openSubmitBidsModal = function () {

    		var modalInstance = $modal.open({
      			templateUrl: 'submitBidsModal.html',
      			controller: SubmitBidsModalInstanceCtrl
    		});

    		modalInstance.result.then(function (selectedItem) {
      			if (selectedItem == 'submitted') {
      				$scope.postTeamSelection();
      			}
    		}, function () {
      			
    		});

  		};

  		/*
		START: New functionality
  		*/


  		$scope.shouldShowSelectablePlayers = function (position) {

  			if (position == 'GK') {
				return $scope.filterRadioValue == 'goalkeeperFilter' || $scope.filterRadioValue == 'undefined';
			} else if (position == 'DEF') {
				return $scope.filterRadioValue == 'defenderFilter';
			} else if (position == 'MID') {
				return $scope.filterRadioValue == 'midfielderFilter';
			} else if (position == 'ATK') {
				return $scope.filterRadioValue == 'strikerFilter';
			}

			return true;
		}


		$scope.isPlayersToSelectDescending = function () {
			return $scope.sortRadioValue != 'team';
		}

	}
);