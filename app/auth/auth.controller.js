app.controller('AuthCtlr', function ($scope, $rootScope, $state, hagane, HG_AUTH_EVENTS) {
	$scope.credentials = {};

	$scope.roleRoutes = {
		Administrador: 'admin',
		Cliente: 'cliente',
		Medico: 'medico',
		Super_medico: 'super-medico'
	};

	$scope.login = function () {
		hagane.login($scope.credentials)
		.then(function (res) {
			$rootScope.$broadcast(HG_AUTH_EVENTS.LOGIN_SUCCESS);
			$state.go($scope.roleRoutes[res.user.role]);
		}, function (res) {
			$rootScope.$broadcast(HG_AUTH_EVENTS.LOGIN_FAILED);
		});
	};
});
