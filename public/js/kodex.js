(function(exports){

	var userRoles = {
		public: 1, // 001
		user:   2, // 010
		admin:  4  // 100
	};

	exports.userRoles = userRoles;
	exports.accessLevels = {
		public:	userRoles.public | userRoles.user | userRoles.admin, // 111
		anon:	userRoles.public, // 001
		user:	userRoles.user | userRoles.admin, // 110
		admin:	userRoles.admin // 100
	};

})(typeof exports === 'undefined'? this['accessControl']={}: exports);
(function() {

	angular.module('kodex', ['ngRoute', 'ngCookies', 'mox'])
	.run(function($rootScope, auth) {
		$rootScope.title = 'kodex.in';
	});
	
})();
(function(angular) {

	var kodex = angular.module('kodex');

	kodex.controller('ForgotFormController', function($scope, $http) {
		$scope.email = '';
		$scope.password = '';
		$scope.busy = false;

		$scope.attemptRegister = function() {
			$scope.busy = true;

			var data = {email:$scope.email, password:$scope.password};

			$http({method:'POST', url:'/api/forgot', data:data}).
				success(function(data, status, headers, config) {
					console.log('SUCCESS', arguments);
				}).
				error(function(data, status, headers, config) {
					console.log('ERROR', arguments);
				}).
				finally(function(data, status, headers, config) {
					$scope.busy = false;
					console.log('FINALLY', arguments);
				});
		};

	});
	
})(angular);
(function(angular) {

	angular.module('kodex').controller('LoginFormController',
		function($scope, $http, $location, $cookieStore, auth) {

			$scope.email = '';
			$scope.password = '';
			$scope.remember = false;

			$scope.busy = false;

			$scope.login = function() {
				$scope.busy = true;
				$scope.errors = {};

				auth.login($scope.email, $scope.password, $scope.remember)
					.then(function(result) {
						$location.path('/dashboard');
					})
					.catch(function(result) {
						if ( result.status === 400 )
							$scope.errors = result.data.errors;
					})
					.finally(function() {
						$scope.busy = false;
					});
			};

		}
	);
	
})(angular);
(function(angular) {

	angular.module('kodex').controller('LogoutController', function($location, auth) {
		auth.logout().then(function() {
			$location.path('/login');
		});
	});

})(angular);
(function(angular) {

	var kodex = angular.module('kodex');

	kodex.controller('RegisterFormController', function($scope, $http, $location, auth) {

		$scope.user = { username: '', email: '', password: '' };
		$scope.errors = {};
		$scope.busy = false;

		$scope.register = function() {
			$scope.busy = true;
			$scope.errors = {};

			auth.register($scope.user.username, $scope.user.email, $scope.user.password)
				.then(function(result) {
					$location.path('/dashboard');
				})
				.catch(function(result) {
					if ( result.status === 400 )
						$scope.errors = result.data.errors;
				})
				.finally(function() {
					$scope.busy = false;
				});
		};

	});
	
})(angular);
(function() {

	var mox = angular.module('mox', []);

	mox.directive('moxButton', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {}
		}
	});

})();
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
(function(angular) {

	// Usage:

	// Service:
	// flash.error('Something went terribly wrong. Sorry.');
	// flash.success('Good job!');
	// flash.error('You must not click the button!', 'forbiddenButton');

	// Flash messages are emptied automatically, but you can do so manually via:
	// flash.clear();
	// flash.clear('forbiddenButton');

	// Directive:
	// <ol flash-messages></ol>
	// <ol flash-messages context="forbiddenButton"></ol>

	angular.module('kodex')
		.factory('flash', function($rootScope) {
			var flashMessage = function(type, text, context) {
				$rootScope.$emit('flash:' + (context || ''), {
					type: type, text: text
				});
			}
			return {
				success: function(text, context) {
					flashMessage('success', text, context);
				},
				error: function(text, context) {
					flashMessage('error', text, context);
				},
				clear: function(context) {
					$rootScope.$emit('clearFlash:' + (context || ''));
				}
			};
		})
		.directive('flashMessages', function($rootScope, $timeout) {
			return {
				restrict: 'AE',
				scope: true,
				template:
					'<ol class="flash-messages">' +
					'<li ng-repeat="f in flashMessages" class="{{f.type}}">{{f.text}}</li>' +
					'</ol>',
				replace: true,
				link: function(scope, element, attrs) {
					scope.flashMessages = [];
					var queue = [];

					$rootScope.$on('flash:' + (attrs.context || ''), function(event, flashMessage) {
						// Empty the current messages and queue the new one to be
						// shown during the next event loop tick
						scope.flashMessages = [];
						queue.push(flashMessage);

						// If a queue dump is schedule for the next tick, cancel it
						var dumpPromise;
						$timeout.cancel(dumpPromise);

						// Schedule a queue dump into the UI (via model binding)
						// at the next tick (via zero miliseconds $timeout).
						// 
						// This makes it possible to display multiple flash messages
						// from one tick (such as an action that resulted in
						// multiple errors) and automatically erase them as soon as
						// new messages arrive in a future tick
						dumpPromise = $timeout(function() {
							while ( queue.length )
								scope.flashMessages.push(queue.pop());
						});
					});

					$rootScope.$on('clearFlash:' + (attrs.context || ''), function() {
						scope.flashMessages = [];
					});

				}
			};
		});

})(angular);
// Based on https://github.com/visionmedia/lingo
(function(angular) {

	angular.module('kodex')
		.factory('inflector', function() {
			
			return {

				// inflector.capitalize('foo bar'); // => "Foo bar"			
				// inflector.capitalize('foo bar', true); // => "Foo Bar"
				capitalize: function(str, allWords) {
					if ( allWords ) {
						return str.split(' ').map(function(word) {
							return exports.capitalize(word);
						}).join(' ');
					}
					return str.charAt(0).toUpperCase() + str.substr(1);
				},

				// inflector.camelCase('foo bar'); // => "fooBar"
				// inflector.camelCase('foo bar', true); // => "FooBar"
				camelCase: function(str, uppercaseFirst) {
					return str.replace(/[^\w\d ]+/g, '').split(' ').map(function(word, i) {
						if ( i || (0 == i && uppercaseFirst) ) {
							word = exports.capitalize(word);
						}
						return word;
					}).join('');
				},

				// inflector.underscore('FooBar'); // => foo_bar
				// inflector.underscore('Foobar'); // => foobar
				underscore: function(str) {
					return str.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
				},

				// inflector.join(['foo', 'bar', 'qux']); // => "Foo, bar and qux"
				// inflector.join(['foo', 'bar', 'qux'], 'or'); // => "Foo, bar or qux"
				join: function(arr, last) {
					var str = arr.pop(), last = last || 'and';
					if ( arr.length ) {
						str = arr.join(', ') + ' ' + last + ' ' + str;
					}
					return str;
				},

				// Based on http://dense13.com/blog/2009/05/03/converting-string-to-slug-javascript/
				// inflector.slugify('Foo Bár'); // => foo-bar
				slugify: function(str) {
					str = str.replace(/^\s+|\s+$/g, ''); // trim
					str = str.toLowerCase();

					// remove accents, swap ñ for n, etc
					var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
					var to   = "aaaaeeeeiiiioooouuuunc------";
					for ( var i=0, l=from.length ; i<l ; i++ ) {
						str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
					}

					str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
						.replace(/\s+/g, '-') // collapse whitespace and replace by -
						.replace(/-+/g, '-'); // collapse dashes

					return str;
				}

			};

		});

})(angular);
// http://www.myersdaily.org/joseph/javascript/md5-text.html
(function() {

	function md5cycle(x, k) {
		var a = x[0], b = x[1], c = x[2], d = x[3];

		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17,  606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12,  1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7,  1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7,  1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22,  1236535329);

		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14,  643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9,  38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5,  568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20,  1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14,  1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);

		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16,  1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11,  1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4,  681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23,  76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16,  530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);

		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10,  1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6,  1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6,  1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21,  1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15,  718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);
	}

	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}

	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
		return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function md51(s) {
		txt = '';
		var n = s.length,
		state = [1732584193, -271733879, -1732584194, 271733878], i;
		for (i=64; i<=s.length; i+=64) {
			md5cycle(state, md5blk(s.substring(i-64, i)));
		}

		s = s.substring(i-64);
		var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
		for (i=0; i<s.length; i++)
		tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
		tail[i>>2] |= 0x80 << ((i%4) << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i=0; i<16; i++) tail[i] = 0;
		}
		tail[14] = n*8;
		md5cycle(state, tail);
		return state;
	}

	/* there needs to be support for Unicode here,
	 * unless we pretend that we can redefine the MD-5
	 * algorithm for multi-byte characters (perhaps
	 * by adding every four 16-bit characters and
	 * shortening the sum to 32 bits). Otherwise
	 * I suggest performing MD-5 as if every character
	 * was two bytes--e.g., 0040 0025 = @%--but then
	 * how will an ordinary MD-5 sum be matched?
	 * There is no way to standardize text to something
	 * like UTF-8 before transformation; speed cost is
	 * utterly prohibitive. The JavaScript standard
	 * itself needs to look at this: it should start
	 * providing access to strings as preformed UTF-8
	 * 8-bit unsigned value arrays.
	 */
	function md5blk(s) { /* I figured global was faster.   */
		var md5blks = [], i; /* Andy King said do it this way. */
		for (i=0; i<64; i+=4) {
			md5blks[i>>2] = s.charCodeAt(i)
			+ (s.charCodeAt(i+1) << 8)
			+ (s.charCodeAt(i+2) << 16)
			+ (s.charCodeAt(i+3) << 24);
		}
		return md5blks;
	}

	var hex_chr = '0123456789abcdef'.split('');

	function rhex(n)
	{
		var s='', j=0;
		for(; j<4; j++)
		s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
		+ hex_chr[(n >> (j * 8)) & 0x0F];
		return s;
	}

	function hex(x) {
		for (var i=0; i<x.length; i++)
			x[i] = rhex(x[i]);
		return x.join('');
	}

	function md5(s) {
		return hex(md51(s));
	}

	/* this function is much faster,
	so if possible we use it. Some IEs
	are the only ones I know of that
	need the idiotic second function,
	generated by an if clause.  */

	function add32(a, b) {
		return (a + b) & 0xFFFFFFFF;
	}

	if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
		function add32(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}
	}

	angular.module('kodex')
	.factory('md5', function() {
		return md5;
	})
	.filter('md5', function() {
		return function(input) {
			return md5(input);
		};
	})

})(angular);