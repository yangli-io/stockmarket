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