app.controller("bookUnitStep1Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, $state, $compile, $uibModal, httpSvc){
	$scope.pageTitle = "Book Unit - Cost Details";
	$scope.unitObj = $cookieStore.get("unitObj");
	$scope.prospectId = $cookieStore.get("prospectId");
	var unitId = $scope.unitObj.UnitDtls_Id;
    $scope.updatedCostSheetObj = {};
    var count = 0;
    
	$scope.getUnitCostSheet = (function() {
        angular.element(".loader").show();
        httpSvc.getUnitCostSheet(unitId, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.unitCostSheetDetail = response.data;
            
        $scope.updatedCostSheetObj = {
              "Untctcm_comp_guid": $cookieStore.get('comp_guid'),
              "Untctcm_templname": "TestfromAPI",
              "Untctcm_Blocks_Id": $scope.unitObj.Blocks_Id,
              "Untctcm_SBA": $scope.unitCostSheetDetail.sba,
              "Untctcm_SiteArea": 0,
              "Untctcm_Cost": $scope.unitCostSheetDetail.basecost,
              "Untctcm_Ascending": $scope.unitCostSheetDetail.flraiseasce,
              "Untctcm_FlrRseCost": $scope.unitCostSheetDetail.flraisecost,
              "Untctcm_From": $scope.unitCostSheetDetail.flraisefrm,
              "Untctcm_To": $scope.unitCostSheetDetail.flraiseto
        };
            
            for(i=1;i<=20;i++){
                if($scope.unitCostSheetDetail['cstcmpnme'+i]!=""){
                    /*console.log($scope.unitCostSheetDetail['cstcmpnme'+i]);*/
                    $scope.updatedCostSheetObj['Untctcm_code'+i] = "";
                    $scope.updatedCostSheetObj['Untctcm_name'+i] = $scope.unitCostSheetDetail['cstcmpnme'+i];
                    $scope.updatedCostSheetObj['Untctcm_calctyp'+i] = $scope.unitCostSheetDetail['cstcmpcalctyp'+i];
                    $scope.updatedCostSheetObj['Untctcm_val_formula'+i] = $scope.unitCostSheetDetail['cstcmpcalcfrm'+i];
                    $scope.updatedCostSheetObj['Untctcm_comments'+i] = $scope.unitCostSheetDetail['cstcmpcalccmnt'+i];
                    count++;
                }
            }
            /*console.log(JSON.stringify(updatedCostSheetObj));*/
            angular.element(".loader").hide();
        });
    })();
	
    /* Add cost component*/
    $scope.addCostComponent = function() {
        var trCount = count+$(".formulaTable > tr").length;
        var increment = trCount + 1;
        if (increment == 7) {
            increment = increment + 1;
        }
        if (increment >= 20) {
            return;
        }
        var costComponentRow = '<tr> <td> <label>Code</label> </td> <td> <input type="text" class="form-control" name="Untctcm_code' + increment + '" ng-model="updatedCostSheetObj.Untctcm_code' + increment + '"/> </td> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="Untctcm_name' + increment + '" ng-model="updatedCostSheetObj.Untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="Untctcm_calctyp' + increment + '" ng-model="updatedCostSheetObj.Untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="1"> Flat </option> <option value="0"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="Untctcm_val_formula' + increment + '" ng-model="updatedCostSheetObj.Untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal({formulaVal:updatedCostSheetObj.Untctcm_val_formula' + increment + ',index:' + increment + '})" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="Untctcm_comments' + increment + '" ng-model="updatedCostSheetObj.Untctcm_comments' + increment + '"/> </td></tr>';

        costComponentRow = $compile(costComponentRow)($scope);
        angular.element(".formulaTable").append(costComponentRow);
    };

    $scope.toggleFields = function(increment) {
        var fieldName = "Untctcm_calctyp" + increment;
        if ($scope.updatedCostSheetObj[fieldName] == 1) {
            $("input[name='Untctcm_val_formula" + increment + "']").attr("disabled", false);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", true);
        } else if ($scope.updatedCostSheetObj[fieldName] == 0) {
            $("input[name='Untctcm_val_formula" + increment + "']").attr("disabled", true);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", false);
        }
    };

    $scope.openFormulaModal = function(val) {
        var modalInstance = $uibModal.open({
            templateUrl: 'formula.html',
            controller: 'costComponentFormulaCtrl',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return val;
                }
            }
        });
    };
    /* Add cost component*/
    $scope.discount = {
        discountField:'',
        discountVal:''
    };
	$scope.calculateFinalPrice = function(obj){
        var discountFormula = obj.discountField+'-'+obj.discountVal;
        $scope.updatedCostSheetObj.Untctcm_code20 = "DISC";
        $scope.updatedCostSheetObj.Untctcm_name20 = "DISCOUNT";
        $scope.updatedCostSheetObj.Untctcm_calctyp20 = 0;
        $scope.updatedCostSheetObj.Untctcm_val_formula20 = discountFormula;
        $scope.updatedCostSheetObj.Untctcm_comments20 = 0;
        
        console.log(JSON.stringify($scope.updatedCostSheetObj));
    }
    
	$scope.saveStep1 = function(){        
        $state.go('/BookUnit-Step2');
	}
});

app.controller("costComponentFormulaCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, item) {
    $scope.formula = {
        abbreviation: '',
        operator: ''
    };
    $scope.formulaGen = item.formulaVal;
    $scope.fieldCount = item.index;
    $scope.fieldName = "Untctcm_val_formula" + $scope.fieldCount;
    $scope.close = function() {
        $uibModalInstance.close();
    };
    $scope.addFormula = function(formObj) {
        var preVal = angular.element("#formulaGen").val();
        var formula = formObj.abbreviation + formObj.operator;
        var finalFormula = preVal + formula;
        //        angular.element("#formulaGen").val(finalFormula);
        $scope.formulaGen = finalFormula;
        $scope.formula = {
            abbreviation: '',
            operator: ''
        };
    };
    $scope.saveFormula = function() {
        /*console.log(fieldName);*/
        if ($scope.formulaGen != "") {
            $scope.updatedCostSheetObj[$scope.fieldName] = $scope.formulaGen;
            $uibModalInstance.close();
        }
    };
});
