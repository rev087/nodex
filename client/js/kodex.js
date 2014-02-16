(function() {

	angular.module('kodex', ['ngRoute', 'ngCookies', 'mox'])
	.run(function($rootScope, auth) {
		$rootScope.title = 'kodex.in';
	});
	
})();