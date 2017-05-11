app.controller("bookUnitStep4Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc){
	$scope.pageTitle = "Book Unit - Payment Stages";
    
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    var comp_guid = $cookieStore.get('comp_guid');
	
	var obj = {
		UnitDtls_Id: unitObj.UnitDtls_Id,
		UnitDtls_Cust_UserId: prospectId,
		UnitDtls_comp_guid: comp_guid
	};
	
	$scope.unitObj = unitObj;
	$scope.stageStatus = ["Pending","Completed"];
    
	httpSvc.getPaymentStages(obj).then(function(response){
		$scope.paymentStagesData = response.data;
	})
});