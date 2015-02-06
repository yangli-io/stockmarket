/**
 * Created by yangli on 7/02/15.
 */
/* globals angular */

;(function(){
    'use strict';
    angular.module('stocks').controller('fundsCtrl', ['$scope', '$state', 'userSvc', function($scope, $state, userSvc){
        if(!userSvc.profile.name){
            $state.go('login');
        }

        $scope.banker = function() {
            userSvc.funds($scope.amount, $scope.choice);
        };
    }]);
})();