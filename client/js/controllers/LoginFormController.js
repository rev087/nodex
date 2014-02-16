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