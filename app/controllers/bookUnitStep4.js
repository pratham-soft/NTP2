app.controller("bookUnitStep4Ctrl", function ($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc) {
	$scope.pageTitle = "Book Unit - Payment Stages";
    
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    var comp_guid = $cookieStore.get('comp_guid');
    var newUnitDtls_Id = $cookieStore.get("newUnitDtls_Id");
	$scope.newUnitDtls_No = $cookieStore.get("newUnitDtls_No");
    $scope.exchange = $cookieStore.get("skip3rdStep");
    $scope.leadFullName=$cookieStore.get("leadName");
  
    // For Existing Boooking Flow --Atul Commented by Atul 16 May 
	var obj = {
		UnitDtls_Id: unitObj.UnitDtls_Id,
		UnitDtls_Cust_UserId: prospectId,
		UnitDtls_comp_guid: comp_guid
	};
   // For Exchange Unit Flow --Atul Commented by Atul 16 May 
      if ( $scope.exchange==true)
          {
              var exchangeObj= {
              UnitDtls_Id:newUnitDtls_Id,
              UnitDtls_Prv_UnitDtls_Id:unitObj.UnitDtls_Id,
              UnitDtls_Cust_UserId:prospectId,
              UnitDtls_Block_Id:unitObj.Blocks_Id,
              UnitDtls_comp_guid:$cookieStore.get('comp_guid')}
     
          }
   
	$scope.unitObj = unitObj;
	$scope.stageStatus = ["Pending","Completed"];
    
    if ( $scope.exchange==true)
        {
        httpSvc.ExChangeunit(exchangeObj).then(function (response) {
        $cookieStore.remove("unitObj");
        $cookieStore.remove("prospectId");
        $cookieStore.remove("newUnitDtls_Id");
        $cookieStore.remove("newUnitDtls_No");
        $cookieStore.remove("skip3rdStep");
		$scope.paymentStagesData = response.data;
        $scope.getCustPaymentHistory(exchangeObj);
	     }); 
        }
    
   else{
       httpSvc.getPaymentStages(obj).then(function (response) {
		$scope.paymentStagesData = response.data;
           $scope.getCustPaymentHistory(obj);
	});
   }
    
	
     $scope.getCustPaymentHistory = function(obj){ 
         $scope.payHistoryClick=true;
            var apiPostObj ={};     
            apiPostObj["UnitDtls_Id"] = obj.UnitDtls_Id;
            apiPostObj["UnitDtls_Cust_UserId"] = obj.UnitDtls_Cust_UserId;
            apiPostObj["UnitDtls_comp_guid"] = $cookieStore.get('comp_guid');
         
            var postObj ={};     
            postObj["usruntpymtrec_unitdtls_id"] = obj.UnitDtls_Id;
            postObj["usruntpymtrec_user_id"] = obj.UnitDtls_Cust_UserId;
            postObj["usruntpymtrec_comp_guid"] = $cookieStore.get('comp_guid');
         
			httpSvc.CustPaymentInfo(apiPostObj).then(function(response){
				var res = response.data[0].ErrorDesc;
                if(res=="0")
                    {
                        $scope.custPayinfo=response.data;
                        httpSvc.CustPaymentHistory(postObj).then(function(response){
                                    var res = response.data[0].ErrorDesc;
                                    if(res=="0")
                                        {
                                            $scope.custPayHistoryinfo=response.data;
                                        }
                                     else
                                        {
                                         alert(response.data[0].ErrorDesc.toString());
                                        }

                                })
                      
                    }
                 else
                    {
                     alert(res.toString());
                    }							               			
			})
        
    }
    
    

});