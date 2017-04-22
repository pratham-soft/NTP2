app.controller("bookUnitStep1Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, httpSvc){
	$scope.pageTitle = "Book Unit - Cost Details";
	$scope.unitObj = $cookieStore.get("unitObj");
	var unitId = $scope.unitObj.UnitDtls_Id;
	$scope.discount = {
		value:0,
		discountType: 0
	};
	
	$scope.getUnitCostSheet = (function() {
        angular.element(".loader").show();
        httpSvc.getUnitCostSheet(unitId, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.unitCostSheetDetail = response.data;
            angular.element(".loader").hide();
        });
    })();
	
	$scope.calculateFinalPrice = function(obj,totalCost){	
		if(obj.discountType == 0){
			if(obj.value > totalCost){
				$rootScope.appMsg = "Discount can not be more than total cost.";
				$rootScope.showAppMsg = true;
			}
			else{
				$rootScope.showAppMsg = false;				
				$scope.finalCost = parseInt(totalCost - obj.value);
				
			}
		}
		if(obj.discountType == 1){
			if(obj.value > 100){
				$rootScope.appMsg = "Discount can not be more than 100%";
				$rootScope.showAppMsg = true;
			}
			else{
				$rootScope.showAppMsg = false;
				$scope.finalCost = parseInt(totalCost - (totalCost*obj.value)/100);
			}
		}
	}
});
