var db = require('../models');
var bcrypt = require('bcrypt');
var lodash = require('lodash');
var validator = require('validator');
var accessControl = require('../../shared/accessControl'),
	roles = accessControl.userRoles,
	access = accessControl.accessLevels;

module.exports = {

	login: function(req, res) {
		// Initial validation
		var errors = {};

		if ( !validator.isEmail(req.body.email) )
			errors.email = ['A valid e-mail is required'];

		if ( !req.body.password )
			errors.password = ['A valid password is required'];
		else if ( !req.body.password || req.body.password.length < 6 )
			errors.password = ['This password is invalid'];

		if ( !lodash.isEmpty(errors) )
			return res.json(400, { errors:errors });

		db.User.find({
			where: { email: req.body.email }
		}).success(function(user) {
			if ( !!user ) {
				bcrypt.compare(req.body.password, user.passHash, function(error, result) {
					if ( !result ) {
						res.json(400, { errors: { password: ['The password was wrong. Did you forget it?'] } })
					} else {
						var expiration;
						if ( req.body.remember ) {
							var hour = 3600000;
							expiration = new Date(Date.now() + 6 * 24 * hour);
						} else {
							expiration = false;
						}

						req.session.cookie.expires = expiration;
						res.cookie('user',
							JSON.stringify({ username:user.username, email:user.email, role:roles.user }),
							{ expires: expiration, httpOnly: false }
						);

						req.session.user = user;
						res.json(200, { user: { username:user.username, email:user.email, role:roles.user } });
					}
				});
			} else {
				res.json(400, { errors: { email: ['This e-mail is not registered'] } })
			}
		});
	},

	logout: function(req, res) {
		res.clearCookie('user');
		req.session.user = null;
		res.json(200, { user: null });
	},

	register: function(req, res) {

		// Build the user
		var prospectUser = db.User.build({
			username: req.body.username,
			email: req.body.email
		});

		// Basic field validations
		var errors = prospectUser.validate() || {};
		if ( !req.body.password || req.body.password === '' ) {
			errors.password = ['A valid password is required'];
		} else if ( req.body.password.length < 6) {
			errors.password = ['Really? That\'s your password?'];
		}

		// Reserved words are not allowed as user names
		var blacklist = [
			'login', 'register', 'forgot', 'logout', 'dashboard', 'not-found',
			'edit', 'save', 'publish', 'post', 'tag', 'tags', 'page', 'pages',
			'kodex'
		];
		if ( blacklist.indexOf(req.body.username) > -1 ) {
			errors.username = ['Good try, but this username is reserved ;)'];
		}

		// Return with any validation errors so far
		if ( !lodash.isEmpty(errors) ) {
			return res.json(400, { errors: errors });
		}

		// If the data is valid, check for uniqueness
		db.User.find({
			where: db.Sequelize.or(
				{ username: req.body.username },
				{ email: req.body.email }
			)
		})
		.then(function(existingUser) {
			if ( !!existingUser ) {
				console.log('EXISTING:', existingUser.username, existingUser.email,
					existingUser.username.toLowerCase() == req.body.username.toLowerCase());

				// Non-unique username
				if ( existingUser.username.toLowerCase() == req.body.username.toLowerCase() )
					errors.username = ['This username is taken'];

				// Non-unique e-mail
				if ( existingUser.email.toLowerCase() == req.body.email.toLowerCase() )
					errors.email = ['This e-mail is already registered'];

				res.json(400, { errors: errors });
			} else {

				// Your papers look ok, let's proceed with the formalities...

				// Hash the password
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(req.body.password, salt, function(err, passHash) {

						// Data is valid, password is hashed, my body is ready, let's do it
						db.User
							.build({
								username: req.body.username,
								email: req.body.email,
								passHash: passHash
							})
							.save()
							.success(function(user) {
								req.session.user = user;
								res.cookie('user',
									JSON.stringify({ username:user.username, email:user.email, role:roles.user }),
									{ httpOnly: false }
								);
								res.json(200, { user: { username:user.username, email:user.email, role:roles.user } });
							});
					});
				});

			}
		});

	},

	forgot: function(req, res) {
		res.send(501);
	}

}