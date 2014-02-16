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