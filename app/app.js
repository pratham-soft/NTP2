var app = angular.module("pratham", ['ui.router', 'ui.bootstrap', 'ngCookies','720kb.datepicker', 'angularUtils.directives.dirPagination']);
app.config(function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});