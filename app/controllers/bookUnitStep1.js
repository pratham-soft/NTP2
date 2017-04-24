app.controller("bookUnitStep1Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc){
	$scope.pageTitle = "Book Unit - Cost Details";
	$scope.unitObj = $cookieStore.get("unitObj");
	$scope.prospectId = $cookieStore.get("prospectId");
	var unitId = $scope.unitObj.UnitDtls_Id;
	$scope.discount = {
		value:0,
		discountType: 0
	};
	
	$scope.getUnitCostSheet = (function() {
        angular.element(".loader").show();
        httpSvc.getUnitCostSheet(unitId, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.unitCostSheetDetail = response.data;
			console.log(JSON.stringify($scope.unitCostSheetDetail));
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
				/*$scope.finalCost = parseInt(totalCost - obj.value);*/
				var updatedCostSheetObj = {
					  "Untctcm_comp_guid": $cookieStore.get('comp_guid'),
					  "Untctcm_templname": "TestfromAPI",
					  "Untctcm_Blocks_Id": $scope.unitObj.Blocks_Id,
					  "Untctcm_SBA": $scope.unitCostSheetDetail.sba,
					  "Untctcm_SiteArea": 0,
					  "Untctcm_Cost": $scope.unitCostSheetDetail.basecost,
					  "Untctcm_Ascending": $scope.unitCostSheetDetail.flraiseasce,
					  "Untctcm_FlrRseCost": $scope.unitCostSheetDetail.flraisecost,
					  "Untctcm_From": $scope.unitCostSheetDetail.flraisefrm,
					  "Untctcm_To": $scope.unitCostSheetDetail.flraiseto,
					  "Untctcm_code1": "CARPRK",
					  "Untctcm_name1": "CAR PARKING",
					  "Untctcm_calctyp1": 1,
					  "Untctcm_val_formula1": "160000",
					  "Untctcm_comments1": "covered car park. ",
					  "Untctcm_code2": "PWRWTR",
					  "Untctcm_name2": "Power and Water",
					  "Untctcm_calctyp2": 0,
					  "Untctcm_val_formula2": "200 * SBA",
					  "Untctcm_comments2": "Rs 200 x SBA",
					  "Untctcm_code3": "CLUB",
					  "Untctcm_name3": "Club Membership",
					  "Untctcm_calctyp3": 1,
					  "Untctcm_val_formula3": "125000",
					  "Untctcm_comments3": "One time   payment",
					  "Untctcm_code4": "STPGEN",
					  "Untctcm_name4": "STP & Generator",
					  "Untctcm_calctyp4": 1,
					  "Untctcm_val_formula4": "30000 ",
					  "Untctcm_comments4": "One time payment, 1 KV Power back for each flat would be provided.",
					  "Untctcm_code5": "VAT",
					  "Untctcm_name5": "VAT",
					  "Untctcm_calctyp5": 0,
					  "Untctcm_val_formula5": "1500*SBA*40%*14.56%",
					  "Untctcm_comments5": "Rs 1500 x SBA= construction agreement value,   VAT= 40% of Construction agreement Value x 14.56%",
					  "Untctcm_code6": "SERVTAX",
					  "Untctcm_name6": "Service tax",
					  "Untctcm_calctyp6": 0,
					  "Untctcm_val_formula6": "SBA*1500*60%*15%",
					  "Untctcm_comments6": "Rs 1500 x SBA= construction agreement value, Service Tax =  60% of Construction   agreement Value x 15%",
					  "Untctcm_code7": "",
					  "Untctcm_name7": "",
					  "Untctcm_calctyp7": 0,
					  "Untctcm_val_formula7": "",
					  "Untctcm_comments7": "",
					  "Untctcm_code8": "",
					  "Untctcm_name8": "",
					  "Untctcm_calctyp8": 0,
					  "Untctcm_val_formula8": "",
					  "Untctcm_comments8": "",
					  "Untctcm_code9": "",
					  "Untctcm_name9": "",
					  "Untctcm_calctyp9": 0,
					  "Untctcm_val_formula9": "",
					  "Untctcm_comments9": "",
					  "Untctcm_code10": "",
					  "Untctcm_name10": "",
					  "Untctcm_calctyp10": 0,
					  "Untctcm_val_formula10": "",
					  "Untctcm_comments10": "",
					  "Untctcm_code11": "",
					  "Untctcm_name11": "",
					  "Untctcm_calctyp11": 0,
					  "Untctcm_val_formula11": "",
					  "Untctcm_comments11": "",
					  "Untctcm_code12": "",
					  "Untctcm_name12": "",
					  "Untctcm_calctyp12": 0,
					  "Untctcm_val_formula12": "",
					  "Untctcm_comments12": "",
					  "Untctcm_code13": "",
					  "Untctcm_name13": "",
					  "Untctcm_calctyp13": 0,
					  "Untctcm_val_formula13": "",
					  "Untctcm_comments13": "",
					  "Untctcm_code14": "",
					  "Untctcm_name14": "",
					  "Untctcm_calctyp14": 0,
					  "Untctcm_val_formula14": "",
					  "Untctcm_comments14": "",
					  "Untctcm_code15": "",
					  "Untctcm_name15": "",
					  "Untctcm_calctyp15": 0,
					  "Untctcm_val_formula15": "",
					  "Untctcm_comments15": "",
					  "Untctcm_code16": "",
					  "Untctcm_name16": "",
					  "Untctcm_calctyp16": 0,
					  "Untctcm_val_formula16": "",
					  "Untctcm_comments16": "",
					  "Untctcm_code17": "",
					  "Untctcm_name17": "",
					  "Untctcm_calctyp17": 0,
					  "Untctcm_val_formula17": "",
					  "Untctcm_comments17": "",
					  "Untctcm_code18": "",
					  "Untctcm_name18": "",
					  "Untctcm_calctyp18": 0,
					  "Untctcm_val_formula18": "",
					  "Untctcm_comments18": "",
					  "Untctcm_code19": "",
					  "Untctcm_name19": "",
					  "Untctcm_calctyp19": 0,
					  "Untctcm_val_formula19": "",
					  "Untctcm_comments19": "",
					  "Untctcm_code20": "DISC",
					  "Untctcm_name20": "DISCOUNT",
					  "Untctcm_calctyp20": 0,
					  "Untctcm_val_formula20": "APPS-100",
					  "Untctcm_comments20": "",
					  "untctcm_UnitDtls_Id": 3094
					};
				console.log(JSON.stringify(updatedCostSheetObj));
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
	
	$scope.saveStep1 = function(prospectId){
		$state.go('/BookUnit-Step2');
	}
});
