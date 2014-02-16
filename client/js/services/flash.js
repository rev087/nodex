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