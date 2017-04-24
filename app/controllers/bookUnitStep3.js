app.controller("bookUnitStep3Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, httpSvc){
	$scope.pageTitle = "Book Unit - Payment Details";
    
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    $scope.paymentDetails = {
        usruntpymtrec_pymttype: "1"
    };
    
    $scope.savePaymentDetails = function(formName, formObj){
        $scope.submit = true;
        if ($scope[formName].$valid) {
            alert("Valid");
            formObj.usruntpymtrec_user_id = prospectId;
            formObj.usruntpymtrec_unitdtls_id = unitObj.UnitDtls_Id;
            console.log(formObj);
        }
        else{
            alert("In Valid");
        }
    }
});