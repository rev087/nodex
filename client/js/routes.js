(function(angular) {

	angular.module('kodex')

	.config(function($locationProvider, $routeProvider) {
		$locationProvider.html5Mode(true);
		
		var access = accessControl.accessLevels;

		// Routes
		$routeProvider
			.when('/', {
				access: access.public,
				templateUrl: '/templates/home.html'
			})
			.when('/login', {
				access: access.anon,
				templateUrl: '/templates/auth/login.html'
			})
			.when('/register', {
				access: access.anon,
				templateUrl: '/templates/auth/register.html'
			})
			.when('/forgot', {
				access: access.anon,
				templateUrl: '/templates/auth/forgot.html'
			})
			.when('/logout', {
				access: access.user,
				resolve: { auth: 'auth', $location: '$location' },
				template: '<p>Logging out...</p>',
				controller: 'LogoutController'
			})
			.when('/dashboard', {
				access:access.logged,
				templateUrl:'/templates/dashboard.html'
			})
			.when('/not-found', {
				access:access.public,
				templateUrl:'/templates/not-found.html'
			})
			.otherwise({ redirectTo: '/not-found' });

	})

	.run(function($rootScope, $location, auth) {

		$rootScope.$on('$routeChangeStart', function(event, next, curr) {

			if ( !auth.authorize(next.access) ) {
				if ( auth.isLoggedIn() ) $location.path('/dashboard');
				else $location.path('/login');
			}

		});

	});

})(angular);