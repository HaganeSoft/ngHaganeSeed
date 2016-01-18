app.controller('AdminUserCtlr', function ($scope, $timeout, $mdSidenav, $log, $http, $mdDialog, $mdToast, hagane) {
	$scope.$parent.loading = 'indeterminate';
	$scope.maestros = [];
	$scope.$parent.toolbar_title = 'Gestión de usuarios';

	hagane.api.get('/maestros')
	.then(function(res) {
		$scope.maestros = res.maestros;
	})
	.finally(function() {
		$scope.$parent.loading = null;
	});



	$scope.modDoctorDialog = function(ev, index) {
		$scope.usuarioDoctorForm = $scope.usuariosDoctor[index];
		$mdDialog.show({
			controller: DialogCtlr,
			templateUrl: 'app/admin/admin-user/edit-medico.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			scope: $scope,
			preserveScope: true
		})
		.then(function(resp) { //se guarda el cambio
			if (resp) {
				$http.post('Admin/ajaxUpdateUsuarioResponsable', $scope.usuarioDoctorForm)
				.then(function(response) {
					$mdToast.show(
						$mdToast.simple()
						.position('right')
						.content('Guardado Usuario Doctor')
						.parent(document.querySelector( '#pagecontent' ))
						.hideDelay(3000)
					);
				});
			}
		});
	};

	$scope.modPymeDialog = function(ev, index) {
		$scope.usuarioResponsableForm = $scope.usuariosResponsable[index];
		$mdDialog.show({
			controller: DialogCtlr,
			templateUrl: 'app/admin/admin-user/edit-cliente.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			scope: $scope,
			preserveScope: true
		})
		.then(function(resp) { //se guarda el cambio
			if (resp) {
				$http.post('Admin/ajaxUpdateUsuarioResponsable', $scope.usuarioResponsableForm)
				.then(function(response) {
					$mdToast.show(
						$mdToast.simple()
						.position('right')
						.content('Guardado Usuario Responsable')
						.parent(document.querySelector( '#pagecontent' ))
						.hideDelay(3000)
					);
				});
			}
		});
	};

	$scope.modAdminDialog = function(ev, index) {
		$scope.usuarioAdminForm = $scope.usuariosAdmin[index];
		$mdDialog.show({
			controller: DialogCtlr,
			templateUrl: 'Templates/modificarUsuarioAdmin.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			scope: $scope,
			preserveScope: true
		})
		.then(function(resp) { //se guarda el cambio
			if (resp) {
				$http.post('Admin/ajaxUpdateUsuarioResponsable', $scope.usuarioAdminForm)
				.then(function(response) {
					$mdToast.show(
						$mdToast.simple()
						.position('right')
						.content('Guardado Usuario Admin')
						.parent(document.querySelector( '#pagecontent' ))
						.hideDelay(3000)
					);
				});
			}
		});
	};
});
