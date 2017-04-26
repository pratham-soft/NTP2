app.controller("bookUnitStep3Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, httpSvc){
	$scope.pageTitle = "Book Unit - Payment Details";
    
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    var comp_guid = $cookieStore.get('comp_guid');
    $scope.paymentDetails = {
        usruntpymtrec_pymttype: "1"
    };
    
    $scope.savePaymentDetails = function(formName, formObj){
        $scope.submit = true;
        if ($scope[formName].$valid) {            
            formObj.usruntpymtrec_user_id = prospectId;
            formObj.usruntpymtrec_unitdtls_id = unitObj.UnitDtls_Id;
            formObj.usruntpymtrec_comp_guid = comp_guid;
            
            console.log(JSON.stringify(formObj));
        }
    }
});