app.controller("bookUnitStep3Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc,myService){
	$scope.pageTitle = "Book Unit - Payment Details";
    var receivePaymentUnitObj=$cookieStore.get("receivePaymentUnitObj");
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    var comp_guid = $cookieStore.get('comp_guid');
    $scope.leadFullName=$cookieStore.get("leadName");
     $scope.convertNumToWords = function (numvalue)
    {
       $scope.amountInWords= myService.convertNumberToWords(numvalue)+"Rupees Only";
    }
     
    if(receivePaymentUnitObj != undefined)
        {
            $scope.receivePaymentBtn=true;
        }
    else{
        $scope.receivePaymentBtn=false;
    }
    //Normal Flow of Book Unit and First Payment Received 
      if(unitObj != undefined)
        {
            var updateUnitObj =  {
                  "UnitDtls_comp_guid": comp_guid,
                  "UnitDtls_Id": unitObj.UnitDtls_Id,
                  "UnitDtls_Status": 5,
                  "UnitDtls_user_id": prospectId
                }; 
        }

    
	$scope.stepsData = [
		{
			stepName: "Cost Details",
			status: "done"
		},
		{
			stepName: "Customer Details",
			status: "done"
		},
		{
			stepName: "Advance Payment",
			status: "active"
		},
		{
			stepName: "Payment Schedule",
			status: "pending"
		}
	];
	
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
                else{
                    alert("Payment Schedule is not defined!");
                }
			})
        }
    }
    
    $scope.receivePayment = function(formName, formObj){
        $scope.submit = true;
        if ($scope[formName].$valid) {            
            formObj.usruntpymtrec_user_id = prospectId;
            formObj.usruntpymtrec_unitdtls_id = receivePaymentUnitObj.UnitDtls_Id;
            formObj.usruntpymtrec_comp_guid = comp_guid;
			formObj.usruntpymtrec_bookng = "false";
			
			httpSvc.updatePaymentDetails(formObj).then(function(response){
				var res = response.data.Comm_ErrorDesc;
				resArr = res.split('|');
				if(resArr[0] == 0){
                        $cookieStore.remove("prospectId");             
                        $cookieStore.remove("receivePaymentUnitObj");
					    alert("Payment Received Successfully!" +"Now Your Pending Amount is INR " + resArr[3]);
                        $state.go('ReceivePayment');
                   
				}
                else{
                   alert("Some Error Occured While Receiving Payment For This UNIT"); 
                }
			})
        }
    }
});