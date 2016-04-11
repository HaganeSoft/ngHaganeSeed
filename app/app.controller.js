app.controller('AppCtlr', function($scope, $timeout, $mdSidenav, $log, $location, hagane, title) {

	$scope.$on('titleChange', function() {
	    $scope.toolbar_title = title.title();
	});

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
