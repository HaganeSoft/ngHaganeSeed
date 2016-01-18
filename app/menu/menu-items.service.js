app.factory('menuItems', function($http, hagane, USER_ROLES) {

	var fileName = {};
	fileName[USER_ROLES.ADMIN] = 'admin';
	fileName[USER_ROLES.MEDICO] = 'medico';
	fileName[USER_ROLES.SUPER_MEDICO] = 'super-medico';
	fileName[USER_ROLES.CLIENTE] = 'cliente';

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
