app.controller("plotGenerationCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $compile, myService) {
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
                        typeId: 2,
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
            url: appConfig.baseUrl+"/Proj/BlockDtls/ByPhaseBlocksId",
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
                unitObj.UnitDtls_EstWstMsrmnt = ((unitObj.UnitDtls_EstMsrmnt+unitObj.UnitDtls_WstMsrmnt)/2);
                unitObj.UnitDtls_NrtSthMsrmnt = ((unitObj.UnitDtls_NrtMsrmnt+unitObj.UnitDtls_SthMsrmnt)/2);
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
//             if(unitObj.UnitDtls_Unit_type_id != $scope.untGeneration.typeId && unitObj.UnitDtls_Unit_type_id != "0"){
//                
//                alert("Type Mismatch! Please select: Plot corrsponding Block.");
//            }
            console.log($scope.UnitsArr);
            angular.element(".loader").hide();
        })};
    })();
 

    
//    $scope.addSamplePlots = function(formObj, formName) {
//        $scope.submit = true;
//        formObj.noOfFloors=$scope.plotvillaReleaseNo;
//        $scope.untDetails=[];
//       
//            /*Update Block*/
//            $http({
//                method: "POST",
//                url: appConfig.baseUrl+"/Proj/Block/Updt",
//                ContentType: 'application/json',
//                data: {
//                    "Blocks_comp_guid": $cookieStore.get('comp_guid'),
//                    "Blocks_Id": formObj.block,
//                    "Blocks_Floors": formObj.noOfFloors,
//                    "Blocks_UnitPerfloor": formObj.unitsPerFloor,
//                    "Blocks_Devation": "true"
//                }
//            }).success(function(data) {
//                var res = data.Comm_ErrorDesc;
//                var resSplit = res.split('|');
//                console.log(resSplit[0]);
//                if (resSplit[0] == 0) {
//                    if (formObj.seperator == undefined) {
//                        formObj.seperator = "";
//                    }
//                    if (formObj.noOfFloors > 9) {
//                        floorNo = "";
//                    } else {
//                        floorNo = "";
//                    }
//
//                    angular.element("#plotRows").html('');
//                    plotsNosArr = [];
//                    var unitsPerFloor = formObj.unitsPerFloor;
//                    var unitNo = parseInt(formObj.unitNo);
//                    var skipBy = parseInt(formObj.skipBy);
//                    str1='';
//                    for (var j =1;j<=$scope.plotvillaReleaseNo;j++){
//                        str1= str1 + "<option value="+ j +">"+j+"</option>";
//                    }
//                    //str1='<option value="1">1 </option> <option value="2">2 </option> <option value="3">3 </option> //<option value="4">4 </option> <option value="5">5 </option> <option value="6">6 </option> ';
//                    var i = 1;
//                    while (i <=unitsPerFloor) {
//                        plotsNosArr.push(unitNo);
//                        var tableRow = '<tr><td><input type="text" style="width:70px;" class="form-control" value="' + floorNo +formObj.seperator + unitNo + '"name="unitNos" ng-required="true"/> </td> <td> <select style="width:70px;" class="form-control" name="plotFacing" ng-model="untDetails[' + i + '].plotFacing"> <option selected="selected"  value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td> <td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'EastP" name="plotEast" ng-model="untDetails[' + i + '].plotEast" ng-keyup="calculateEastWestP(' + i + ')"/> </td> <td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'WestP" name="plotWest" ng-model="untDetails[' + i + '].plotWest" ng-keyup="calculateEastWestP(' + i + ')"/> </td> <td><input type="text" style="width:70px;" id="untDetails' + i + 'NorthP" class="form-control" name="plotNorth" ng-model="untDetails[' + i + '].plotNorth" ng-keyup="calculateNorthSouthP(' + i + ')"/> </td> <td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'SouthP" name="plotSouth" ng-model="untDetails[' + i + '].plotSouth" ng-keyup="calculateNorthSouthP(' + i + ')"/> </td><td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'plotEastWest" name="plotEastWest" ng-model="untDetails[' + i + '].plotEastWest" ng-model-options="{ updateOn: change}" ng-disabled="true"/> </td> <td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'plotNorthSouth" name="plotNorthSouth" ng-model="untDetails[' + i + '].plotNorthSouth" ng-model-options="{ updateOn: change}" ng-disabled="true"/> </td> <td><input type="text" class="form-control" id="untDetails' + i + 'plotSuperArea" name="plotSuperArea" id="untDetails' + i + 'plotSuperArea" ng-model="untDetails[' + i + '].plotSuperArea" ng-model-options="{ updateOn: change}" ng-disabled="true"/> </td> <td> <select class="form-control" name="reolaseNo" id="untDetails' + i + 'releaseNo" ng-model="untDetails[' + i + '].releaseNo"> '+str1+' </select> </td> <td><select class="form-control" name="premiumPlot" id="untDetails' + i + 'premiumPlot" ng-model="untDetails[' + i + '].premiumPlot"><option value="1">Y </option> <option selected="selected" value="0">N </option></select> </td> <td><select class="form-control" name="plotCorner" id="untDetails' + i + 'plotCorner" ng-model="untDetails[' + i + '].plotCorner"><option value="1">Y </option> <option selected="selected" value="0">N </option></select> </td> </tr>';
//                        var tableRowComplied = $compile(tableRow)($scope);
//                        angular.element("#plotRows").append(tableRowComplied);
//                        unitNo = unitNo + skipBy;
//                        i++;
//                    }
//                    
//                    console.log(plotsNosArr);
//                }
//                angular.element(".loader").hide();
//            }).error(function() {
//                angular.element(".loader").hide();
//            });
//            /*End Update Block*/
//        
//    };
    
    
     $scope.addPlotTYpeRow = function(){
		var i =	angular.element("#plotTypeGrid > .plotTypeRow").length;
		var rowHtml = '<div class="plotTypeRow"> <label for="plotFacing">Facing: </label> <select name="plotFacing" id="plotFacing" ng-model="untGeneration.plotType['+i+'].plotFacing" ng-required="true" class="form"> <option value="">Select</option> <option value="E">E </option> <option value="W">W </option> <option value="N">N </option> <option value="S">S </option> <option value="NW">NW </option> <option value="NE">NE </option> <option value="SW">SW </option> <option value="SE">SE </option> </select> | <label for="eastDimension">East:</label> <input type="number" id="eastDimension" ng-model="untGeneration.plotType['+i+'].eastDimension" ng-required="true"> <label for="westDimension">West:</label> <input type="number" id="westDimension" ng-model="untGeneration.plotType['+i+'].westDimension" ng-required="true"> <label for="northDimension">North:</label> <input type="number" id="northDimension" ng-model="untGeneration.plotType['+i+'].northDimension" ng-required="true"> <label for="southDimension">South:</label> <input type="number" id="southDimension" ng-model="untGeneration.plotType['+i+'].southDimension" ng-required="true"> | <label for="noOfPlots">No. of Plots:</label> <input type="number" id="noOfPlots" ng-model="untGeneration.plotType['+i+'].noOfPlots" ng-required="true"> </div>';
		
		var rowHtmlComplied = $compile(rowHtml)($scope);
 		angular.element("#plotTypeGrid").append(rowHtmlComplied);
	}
    
 
    $scope.addSamplePlots = function(formObj, formName) {
        $scope.showHideFormula = false;
        $scope.submit = true;
        if ($scope[formName].$valid) {
			console.log(JSON.stringify(formObj.plotType));
			var plotTypeData = [];
			angular.forEach(formObj.plotType, function(value, key) {
  				plotTypeData.push(value);
			});
			console.log(plotTypeData);
            angular.element(".loader").show();
            /*Update Block*/
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Block/Updt",
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
					angular.element("#plotRowsCntr").html('');
					var increamenter = 0;
					
					$scope.plotDetails = [];
					
					for(i=0;i<plotTypeData.length;i++){
						for(j=0;j<plotTypeData[i].noOfPlots;j++){
							var plotRowHtml = '<tr> <td><input type="text" style="width:70px;" class="form-control" name="plotNo" ng-model="plotDetails[' + increamenter + '].UnitDtls_No" ng-required="true"/> </td><td> <select class="form-control" name="plotFacing" ng-model="plotDetails[' + increamenter + '].UnitDtls_Directn"> <option selected="selected" value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td><td><input type="text" style="width:70px;" class="form-control" name="plotEast" ng-model="plotDetails[' + increamenter + '].UnitDtls_EstMsrmnt"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotWest" ng-model="plotDetails[' + increamenter + '].UnitDtls_WstMsrmnt"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotNorth" ng-model="plotDetails[' + increamenter + '].UnitDtls_NrtMsrmnt"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotSouth" ng-model="plotDetails[' + increamenter + '].UnitDtls_SthMsrmnt"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotEastWest" ng-model="plotDetails[' + increamenter + '].plotEastWest" ng-disabled="true"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotNorthSouth" ng-model="plotDetails[' + increamenter + '].plotNorthSouth" ng-disabled="true"/> </td><td><input type="text" class="form-control" name="plotSuperArea" ng-model="plotDetails[' + increamenter + '].UnitDtls_BuliltupArea" ng-disabled="true"/> </td><td> <select class="form-control" name="releaseNo" ng-model="plotDetails[' + increamenter + '].UnitDtls_Floor">'+realeaseNoOptions+'</select> </td><td class="text-center"> <input type="checkbox" name="premiumPlot" ng-model="plotDetails[' + increamenter + '].UnitDtls_Premium" ng-true-value="1" ng-false-value="0"/> </td><td class="text-center"> <input type="checkbox" name="plotCorner" ng-model="plotDetails[' + increamenter + '].UnitDtls_Cornerplot" ng-true-value="1" ng-false-value="0"/> </td></tr>';
							
							var plotRowHtmlComplied = $compile(plotRowHtml)($scope);
 							angular.element("#plotRowsCntr").append(plotRowHtmlComplied);
							
							increamenter++;
						}
					}
                    if($scope.units.length>0){
                        var plotNoCalc = $scope.units.length+1;
                    }
                   
					for(i=0;i<plotTypeData.length;i++){
						for(j=0;j<plotTypeData[i].noOfPlots;j++){
							var plotEastWestCalc = (plotTypeData[i].eastDimension+plotTypeData[i].westDimension)/2;
							var plotNorthSouthCalc = (plotTypeData[i].northDimension+plotTypeData[i].southDimension)/2;
							var plotSuperAreaCalc = plotEastWestCalc*plotNorthSouthCalc;
							var obj = {
								UnitDtls_No:plotNoCalc,
								UnitDtls_Directn:plotTypeData[i].plotFacing,
								UnitDtls_EstMsrmnt:plotTypeData[i].eastDimension,
								UnitDtls_WstMsrmnt:plotTypeData[i].westDimension,
								UnitDtls_NrtMsrmnt:plotTypeData[i].northDimension,
								UnitDtls_SthMsrmnt:plotTypeData[i].southDimension,
								plotEastWest:plotEastWestCalc,
								plotNorthSouth:plotNorthSouthCalc,
								UnitDtls_BuliltupArea:plotSuperAreaCalc,
								UnitDtls_Premium:0,
								UnitDtls_Cornerplot:0,
								UnitDtls_Floor:plotTypeData[i].releaseNo
							};
							$scope.plotDetails.push(obj);
							plotNoCalc++;
							obj={};
						}
					}
//                    $scope.UnitsArr=$scope.UnitsArr.concat($scope.plotDetails);
//					console.log(JSON.stringify($scope.UnitsArr));
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
    
    
    
   
    
    $scope.calculateEastWestP = function(id) {
        var eastNo =parseInt($('#untDetails' + id + 'EastP').val());
        var westNo =parseInt($('#untDetails' + id + 'WestP').val());
        if (eastNo > 0 && westNo > 0) {
        var eastWest = ((eastNo+westNo)/2);
        $('#untDetails' + id + 'plotEastWest').val(Math.round(parseFloat(eastWest))).trigger("change");; 
        } else {
            return false;
        } 
        var eastWest = parseInt($('#untDetails' + id + 'plotEastWest').val());
        var northSouth = parseInt($('#untDetails' + id + 'plotNorthSouth').val());

        if (eastWest > 0 && northSouth > 0) {
            var superBuiltArea = eastWest * northSouth;
            $('#untDetails' + id + 'plotSuperArea').val(Math.round(parseFloat(superBuiltArea))).trigger("change");;
        } else {
            return false;
        }
    };
    
    $scope.calculateNorthSouthP = function(id) {
        var northNo =parseInt($('#untDetails' + id + 'NorthP').val());
        var southNo =parseInt($('#untDetails' + id + 'SouthP').val());
        if (northNo > 0 && southNo > 0) {
        var eastWest = (((northNo)+(southNo))/2);
        $('#untDetails' + id + 'plotNorthSouth').val(Math.round(parseFloat(eastWest))).trigger("change");; 
        } else {
            return false;
        }
        
        var eastWest = parseInt($('#untDetails' + id + 'plotEastWest').val());
        var northSouth = parseInt($('#untDetails' + id + 'plotNorthSouth').val());
        if (eastWest > 0 && northSouth > 0) {
            var superBuiltArea = eastWest * northSouth;
            $('#untDetails' + id + 'plotSuperArea').val(Math.round(parseFloat(superBuiltArea))).trigger("change");;
        } else {
            return false;
        } 
    };

    

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
    
    
    
    $scope.releaseChange=function(){
        if($scope.oldReleaseNo>$scope.plotvillaReleaseNo){
            $scope.plotvillaReleaseNo=$scope.oldReleaseNo;
            alert("Select Release No. higher than or equal to "+$scope.oldReleaseNo);
        }
    };
   
  
    
    $scope.saveAllPlots = function(formName, formObj, parentObj) {
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];
       
            for (var j = 0; j < formObj.length; j++) {
                var unitObj = {};
                //var unitNo = plotsNosArr[j - 1];
 
                //unitNo = unitNo;
                
                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
                unitObj.UnitDtls_Unit_type_id = "2";
                unitObj.UnitDtls_Block_Id = parentObj.block.toString();
                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
                unitObj.UnitDtls_No = formObj[j].UnitDtls_No;
                unitObj.UnitDtls_Name = "";
                unitObj.UnitDtls_Type = "";
                unitObj.UnitDtls_Balcn = "0";
                unitObj.UnitDtls_ComBRoom = "0";
                unitObj.UnitDtls_BRoom = "0";
                unitObj.UnitDtls_Rooms = "0";
                unitObj.UnitDtls_Msrmnt =formObj[j].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Directn = formObj[j].UnitDtls_Directn;
                unitObj.UnitDtls_Floor = parseInt(formObj[j].UnitDtls_Floor);
                unitObj.UnitDtls_SrvntRoom = "0";
                unitObj.UnitDtls_EstMsrmnt = parseInt(formObj[j].UnitDtls_EstMsrmnt);
                unitObj.UnitDtls_WstMsrmnt = parseInt(formObj[j].UnitDtls_WstMsrmnt);
                unitObj.UnitDtls_NrtMsrmnt = parseInt(formObj[j].UnitDtls_NrtMsrmnt);
                unitObj.UnitDtls_SthMsrmnt = parseInt(formObj[j].UnitDtls_SthMsrmnt);
                unitObj.UnitDtls_BuliltupArea = formObj[j].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Cornerplot =parseInt(formObj[j].UnitDtls_Cornerplot);
                unitObj.UnitDtls_Premium = parseInt(formObj[j].UnitDtls_Premium);
                unitObj.UnitDtls_Status = 1;
                unitObj.UnitDtls_percentage = 0;
                unitsJson.push(unitObj);
                
                        }

        
        unitsJson = JSON.stringify(unitsJson);
        console.log(unitsJson);
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Save",
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
            }
            $scope.optionButton=false;
            console.log($scope.optionButton);
        }).error(function() {});
    };
    
    $scope.goto=function(formName, formObj,parentObj){
        $state.go("/GeneratedCostSheetDetails", {
                    blockId: parentObj.block
                });
    };
    $scope.gohome=function(){
        $state.go("/UnitVwEdit");
    };
   
    
});