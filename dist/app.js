var app = angular.module('hgapp', ['ngHagane', 'ui.router', 'ngMaterial']);

app.config(function($mdThemingProvider, $mdIconProvider, haganeProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('red', {
		'default': '500'
	})
	.accentPalette('cyan', {
		'default': 'A200'
	});

	//Hagane API config
	//$httpProvider.defaults.withCredentials = true;
	haganeProvider.setHost('http://seed.hagane.io');
});

app.constant('USER_ROLES', {
	ADMIN: 'Administrador'
});

app.controller('AppCtlr', function($scope, $timeout, $mdSidenav, $log, $location, hagane) {
	$scope.toggleLeft = buildDelayedToggler('left');
	$scope.toggleRight = buildToggler('right');

	$scope.isOpenRight = function() {
		return $mdSidenav('right').isOpen();
	};

	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

	$scope.loading = null;
	$scope.toolbar_title = 'ngHgnSeed';

	/**
	 * Checks the current path and assigns an 'active' class to the
	 * element if it matches the argument
	 */
	$scope.isActive = function(path) {
		pathArray = path.split('/');
		actualPathArray = window.location.pathname.split('/');
		for (var i = pathArray.length - 1; i >= 0; i--) {
			if (pathArray[i] === "") break;
			if (pathArray[i] != actualPathArray[actualPathArray.length - 1 - (pathArray.length - 1 - i)]) return false;
		};
		return true;
	};

	/**
	 * Supplies a function that will continue to operate until the
	 * time is up.
	 */
	function debounce(func, wait, context) {
		var timer;
		return function debounced() {
			var context = $scope,
				args = Array.prototype.slice.call(arguments);
			$timeout.cancel(timer);
			timer = $timeout(function() {
				timer = undefined;
				func.apply(context, args);
			}, wait || 10);
		};
	}
	/**
	 * Build handler to open/close a SideNav; when animation finishes
	 * report completion in console
	 */
	function buildDelayedToggler(navID) {
		return debounce(function() {
			$mdSidenav(navID).toggle()
		}, 200);
	}

	function buildToggler(navID) {
		return function() {
			$mdSidenav(navID).toggle()
		}
	}
})
.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log, $location, menuItems, hagane) {
	$scope.location = $location;

	function getMenuItems() {
		menuItems.get().then(function(res) {
			$scope.menuItems = res.data;
		}, function(err) {
			console.log('Server error:');
			console.log(err);
		});
	}

	$scope.close = function() {
		$mdSidenav('left').close()
	};

	$scope.$on('auth-login-success', getMenuItems);
	$scope.$on('auth-logout-success', getMenuItems);
	$scope.$on('is-authorized', getMenuItems);

	getMenuItems();
})

app.directive('hgApp', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/app.html',
		controller: 'AppCtlr'
	}
});

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
function DialogCtlr($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}

app.controller('AdminMainCtlr', function($scope) {
  
});

app.controller('AuthCtlr', function ($scope, $rootScope, $state, hagane, HG_AUTH_EVENTS) {
	$scope.credentials = {};
	$scope.$parent.loading = null;

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

app.factory('menuItems', function($http, hagane, USER_ROLES) {

	var fileName = {};
	fileName[USER_ROLES.ADMIN] = 'admin';

	var MenuItems = function() {
		this.get = function() {
			var menuType;
			var role = hagane.session.getRole();

			if (role) {
				menuType = fileName[role];
			} else {
				menuType = 'no-auth'
			}

			return $http.get('app/menu/' + menuType + '.menu.json')
		}
	}

	return new MenuItems();
});

app.directive('hgMenu', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/menu/menu.html',
    scope: {
      items: '=items'
    },
    controller: function($scope) {
      $scope.activeItem = 0;
    }
  }
});

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
