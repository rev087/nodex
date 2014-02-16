(function(exports){

	var userRoles = {
		public: 1, // 001
		user:   2, // 010
		admin:  4  // 100
	};

	exports.userRoles = userRoles;
	exports.accessLevels = {
		public:	userRoles.public | userRoles.user | userRoles.admin, // 111
		anon:	userRoles.public, // 001
		user:	userRoles.user | userRoles.admin, // 110
		admin:	userRoles.admin // 100
	};

})(typeof exports === 'undefined'? this['accessControl']={}: exports);