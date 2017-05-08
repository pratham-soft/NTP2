app.controller("plotGenerationCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.untDetails = [];
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId = $stateParams.blockId;
    $scope.plotvillaReleaseNo=0;
    
    var unitNosArr = [];
    var plotsNosArr = [];
   
    
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
       
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;            
            angular.element(".loader").hide();
        });
    })();
    ($scope.phaseListFun = function(projectName) {
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), $scope.projectId).then(function(response) {
            $scope.phaseList = response.data;
            console.log($scope.phaseList);
            for (i = 0; i < $scope.phaseList.length; i++) {
                if ($scope.phaseList[i].Phase_Id == $scope.phaseId) {
                    $scope.untGeneration = {
                        projectName: $scope.projectId,
                        phase: $scope.phaseId,
                        typeId: $scope.phaseList[i].Phase_UnitType.UnitType_Id,
                        block : $scope.blockId
                    };
                    $scope.typeObj = $scope.phaseList[i].Phase_UnitType;
                }
            }

            angular.element(".loader").hide();
        });
        
    })();

    ($scope.getBlockList = function() {
        angular.element(".loader").show();
         
            
            
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": $scope.phaseId,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            $scope.blockList = data;            
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

     
    

    
    $scope.addSamplePlots = function(formObj, formName) {
        $scope.submit = true;
        formObj.noOfFloors=$scope.plotvillaReleaseNo;
        $scope.untDetails=[];
       
            /*Update Block*/
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Block/Updt",
                ContentType: 'application/json',
                data: {
                    "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                    "Blocks_Id": formObj.block,
                    "Blocks_Floors": formObj.noOfFloors,
                    "Blocks_UnitPerfloor": formObj.unitsPerFloor,
                    "Blocks_Devation": "true"
                }
            }).success(function(data) {
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                console.log(resSplit[0]);
                if (resSplit[0] == 0) {
                    if (formObj.seperator == undefined) {
                        formObj.seperator = "";
                    }
                    if (formObj.noOfFloors > 9) {
                        floorNo = "";
                    } else {
                        floorNo = "";
                    }

                    angular.element("#plotRows").html('');
                    plotsNosArr = [];
                    var unitsPerFloor = formObj.unitsPerFloor;
                    var unitNo = parseInt(formObj.unitNo);
                    var skipBy = parseInt(formObj.skipBy);
                    str1='';
                    for (var j =1;j<=$scope.plotvillaReleaseNo;j++){
                        str1= str1 + "<option value="+ j +">"+j+"</option>";
                    }
                    //str1='<option value="1">1 </option> <option value="2">2 </option> <option value="3">3 </option> //<option value="4">4 </option> <option value="5">5 </option> <option value="6">6 </option> ';
                    var i = 1;
                    while (i <=unitsPerFloor) {
                        plotsNosArr.push(unitNo);
                        var tableRow = '<tr><td><input type="text" class="form-control" value="' + floorNo +formObj.seperator + unitNo + '"name="unitNos" ng-required="true"/> </td> <td> <select style="width:70px;" class="form-control" name="plotFacing" ng-model="untDetails[' + i + '].plotFacing"> <option selected="selected" value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td> <td><input type="text" class="form-control" name="plotEast" ng-model="untDetails[' + i + '].plotEast"/> </td> <td><input type="text" class="form-control" name="plotWest" ng-model="untDetails[' + i + '].plotWest"/> </td> <td><input type="text" class="form-control" name="plotNorth" ng-model="untDetails[' + i + '].plotNorth"/> </td> <td><input type="text" class="form-control" name="plotSouth" ng-model="untDetails[' + i + '].plotSouth"/> </td><td><input type="text" class="form-control" name="plotEastWest" ng-model="untDetails[' + i + '].plotEastWest"/> </td> <td><input type="text" class="form-control" name="plotNorthSouth" ng-model="untDetails[' + i + '].plotNorthSouth"/> </td> <td><input type="text" class="form-control" name="plotSuperArea" id="untDetails' + i + 'plotSuperArea" ng-model="untDetails[' + i + '].plotSuperArea"/> </td> <td> <select class="form-control" name="reolaseNo" id="untDetails' + i + 'releaseNo" ng-model="untDetails[' + i + '].releaseNo"> '+str1+' </select> </td> <td><select class="form-control" name="premiumPlot" id="untDetails' + i + 'premiumPlot" ng-model="untDetails[' + i + '].premiumPlot"><option value=1>Y </option> <option  value=0>N </option></select> </td> <td><select class="form-control" name="plotCorner" id="untDetails' + i + 'plotCorner" ng-model="untDetails[' + i + '].plotCorner"><option value=1>Y</option> <option value=0>N </option></select> </td> </tr>';
                        var tableRowComplied = $compile(tableRow)($scope);
                        angular.element("#plotRows").append(tableRowComplied);
                        unitNo = unitNo + skipBy;
                        i++;
                    }
                    
                    console.log(plotsNosArr);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        
    };
    

    
    $scope.apiAlert=function(){
        alert("Can't be saved API Not Avialable");
    }

    $scope.calculatePercentage = function(id) {
        var percentage = $('#untDetails' + id + 'unitPercentage').val();

        if (percentage > 0 && percentage <= 100) {
            var superBuiltArea = $('#untDetails' + id + 'unitSuperArea').val();
            var carpetArea = superBuiltArea - (superBuiltArea * (percentage / 100));
            $('#untDetails' + id + 'unitCarpetArea').val(Math.round(parseFloat(carpetArea)));
        } else {
            alert("Percentage value should be between 0-100.");
            return false;
        }
    };

  
   
    ($scope.checkBlockUnits = function(blockId) {
        if (blockId == undefined) {
           blockId=$scope.blockId;
           //$scope.untGeneration.block=blockId;
        }
        if(blockId != "" ){
        var compId = $cookieStore.get('comp_guid');
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, blockId).then(function(response) {
            $scope.units = response.data[0];
            $scope.blockFloorUnits = response.data[1].Blocks_UnitPerfloor;
            $scope.UnitsArr = [];
            for (i = 0; i < $scope.units.length; i++) {
                var unitObj = {};
                unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                unitObj.UnitDtls_Name = "";
                unitObj.UnitDtls_Type = $scope.units[i].UnitDtls_Type;
                unitObj.UnitDtls_Rooms = $scope.units[i].UnitDtls_Rooms + "";
                unitObj.UnitDtls_ComBRoom = $scope.units[i].UnitDtls_ComBRoom + "";
                unitObj.UnitDtls_BRoom = $scope.units[i].UnitDtls_BRoom + "";
                unitObj.UnitDtls_Balcn = $scope.units[i].UnitDtls_Balcn + "";
                unitObj.UnitDtls_BuliltupArea = $scope.units[i].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Msrmnt = $scope.units[i].UnitDtls_Msrmnt;
                unitObj.UnitDtls_Premium = $scope.units[i].UnitDtls_Premium + "";
                unitObj.UnitDtls_Directn = $scope.units[i].UnitDtls_Directn;
                unitObj.UnitDtls_Floor = $scope.units[i].UnitDtls_Floor;
                unitObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                unitObj.UnitDtls_SrvntRoom = $scope.units[i].UnitDtls_SrvntRoom + "";
                unitObj.UnitDtls_Cornerplot =$scope.units[i].UnitDtls_Cornerplot;
                unitObj.UnitDtls_EstMsrmnt = $scope.units[i].UnitDtls_EstMsrmnt;
                unitObj.UnitDtls_WstMsrmnt = $scope.units[i].UnitDtls_WstMsrmnt;
                unitObj.UnitDtls_NrtMsrmnt = $scope.units[i].UnitDtls_NrtMsrmnt;
                unitObj.UnitDtls_SthMsrmnt = $scope.units[i].UnitDtls_SthMsrmnt;
                unitObj.UnitDtls_EstWstMsrmnt = 0;
                unitObj.UnitDtls_NrtSthMsrmnt = 0;
                unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                unitObj.UnitDtls_percentage=$scope.units[i].UnitDtls_percentage;
                $scope.UnitsArr.push(unitObj);
            }
            console.log($scope.UnitsArr);
            angular.element(".loader").hide();
        })};
    })();


    

    
    
    $scope.saveAllPlots = function(formName, formObj, parentObj) {
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];
       
            for (j = 1; j < formObj.length; j++) {
                var unitObj = {};
                var unitNo = plotsNosArr[j - 1];
 
                unitNo = unitNo;
                
                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
                unitObj.UnitDtls_Unit_type_id = "2";
                unitObj.UnitDtls_Block_Id = parentObj.block.toString();
                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
                unitObj.UnitDtls_No = unitNo.toString();
                unitObj.UnitDtls_Name = "";
                unitObj.UnitDtls_Type = "";
                unitObj.UnitDtls_Balcn = "0";
                unitObj.UnitDtls_ComBRoom = "0";
                unitObj.UnitDtls_BRoom = "0";
                unitObj.UnitDtls_Rooms = "0";
                unitObj.UnitDtls_Msrmnt =0;
                unitObj.UnitDtls_Directn = formObj[j].plotFacing;
                unitObj.UnitDtls_Floor = parseInt(formObj[j].releaseNo);
                unitObj.UnitDtls_SrvntRoom = "0";
                unitObj.UnitDtls_EstMsrmnt = parseInt(formObj[j].plotEast);
                unitObj.UnitDtls_WstMsrmnt = parseInt(formObj[j].plotWest);
                unitObj.UnitDtls_NrtMsrmnt = parseInt(formObj[j].plotNorth);
                unitObj.UnitDtls_SthMsrmnt = parseInt(formObj[j].plotSouth);
                unitObj.UnitDtls_BuliltupArea = formObj[j].plotSuperArea;
                unitObj.UnitDtls_Cornerplot =parseInt(formObj[j].plotCorner);
                unitObj.UnitDtls_Premium = parseInt(formObj[j].premiumPlot);
                unitObj.UnitDtls_Status = 1;
                unitObj.UnitDtls_percentage = 0;
                unitsJson.push(unitObj);
                
                        }

        
        unitsJson = JSON.stringify(unitsJson);
        console.log(unitsJson);
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Save",
            ContentType: 'application/json',
            data: unitsJson
        }).success(function(data) {
            console.log(data);
            var res = data.Comm_ErrorDesc;
            var resSplit = res.split('|');
            console.log(resSplit[0]);
            if (resSplit[0] == 0) {
//                $state.go("/Units", {
//                    projId: $scope.projectId,
//                    phaseId: $scope.phaseId,
//                    blockId: parentObj.block
//                });
                
                $state.go("/ApplyCostSheet", {
                    projId: $scope.projectId,
                    phaseId: $scope.phaseId,
                    blockId: parentObj.block
                });
            }
        }).error(function() {});
    };
    
