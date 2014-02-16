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