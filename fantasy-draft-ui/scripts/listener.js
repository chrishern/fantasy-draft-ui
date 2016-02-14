app.run(function($rootScope, $http, $location, Base64Service) {

	$rootScope.$on("$routeChangeStart", function() {
        $http.get('http://localhost:8080/fantasy-draft-api/fantasydraft/user/authenticated/retrieve/').success(function (data) {
            $rootScope.emailaddress = data;
        });
	});
	
	/**
     * Holds all the requests which failed due to 401 response.
     */
    $rootScope.requests401 = [];

    $rootScope.$on('event:loginRequired', function () {
    	$rootScope.requests401 = [];
    	
    	if ($location.path().indexOf("/login") == -1) {
    		originalLocation = $location.path();
    		
    		$rootScope.error = "Please enter a valid username / password";
    	}
   
        $location.path('/login');
    });

    /**
     * On 'event:loginConfirmed', resend all the 401 requests.
     */
    $rootScope.$on('event:loginConfirmed', function () {
        var i,
            requests = $rootScope.requests401,
            retry = function (req) {
                $http(req.config).then(function (response) {
                    req.deferred.resolve(response);
                });
            };

        for (i = 0; i < requests.length; i += 1) {
            retry(requests[i]);
        }
        $rootScope.requests401 = [];
    });

    /**
     * On 'event:loginRequest' send credentials to the server.
     */
    $rootScope.$on('event:loginRequest', function (event, username, password) {
    	// set the basic authentication header that will be parsed in the next request and used to authenticate
        httpHeaders.common['Authorization'] = 'Basic ' + Base64Service.encode(username + ':' + password);
        
        $http.post('http://localhost:8080/fantasy-draft-api/fantasydraft/user/authenticate/').success(function (data) {
        	$rootScope.$broadcast('event:loginConfirmed');
        	delete $rootScope.error;
        });
    });

    /**
     * On 'logoutRequest' invoke logout on the server.
     */
    $rootScope.$on('event:logoutRequest', function () {
        httpHeaders.common['Authorization'] = null;
        originalLocation = "/main";
    });
});