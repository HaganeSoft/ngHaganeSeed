app.run(['$rootScope', '$state', 'hagane', 'HG_AUTH_EVENTS', function ($rootScope, $state, hagane, HG_AUTH_EVENTS) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		var isAuthenticationRequired =  toState.data
		&& toState.data.loginRequired;

		if(isAuthenticationRequired)
		{
			var role = hagane.session.getRole();
			if (role) {
				if (toState.data.roles.indexOf(role) < 0) {
					event.preventDefault();
					$state.go('login');
				}
			} else {
				hagane.session.authorize().then(function (res) {
					if (toState.data.roles.indexOf(res.user.role) < 0) {
						event.preventDefault();
						$state.go('login');
					} else {
						$rootScope.$broadcast(HG_AUTH_EVENTS.IS_AUTHORIZED);
					}
				}, function (res) {
					event.preventDefault();
					$state.go('login');
				});
			}
		}
	});
}]);