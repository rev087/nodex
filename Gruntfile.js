var CONFIG = require('config');

module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		clean: {
			fonts: ['public/fonts/'],
			ngtemplates: ['public/templates/'],
			js: ['public/js/'],
			css: ['public/css/']
		},
		copy: {
			polyfills: {
				nonull: true,
				files: {
					'public/js/polyfills/html5shiv.js':
					'bower_components/html5shiv/dist/html5shiv.js',

					'public/js/polyfills/es6-shim.js':
					'bower_components/es6-shim/es6-shim.js',

					'public/js/polyfills/json2.js':
					'bower_components/json2/json2.js',

					'public/js/polyfills/respond.js':
					'bower_components/respond/dest/respond.min.js'
				}
			},
			fonts: {
				files: [
					{
						expand: true,
						cwd: 'bower_components/font-awesome/fonts/',
						src: '*.*',
						dest: 'public/fonts'
					},
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/fonts/',
						src: '*.*',
						dest: 'public/fonts'
					}
				]
			}
		},
		less: {
			compile: {
				files: { 'public/css/kodex.css' : 'client/less/kodex.less' }
			}
		},
		concat: {
			js: {
				files: {
					'public/js/kodex.js' : [
						'shared/accessControl.js',
						'client/js/kodex.js', 'client/js/services/kodex.js', 'client/js/**/*.js'
					]
				}
			},
			css: {
				files: {
					'public/css/vendor.css': [
						'bower_components/bootstrap/dist/css/bootstrap.css',
						'bower_components/normalize-css/normalize.css',
						'bower_components/font-awesome/css/font-awesome.css',
						'bower_components/angular/angular-csp.css'
					]
				} 
			}
		},
		uglify: {
			vendor: {
				files: {
					'public/js/vendor.js': [
						'bower_components/jquery/dist/jquery.js',
						'bower_components/angular/angular.js',
						'bower_components/bootstrap/dist/js/bootstrap.js',
						'bower_components/angular-route/angular-route.js',
						'bower_components/angular-cookies/angular-cookies.js'
					]
				}
			}
		},
		jade: {
			ngtemplates: {
				options: {
					client: false,
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'client/templates/',
					src: '**/*.jade',
					dest: 'public/templates',
					ext: ".html"
				}]
			}
		},
		ngtemplates: {
			kodex: {
				options: { prefix: '/templates/' },
				cwd: 'public/templates',
				src: '**/*.html',
				dest: 'public/js/kodex.templates.js'
			}
		},
		watch: {
			js: {
				files: ['client/js/**/*.js'],
				tasks: ['concat:js'],
				options: { livereload: true }
			},
			less: {
				files: ['client/less/**/*.less'],
				tasks: ['less:compile'],
				options: { livereload: true }
			},
			views: {
				files: ['server/views/**/*.jade'],
				options: { livereload: true }
			},
			ngtemplates: {
				files: ['client/templates/**/*.jade'],
				tasks: ['jade:ngtemplates', 'ngtemplates:kodex'],
				options: { livereload: true }
			}
		}
	});
	
	grunt.registerTask('build', [
		'clean', 'copy', 'less', 'concat', 'uglify', 'jade', 'ngtemplates'
	]);
	grunt.registerTask('dev', [
		'clean', 'copy', 'less', 'concat', 'uglify', 'jade', 'ngtemplates',
		'watch'
	]);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-angular-templates');
};