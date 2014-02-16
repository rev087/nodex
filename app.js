// Module dependencies
var express = require('express');
var tls = require('tls');
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
	key: fs.readFileSync('./config/ssl/' + app.get('env') + '/kodex.key'),
	cert: fs.readFileSync('./config/ssl/' + app.get('env') + '/kodex.cert'),
	requestCert: true,
	rejectUnauthorized: false,
	requestCert: true,
};

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	options.agent = true;
}
if ( app.get('env') == 'production' ) {
}

// Routes
require('./server/routes')(app);

// Connect to the database and start the webserver
db
	.sequelize
	.sync()
	.complete(function(err) {
	if (err) {
		throw err;
	} else {
		https.createServer(options, app).listen(CONFIG.app.port, function(){
			console.log( 'Express server listening on port ' + CONFIG.app.port +
				' in ' + app.get('env') + ' mode');
		});
	}
});