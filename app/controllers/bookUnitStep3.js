app.controller("bookUnitStep3Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, httpSvc){
	$scope.pageTitle = "Book Unit - Payment Details";
    $scope.paymentDetails = {
        usruntpymtrec_pymttype: "1"
    };
});