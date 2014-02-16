(function() {

	var mox = angular.module('mox', []);

	mox.directive('moxButton', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {}
		}
	});

})();