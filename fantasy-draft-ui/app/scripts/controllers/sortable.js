'use strict';

/**
 * @ngdoc function
 * @name fantasyDraftUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasyDraftUiApp
 */
angular.module('fantasyDraftUiApp').controller('SortableCtrl', 

	function ($scope) {
		function makeList (letter) {
			var tmpList = [];

			for (var i = 1; i <= 6; i++){
			  tmpList.push({
				title: 'Item ' + i + letter,
				value: i
			  });
			}
			return tmpList;
		}
	  
		$scope.list1 = makeList('a');
		$scope.list2 = makeList('b');
	  
		$scope.rawScreens = [
			$scope.list1,
			$scope.list2
		];
	  
		$scope.sortableOptions = {
			placeholder: "app",
			connectWith: ".apps-container",
			update: function(event, ui) {
				// check that its an actual moving
				// between the two lists
				if (event.target.id !== 'screen-1' && ui.item.sortable.droptarget.attr('id') === 'screen-1' && $scope.rawScreens[1].length >= 10) {
					ui.item.sortable.cancel();
				}
			}
		};
	}
);