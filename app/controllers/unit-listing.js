app.controller("unitsListingCtrl", function($scope,  $http, $cookieStore, $state, $uibModal,$window) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];
    $scope.unitTypeNo = 0;
    
     $scope.selected = []; //stores checked items only
    (
        

 
        $scope.getProjectList = function() {
        angular.element(".loader").show();
        $scope.unitsList="";
       
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
           
    })();

    $scope.getPhaseList = function(projectName) {
        $scope.unitsList="";
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.selectedToTopSettings = { selectedToTop: true, }
        $scope.blockList = {};       
        
        //$scope. = '-1';
        angular.element(".loader").show();
        
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) { 
             if (data[0].Phase_ErrorDesc !='-1 | Phase record does not exist for this Company')
                {
                  $scope.phaseList = data;
                  angular.element(".loader").hide(); 
                }
            else{
                 //alert("No Phase for this Project");
                 angular.element(".loader").hide(); 
                 $scope.phaseList="";
            }
            
            
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        $scope.unitsList="";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
                 $scope.unitTypeNo  =  parseInt($scope.phaseList[i].Phase_UnitType.UnitType_Id);
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.exist = function(item) {
        return $scope.selected.indexOf(item) > -1;
    }
      $scope.toggleSelection = function(item) {
        var idx = $scope.selected.indexOf(item);
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
            //              console.log($scope.selected);
        } else {
            $scope.selected.push(item);
            //              console.log($scope.selected);
        }

    }
      $scope.checkAll = function() {
        if ($scope.selectAll) {
            angular.forEach($scope.unitsList, function(item) {
                idx = $scope.selected.indexOf(item.UnitDtls_Id);
                if (idx >= 0) {
                    return true;
                    //                        console.log($scope.selected);
                } else {
                    $scope.selected.push(item.UnitDtls_Id);
                    //                        console.log($scope.selected);
                }
            })
        } else {
            $scope.selected = [];
            //              console.log($scope.selected);
        }
    };
   
     $scope.unitStatusBtnClick = function(obj, formName) {
        var str = "" + $scope.selected;
        var untstat ='';
         if ($scope.projectDetails.unitstatus == 1)
             {
                 untstat = 3;                 
             }
             
         else if ($scope.projectDetails.unitstatus == 3)
             {
                 untstat = 1;
             }             
            
        if (str != "") {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/UpdtUnitDtls/ByMultiUnitDtlsID",
                ContentType: 'application/json',
                data: {
                    
                    "UnitDtls_Type": str,
                    "UnitDtls_Status": untstat,
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                console.log(data);            
                if (data.Comm_ErrorDesc == "0  | Update Success") {
                    $scope.selected = [];
                    angular.element(".loader").hide();
                    $scope.getUnitAllocation(obj, formName);
                } else {
                    alert("Some Error Occurred While Updating");
                    angular.element(".loader").hide();
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Please Select the Unit")
        }
    } //leadToProspectBtnClick end

     //RD 18/04/2017 display button flag
      $scope.changeBtndisp = function(obj,formName,obj2) {
        $scope.DispStatus = false;
        $scope.DispStatus2 = false;
        
        $scope.getUnitAllocation(obj2,formName);
         if (unitstatus == 1)
         {                     
             $scope.DispStatus = true;
         }

        else if (unitstatus == 3)
         {
             $scope.DispStatus2 = true;
         }             
                
            
    }
     
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.DispStatus = false;
        $scope.DispStatus2 = false;
        $scope.submit = true;

        $scope.unitsSrchList = '';
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }
           
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/UnitDtls/ByUnitDtlsBlocksId",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Block_Id": obj.blocks,
                    "UnitDtls_Status": obj.unitstatus /*RD 14/04/2017 - send status for filter*/
                }
            }).success(function(data) {
                $scope.unitsList = data[0];
                 if (obj.unitstatus == 1)
                 {                     
                     $scope.DispStatus = true;
                 }

                else if (obj.unitstatus == 3)
                 {
                     $scope.DispStatus2 = true;
                 }             
                
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    $scope.viewUnitCostSheet = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }
});

app.controller("unitCostSheetCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $uibModalInstance, item ,myService) {
    
    $scope.unitId = item;
    ($scope.getUnitCostSheetDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntCstSheet/Gt",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Id": parseInt($scope.unitId),
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log("Atul Test " + JSON.stringify(data));
            $scope.unitCostSheetDetail = data;
        $scope.unitCostSheetDetail["unitTotalAmtinWords"]=myService.convertNumberToWords($scope.unitCostSheetDetail.unitcostcal_custtotcost);
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});