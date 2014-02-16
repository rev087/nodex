(function(angular) {

	angular.module('kodex').controller('LogoutController', function($location, auth) {
		auth.logout().then(function() {
			$location.path('/login');
		});
	});

})(angular);