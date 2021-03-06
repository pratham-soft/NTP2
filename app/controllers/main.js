app.controller("mainCtrl", function($scope, $rootScope, $http, $cookieStore, $state, $window,$cookies) {    
    $rootScope.appMsg = "";
    $rootScope.showAppMsg = false;
    $scope.title = "Pratham :: Home";
    $scope.clientCss = "prathamClient";
    ($scope.checkLogin = function() {
        var userId = $cookieStore.get('user_id');
        var compGuid = $cookieStore.get('comp_guid');
        if (userId == undefined || compGuid == undefined) {
            var pageUrl = $window.location.href;
            $cookieStore.put('pageUrl', pageUrl);
            $window.location.href = '/';
        }
    })();
	
	$scope.userType = $cookies.get("user_loggedin_type");
    $scope.logout = function() {
        $cookieStore.remove('user_id');
        $cookieStore.remove('comp_guid');
        $cookieStore.remove('pageUrl');
        $cookieStore.remove("prospectId");
        $cookieStore.remove("unitObj");
        $cookieStore.remove("receivePaymentUnitObj");
        $cookieStore.remove("leadName");  
        $cookieStore.remove("user_loggedin_type");  
        $window.location.href = 'index.html';
    };
});