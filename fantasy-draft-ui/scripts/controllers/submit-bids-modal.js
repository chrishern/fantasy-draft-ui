'use strict';

var SubmitBidsModalInstanceCtrl = function ($scope, $modalInstance, $rootScope) {

  $scope.ok = function () {
  	$rootScope.postTeamSelection();
    $modalInstance.close('submit');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};