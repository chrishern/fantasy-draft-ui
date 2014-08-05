'use strict';

var httpHeaders;
var originalLocation = "/main";

app.config([ '$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
	
	// ======= router configuration
	$routeProvider
      	.when('/', {
        	templateUrl: 'views/main.html',
        	controller: 'MainCtrl'
	    })
	    .when('/about', {
	        templateUrl: 'views/about.html',
	        controller: 'AboutCtrl'
	    })
	    .when('/login', {
	        templateUrl: 'views/login.html',
	        controller: 'LoginCtrl'
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