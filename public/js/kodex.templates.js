angular.module('kodex').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/templates/auth/forgot.html',
    "\n" +
    "<form ng-controller=\"ForgotFormController\" ng-submit=\"attemptLogin()\" class=\"user-forgot\">\n" +
    "  <h1>kodex.in</h1>\n" +
    "  <ol flash-messages=\"flash-messages\"></ol>\n" +
    "  <div class=\"field\">\n" +
    "    <label for=\"login-email\" class=\"sr-only\">e-mail</label>\n" +
    "    <input type=\"email\" id=\"login-email\" placeholder=\"e-mail\" ng-model=\"email\" ng-disabled=\"busy\"/>\n" +
    "  </div>\n" +
    "  <div class=\"field\">\n" +
    "    <button type=\"submit\" mox-button=\"mox-button\" loading=\"loading\" ng-disabled=\"busy\" class=\"wide\"><span ng-hide=\"busy\">send password reset</span><i ng-show=\"busy\" class=\"fa fa-refresh fa-spin\"></i></button>\n" +
    "    <p class=\"actions\"><a href=\"/#/login\">Remembered, by any chance?</a></p>\n" +
    "  </div>\n" +
    "</form>"
  );


  $templateCache.put('/templates/auth/login.html',
    "\n" +
    "<form ng-controller=\"LoginFormController\" class=\"user-login\">\n" +
    "  <h1>kodex.in</h1>\n" +
    "  <ol flash-messages=\"flash-messages\" context=\"loginForm\"></ol>\n" +
    "  <div class=\"field\">\n" +
    "    <ol class=\"form-errors\">\n" +
    "      <li ng-repeat=\"error in errors.email\">{{error}}</li>\n" +
    "    </ol>\n" +
    "    <label for=\"login-email\" class=\"sr-only\">e-mail</label>\n" +
    "    <input type=\"email\" id=\"login-email\" placeholder=\"e-mail\" ng-model=\"email\" ng-disabled=\"busy\" tabindex=\"1\" ng-class=\"{invalid:errors.email}\"/>\n" +
    "  </div>\n" +
    "  <div class=\"field\">\n" +
    "    <ol class=\"form-errors\">\n" +
    "      <li ng-repeat=\"error in errors.password\">{{error}}</li>\n" +
    "    </ol>\n" +
    "    <label for=\"login-password\" class=\"sr-only\">password</label>\n" +
    "    <input type=\"password\" id=\"login-password\" placeholder=\"password\" ng-model=\"password\" ng-disabled=\"busy\" tabindex=\"2\" ng-class=\"{invalid:errors.password}\"/>\n" +
    "  </div>\n" +
    "  <div class=\"field\">\n" +
    "    <button type=\"submit\" ng-disabled=\"busy\" tabindex=\"4\" ng-click=\"login()\" class=\"wide\"><span ng-hide=\"busy\">login</span><i ng-show=\"busy\" class=\"fa fa-refresh fa-spin\"></i></button>\n" +
    "    <p>\n" +
    "      <input type=\"checkbox\" id=\"login-remember\" ng-model=\"remember\" tabindex=\"3\"/>\n" +
    "      <label for=\"login-remember\" class=\"clickable\">Remember me</label>\n" +
    "    </p>\n" +
    "    <p class=\"actions\"><a href=\"/#/register\" tabindex=\"5\" class=\"register\">Register</a><a href=\"/#/forgot\" tabindex=\"6\" class=\"forgot\">Forgot your password?</a></p>\n" +
    "  </div>\n" +
    "</form>"
  );


  $templateCache.put('/templates/auth/register.html',
    "\n" +
    "<form ng-controller=\"RegisterFormController\" name=\"form\" class=\"user-register\">\n" +
    "  <h1>kodex.in</h1>\n" +
    "  <ol flash-messages=\"flash-messages\" context=\"register.username\"></ol>\n" +
    "  <div class=\"field\">\n" +
    "    <ol class=\"form-errors\">\n" +
    "      <li ng-repeat=\"error in errors.username\">{{error}}</li>\n" +
    "    </ol>\n" +
    "    <label for=\"register-username\" class=\"sr-only\">username</label>\n" +
    "    <input type=\"text\" id=\"register-username\" name=\"username\" placeholder=\"username\" ng-model=\"user.username\" ng-disabled=\"busy\" ng-class=\"{invalid:errors.username}\"/>\n" +
    "  </div>\n" +
    "  <div class=\"field\">\n" +
    "    <ol class=\"form-errors\">\n" +
    "      <li ng-repeat=\"error in errors.email\">{{error}}</li>\n" +
    "    </ol>\n" +
    "    <label for=\"register-email\" class=\"sr-only\">e-mail</label>\n" +
    "    <input type=\"email\" id=\"register-email\" name=\"email\" placeholder=\"e-mail\" ng-model=\"user.email\" ng-disabled=\"busy\" ng-class=\"{invalid:errors.email}\"/>\n" +
    "  </div>\n" +
    "  <div class=\"field\">\n" +
    "    <ol class=\"form-errors\">\n" +
    "      <li ng-repeat=\"error in errors.password\">{{error}}</li>\n" +
    "    </ol>\n" +
    "    <label for=\"register-password\" class=\"sr-only\">password</label>\n" +
    "    <input type=\"password\" id=\"register-password\" name=\"password\" placeholder=\"password\" ng-model=\"user.password\" ng-disabled=\"busy\" ng-class=\"{invalid:errors.password}\"/>\n" +
    "  </div>\n" +
    "  <div class=\"field\">\n" +
    "    <button type=\"submit\" ng-click=\"register()\" ng-disabled=\"busy\" class=\"wide\"><span ng-hide=\"busy\">register</span><i ng-show=\"busy\" class=\"fa fa-refresh fa-spin\"></i></button>\n" +
    "    <p class=\"actions\"><a href=\"/#/login\" class=\"register\">Already registered?</a></p>\n" +
    "  </div>\n" +
    "</form>"
  );


  $templateCache.put('/templates/dashboard.html',
    "\n" +
    "<h1>Dashboard</h1>"
  );


  $templateCache.put('/templates/home.html',
    "\n" +
    "<h1>Welcome to Kodex</h1>\n" +
    "<p>This angular template was generated from a Jade source by grunt-contrib-jade</p>"
  );


  $templateCache.put('/templates/not-found.html',
    "\n" +
    "<h1>404</h1>\n" +
    "<h2>Not Found</h2>"
  );

}]);
