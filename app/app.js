var app = angular.module("pratham", ['ui.router', 'ui.bootstrap', 'ngCookies','720kb.datepicker', 'angularUtils.directives.dirPagination','base64', 'scrollable-table']);
app.config(function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.filter('format', function () {
   return function (input) {
       return input.replace('TC','')
   };
});

});