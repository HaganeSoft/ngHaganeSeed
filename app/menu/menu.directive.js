angular.module('hgapp').directive('hgMenu', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/menu/menu.html',
    scope: {
      items: '='
    },
    controller: ['$scope', '$mdSidenav', '$state', function($scope, $mdSidenav, $state) {
			$scope.isActive = function(item) {
				return item.route == $state.current.name;
			};

			$scope.navigate = function(loc) {
				$mdSidenav('left').toggle();
				$state.go(loc);
			};
    }]
  }
});
