(function(angular, undefined) {

	angular.module('kodex')
	.factory('auth',
		['$rootScope', '$http', '$cookieStore', '$q',
			function($rootScope, $http, $cookieStore, $q) {

				var access = accessControl.accessLevels,
					roles = accessControl.userRoles;

				$rootScope.access = access;
				$rootScope.roles = roles;
				$rootScope.user = $cookieStore.get('user') || {
						username: null,
						email: null,
						role: roles.public
					};

				return {

					authorize: function(accessLevel, role) {
						if ( role === undefined )
							role = $rootScope.user.role;
						return accessLevel & role;
					},

					isLoggedIn: function(user) {
						if ( user === undefined )
							user = $rootScope.user;
						return user.role === roles.user || user.role === roles.admin;
					},

					register: function(username, email, password) {
						var deferred = $q.defer();

						$http({ method:'POST', url:'/api/auth/register',
							data: { username:username, email:email, password:password }
						})
						.then(function(result) {
							$rootScope.user = result.data.user;
							deferred.resolve(result);
						})
						.catch(function(result) {
							deferred.reject(result);
						});

						return deferred.promise;
					},

					login: function(email, password, remember) {
						var deferred = $q.defer();

						var xhrPromise = $http({ method:'POST', url:'/api/auth/login',
							data: { email:email, password:password, remember:remember }
						})
						.then(function(result) {
							$rootScope.user = result.data.user;
							deferred.resolve(result);
						})
						.catch(function(result) {
							deferred.reject(result);
						});

						return deferred.promise;
					},

					logout: function() {
						var deferred = $q.defer();

						$http({ method:'GET', url:'/api/auth/logout' })
						.success(function() {
							$rootScope.user = {
								username: null,
								email: null,
								role: roles.public
							};
							deferred.resolve();
						})
						.error(function(error) {
							deferred.reject(error);
						});

						return deferred.promise;
					},

					forgot: function(email) {
						return $http({ method:'POST', url:'/api/auth/forgot',
							data: { email:email }
						})
					}

				};
			}
		]
	);

})(angular);