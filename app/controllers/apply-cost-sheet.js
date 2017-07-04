app.controller("applyCostSheetCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService) {
    $scope.title = "Apply Cost Sheet";
    $scope.projectId = $stateParams.projectId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId = $stateParams.blockId;
    $scope.showPremium = false;

    $scope.getCostSheetTemplates = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": 0
            }
        }).success(function(data) {
            $scope.costSheetTemplates = data;
            for (i = 1; i <= 19; i++) {
                var increment;
                if (i == 7) {
                    i = i + 1;
                }
                increment = i;
                var costComponentRow = '<tr> <td> <label>Name</label> </td> <td> <input type="text" class="form-control" name="untctcm_name' + increment + '" ng-model="costSheetTemplate.untctcm_name' + increment + '"/> </td> <td> <label>Calc. Type</label> </td> <td> <select class="form-control" name="untctcm_calctyp' + increment + '" ng-model="costSheetTemplate.untctcm_calctyp' + increment + '" ng-change="toggleFields(' + increment + ')"> <option value=""> Select </option> <option value="1"> Flat </option> <option value="0"> Formula </option> </select> </td> <td> <input type="text" class="form-control" placeholder="Value" name="untctcm_val_formula' + increment + '" ng-model="costSheetTemplate.untctcm_val_formula' + increment + '" disabled="true"/> </td> <td> <button type="button" class="btn btn-warning" name="formulaBtn' + increment + '" ng-click="openFormulaModal({formulaVal:costSheetTemplate.untctcm_val_formula' + increment + ',index:' + increment + '})" disabled="true"> Formula </button> </td> <td> <input type="text" class="form-control comment" placeholder="Comment" name="untctcm_comments' + increment + '" ng-model="costSheetTemplate.untctcm_comments' + increment + '"/> </td><td><span class="glyphicon glyphicon-trash" ng-click="deleteCostComponent(' + increment + ')"></span></td></tr>';
                //                console.log(costComponentRow);
                costComponentRow = $compile(costComponentRow)($scope);
                angular.element(".formulaTable").append(costComponentRow);
            }

            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }


    $scope.showPremiumRow = function() {
        $scope.showPremium = true;
        $scope.costSheetTemplate.untctcm_name7 = 'PREMIUM';
    }


    $scope.checkBlockCostSheetTemplates = (function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": $scope.blockId
            }
        }).success(function(data) {
			console.log(JSON.stringify(data));
            if (data[0].untctcm_ErrorDesc == "0") {
                $scope.showCostSheetTemplates = false;
                $scope.showMessage = true;

            } else {
                $scope.getCostSheetTemplates();
                $scope.showCostSheetTemplates = true;
                $scope.showMessage = false;
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.toggleFields = function(increment) {
        var fieldName = "untctcm_calctyp" + increment;
        if ($scope.costSheetTemplate[fieldName] == 1) {
            $("input[name='untctcm_val_formula" + increment + "']").attr("disabled", false);
            $("button[name='formulaBtn" + increment + "']").attr("disabled", true);
        } else {
            $("input[name='untctcm_val_formula" + increment + "']").attr("disabled", true);
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

    $scope.saveFormula = function() {
        if ($scope.formulaGen != "") {
            $scope.costSheetTemplate[fieldName] = $scope.formulaGen;
            $uibModalInstance.close();
        }
    };

    ($scope.checkBlockUnits = function() {
        var compId = $cookieStore.get('comp_guid');
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, $stateParams.blockId).then(function(response) {
            var blockFloorNumberArr = [];
            var blockFloors = response.data[1].Blocks_Floors;
            for (i = 1; i <= blockFloors; i++) {
                blockFloorNumberArr.push(i);
            }
            $scope.blockFloorNumbers = blockFloorNumberArr;
        });

    })();

    $scope.getTemplateDetails = function(tempId) {
        $scope.flag = 1;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": tempId,
                "untctcm_Blocks_Id": 0
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $scope.flag = 1;
            /*$scope.costSheetTemplate = data[0];*/
            $scope.costSheetTemplate = {
                untctcm_templname: data[0].untctcm_templname,
                untctcm_Cost: data[0].untctcm_Cost,
                untctcm_Ascending: data[0].untctcm_Ascending.toString(),
                untctcm_From: data[0].untctcm_From.toString(),
                untctcm_To: data[0].untctcm_To.toString(),
                untctcm_FlrRseCost: data[0].untctcm_Ascending.toString(),
				
				untctcm_name1:data[0].untctcm_name1,
				untctcm_calctyp1:data[0].untctcm_calctyp1.toString(),				
				untctcm_val_formula1:data[0].untctcm_val_formula1,
				untctcm_comments1:data[0].untctcm_comments1,
				
				untctcm_name2:data[0].untctcm_name2,
				untctcm_calctyp2:data[0].untctcm_calctyp2.toString(),				
				untctcm_val_formula2:data[0].untctcm_val_formula2,
				untctcm_comments2:data[0].untctcm_comments2,
				
				untctcm_name3:data[0].untctcm_name3,
				untctcm_calctyp3:data[0].untctcm_calctyp3.toString(),				
				untctcm_val_formula3:data[0].untctcm_val_formula3,
				untctcm_comments3:data[0].untctcm_comments3,
				
				untctcm_name4:data[0].untctcm_name4,
				untctcm_calctyp4:data[0].untctcm_calctyp4.toString(),				
				untctcm_val_formula4:data[0].untctcm_val_formula4,
				untctcm_comments4:data[0].untctcm_comments4,
				
				untctcm_name5:data[0].untctcm_name5,
				untctcm_calctyp5:data[0].untctcm_calctyp5.toString(),				
				untctcm_val_formula5:data[0].untctcm_val_formula5,
				untctcm_comments5:data[0].untctcm_comments5,
				
				untctcm_name6:data[0].untctcm_name6,
				untctcm_calctyp6:data[0].untctcm_calctyp6.toString(),				
				untctcm_val_formula6:data[0].untctcm_val_formula6,
				untctcm_comments6:data[0].untctcm_comments6,
				
				untctcm_name8:data[0].untctcm_name8,
				untctcm_calctyp8:data[0].untctcm_calctyp8.toString(),				
				untctcm_val_formula8:data[0].untctcm_val_formula8,
				untctcm_comments8:data[0].untctcm_comments8,
				
				untctcm_name9:data[0].untctcm_name9,
				untctcm_calctyp9:data[0].untctcm_calctyp9.toString(),				
				untctcm_val_formula9:data[0].untctcm_val_formula9,
				untctcm_comments9:data[0].untctcm_comments9,
				
				untctcm_name10:data[0].untctcm_name10,
				untctcm_calctyp10:data[0].untctcm_calctyp10.toString(),				
				untctcm_val_formula10:data[0].untctcm_val_formula10,
				untctcm_comments10:data[0].untctcm_comments10,
				
				untctcm_name11:data[0].untctcm_name11,
				untctcm_calctyp11:data[0].untctcm_calctyp11.toString(),				
				untctcm_val_formula11:data[0].untctcm_val_formula11,
				untctcm_comments11:data[0].untctcm_comments11,
				
				untctcm_name12:data[0].untctcm_name12,
				untctcm_calctyp12:data[0].untctcm_calctyp12.toString(),				
				untctcm_val_formula12:data[0].untctcm_val_formula12,
				untctcm_comments12:data[0].untctcm_comments12,
				
				untctcm_name13:data[0].untctcm_name13,
				untctcm_calctyp13:data[0].untctcm_calctyp13.toString(),				
				untctcm_val_formula13:data[0].untctcm_val_formula13,
				untctcm_comments13:data[0].untctcm_comments13,
				
				untctcm_name14:data[0].untctcm_name14,
				untctcm_calctyp14:data[0].untctcm_calctyp14.toString(),				
				untctcm_val_formula14:data[0].untctcm_val_formula14,
				untctcm_comments14:data[0].untctcm_comments14,
				
				untctcm_name15:data[0].untctcm_name15,
				untctcm_calctyp15:data[0].untctcm_calctyp15.toString(),				
				untctcm_val_formula15:data[0].untctcm_val_formula15,
				untctcm_comments15:data[0].untctcm_comments15,
				
				untctcm_name16:data[0].untctcm_name16,
				untctcm_calctyp16:data[0].untctcm_calctyp16.toString(),				
				untctcm_val_formula16:data[0].untctcm_val_formula16,
				untctcm_comments16:data[0].untctcm_comments16,
				
				untctcm_name17:data[0].untctcm_name17,
				untctcm_calctyp17:data[0].untctcm_calctyp17.toString(),				
				untctcm_val_formula17:data[0].untctcm_val_formula17,
				untctcm_comments17:data[0].untctcm_comments17,
				
				untctcm_name18:data[0].untctcm_name18,
				untctcm_calctyp18:data[0].untctcm_calctyp18.toString(),				
				untctcm_val_formula18:data[0].untctcm_val_formula18,
				untctcm_comments18:data[0].untctcm_comments18,
				
				untctcm_name19:data[0].untctcm_name19,
				untctcm_calctyp19:data[0].untctcm_calctyp19.toString(),				
				untctcm_val_formula19:data[0].untctcm_val_formula19,
				untctcm_comments19:data[0].untctcm_comments19
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.saveCostSheetTemplate = function(formName, formObj) {
        $scope.costSheetTemplate.floorRaiseDirection = "";
        $scope.submit = true;
        if ($scope[formName].$valid) {
            formObj.untctcm_comp_guid = $cookieStore.get('comp_guid');
            formObj.untctcm_Blocks_Id = parseInt($scope.blockId);
            formObj.untctcm_SBA = 0;
            formObj.untctcm_SiteArea = 0;
            console.log(JSON.stringify(formObj));

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/UntCstTempl/Save",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go("/GenerateCostSheet", {
                        "blockId": $scope.blockId,
                        "phaseId" :$scope.phaseId,
                        "projectId" :$scope.projectId
                    });
                }
            }).error(function() {
                angular.element(".loader").hide();
            });

        }
    };

    $scope.editCstShtYes = function() {
        $state.go("/EditBlockCostSheet", {
            "blockId": $scope.blockId,
            "phaseId" :$scope.phaseId,
            "projectId" :$scope.projectId
        });
    };

    $scope.editCstShtNo = function() {

        $state.go("/Projects");

    };


});