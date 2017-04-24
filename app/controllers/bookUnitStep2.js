app.controller("bookUnitStep2Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, httpSvc){
	$scope.pageTitle = "Book Unit - Add Customer";
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    
	$scope.getUserDetails = (function() {
        angular.element(".loader").show();
        httpSvc.getUserDetails(prospectId, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.userDetail = response.data;
            angular.element(".loader").hide();
        });
    })();
});