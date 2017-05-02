app.controller("bookUnitStep3Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc){
	$scope.pageTitle = "Book Unit - Payment Details";
    
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    var comp_guid = $cookieStore.get('comp_guid');
	
    var updateUnitObj =  {
      "UnitDtls_comp_guid": comp_guid,
      "UnitDtls_Id": unitObj.UnitDtls_Id,
      "UnitDtls_Status": 5,
      "UnitDtls_user_id": prospectId
    };
    
    $scope.paymentDetails = {
        usruntpymtrec_pymttype: "1"
    };
    
    $scope.savePaymentDetails = function(formName, formObj){
        $scope.submit = true;
        if ($scope[formName].$valid) {            
            formObj.usruntpymtrec_user_id = prospectId;
            formObj.usruntpymtrec_unitdtls_id = unitObj.UnitDtls_Id;
            formObj.usruntpymtrec_comp_guid = comp_guid;
			formObj.usruntpymtrec_bookng = "true";
			
			httpSvc.updatePaymentDetails(formObj).then(function(response){
				var res = response.data.Comm_ErrorDesc;
				resArr = res.split('|');
				if(resArr[0] == 0){
					alert("Payment updated successfully!");
                    httpSvc.updateUnitStatus(updateUnitObj).then(function(response){
                        var updateUnitRes = response.data;
                        if(updateUnitRes[0].UnitDtls_ErrorDesc == "0"){
                            alert("Unit status changed to booked!");
                            $state.go('/BookUnit-Step4');
                        }
                    });
				}
			})
        }
    }
});