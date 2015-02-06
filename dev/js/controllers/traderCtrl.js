/**
 * Created by yangli on 5/02/15.
 */
/* globals angular */

;(function(){
    'use strict';
    angular.module('stocks').controller('traderCtrl', ['$scope', '$modal', 'userSvc', 'stocksSvc', '$state', '$interval', function($scope, $modal, userSvc, stocksSvc, $state, $interval){

        $scope.stock = {};

        $scope.profile = userSvc.profile;
        $scope.stocklist = stocksSvc.stocklist;

        if(!$scope.profile.name){
            $state.go('login');
        }

        $scope.netValue = function(){
            return _netAssets();
        };


        $scope.getQuote = function(){
            stocksSvc.getQuote($scope.stock.name).then(function(data){
                $scope.stock.results = data;
            });
        };


        $scope.open = function (data) {

            var modalInstance = $modal.open({
                templateUrl: 'buy-modal.html',
                controller: 'buyModalCtrl',
                size: 'md',
                resolve: {
                    data: function(){
                        return data || $scope.stock.results;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        //run this function asynchronously in the background to boost performance
        function _netAssets(){
            if ($scope.process) {return;}
            $scope.process = true;
            var keys = Object.keys($scope.profile.stocks);
            var amount = 0;
            for (var i = 0; i < keys.length; i ++){
                if (!$scope.stocklist[keys[i]]) {continue;}
                if ($scope.profile.stocks[keys[i]] < 0){
                    amount += $scope.profile.stocks[keys[i]] * $scope.stocklist[keys[i]].ask;
                } else {
                    amount += $scope.profile.stocks[keys[i]] * $scope.stocklist[keys[i]].bid;
                }
            }
            amount += $scope.profile.amount;
            $scope.process = false;
            return amount;
        }
    }]);
})();