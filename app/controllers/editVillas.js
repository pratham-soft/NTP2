app.controller("villaGenerationCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.untDetails = [];
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId = $stateParams.blockId;
    $scope.plotvillaReleaseNo=0;
    $scope.oldReleaseNo=0;
    $scope.optionButton=true;
    
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
                        typeId: 3,
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

     
 
   
    $scope.addSampleVillas = function(formObj, formName) {
        $scope.submit = true;
        formObj.noOfFloors="1";
       
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

                    angular.element("#villaRows").html('');
                    unitNosArr = [];
                    var unitsPerFloor = formObj.unitsPerFloor;
                    var unitNo = parseInt(formObj.unitNo);
                    var skipBy = parseInt(formObj.skipBy);
                    str1='';
                    for (var j =1;j<=$scope.plotvillaReleaseNo;j++){
                        str1= str1 + "<option value="+ j +">"+j+"</option>";
                    }
                    var i = 1;
                    while (i <= unitsPerFloor) {
                        unitNosArr.push(unitNo);
                        var tableRow = '<tr><td><input type="text" style="width:70px;" class="form-control" value="' + floorNo + formObj.seperator +  unitNo + '" name="villaNos" ng-required="true"/> </td> <td> <select style="width:70px;" class="form-control" name="villaFacing" ng-model="untDetails[' + i + '].villaFacing"><option value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option><option value="SW">SW</option> <option value="SE">SE</option></select></td><td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'East" name="villaEast" ng-keyup="calculateEastWest(' + i + ')" ng-model="untDetails[' + i + '].villaEast"/></td> <td><input type="text" style="width:70px;" id="untDetails' + i + 'West" ng-keyup="calculateEastWest(' + i + ')" class="form-control" name="villaWest" ng-model="untDetails[' + i + '].villaWest"/> </td><td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'North" ng-keyup="calculateNorthSouth(' + i + ')" name="plotNorth" ng-model="untDetails[' + i + '].villaNorth"/> </td> <td><input type="text" style="width:70px;" class="form-control" ng-keyup="calculateNorthSouth(' + i + ')" name="villaSouth" id="untDetails' + i + 'South" ng-model="untDetails[' + i + '].villaSouth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaEastWest" id="untDetails' + i + 'villaEastWest" ng-model="untDetails[' + i + '].villaEastWest" ng-model-options="{ updateOn: change}" ng-disabled="true"/></td> <td><input type="text" style="width:70px;" class="form-control" name="villaNorthSouth"  id="untDetails' + i + 'villaNorthSouth" ng-model="untDetails[' + i + '].villaNorthSouth" ng-model-options="{ updateOn: change}" ng-disabled="true"/></td><td> <select class="form-control" style="width:60px;" name="villaBedroom" ng-model="untDetails[' + i + '].villaBedroom">  <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option>  <option value="6">6</option> <option value="7">7</option>  <option value="8">8</option>  </select> </td> <td> <select class="form-control" style="width:60px;" name="villaBalconies" ng-model="untDetails[' + i + '].villaBalconies">  <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option></select> </td> <td> <select class="form-control" style="width:60px;" name="villaBathrooms" ng-model="untDetails[' + i + '].villaBathrooms">   <option value="1">1</option> <option value="2">2</option><option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </td> <td><input type="text" style="width:70px;" class="form-control" name="villaSuperArea" id="untDetails' + i + 'villaSuperArea" ng-model="untDetails[' + i + '].villaSuperArea" ng-model-options="{ updateOn: change}" ng-disabled="true"/></td> <td><input style="width:70px;" ng-keyup="calculatePercentageforVilla(' + i + ')" type="number"  id="untDetails' + i + 'villaPercentage"  class="form-control" name="villaPercentage" ng-model="untDetails[' + i + '].villaPercentage"/></td> <td><input type="text" style="width:70px;" class="form-control" ng-disabled="true" name="villaCarpetArea" id="untDetails' + i + 'villaCarpetArea" ng-model="untDetails[' + i + '].villaCarpetArea"  ng-value="" ng-model-options="{ updateOn: change}"/></td><td> <select style="width:60px;" class="form-control" name="villaPremium" ng-model="untDetails[' + i + '].villaPremium">  <option value="1">Y</option> <option value="0">N</option> </select> </td><td>  <select style="width:65px;" class="form-control" name="relaseNo" id="untDetails' + i + 'releaseNo" ng-model="untDetails[' + i + '].releaseNo"> '+str1+' </select> </td> <td> <select style="width:60px;" class="form-control" name="villaCorner" ng-model="untDetails[' + i + '].villaCorner">  <option value="1">Y</option> <option value="0">N</option> </select> </td></tr>';
                        var tableRowComplied = $compile(tableRow)($scope);
                        angular.element("#villaRows").append(tableRowComplied);
                        unitNo = unitNo + skipBy;
                        i++;
                    }
                    console.log(unitNosArr);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        
    };

    
     $scope.calculatePercentageforVilla = function(id) {
        var percentage = $('#untDetails' + id + 'villaPercentage').val();

        if (percentage > 0 && percentage <= 100) {
            var superBuiltArea = $('#untDetails' + id + 'villaSuperArea').val();
            var carpetArea = superBuiltArea - (superBuiltArea * (percentage / 100));
            $('#untDetails' + id + 'villaCarpetArea').val(Math.round(parseFloat(carpetArea))).trigger("change");;
        } else {
            alert("Percentage value should be between 0-100.");
            return false;
        }
    };
    
    
    
    $scope.calculateEastWest = function(id) {
        var eastNo =parseInt($('#untDetails' + id + 'East').val());
        var westNo =parseInt($('#untDetails' + id + 'West').val());
        if (eastNo > 0 && westNo > 0) {
        var eastWest = ((eastNo+westNo)/2);
        $('#untDetails' + id + 'villaEastWest').val(Math.round(parseFloat(eastWest))).trigger("change");; 
        } else {
            return false;
        } 
        var eastWest = parseInt($('#untDetails' + id + 'villaEastWest').val());
        var northSouth = parseInt($('#untDetails' + id + 'villaNorthSouth').val());

        if (eastWest > 0 && northSouth > 0) {
            var superBuiltArea = eastWest * northSouth;
            $('#untDetails' + id + 'villaSuperArea').val(Math.round(parseFloat(superBuiltArea))).trigger("change");;
        } else {
            return false;
        }
    };
    
    $scope.calculateNorthSouth = function(id) {
        var northNo =parseInt($('#untDetails' + id + 'North').val());
        var southNo =parseInt($('#untDetails' + id + 'South').val());
        if (northNo > 0 && southNo > 0) {
        var eastWest = (((northNo)+(southNo))/2);
        $('#untDetails' + id + 'villaNorthSouth').val(Math.round(parseFloat(eastWest))).trigger("change");; 
        } else {
            return false;
        }
        
        var eastWest = parseInt($('#untDetails' + id + 'villaEastWest').val());
        var northSouth = parseInt($('#untDetails' + id + 'villaNorthSouth').val());
        if (eastWest > 0 && northSouth > 0) {
            var superBuiltArea = eastWest * northSouth;
            $('#untDetails' + id + 'villaSuperArea').val(Math.round(parseFloat(superBuiltArea))).trigger("change");;
        } else {
            return false;
        } 
    };
    
    $scope.releaseChange=function(){
        if($scope.oldReleaseNo>$scope.plotvillaReleaseNo){
            $scope.plotvillaReleaseNo=$scope.oldReleaseNo;
            alert("Select Release No. higher than or equal to "+$scope.oldReleaseNo);
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
            var maxRelease=0;
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
                unitObj.UnitDtls_Unit_type_id=$scope.units[i].UnitDtls_Unit_type_id;
                unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                unitObj.UnitDtls_percentage=$scope.units[i].UnitDtls_percentage;
                $scope.UnitsArr.push(unitObj);
                if(maxRelease<unitObj.UnitDtls_Floor){
                    maxRelease=unitObj.UnitDtls_Floor;
                }
            }
            $scope.plotvillaReleaseNo= maxRelease;
            $scope.oldReleaseNo= maxRelease;
             if(unitObj.UnitDtls_Unit_type_id != $scope.untGeneration.typeId && unitObj.UnitDtls_Unit_type_id != "0"){
                
                alert("Type Mismatch! Please select: Villa corrsponding Block.");
            }
            console.log($scope.UnitsArr);
            angular.element(".loader").hide();
            
        })};
    })();

   // $scope.checkBlockUnits($scope.blockId);
    // populating units
    
    $scope.addBlockUnit = function(formObj, formName, parentObj) {
        for (i = 0; i < formObj.length; i++) {
            formObj[i].UnitDtls_comp_guid = $cookieStore.get('comp_guid');
            /*formObj[i].UnitDtls_Unit_type_id = 3;*/
            formObj[i].UnitDtls_Block_Id = parentObj.block;
            formObj[i].UnitDtls_user_id = $cookieStore.get('user_id');
        }

        console.log(formObj);

        var unitsData = JSON.stringify(formObj);

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Update",
            ContentType: 'application/json',
            data: unitsData
        }).success(function(data) {
            console.log(data);
            $state.go("/ApplyCostSheet", {
                "projectId": $stateParams.projId,
                "phaseId": $stateParams.phaseId,
                "blockId": parentObj.block
            });
        }).error(function() {});
    }

    $scope.saveAllVillas = function(formName, formObj, parentObj) {
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];
        
            for (j = 1; j < formObj.length; j++) {
                var unitObj = {};
                var unitNo = unitNosArr[j - 1];
 
                unitNo = unitNo;
                
                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
                unitObj.UnitDtls_Unit_type_id = "3";
                unitObj.UnitDtls_Block_Id = parentObj.block.toString();
                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
                unitObj.UnitDtls_No = unitNo.toString();
                unitObj.UnitDtls_Name = "";
                unitObj.UnitDtls_Type = "";
                unitObj.UnitDtls_Balcn = formObj[j].villaBalconies;
                unitObj.UnitDtls_ComBRoom = "0";
                unitObj.UnitDtls_BRoom = formObj[j].villaBathrooms;
                unitObj.UnitDtls_Rooms = formObj[j].villaBedroom;
                unitObj.UnitDtls_Msrmnt = formObj[j].villaCarpetArea;
                unitObj.UnitDtls_Directn = formObj[j].villaFacing;
                unitObj.UnitDtls_Floor = parseInt(formObj[j].releaseNo);
                unitObj.UnitDtls_SrvntRoom = "0";
                unitObj.UnitDtls_EstMsrmnt = parseInt(formObj[j].villaEast);
                unitObj.UnitDtls_WstMsrmnt = parseInt(formObj[j].villaWest);
                unitObj.UnitDtls_NrtMsrmnt = parseInt(formObj[j].villaNorth);
                unitObj.UnitDtls_SthMsrmnt = parseInt(formObj[j].villaSouth);
                unitObj.UnitDtls_BuliltupArea = formObj[j].villaSuperArea;
                unitObj.UnitDtls_Cornerplot =parseInt(formObj[j].villaCorner);
                unitObj.UnitDtls_Premium = parseInt(formObj[j].villaPremium);
                unitObj.UnitDtls_Status = 1;
                unitObj.UnitDtls_percentage = formObj[j].villaPercentage;
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
//                 $state.go("/GeneratedCostSheetDetails", {
//                    projId: $scope.projectId,
//                    phaseId: $scope.phaseId,
//                    blockId: parentObj.block
//                });
                
            }
             $scope.optionButton=false;
        }).error(function() {});
    };
    
    $scope.goto=function(formName, formObj,parentObj){
        $state.go("/GeneratedCostSheetDetails", {
//                    projId: $scope.projectId,
//                    phaseId: $scope.phaseId,
                    blockId: parentObj.block
                });
    };
    $scope.gohome=function(){
        $state.go("/UnitVwEdit");
    };
 
});