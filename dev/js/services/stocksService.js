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