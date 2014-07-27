'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('FplSortableCtrl', 

	function ($scope) {
	
		function makePoolList (position, limit) {
			var tmpList = [];

			for (var i = 1; i <= limit; i++){
			  tmpList.push({
				title: position + ' ' + i + ' to select ',
				position: position,
				pool: true,
				value: i
			  });
			}
			return tmpList;
		}
		
		function makeSquadList (position, limit) {
			var tmpList = [];

			for (var i = 1; i <= limit; i++){
			  tmpList.push({
				title: position + ' ' + i,
				position: position,
				pool: false,
				value: i
			  });
			}
			return tmpList;
		}
		
		function removeSelectionPanel(list) {
			var indexToRemove = -1; 
					
			for (var i = list.length - 1; i >= 0; i--) { 
				if (!list[i].pool) {
					indexToRemove = i;
					i = -1;
				}
			}
			
			// Remove the last selection panel.  If the last item in the list is a selection, remove the last selection panel.
			if (indexToRemove != list.length - 1) {
				for (var i = indexToRemove; i < list.length; i++) {
					list[i] = list[i + 1];
				}
			}
			
			list.length = list.length - 1;
		}
	  
		$scope.list1 = makePoolList('Goalkeeper', 4);
		$scope.list2 = makePoolList('Defender', 10);
		$scope.list3 = makePoolList('Midfielder', 10);
		$scope.list4 = makePoolList('Striker', 8);
		$scope.list5 = makeSquadList('Goalkeeper', 2);
		$scope.list6 = makeSquadList('Defender', 6);
		$scope.list7 = makeSquadList('Midfielder', 6),
		$scope.list8 = makeSquadList('Strikers', 4);
		
		$scope.noOfSelectedGoalkeepers = 0;
		$scope.noOfSelectedDefenders = 0;
		$scope.noOfSelectedMidfielders = 0;
		$scope.noOfSelectedStrikers = 0;
		
		$scope.poolGoalkeepers = [
			$scope.list1
		];
		
		$scope.poolDefenders = [
			$scope.list2
		];
		
		$scope.poolMidfielders = [
			$scope.list3
		];
		
		$scope.poolStrikers = [
			$scope.list4
		];
		
		$scope.teamGoalkeepers = [
			$scope.list5
		];
		
		$scope.teamDefenders = [
			$scope.list6
		];
		
		$scope.teamMidfielders = [
			$scope.list7
		];
		
		$scope.teamStrikers = [
			$scope.list8
		];
		
		$scope.sortablePoolGoalkeepers = {
			placeholder: "app",
			connectWith: "#selectedGoalkeepers",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if ($scope.noOfSelectedGoalkeepers === 2) {
					ui.item.sortable.cancel();
				}
				
			}
		};
		
		$scope.sortablePoolDefenders = {
			placeholder: "app",
			connectWith: "#selectedDefenders",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if ($scope.noOfSelectedDefenders === 6) {
					ui.item.sortable.cancel();
				}
				
			}
		};
		
		$scope.sortablePoolMidfielders = {
			placeholder: "app",
			connectWith: "#selectedMidfielders",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if ($scope.noOfSelectedMidfielders === 6) {
					ui.item.sortable.cancel();
				}
				
			}
		};
		
		$scope.sortablePoolStrikers = {
			placeholder: "app",
			connectWith: "#selectedStrikers",
			update: function(event, ui) {
				if ($scope.noOfSelectedStrikers === 4) {
					ui.item.sortable.cancel();
				}
			}
		};
		
		$scope.sortableSelectedGoalkeepers = {
			placeholder: "app",
			connectWith: "#poolGoalkeepers",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if ($scope.noOfSelectedGoalkeepers === 2) {
					ui.item.sortable.cancel();
				} else {
					$scope.noOfSelectedGoalkeepers = $scope.noOfSelectedGoalkeepers + 1;
					removeSelectionPanel($scope.list5);
				}
				
			}
		};
		
		$scope.sortableSelectedDefenders = {
			placeholder: "app",
			connectWith: "#poolDefenders",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if ($scope.noOfSelectedDefenders === 6) {
					ui.item.sortable.cancel();
				} else {
					$scope.noOfSelectedDefenders = $scope.noOfSelectedDefenders + 1;
					removeSelectionPanel($scope.list6);
				}
				
			}
		};
		
		$scope.sortableSelectedMidfielders = {
			placeholder: "app",
			connectWith: "#poolMidfielders",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if ($scope.noOfSelectedMidfielders === 6) {
					ui.item.sortable.cancel();
				} else {
					$scope.noOfSelectedMidfielders = $scope.noOfSelectedMidfielders + 1;
					removeSelectionPanel($scope.list7);
				}
				
			}
		};
		
		$scope.sortableSelectedStrikers = {
			placeholder: "app",
			connectWith: "#poolStrikers",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				//console.log('event.target.id: ' + event.target.id);
				//console.log('ui.item.sortable.droptarget.attr: ' + ui.item.sortable.droptarget.attr('id'));
				
				if ($scope.noOfSelectedStrikers === 4) {
					ui.item.sortable.cancel();
				} else {
					var item = ui.item.sortable.moved;
					var fromIndex = ui.item.sortable.index;
					var toIndex = ui.item.sortable.dropindex;
					//console.log('Data: ' + item + ", " + fromIndex + ", " + toIndex + ", " + $scope.dropTarget);
					
					$scope.noOfSelectedStrikers = $scope.noOfSelectedStrikers + 1;
					
					removeSelectionPanel($scope.list8);
				}
			}
		};
	}
);	