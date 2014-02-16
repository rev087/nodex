var lodash = require('lodash'),
	api = require('./api'),
	accessControl = require('../shared/accessControl'),
	roles = accessControl.userRoles,
	access = accessControl.accessLevels;

var routes = [
	
	// API Routes
	{
		method: 'POST',
		path: '/api/auth/login',
		middleware: [authorizeAccess, api.auth.login],
		access: access.anon
	},
	{
		method: 'GET',
		path: '/api/auth/logout',
		middleware: [authorizeAccess, api.auth.logout],
		access: access.anon
	},
	{
		method: 'POST',
		path: '/api/auth/register',
		middleware: [authorizeAccess, api.auth.register],
		access: access.anon
	},
	{
		method: 'POST',
		path: '/api/auth/forgot',
		middleware: [authorizeAccess, api.auth.forgot],
		access: access.anon
	},

	// Client routes are managed by AngularJS.
	// Simply render the layout for all requests not starting with /api/
	{
		method: 'GET',
		path: /^(?!\/api\/).+/,
		middleware: [function(req, res) { res.render('layout'); }],
		access: roles.public
	}

];

function authorizeAccess(req, res, next) {
	var role;
	if ( !req.user ) role = roles.public;
	else role = req.user.role;

	var accessLevel = lodash.findWhere(routes, {
		path: req.route.path
	}).access;

	if ( !(accessLevel & role) )
		return res.send(403);
	
	return next();
}

module.exports = function(app) {

	routes.map(function(route) {
		var args = lodash.flatten([route.path, route.middleware]);

		switch ( route.method.toUpperCase() ) {
			case 'GET': app.get.apply(app, args); break;
			case 'POST': app.get.apply(app, args); break;
			case 'PUT': app.get.apply(app, args); break;
			case 'DELETE': app.get.apply(app, args); break;
			case 'PATCH': app.get.apply(app, args); break;
			default:
				throw new Error('Invalid HTTP method for route' + route.path);
		}
	});

	// Api routes
	app.post('/api/auth/login', api.auth.login);
	app.get('/api/auth/logout', api.auth.logout);
	app.post('/api/auth/register', api.auth.register);

	// Client routes are managed by AngularJS
	// Simply render the layout for all requests not starting with /api/
	app.get(/^(?!\/api\/).+/, function(req, res){
		
	});
}