// Module dependencies
var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var CONFIG = require('config');
var fs = require('fs');

// Middleware, api, db
var auth = require('./server/middleware/auth');
var db = require('./server/models');

// App
var app = express();

app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser(
	'ExNwuamdJyx2u5Y2nRR$ya12z*$*9U8z' +
	'!&$n#kxZsF9XEz9FBFaL!wBmHeSExNwu'
));
app.use(express.cookieSession({
	secret:
		'NwuamdJyx2u5Y2nRR$ya12z*$*9U8zeC' +
		'MLLT@XQNSjhBEAc$h216!8Vj2C%T#ZNW',
	cookie: { httpOnly: true },
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

var options = {
	// SSL
	key: fs.readFileSync('./config/ssl/' + app.get('env') + '/' + CONFIG.ssl.key),
	cert: fs.readFileSync('./config/ssl/' + app.get('env') + '/' + CONFIG.ssl.cert),
	requestCert: true,
	rejectUnauthorized: false,
	requestCert: true,
};

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	options.agent = true;
}
if ( app.get('env') == 'production' ) {
	options.ca = [fs.readFileSync('./config/ssl/' + app.get('env') + '/' + CONFIG.ssl.ca)];
}

// Routes
require('./server/routes')(app);

console.log('PORT', CONFIG.app.httpsPort);

// Connect to the database and start the webserver
db
	.sequelize
	.sync()
	.complete(function(err) {
		if (err) {
			console.log(err);
			throw err;
		} else {
			https.createServer(options, app).listen(CONFIG.app.httpsPort, function(){
				console.log( 'Express server listening on port ' + CONFIG.app.httpsPort +
					' in ' + app.get('env') + ' mode');
			});
		}
	});

// Redirect all HTTP requests to HTTPS
var app2 = express();
app2.use(function(req, res) {
	res.redirect('https://' + req.host + ':' + CONFIG.app.httpsPort + req.url);
});
http.createServer(app2).listen(CONFIG.app.httpPort, function() {
	console.log( 'Express server listening on port ' + CONFIG.app.httpPort +
		' in ' + app.get('env') + ' mode');
});