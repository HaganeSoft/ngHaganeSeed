app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'app/auth/login.html',
			controller: 'AuthCtlr'
		})
		.state('logout', {
			url: '/logout',
			template: '<div></div>',
			controller: function ($state, hagane, $rootScope, HG_AUTH_EVENTS) {
				hagane.session.destroy();
				$rootScope.$broadcast(HG_AUTH_EVENTS.LOGOUT_SUCCESS);
				$state.go('login');
			}
		});
});