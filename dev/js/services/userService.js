/**
 * Created by yangli on 5/02/15.
 */
/* globals angular */
;(function(){
    'use strict';
    angular.module('stocks').service('userSvc', ['$http', '$state', 'stocksSvc', function($http, $state, stocksSvc){
        var vm = this;
        /*
         * user register function
         *
         * @param data (Object)
         */
        this.profile = {};

        this.getStockValues = _getStockValues;
        this.addStock = _addStock;
        this.login = _login;
        this.register = _register;
        this.funds = _funds;

        function _getStockValues(){
            var stocks = vm.profile.stocks;
            var keys = Object.keys(stocks);
            for (var i = 0; i < keys.length; i++){
                stocksSvc.getQuote(keys[i]);
            }
        }

        function _funds(amount, choice){
            var data = {
                amount: amount,
                choice: choice,
                email: vm.profile.email
            };

            $http({
                url: '/funds',
                method: 'PUT',
                data: data
            }).success(function(data){
                vm.profile.amount = data.amount;
                $state.go('trader');
            });
        }

        function _addStock(amount, data){
            var price = (amount > 0) ? data.AskRealtime : data.BidRealtime;

            var serverData = {
                email: vm.profile.email,
                amount: amount,
                symbol: data.Symbol,
                price: price
            };
            $http({
                url: '/stocks',
                method: 'PUT',
                data: serverData
            }).success(function(res){
                if (!vm.profile.stocks[serverData.symbol]){
                    vm.profile.stocks[serverData.symbol] = serverData.amount;
                } else {
                    vm.profile.stocks[serverData.symbol] += serverData.amount;
                }
                _getStockValues();
                vm.profile.amount -= (serverData.amount * serverData.price);
            });
        }

        function _login(data){
            $http({
                url: '/login',
                method: 'POST',
                data: data
            }).success(function(res){
                vm.profile = res;
                _getStockValues();
                $state.go('trader');
            });
        }


        function _register(data){
            $http({
                url: '/signup',
                method: 'POST',
                data: data
            }).success(function(res){
                vm.profile = res;
                _getStockValues();
                $state.go('trader');
            });
        }
    }]);
})();