app.controller("villaGenerationCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.untDetails = [];
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId = $stateParams.blockId;
    $scope.plotvillaReleaseNo=0;
    $scope.oldReleaseNo=0;
    $scope.optionButton=true;
    $scope.showHideFormula = true;
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

     var x=1
    	$scope.addVillaTypeRow = function(){
//		var i =	angular.element("#villaTypeGrid > .villaTypeRow").length;
		var rowHtml = '<tr><td><select name="villaFacing" id="villaFacing" ng-model="untGeneration.villaType['+x+'].villaFacing" ng-required="true" class="form"> <option value="">Select</option> <option value="E">E </option> <option value="W">W </option> <option value="N">N </option> <option value="S">S </option> <option value="NW">NW </option> <option value="NE">NE </option> <option value="SW">SW </option> <option value="SE">SE </option> </select> </td><td><input type="number" id="eastDimension" ng-model="untGeneration.villaType['+x+'].eastDimension" ng-required="true"> </td><td><input type="number" id="westDimension" ng-model="untGeneration.villaType['+x+'].westDimension" ng-required="true"> </td><td><input type="number" id="northDimension" ng-model="untGeneration.villaType['+x+'].northDimension" ng-required="true"> </td><td><input type="number" id="southDimension" ng-model="untGeneration.villaType['+x+'].southDimension" ng-required="true">  </td><td><select name="bedRoom" id="bedRoom" ng-model="untGeneration.villaType['+x+'].bedRoom" ng-required="true" class="form"><option value="">Select</option><option value="1">1 </option><option value="2">2 </option><option value="3">3 </option><option value="4">4 </option><option value="5">5 </option><option value="6">6 </option><option value="7">7 </option><option value="8">8 </option></select></td> <td><select name="balconies" id="balconies" ng-model="untGeneration.villaType['+x+'].balconies" ng-required="true" class="form"><option value="">Select</option><option value="1">1 </option><option value="2">2 </option><option value="3">3 </option><option value="4">4 </option><option value="5">5 </option></select></td><td><select name="bathRoom" id="bathRoom" ng-model="untGeneration.villaType['+x+'].bathRoom" ng-required="true" class="form"><option value="">Select</option><option value="1">1 </option><option value="2">2 </option><option value="3">3 </option><option value="4">4 </option><option value="5">5 </option></select></td><td><input type="number" id="buildPercent" ng-model="untGeneration.villaType['+x+'].buildPercent" ng-required="true"> </td><td><input type="number" id="noOfFlats" ng-model="untGeneration.villaType['+x+'].noOfVillas" ng-required="true"> </td></tr>';
            
		x++;
		var rowHtmlComplied = $compile(rowHtml)($scope);
 		angular.element("#villaTypeGrid").append(rowHtmlComplied);
	} 
 
   
    $scope.addSampleVillas = function(formObj, formName) {
      //  $scope.showHideFormula = false;
        $scope.submit = true;
        if ($scope[formName].$valid) {
			//console.log(JSON.stringify(formObj.villaType));
			var villaTypeData = [];
			angular.forEach(formObj.villaType, function(value, key) {
  				villaTypeData.push(value);
			});
			console.log(villaTypeData);
            angular.element(".loader").show();
            /*Update Block*/
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Block/Updt",
                ContentType: 'application/json',
                data: {
                    "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                    "Blocks_Id": formObj.block,
                    "Blocks_Floors": formObj.plotvillaReleaseNo,
                    "Blocks_UnitPerfloor": 0,
                    "Blocks_Devation": "true"
                }
            }).success(function(data) {
                var res = data.Comm_ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
					var realeaseNoOptions = '<option value="">Select</option>';
					for(var i=1;i<=$scope.plotvillaReleaseNo;i++){
						realeaseNoOptions = realeaseNoOptions+'<option value="'+i+'">'+i+'</option>';
					}
					angular.element("#villaRowsCntr").html('');
					var increamenter = 0;
					
					$scope.villaDetails = [];
					
					for(i=0;i<villaTypeData.length;i++){
						for(j=0;j<villaTypeData[i].noOfVillas;j++){
							var villaRowHtml = '<tr> <td><input type="text" style="width:70px;" class="form-control" name="villaNo" ng-model="villaDetails[' + increamenter + '].villaNo" ng-required="true"/> </td><td><select style="width:70px;" class="form-control" name="villaFacing" ng-model="villaDetails[' + increamenter + '].villaFacing"> <option  value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td><td><input type="text" style="width:70px;" class="form-control" name="villaEast" ng-model="villaDetails[' + increamenter + '].villaEast"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaWest" ng-model="villaDetails[' + increamenter + '].villaWest"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaNorth" ng-model="villaDetails[' + increamenter + '].villaNorth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaSouth" ng-model="villaDetails[' + increamenter + '].villaSouth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaEastWest" ng-model="villaDetails[' + increamenter + '].villaEastWest" ng-disabled="true"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaNorthSouth" ng-model="villaDetails[' + increamenter + '].villaNorthSouth" ng-disabled="true"/> </td><td><input type="text" class="form-control" name="villaSuperArea" ng-model="villaDetails[' + increamenter + '].villaSuperArea" ng-disabled="true"/> </td><td><input type="number" style="width:70px;"  class="form-control" name="villaPercentage" ng-model="villaDetails[' + increamenter + '].villaPercentage"/></td> <td><input type="number" style="width:70px;" class="form-control" ng-disabled="true" name="villaCarpetArea" ng-model="villaDetails[' + increamenter + '].villaCarpetArea"/></td> <td><select class="form-control" style="width:60px;" name="villaRooms" ng-model="villaDetails[' + increamenter + '].villaRooms"><option value="0">0</option><option value="1" ng-selected="villaDetails[' + increamenter + '].villaRooms==1">1</option><option value="2" ng-selected="villaDetails[' + increamenter + '].villaRooms==2">2</option><option value="3" ng-selected="villaDetails[' + increamenter + '].villaRooms==3">3</option><option value="4" ng-selected="villaDetails[' + increamenter + '].villaRooms==4">4</option><option value="5" ng-selected="villaDetails[' + increamenter + '].villaRooms==5">5</option><option value="6" ng-selected="villaDetails[' + increamenter + '].villaRooms==6">6</option> <option value="7" ng-selected="villaDetails[' + increamenter + '].villaRooms==7">7</option><option value="8" ng-selected="villaDetails[' + increamenter + '].villaRooms==8"></option> </select></td><td><select class="form-control" style="width:60px;" name="villaBalcn" ng-model="villaDetails[' + increamenter + '].villaBalcn"><option value="0">0</option><option value="1" ng-selected="villaDetails[' + increamenter + '].villaBalcn==1">1</option><option value="2" ng-selected="villaDetails[' + increamenter + '].villaBalcn==2">2</option><option value="3" ng-selected="villaDetails[' + increamenter + '].villaBalcn==3">3</option><option value="4" ng-selected="villaDetails[' + increamenter + '].villaBalcn==4">4</option><option value="5" ng-selected="villaDetails[' + increamenter + '].villaBalcn==5">5</option></select></td><td><select class="form-control" style="width:60px;" name="UnitDtls_BRoom" ng-model="villaDetails[' + increamenter + '].UnitDtls_BRoom"><option value="">Select</option><option value="0">0</option><option value="1" ng-selected="villaDetails[' + increamenter + '].UnitDtls_BRoom==1">1</option><option value="2" ng-selected="villaDetails[' + increamenter + '].UnitDtls_BRoom==2">2</option><option value="3" ng-selected="villaDetails[' + increamenter + '].UnitDtls_BRoom==3">3</option><option value="4" ng-selected="villaDetails[' + increamenter + '].UnitDtls_BRoom==4">4</option><option value="5" ng-selected="villaDetails[' + increamenter + '].UnitDtls_BRoom==5">5</option> </select></td><td> <select style="width:70px;" class="form-control" name="releaseNo" ng-model="villaDetails[' + increamenter + '].releaseNo">'+realeaseNoOptions+'</select></td><td class="text-center"><input type="checkbox" name="premiumvilla" ng-model="villaDetails[' + increamenter + '].premiumvilla" ng-true-value="1" ng-false-value="0"/> </td><td class="text-center"> <input type="checkbox" name="villaCorner" ng-model="villaDetails[' + increamenter + '].villaCorner" ng-true-value="1" ng-false-value="0"/> </td></tr>';
							
							var villaRowHtmlComplied = $compile(villaRowHtml)($scope);
 							angular.element("#villaRowsCntr").append(villaRowHtmlComplied);
							
							increamenter++;
						}
					}
                    if($scope.units.length>0){
                        var villaNoCalc = $scope.units.length+1;
                    }
                    else{
                        var villaNoCalc = 0;
                    }
					
					for(i=0;i<villaTypeData.length;i++){
						for(j=0;j<villaTypeData[i].noOfVillas;j++){
							var villaEastWestCalc = (villaTypeData[i].eastDimension+villaTypeData[i].westDimension)/2;
							var villaNorthSouthCalc =(villaTypeData[i].northDimension+villaTypeData[i].southDimension)/2;
							var villaSuperAreaCalc = villaEastWestCalc*villaNorthSouthCalc;
                            var carpetAreaCalc = villaSuperAreaCalc*(villaTypeData[i].buildPercent/100);
							var obj = {
								villaNo:villaNoCalc,
								villaFacing:villaTypeData[i].villaFacing,
								villaEast:villaTypeData[i].eastDimension,
								villaWest:villaTypeData[i].westDimension,
								villaNorth:villaTypeData[i].northDimension,
								villaSouth:villaTypeData[i].southDimension,
								villaEastWest:villaEastWestCalc,
								villaNorthSouth:villaNorthSouthCalc,
								villaSuperArea:villaSuperAreaCalc,
                                villaRooms:villaTypeData[i].bedRoom,
                                UnitDtls_BRoom:villaTypeData[i].bathRoom,
                                villaBalcn:villaTypeData[i].balconies,
                                villaPercentage:villaTypeData[i].buildPercent,
                                villaCarpetArea:carpetAreaCalc,
								premiumvilla:0,
								villaCorner:0,
								releaseNo:villaTypeData[i].releaseNo
							};
							$scope.villaDetails.push(obj);
							villaNoCalc++;
							obj={};
						}
					}
                    $scope.UnitsArr=$scope.UnitsArr.concat($scope.villaDetails);
					console.log(JSON.stringify($scope.UnitsArr));
				}
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        }
		else{
			alert("In Valid!");
		}
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
                unitObj.UnitDtls_EstWstMsrmnt =((unitObj.UnitDtls_EstMsrmnt + unitObj.UnitDtls_WstMsrmnt) / 2);
                unitObj.UnitDtls_NrtSthMsrmnt =((unitObj.UnitDtls_NrtMsrmnt + unitObj.UnitDtls_SthMsrmnt) / 2);
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

        for (var j = 0; j < formObj.length; j++) {
            var unitObj = {};
//            var unitNo = unitNosArr[j - 1];
//
//            unitNo = unitNo;

            unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
            unitObj.UnitDtls_Unit_type_id = "3";
            unitObj.UnitDtls_Block_Id = parentObj.block.toString();
            unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
            unitObj.UnitDtls_No = formObj[j].villaNo;
            unitObj.UnitDtls_Name = "";
            unitObj.UnitDtls_Type = "";
            unitObj.UnitDtls_Balcn = formObj[j].villaBalcn;
            unitObj.UnitDtls_ComBRoom = "0";
            unitObj.UnitDtls_BRoom = formObj[j].villaBRoom;
            unitObj.UnitDtls_Rooms = formObj[j].villaRooms;
            unitObj.UnitDtls_Msrmnt = formObj[j].villaCarpetArea;
            unitObj.UnitDtls_Directn = formObj[j].villaFacing;
            unitObj.UnitDtls_Floor = parseInt(formObj[j].releaseNo);
            unitObj.UnitDtls_SrvntRoom = "0";
            unitObj.UnitDtls_EstMsrmnt = parseInt(formObj[j].villaEast);
            unitObj.UnitDtls_WstMsrmnt = parseInt(formObj[j].villaWest);
            unitObj.UnitDtls_NrtMsrmnt = parseInt(formObj[j].villaNorth);
            unitObj.UnitDtls_SthMsrmnt = parseInt(formObj[j].villaSouth);
            unitObj.UnitDtls_BuliltupArea = formObj[j].villaSuperArea;
            unitObj.UnitDtls_Cornerplot = parseInt(formObj[j].villaCorner);
            unitObj.UnitDtls_Premium = parseInt(formObj[j].premiumvilla);
            unitObj.UnitDtls_Status = 1;
            unitObj.UnitDtls_percentage = formObj[j].villaPercentage;
            unitsJson.push(unitObj);

        }


        unitsJson = JSON.stringify(unitsJson);
        console.log(unitsJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Save",
            ContentType: 'application/json',
            data: unitsJson
        }).success(function(data) {
            angular.element(".loader").hide();
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
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

});