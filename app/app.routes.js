app.run(['$rootScope', '$state', 'hagane', function ($rootScope, $state, hagane) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    var isAuthenticationRequired =  toState.data
          && toState.data.requiresLogin
          && !hagane.session.authorize();

    if(isAuthenticationRequired)
    {
      event.preventDefault();
      $state.go('login');
    }
	});
}]);
app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'app/auth/login.html',
			controller: 'AuthCtlr'
		})
		.state('admin', {
			url: '/admin',
			templateUrl: 'app/admin/admin.html',
			data: {
				requiresLogin : true
			},
			controller: 'AdminMainCtlr'
		});
});