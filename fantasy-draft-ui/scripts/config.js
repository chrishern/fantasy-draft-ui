'use strict';

var httpHeaders;
var originalLocation = "/main";

app.config([ '$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
	
	// ======= router configuration
	$routeProvider
      	.when('/', {
        	templateUrl: 'views/allSquads.html',
        	controller: 'SquadsCtrl'
	    })
	    .when('/login', {
	        templateUrl: 'views/login.html',
	        controller: 'LoginCtrl'
	    })
        .when('/allSquads', {
            templateUrl: 'views/allSquads.html',
            controller: 'SquadsCtrl'
        })
        .when('/draftRound', {
            templateUrl: 'views/draftRound.html',
            controller: 'TransferWindowCtrl'
        })
        .when('/auctionResults', {
            templateUrl: 'views/draftResults.html',
            controller: 'DraftResultsCtrl'
        })
        .when('/leagueTable', {
            templateUrl: 'views/leagueTable.html',
            controller: 'LeagueTableCtrl'
        })
        .when('/transferWindow', {
            templateUrl: 'views/transferWindow.html',
            controller: 'TransfersCtrl'
        })
        .when('/transferWindowAuction', {
            templateUrl: 'views/transferWindowAuction.html',
            controller: 'TransferWindowAuctionCtrl'
        })
        .when('/admin', {
            templateUrl: 'views/adminFunctions.html',
            controller: 'AdminFunctionsCtrl'
        })
	    .otherwise({
	        redirectTo: '/'
	    });
	
	// ======== http configuration
	
	//configure $http to view a login whenever a 401 unauthorized response arrives
    $httpProvider.responseInterceptors.push(function ($rootScope, $q) {
        return function (promise) {
            return promise.then(
                //success -> don't intercept
                function (response) {
                    return response;
                },
                //error -> if 401 save the request and broadcast an event
                function (response) {
                    if (response.status === 401) {
                        var deferred = $q.defer(),
                            req = {
                                config: response.config,
                                deferred: deferred
                            };
                        $rootScope.requests401.push(req);
                        $rootScope.$broadcast('event:loginRequired');
                        return deferred.promise;
                    }
                    return $q.reject(response);
                }
            );
        };
    });
    httpHeaders = $httpProvider.defaults.headers;
}]);