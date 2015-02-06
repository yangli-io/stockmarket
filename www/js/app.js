/**
 * Created by yangli on 5/02/15.
 */
/*globals angular*/
;(function(){
    'use strict';
    angular.module('stocks',['ui.bootstrap', 'ui.router']);
})();
/**
 * Created by yangli on 5/02/15.
 */
/* globals angular*/
;(function(){
    'use strict';
    angular.module('stocks').config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        //
        // Now set up the states
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "login.html",
                controller: 'loginCtrl'
            }).state('signup', {
                url: "/signup",
                templateUrl: "signup.html",
                controller: 'signupCtrl'
            }).state('trader', {
                url: "/trader",
                templateUrl: "trader.html",
                controller: 'traderCtrl'
            }).state('funds', {
                url: "/funds",
                templateUrl: "funds.html",
                controller: 'fundsCtrl'
            });
    });

})();
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
/**
 * Created by yangli on 5/02/15.
 */
/* globals angular */

;(function(){
    'use strict';
    angular.module('stocks').service('stocksSvc', ['$http', function($http){
        var vm = this;

        vm.stocklist = {

        };


        this.getQuote = function(stock){
            var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + stock +"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK";
            return $http({
                url: url,
                method: 'JSONP'
            }).then(function(response){
                var data = response.data.query.results.quote;
                //saves data in memory
                vm.stocklist[data.Symbol] = {
                    ask: data.AskRealtime,
                    bid: data.BidRealtime
                };
                return data;
            });
        };


    }]);
})();
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