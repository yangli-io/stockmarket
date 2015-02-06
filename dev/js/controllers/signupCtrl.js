/**
 * Created by yangli on 5/02/15.
 */
/* globals angular */

;(function(){
    'use strict';
    angular.module('stocks').controller('signupCtrl', ['$scope', 'userSvc', function($scope, userSvc){
        $scope.details = {};

        $scope.register = function(){
            $scope.details.stocks = {}
            userSvc.register($scope.details);
        };

    }]);
})();