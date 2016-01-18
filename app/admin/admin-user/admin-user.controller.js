app.controller('AdminUserCtlr', function ($scope, $timeout, $mdSidenav, $log, $http, $mdDialog, $mdToast, hagane) {
	$scope.$parent.loading = 'indeterminate';
	$scope.$parent.toolbar_title = 'Gestión de usuarios';
	$scope.usuarios = [];

	hagane.api.get('/usuarios')
	.then(function(res) {
		$scope.usuarios = res.usuarios;
	})
	.finally(function() {
		$scope.$parent.loading = null;
	});
});
