app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('admin', {
			url: '/admin',
			templateUrl: 'app/admin/admin.html',
			controller: 'AdminMainCtlr',
			data: {
				loginRequired: true,
				roles: ['Administrador']
			}
		})
		.state('admin/clientes', {
			url: '/admin/admin-clientes',
			templateUrl: 'app/admin/admin-clientes/admin-clientes.html',
			controller: 'AdminClientesCtlr',
			data: {
				loginRequired: true,
				roles: ['Administrador']
			}
		})
		.state('admin/user', {
			url: '/admin/admin-user',
			templateUrl: 'app/admin/admin-user/admin-user.html',
			controller: 'AdminUserCtlr',
			data: {
				loginRequired: true,
				roles: ['Administrador']
			}
		})
		.state('admin/reportes', {
			url: '/admin/admin-reportes',
			templateUrl: 'app/admin/admin-reportes/admin-reportes.html',
			controller: 'AdminReportesCtlr',
			data: {
				loginRequired: true,
				roles: ['Administrador']
			}
		});
});