//    $scope.saveAllVillas = function(formName, formObj, parentObj) {
//        var initiator = 1;
//        if (parentObj.agf == true) {
//            initiator = 0;
//        }
//        var unitsJson = [];
//        for (i = initiator; i <= parentObj.noOfFloors; i++) {
//            for (j = 1; j < formObj.length; j++) {
//                var unitObj = {};
//                var unitNo = unitNosArr[j - 1];
// 
//                unitNo = unitNo;
//                
//                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
//                unitObj.UnitDtls_Unit_type_id = "3";
//                unitObj.UnitDtls_Block_Id = parentObj.block.toString();
//                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
//                unitObj.UnitDtls_No = unitNo.toString();
//                unitObj.UnitDtls_Name = "";
//                unitObj.UnitDtls_Type = "";
//                unitObj.UnitDtls_Balcn = formObj[j].villaBalconies;
//                unitObj.UnitDtls_ComBRoom = "0";
//                unitObj.UnitDtls_BRoom = formObj[j].villaBathrooms;
//                unitObj.UnitDtls_Rooms = formObj[j].villaBedroom;
//                unitObj.UnitDtls_Msrmnt = formObj[j].villaCarpetArea;
//                unitObj.UnitDtls_Directn = formObj[j].villaFacing;
//                unitObj.UnitDtls_Floor = parseInt(formObj[j].releaseNo);
//                unitObj.UnitDtls_SrvntRoom = "0";
//                unitObj.UnitDtls_EstMsrmnt = parseInt(formObj[j].villaEast);
//                unitObj.UnitDtls_WstMsrmnt = parseInt(formObj[j].villaWest);
//                unitObj.UnitDtls_NrtMsrmnt = parseInt(formObj[j].villaNorth);
//                unitObj.UnitDtls_SthMsrmnt = parseInt(formObj[j].villaSouth);
//                unitObj.UnitDtls_BuliltupArea = formObj[j].villaSuperArea;
//                unitObj.UnitDtls_Cornerplot =parseInt(formObj[j].villaCorner);
//                unitObj.UnitDtls_Premium = parseInt(formObj[j].villaPremium);
//                unitObj.UnitDtls_Status = 1;
//                unitObj.UnitDtls_percentage = formObj[j].villaPercentage;
//                unitsJson.push(unitObj);
//                
//                        }
//
//        }
//        unitsJson = JSON.stringify(unitsJson);
//        console.log(unitsJson);
//        $http({
//            method: "POST",
//            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Save",
//            ContentType: 'application/json',
//            data: unitsJson
//        }).success(function(data) {
//            console.log(data);
//            var res = data.Comm_ErrorDesc;
//            var resSplit = res.split('|');
//            console.log(resSplit[0]);
//            if (resSplit[0] == 0) {
////                $state.go("/Units", {
////                    projId: $scope.projectId,
////                    phaseId: $scope.phaseId,
////                    blockId: parentObj.block
////                });
//                 $state.go("/ApplyCostSheet", {
//                    projId: $scope.projectId,
//                    phaseId: $scope.phaseId,
//                    blockId: parentObj.block
//                });
//                
//            }
//        }).error(function() {});
//    };
//    
    
   
    
});