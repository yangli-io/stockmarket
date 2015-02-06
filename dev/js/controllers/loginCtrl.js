/**
 * Created by yangli on 5/02/15.
 */
/* globals angular */
;(function(){
    'use strict';
    angular.module('stocks').controller('loginCtrl', ['$scope', 'userSvc', function($scope, userSvc){
        $scope.details = {};

        $scope.logins = function(){
            userSvc.login($scope.details);
        };
    }]);
})();