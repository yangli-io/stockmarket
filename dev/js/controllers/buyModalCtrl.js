/**
 * Created by yangli on 6/02/15.
 */
/* globals angular */

;(function(){
    'use strict';
    angular.module('stocks').controller('buyModalCtrl', ['$modalInstance', '$scope', 'data', 'stocksSvc', 'userSvc', function($modalInstance, $scope, data, stocksSvc, userSvc){
        $scope.data = data;
        if (typeof data === "string"){
            stocksSvc.getQuote(data).then(function(data){
                $scope.data = data;
            });
        }
        $scope.stock = {};

        $scope.ok = function () {
            stocksSvc.getQuote($scope.data.Symbol).then(function(data){
                //when current price doesnt equal shown price

                if ($scope.data.AskRealtime !== data.AskRealtime){
                    $scope.data = data;
                    return;
                }

                if ($scope.stock.buySell === "Sell"){
                    $scope.stock.amount = $scope.stock.amount * -1;
                }

                userSvc.addStock($scope.stock.amount, $scope.data);
                $modalInstance.close();
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
})();