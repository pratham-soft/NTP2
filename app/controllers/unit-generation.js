app.controller("unitGenerationCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $compile, myService, encyrptSvc) {
  //  $scope.Ugid = encyrptSvc.decyrpt($stateParams.Ugid); Aman changes 9 july as in previous page unit-vwEdit UGid was not encrypted
    $scope.Ugid = $stateParams.Ugid; 
    $scope.untDetails = [];
    $scope.projectId = encyrptSvc.decyrpt($stateParams.projId);
    $scope.phaseId = encyrptSvc.decyrpt($stateParams.phaseId);
    $scope.blockId = encyrptSvc.decyrpt($stateParams.blockId);
   var myblockId=encyrptSvc.decyrpt($stateParams.blockId);
    $scope.plotvillaReleaseNo = 0;
    $scope.showHideFormula = true;
    var unitNosArr = [];
    var plotsNosArr = [];
   
    $scope.stepsData = [
		{
			stepName: "Add Phase      ",
			status: "done",
            Num: "1"
		},
		{
			stepName: "Phase Details",
			status: "done",
            Num: "2"
		},
		{
			stepName: "Unit Generation",
			status: "active",
            Num: "3"
		},
		{
			stepName: "Apply Cost Sheet",
			status: "pending",
            Num: "4"
		},
        {
			stepName: "Generate Cost Sheet",
			status: "pending",
            Num: "5"
		},
        {
			stepName: "Payment Schedule",
			status: "pending",
            Num: "6"
		}
	];
 
$scope.stepsDataEdit = [
		{
			stepName: "Unit Generation",
			status: "active",
            Num: "1"
		},
		{
			stepName: "Apply Cost Sheet",
			status: "pending",
            Num: "2"
		},
        {
			stepName: "Generate Cost Sheet",
			status: "pending",
            Num: "3"
		},
        {
			stepName: "Payment Schedule",
			status: "pending",
            Num: "4"
		}
	];
   

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
                        block: $scope.blockId
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




    $scope.addSampleData = function(formObj, formName) {
        $scope.submit = true;
        /*if ($scope[formName].$valid) {*/
            /*Update Block*/
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Block/Updt",
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
                if (resSplit[0] == 0) {
                    if (formObj.seperator == undefined) {
                        formObj.seperator = "";
                    }
                    if (formObj.towerName == undefined) {
                        formObj.towerName = "";
                    }
                    /*if (formObj.noOfFloors > 9) {
                        floorNo = "01";
                    } else {
                        floorNo = "1";
                    }*/
                    var floorNo = "01";

                    angular.element("#unitRows").html('');
                    unitNosArr = [];
                    var unitsPerFloor = formObj.unitsPerFloor;
                    /*var unitNo = parseInt(formObj.unitNo);*/
                    /*var skipBy = parseInt(formObj.skipBy);*/
                    var towerName = formObj.towerName;
                    var seperator = formObj.seperator;
                    var i = 1;
                    var unitNo = '';
                    while (i <= unitsPerFloor) {
                        if (i < 10) {
                            unitNo = '0' + i;
                        } else {
                            unitNo = i;
                        }
                        unitNosArr.push(unitNo);
                        var tableRow = '<tr><td><input type="text" class="form-control" value="' + towerName + seperator + unitNo + floorNo + '" name="unitNos" ng-required="true"/></td> <td><input type="text" style="width:70px;" class="form-control" name="unitType" ng-model="untDetails[' + i + '].unitType"/></td> <td> <select class="form-control" name="unitBedroom" ng-model="untDetails[' + i + '].unitBedroom"> <option value="">Select</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option>  </select> </td> <td> <select class="form-control" name="unitBalconies" ng-model="untDetails[' + i + '].unitBalconies"> <option value="">Select</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> </select> </td> <td> <select class="form-control" name="unitBathroomsCommon" ng-model="untDetails[' + i + '].unitBathroomsCommon"> <option value="">Select</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </td> <td> <select class="form-control" name="unitBathroomsAttached" ng-model="untDetails[' + i + '].unitBathroomsAttached"> <option value="">Select</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </td> <td><input type="text" class="form-control" name="unitSuperArea" id="untDetails' + i + 'unitSuperArea" ng-model="untDetails[' + i + '].unitSuperArea"/></td> <td><input type="text" ng-keyup="calculatePercentage(' + i + ')" id="untDetails' + i + 'unitPercentage" class="form-control" name="unitPercentage" ng-model="untDetails[' + i + '].unitPercentage"/></td> <td><input type="text" class="form-control" ng-disabled="true"  name="UnitDtls_Msrmnt" id="untDetails' + i + 'UnitDtls_Msrmnt" ng-model="untDetails[' + i + '].UnitDtls_Msrmnt"  ng-value="" ng-model-options="{ updateOn: change}"/></td> <td> <select class="form-control" name="unitServentRoom" ng-model="untDetails[' + i + '].unitServentRoom"> <option value="0">0</option> <option value="1">1</option> <option value="2">2</option> </select> </td> <td> <select class="form-control" name="unitPremium" ng-model="untDetails[' + i + '].unitPremium"> <option value="">Select</option> <option value="1">Y</option> <option  value="0">N</option> </select> </td> <td> <select class="form-control" style="width:70px;" name="unitPosition" ng-model="untDetails[' + i + '].unitPosition"> <option value="">Select</option> <option value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select></td></tr>';
                        var tableRowComplied = $compile(tableRow)($scope);
                        angular.element("#unitRows").append(tableRowComplied);
                        /*unitNo = unitNo++;*/
                        i++;
                    }
                    /*angular.element(".loader").hide();*/
                    console.log("unitNosArr" + unitNosArr);
                    //var test="";

                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        /*}*/
    };
	$scope.plotvillaReleaseNo = "";
	
	$scope.addPlotTYpeRow = function(){
		var i =	angular.element("#plotTypeGrid > .plotTypeRow").length;
		var rowHtml = '<div class="plotTypeRow"> <label for="plotFacing">Facing: </label> <select name="plotFacing" id="plotFacing" ng-model="untGeneration.plotType['+i+'].plotFacing" ng-required="true" class="form"> <option value="">Select</option> <option value="E">E </option> <option value="W">W </option> <option value="N">N </option> <option value="S">S </option> <option value="NW">NW </option> <option value="NE">NE </option> <option value="SW">SW </option> <option value="SE">SE </option> </select> | <label for="eastDimension">East:</label> <input type="number" id="eastDimension" ng-model="untGeneration.plotType['+i+'].eastDimension" ng-required="true"> <label for="westDimension">West:</label> <input type="number" id="westDimension" ng-model="untGeneration.plotType['+i+'].westDimension" ng-required="true"> <label for="northDimension">North:</label> <input type="number" id="northDimension" ng-model="untGeneration.plotType['+i+'].northDimension" ng-required="true"> <label for="southDimension">South:</label> <input type="number" id="southDimension" ng-model="untGeneration.plotType['+i+'].southDimension" ng-required="true"> | <label for="noOfPlots">No. of Plots:</label> <input type="number" id="noOfPlots" ng-model="untGeneration.plotType['+i+'].noOfPlots" ng-required="true"> </div>';
		
		var rowHtmlComplied = $compile(rowHtml)($scope);
 		angular.element("#plotTypeGrid").append(rowHtmlComplied);
	}
	
    /*For generating plots*/
    $scope.addSamplePlots = function(formObj, formName) {
        $scope.untGeneration.noOfVillaType=0;
        $scope.untGeneration.totalVillaments=0;
        $scope.showHideFormula=false;
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
					for(var i=1;i<=formObj.plotvillaReleaseNo;i++){
						realeaseNoOptions = realeaseNoOptions+'<option value="'+i+'">'+i+'</option>';
					}
					angular.element("#plotRowsCntr").html('');
					var increamenter = 0;
					
					$scope.plotDetails = [];
					
					for(i=0;i<plotTypeData.length;i++){
						for(j=0;j<plotTypeData[i].noOfPlots;j++){
							var plotRowHtml = '<tr> <td><input type="text" style="width:70px;" class="form-control" name="plotNo" ng-model="plotDetails[' + increamenter + '].plotNo" ng-required="true"/> </td><td> <select style="width:70px;" class="form-control" name="plotFacing" ng-model="plotDetails[' + increamenter + '].plotFacing"> <option selected="selected" value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td><td><input type="text" style="width:70px;" class="form-control" name="plotEast" ng-model="plotDetails[' + increamenter + '].plotEast"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotWest" ng-model="plotDetails[' + increamenter + '].plotWest"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotNorth" ng-model="plotDetails[' + increamenter + '].plotNorth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotSouth" ng-model="plotDetails[' + increamenter + '].plotSouth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotEastWest" ng-model="plotDetails[' + increamenter + '].plotEastWest" ng-disabled="true"/> </td><td><input type="text" style="width:70px;" class="form-control" name="plotNorthSouth" ng-model="plotDetails[' + increamenter + '].plotNorthSouth" ng-disabled="true"/> </td><td><input type="text" class="form-control" name="plotSuperArea" ng-model="plotDetails[' + increamenter + '].plotSuperArea" ng-disabled="true"/> </td><td> <select class="form-control" name="releaseNo" ng-model="plotDetails[' + increamenter + '].releaseNo">'+realeaseNoOptions+'</select> </td><td class="text-center"> <input type="checkbox" name="premiumPlot" ng-model="plotDetails[' + increamenter + '].premiumPlot" ng-true-value="1" ng-false-value="0"/> </td><td class="text-center"> <input type="checkbox" name="plotCorner" ng-model="plotDetails[' + increamenter + '].plotCorner" ng-true-value="1" ng-false-value="0"/> </td></tr>';
							
							var plotRowHtmlComplied = $compile(plotRowHtml)($scope);
 							angular.element("#plotRowsCntr").append(plotRowHtmlComplied);
							
							increamenter++;
						}
					}
					var plotNoCalc = 1;
					for(i=0;i<plotTypeData.length;i++){
						for(j=0;j<plotTypeData[i].noOfPlots;j++){
							var plotEastWestCalc = (plotTypeData[i].eastDimension+plotTypeData[i].westDimension)/2;
							var plotNorthSouthCalc =(plotTypeData[i].northDimension+plotTypeData[i].southDimension)/2;
							var plotSuperAreaCalc = plotEastWestCalc*plotNorthSouthCalc;
							var obj = {
								plotNo:plotNoCalc,
								plotFacing:plotTypeData[i].plotFacing,
								plotEast:plotTypeData[i].eastDimension,
								plotWest:plotTypeData[i].westDimension,
								plotNorth:plotTypeData[i].northDimension,
								plotSouth:plotTypeData[i].southDimension,
								plotEastWest:plotEastWestCalc,
								plotNorthSouth:plotNorthSouthCalc,
								plotSuperArea:plotSuperAreaCalc,
								premiumPlot:0,
								plotCorner:0,
								releaseNo:plotTypeData[i].releaseNo
							};
							$scope.plotDetails.push(obj);
							plotNoCalc++;
							obj={};
						}
					}
					console.log(JSON.stringify($scope.plotDetails));
				}
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        }
		else{
            console.log($scope[formName].$error);
			alert("In Valid!");

		}
    };

    $scope.calculateEastWestP = function(id) {
        var eastNo = parseInt($('#untDetails' + id + 'EastP').val());
        var westNo = parseInt($('#untDetails' + id + 'WestP').val());
        if (eastNo > 0 && westNo > 0) {
            var eastWest = ((eastNo + westNo) / 2);
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
        var northNo = parseInt($('#untDetails' + id + 'NorthP').val());
        var southNo = parseInt($('#untDetails' + id + 'SouthP').val());
        if (northNo > 0 && southNo > 0) {
            var eastWest = (((northNo) + (southNo)) / 2);
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


    
        
        
    	$scope.addVillaTypeRow = function(){
        $scope.untGeneration.plotvillaReleaseNo='0';
        for(var x=0; x<$scope.untGeneration.noOfVillaType; x++){
//		var i =	angular.element("#villaTypeGrid > .villaTypeRow").length;
		var rowHtml = '<tr><td><select name="villaFacing" id="villaFacing" ng-model="untGeneration.villaType['+x+'].villaFacing" ng-required="true" class="form"> <option value="">Select</option> <option value="E">E </option> <option value="W">W </option> <option value="N">N </option> <option value="S">S </option> <option value="NW">NW </option> <option value="NE">NE </option> <option value="SW">SW </option> <option value="SE">SE </option> </select> </td> <td><input type="text" style="width:70px;" class="form" name="villaType" ng-model="untGeneration.villaType['+x+'].unitType"/></td> <td><input type="number" id="eastDimension" ng-model="untGeneration.villaType['+x+'].eastDimension" ng-required="true"> </td><td><input type="number" id="westDimension" ng-model="untGeneration.villaType['+x+'].westDimension" ng-required="true"> </td><td><input type="number" id="northDimension" ng-model="untGeneration.villaType['+x+'].northDimension" ng-required="true"> </td><td><input type="number" id="southDimension" ng-model="untGeneration.villaType['+x+'].southDimension" ng-required="true">  </td><td><select name="bedRoom" id="bedRoom" ng-model="untGeneration.villaType['+x+'].bedRoom" ng-required="true" class="form"><option value="">Select</option><option value="1">1 </option><option value="2">2 </option><option value="3">3 </option><option value="4">4 </option><option value="5">5 </option><option value="6">6 </option><option value="7">7 </option><option value="8">8 </option></select></td> <td><select name="balconies" id="balconies" ng-model="untGeneration.villaType['+x+'].balconies" ng-required="true" class="form"><option value="">Select</option><option value="1">1 </option><option value="2">2 </option><option value="3">3 </option><option value="4">4 </option><option value="5">5 </option></select></td><td><select name="bathRoom" id="bathRoom" ng-model="untGeneration.villaType['+x+'].bathRoom" ng-required="true" class="form"><option value="">Select</option><option value="1">1 </option><option value="2">2 </option><option value="3">3 </option><option value="4">4 </option><option value="5">5 </option></select></td> <td><input type="number" id="villaFloorNo" ng-model="untGeneration.villaType['+x+'].villaFloorNo" ng-required="true"> </td><td><input type="number" id="noOfFlats" ng-model="untGeneration.villaType['+x+'].noOfVillas" ng-required="true"> </td></tr>';
           
//            <td><input type="number" id="buildPercent" ng-model="untGeneration.villaType['+x+'].buildPercent" ng-required="true"> </td> 
	
		var rowHtmlComplied = $compile(rowHtml)($scope);
 		angular.element("#villaTypeGrid").append(rowHtmlComplied);
	}
        }
        
        $scope.addSampleVillas = function(formObj, formName) {
        //formObj["plotvillaReleaseNo"]='0';
        $scope.showHideFormula = false;
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
//					var realeaseNoOptions = '<option value="">Select</option>';
//					for(var i=1;i<=formObj.plotvillaReleaseNo;i++){
//						realeaseNoOptions = realeaseNoOptions+'<option value="'+i+'">'+i+'</option>';
//					}
					angular.element("#villaRowsCntr").html('');
					var increamenter = 0;
					
					$scope.villaDetails = [];
					
					for(i=0;i<villaTypeData.length;i++){
						for(j=0;j<villaTypeData[i].noOfVillas;j++){
							var villaRowHtml = '<tr> <td><input type="text" style="width:70px;" class="form-control" name="villaNo" ng-model="villaDetails[' + increamenter + '].villaNo" ng-required="true"/> </td><td><select style="width:70px;" class="form-control" name="villaFacing" ng-model="villaDetails[' + increamenter + '].villaFacing"> <option  value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td> <td><input type="text" style="width:70px;" class="form-control" name="villaType" ng-model="villaDetails[' + increamenter + '].unitType"/></td> <td><input type="text" style="width:70px;" class="form-control" name="villaEast" ng-model="villaDetails[' + increamenter + '].villaEast"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaWest" ng-model="villaDetails[' + increamenter + '].villaWest"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaNorth" ng-model="villaDetails[' + increamenter + '].villaNorth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaSouth" ng-model="villaDetails[' + increamenter + '].villaSouth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaEastWest" ng-model="villaDetails[' + increamenter + '].villaEastWest" ng-disabled="true"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaNorthSouth" ng-model="villaDetails[' + increamenter + '].villaNorthSouth" ng-disabled="true"/> </td><td><input type="text" class="form-control" name="villaSuperArea" ng-model="villaDetails[' + increamenter + '].villaSuperArea" ng-disabled="true"/> </td> <td><select class="form-control" style="width:60px;" name="villaRooms" ng-model="villaDetails[' + increamenter + '].villaRooms"><option value="0">0</option><option value="1" ng-selected="villaDetails[' + increamenter + '].villaRooms==1">1</option><option value="2" ng-selected="villaDetails[' + increamenter + '].villaRooms==2">2</option><option value="3" ng-selected="villaDetails[' + increamenter + '].villaRooms==3">3</option><option value="4" ng-selected="villaDetails[' + increamenter + '].villaRooms==4">4</option><option value="5" ng-selected="villaDetails[' + increamenter + '].villaRooms==5">5</option><option value="6" ng-selected="villaDetails[' + increamenter + '].villaRooms==6">6</option> <option value="7" ng-selected="villaDetails[' + increamenter + '].villaRooms==7">7</option><option value="8" ng-selected="villaDetails[' + increamenter + '].villaRooms==8"></option> </select></td><td><select class="form-control" style="width:60px;" name="villaBalcn" ng-model="villaDetails[' + increamenter + '].villaBalcn"><option value="0">0</option><option value="1" ng-selected="villaDetails[' + increamenter + '].villaBalcn==1">1</option><option value="2" ng-selected="villaDetails[' + increamenter + '].villaBalcn==2">2</option><option value="3" ng-selected="villaDetails[' + increamenter + '].villaBalcn==3">3</option><option value="4" ng-selected="villaDetails[' + increamenter + '].villaBalcn==4">4</option><option value="5" ng-selected="villaDetails[' + increamenter + '].villaBalcn==5">5</option></select></td><td><select class="form-control" style="width:60px;" name="villaBRoom" ng-model="villaDetails[' + increamenter + '].villaBRoom"><option value="">Select</option><option value="0">0</option><option value="1" ng-selected="villaDetails[' + increamenter + '].villaBRoom==1">1</option><option value="2" ng-selected="villaDetails[' + increamenter + '].villaBRoom==2">2</option><option value="3" ng-selected="villaDetails[' + increamenter + '].villaBRoom==3">3</option><option value="4" ng-selected="villaDetails[' + increamenter + '].villaBRoom==4">4</option><option value="5" ng-selected="villaDetails[' + increamenter + '].villaBRoom==5">5</option> </select></td> <td><input type="number"  class="form-control" name="villaFloorNo" ng-model="villaDetails[' + increamenter + '].villaFloorNo"/></td> <td class="text-center"><input type="checkbox" name="premiumvilla" ng-model="villaDetails[' + increamenter + '].premiumvilla" ng-true-value="1" ng-false-value="0"/> </td><td class="text-center"> <input type="checkbox" name="villaCorner" ng-model="villaDetails[' + increamenter + '].villaCorner" ng-true-value="1" ng-false-value="0"/> </td></tr>';
							
							var villaRowHtmlComplied = $compile(villaRowHtml)($scope);
 							angular.element("#villaRowsCntr").append(villaRowHtmlComplied);
							
							increamenter++; 
						}
					}
//                    **Insert this line to add release no in the table**
//                    <td> <select style="width:70px;" class="form-control" name="releaseNo" ng-model="villaDetails[' + increamenter + '].releaseNo">'+realeaseNoOptions+'</select></td>
//                    <td><input type="number" style="width:70px;"  class="form-control" name="villaPercentage" ng-model="villaDetails[' + increamenter + '].villaPercentage"/></td> <td><input type="number" style="width:70px;" class="form-control" ng-disabled="true" name="villaCarpetArea" ng-model="villaDetails[' + increamenter + '].villaCarpetArea"/></td>
                    
                    
                    
					var villaNoCalc = 1;
					for(i=0;i<villaTypeData.length;i++){
						for(j=0;j<villaTypeData[i].noOfVillas;j++){
							var villaEastWestCalc = (villaTypeData[i].eastDimension+villaTypeData[i].westDimension)/2;
							var villaNorthSouthCalc =(villaTypeData[i].northDimension+villaTypeData[i].southDimension)/2;
							var villaSuperAreaCalc = villaEastWestCalc*villaNorthSouthCalc;
//                            var carpetAreaCalc = villaSuperAreaCalc*(villaTypeData[i].buildPercent/100);
							var obj = {
								villaNo:villaNoCalc,
								villaFacing:villaTypeData[i].villaFacing,
                                unitType:villaTypeData[i].unitType,
								villaEast:villaTypeData[i].eastDimension,
								villaWest:villaTypeData[i].westDimension,
								villaNorth:villaTypeData[i].northDimension,
								villaSouth:villaTypeData[i].southDimension,
								villaEastWest:villaEastWestCalc,
								villaNorthSouth:villaNorthSouthCalc,
								villaSuperArea:villaSuperAreaCalc,
                                villaRooms:villaTypeData[i].bedRoom,
                                villaBRoom:villaTypeData[i].bathRoom,
                                villaBalcn:villaTypeData[i].balconies,
                                villaPercentage:0,
                                villaFloorNo:villaTypeData[i].villaFloorNo,
                                villaCarpetArea:0,
								premiumvilla:0,
								villaCorner:0,
								releaseNo:0
							};
							$scope.villaDetails.push(obj);
							villaNoCalc++;
							obj={};
						}
					}
					console.log(JSON.stringify($scope.villaDetails));
				}
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
            /*End Update Block*/
        }
		else{
            console.log($scope.untGenerationForm.$error.required);
			 alert("In Valid!");
             $scope.showHideFormula = true;
		}
    };
        
    

    $scope.calculateEastWestValue = function(id, UnitsArr) {
        var eastNo = parseInt(UnitsArr[id].UnitDtls_EstMsrmnt);
        var westNo = parseInt(UnitsArr[id].UnitDtls_WstMsrmnt);
        if (eastNo > 0 && westNo > 0) {
            var newvalue = (eastNo + westNo) / 2;
            UnitsArr[id].UnitDtls_EstWstMsrmnt = newvalue;
        } else {
            return false;
        }
        var eastWest = (UnitsArr[id].UnitDtls_EstWstMsrmnt);
        var northSouth = (UnitsArr[id].UnitDtls_NrtSthMsrmnt);
        if (eastWest > 0 && northSouth > 0) {
            UnitsArr[id].UnitDtls_BuliltupArea = eastWest * northSouth;
        } else {
            return false;
        }
        if (UnitsArr[id].UnitDtls_Unit_type_id == 3) {
            $scope.calculateCarpet(id, UnitsArr);
        }
    }

    $scope.calculateNorthSouthValue = function(id, UnitsArr) {
        var northNo = parseInt(UnitsArr[id].UnitDtls_NrtMsrmnt);
        var southNo = parseInt(UnitsArr[id].UnitDtls_SthMsrmnt);
        if (northNo > 0 && southNo > 0) {
            var newvalue = (northNo + southNo) / 2;
            UnitsArr[id].UnitDtls_NrtSthMsrmnt = newvalue;
        } else {
            return false;
        }
        var eastWest = (UnitsArr[id].UnitDtls_EstWstMsrmnt);
        var northSouth = (UnitsArr[id].UnitDtls_NrtSthMsrmnt);
        if (eastWest > 0 && northSouth > 0) {
            UnitsArr[id].UnitDtls_BuliltupArea = (eastWest * northSouth);
        } else {
            return false;
        }
        if (UnitsArr[id].UnitDtls_Unit_type_id == 3) {
            $scope.calculateCarpet(id, UnitsArr);
        }

    }

    $scope.calculateCarpet = function(id, UnitsArr) {
//        var area = parseInt(UnitsArr[id].UnitDtls_BuliltupArea);
//        var percentage = parseInt(UnitsArr[id].UnitDtls_percentage);
//
//        if (percentage >= 1 && percentage <= 100) {
//            var superBuiltArea = UnitsArr[id].UnitDtls_BuliltupArea;
//            var carpetArea = superBuiltArea * (percentage / 100);
//            UnitsArr[id].UnitDtls_Msrmnt = parseInt(carpetArea);
//        } else {
//            alert("Percentage value should be between 0-100.");
//            return false;
//        }
    }

    $scope.calculateEastWest = function(id) {
        var eastNo = parseInt($('#untDetails' + id + 'East').val());
        var westNo = parseInt($('#untDetails' + id + 'West').val());
        if (eastNo > 0 && westNo > 0) {
            var eastWest = ((eastNo + westNo) / 2);
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
        var northNo = parseInt($('#untDetails' + id + 'North').val());
        var southNo = parseInt($('#untDetails' + id + 'South').val());
        if (northNo > 0 && southNo > 0) {
            var eastWest = (((northNo) + (southNo)) / 2);
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

    $scope.calculatePercentage = function(id) {
        var percentage = $('#untDetails' + id + 'unitPercentage').val();
        if (percentage > 0 && percentage <= 100) {
            var superBuiltArea = $('#untDetails' + id + 'unitSuperArea').val();
            var carpetArea = (superBuiltArea * percentage) / 100;
            $('#untDetails' + id + 'UnitDtls_Msrmnt').val(Math.round(parseFloat(carpetArea))).trigger("change");;
        } else {
            return false;
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

    $scope.generateForAllFloors = function(formName, formObj, parentObj) {
        var initiator = 1;
        var totalFloors = parentObj.noOfFloors;
        if (parentObj.agf == true) {
            initiator = 0;
            totalFloors = totalFloors - 1
        }
        var towerName = parentObj.towerName;
        var seperator = parentObj.seperator;

        var unitsJson = [];
        for (var i = initiator; i <= totalFloors; i++) {
            for (var j = 1; j < formObj.length; j++) {
                var unitObj = {};
                var unitNo = unitNosArr[j - 1];
                if (i == 0) {
                    unitNo = towerName + seperator + 'G' + unitNo;
                } else if (i > 0 && i < 10) {
                    unitNo = towerName + seperator + '0' + i + unitNo;
                } else {
                    unitNo = towerName + seperator + i + unitNo;
                }
                unitObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
                unitObj.UnitDtls_Unit_type_id = parentObj.typeId;
                unitObj.UnitDtls_Block_Id = parentObj.block;
                unitObj.UnitDtls_user_id = $cookieStore.get('user_id');
                unitObj.UnitDtls_No = unitNo;
                unitObj.UnitDtls_Name = "";
                unitObj.UnitDtls_Type = formObj[j].unitType;
                unitObj.UnitDtls_Balcn = formObj[j].unitBalconies;
                unitObj.UnitDtls_ComBRoom = formObj[j].unitBathroomsCommon;
                unitObj.UnitDtls_BRoom = formObj[j].unitBathroomsAttached;
                unitObj.UnitDtls_Rooms = formObj[j].unitBedroom;
                unitObj.UnitDtls_Msrmnt = formObj[j].UnitDtls_Msrmnt; // This is a carper Area
                unitObj.UnitDtls_Directn = formObj[j].unitPosition;
                unitObj.UnitDtls_Floor = i;
                unitObj.UnitDtls_SrvntRoom = formObj[j].unitServentRoom;
                unitObj.UnitDtls_Premium = formObj[j].unitPremium;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_BuliltupArea = formObj[j].unitSuperArea;
                unitObj.UnitDtls_Status = 1;
                unitObj.UnitDtls_percentage = formObj[j].unitPercentage;

                unitsJson.push(unitObj);
            }
        }
        unitsJson = JSON.stringify(unitsJson);
        console.log(unitsJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Save",
            ContentType: 'application/json',
            data: unitsJson
        }).success(function(data) {
            angular.element(".loader").hide();
            console.log(data);
            var res = data.Comm_ErrorDesc;
            var resSplit = res.split('|');
            console.log(resSplit[0]);
            if (resSplit[0] == 0) {
                $state.go("/Units", {
                    projId: encyrptSvc.encyrpt($scope.projectId),
                    phaseId: encyrptSvc.encyrpt($scope.phaseId),
                    blockId: encyrptSvc.encyrpt(parentObj.block),
                    Ugid: encyrptSvc.encyrpt($scope.Ugid)
                });
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };


    ($scope.checkBlockUnits = function(myblockId) {
        if (myblockId == undefined) {
            myblockId = $scope.blockId;
            //$scope.untGeneration.block=blockId;
        }
        if (myblockId != "") {
            var compId = $cookieStore.get('comp_guid');
            angular.element(".loader").show();
            myService.getUnitsByBlock(compId, myblockId).then(function(response) {
                $scope.units = response.data[0];
                $scope.blockFloorUnits = response.data[1].Blocks_UnitPerfloor;
                $scope.UnitsArr = [];
                console.log($scope.units);
                for (i = 0; i < $scope.units.length; i++) {
                    var unitObj = {};
                    unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                    unitObj.UnitDtls_Name = $scope.units[i].UnitDtls_Name;
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
                    unitObj.UnitDtls_Cornerplot = $scope.units[i].UnitDtls_Cornerplot;
                    unitObj.UnitDtls_EstMsrmnt = $scope.units[i].UnitDtls_EstMsrmnt;
                    unitObj.UnitDtls_WstMsrmnt = $scope.units[i].UnitDtls_WstMsrmnt;
                    unitObj.UnitDtls_NrtMsrmnt = $scope.units[i].UnitDtls_NrtMsrmnt;
                    unitObj.UnitDtls_SthMsrmnt = $scope.units[i].UnitDtls_SthMsrmnt;
                    unitObj.UnitDtls_EstWstMsrmnt = ((unitObj.UnitDtls_EstMsrmnt + unitObj.UnitDtls_WstMsrmnt) / 2);
                    unitObj.UnitDtls_NrtSthMsrmnt = ((unitObj.UnitDtls_NrtMsrmnt + unitObj.UnitDtls_SthMsrmnt) / 2);
                    unitObj.UnitDtls_Unit_type_id = $scope.units[i].UnitDtls_Unit_type_id;
                    unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                    unitObj.UnitDtls_percentage = $scope.units[i].UnitDtls_percentage;
                    $scope.UnitsArr.push(unitObj);
                }

               
                console.log($scope.UnitsArr);
                angular.element(".loader").hide();

            })
        };
    });

  $scope.checkBlockUnits(myblockId);

    $scope.addBlockUnit = function(formObj, formName, parentObj) {
        for (i = 0; i < formObj.length; i++) {
            formObj[i].UnitDtls_comp_guid = $cookieStore.get('comp_guid');
            /*formObj[i].UnitDtls_Unit_type_id = 3;*/
            formObj[i].UnitDtls_Block_Id = parentObj.block;
            formObj[i].UnitDtls_user_id = $cookieStore.get('user_id');
        }

        console.log(formObj);

        var unitsData = JSON.stringify(formObj);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Update",
            ContentType: 'application/json',
            data: unitsData
        }).success(function(data) {
            angular.element(".loader").hide();
            console.log(data);
//            $state.go("/ApplyCostSheet", {
//                "projectId": $stateParams.projId,
//                "phaseId": $stateParams.phaseId,
//                "blockId": parentObj.block
//            });
            }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.addBlockUnitNext = function(formObj, formName, parentObj){
        $scope.blockId = parentObj.block;
        $state.go("/ApplyCostSheet", {
                "projectId": encyrptSvc.encyrpt($scope.projectId),
                "phaseId": encyrptSvc.encyrpt($scope.phaseId),
                "blockId": encyrptSvc.encyrpt($scope.blockId),
                "Ugid": encyrptSvc.encyrpt($scope.Ugid)
            });
    }
    
// $scope.addBlockUnitNext = function(formObj, formName, parentObj) {
//        for (i = 0; i < formObj.length; i++) {
//            formObj[i].UnitDtls_comp_guid = $cookieStore.get('comp_guid');
//            /*formObj[i].UnitDtls_Unit_type_id = 3;*/
//            formObj[i].UnitDtls_Block_Id = parentObj.block;
//            formObj[i].UnitDtls_user_id = $cookieStore.get('user_id');
//        }
//
//        console.log(formObj);
//
//        var unitsData = JSON.stringify(formObj);
//        angular.element(".loader").show();
//        $http({
//            method: "POST",
//            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Update",
//            ContentType: 'application/json',
//            data: unitsData
//        }).success(function(data) {
//            angular.element(".loader").hide();
//            console.log(data);
//            
//        }).error(function() {
//            angular.element(".loader").hide();
//        });
//    }


    $scope.saveAllPlots = function(formName, formObj, parentObj) {
        var plotsJson = [];

        for (var j = 0; j < formObj.length; j++) {
            var plotObj = {};

            plotObj.UnitDtls_comp_guid = $cookieStore.get('comp_guid');
            plotObj.UnitDtls_Unit_type_id = "2";
            plotObj.UnitDtls_Block_Id = parentObj.block.toString();
            plotObj.UnitDtls_user_id = $cookieStore.get('user_id');
			
            plotObj.UnitDtls_No = formObj[j].plotNo;
            plotObj.UnitDtls_Name = "";
            plotObj.UnitDtls_Type = "";
            plotObj.UnitDtls_Balcn = "0";
            plotObj.UnitDtls_ComBRoom = "0";
            plotObj.UnitDtls_BRoom = "0";
            plotObj.UnitDtls_Rooms = "0";
            plotObj.UnitDtls_Msrmnt = "0";
            plotObj.UnitDtls_Directn = formObj[j].plotFacing;
            plotObj.UnitDtls_Floor = parseInt(formObj[j].releaseNo);
            plotObj.UnitDtls_SrvntRoom = "0";
            plotObj.UnitDtls_EstMsrmnt = parseFloat(formObj[j].plotEast);
            plotObj.UnitDtls_WstMsrmnt = parseFloat(formObj[j].plotWest);
            plotObj.UnitDtls_NrtMsrmnt = parseFloat(formObj[j].plotNorth);
            plotObj.UnitDtls_SthMsrmnt = parseFloat(formObj[j].plotSouth);
            plotObj.UnitDtls_EstWstMsrmnt = parseFloat(formObj[j].plotEastWest);
            plotObj.UnitDtls_NrtSthMsrmnt = parseFloat(formObj[j].plotNorthSouth);
            plotObj.UnitDtls_Msrmnt = parseFloat(formObj[j].plotSuperArea);
            plotObj.UnitDtls_BuliltupArea = parseFloat(formObj[j].plotSuperArea);
            plotObj.UnitDtls_Cornerplot = parseInt(formObj[j].plotCorner);
            plotObj.UnitDtls_Premium = parseInt(formObj[j].premiumPlot);
            plotObj.UnitDtls_Status = 1;
            plotObj.UnitDtls_percentage = 0;
			
            plotsJson.push(plotObj);

        }

        plotsJson = JSON.stringify(plotsJson);
        console.log(plotsJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Save",
            ContentType: 'application/json',
            data: plotsJson
        }).success(function(data) {
            angular.element(".loader").hide();
            console.log(data);
            var res = data.Comm_ErrorDesc;
            var resSplit = res.split('|');
            console.log(resSplit[0]);
            if (resSplit[0] == 0) {
                $state.go("/ApplyCostSheet", {
                    projectId: encyrptSvc.encyrpt($scope.projectId),
                    phaseId: encyrptSvc.encyrpt($scope.phaseId),
                    blockId: encyrptSvc.encyrpt(parentObj.block),
                    Ugid: encyrptSvc.encyrpt($scope.Ugid)
                });
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

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
            unitObj.UnitDtls_Name =formObj[j].unitType;
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
            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Save",
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
                    projectId: encyrptSvc.encyrpt($scope.projectId),
                    phaseId: encyrptSvc.encyrpt($scope.phaseId),
                    blockId: encyrptSvc.encyrpt(parentObj.block),
                    Ugid: encyrptSvc.encyrpt($scope.Ugid)
                });

            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };



    $scope.addMorePlots = function(formObj, formName) {
        var projectId = formObj.projectName;
        var phaseId = formObj.phase;
        var blockId = formObj.block;


        $state.go("/EditPlot", {
            projId: projectId,
            phaseId: phaseId,
            blockId: blockId,
        });

    };
    $scope.addMoreVillas = function(formObj, formName) {
        var projectId = formObj.projectName;
        var phaseId = formObj.phase;
        var blockId = formObj.block;


        $state.go("/EditVillas", {
            projId: projectId,
            phaseId: phaseId,
            blockId: blockId,
        });

    };


});