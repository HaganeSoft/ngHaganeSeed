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
