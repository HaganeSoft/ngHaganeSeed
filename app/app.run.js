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