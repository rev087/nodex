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