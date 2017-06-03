app.controller("unitGenerationCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, myService) {
    $scope.untDetails = [];
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId = $stateParams.blockId;
    $scope.plotvillaReleaseNo = 0;

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




    $scope.addSampleData = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            /*Update Block*/
            angular.element(".loader").show();
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
        }
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
        $scope.submit = true;
        if ($scope[formName].$valid) {
			console.log(JSON.stringify(formObj.plotType));
			var plotTypeData = [];
			angular.forEach(formObj.plotType, function(value, key) {
  				plotTypeData.push(value);
			});
			/*console.log(plotTypeData);*/
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
					angular.element("#plotRowsCntr").html('');
					
					var plotNo = 1;
					var increamenter = 0;
					$scope.plotDetails = [];
					for(i=0;i<plotTypeData.length;i++){
						for(j=0;j<plotTypeData[i].noOfPlots;j++){
							var plotRowHtml = '<tr> <td><input type="text" style="width:70px;" class="form-control" value="' + plotNo + '"name="plotNo" ng-model="plotDetails[' + increamenter + '].plotNo" ng-required="true"/> </td><td> <select style="width:70px;" class="form-control" name="plotFacing" ng-model="plotDetails[' + increamenter + '].plotFacing"> <option selected="selected" value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option> <option value="SW">SW</option> <option value="SE">SE</option> </select> </td><td><input type="text" style="width:70px;" class="form-control" id="plotDetails' + i + 'EastP" name="plotEast" ng-model="plotDetails[' + increamenter + '].plotEast"/> </td><td><input type="text" style="width:70px;" class="form-control" id="plotDetails' + i + 'WestP" name="plotWest" ng-model="plotDetails[' + increamenter + '].plotWest"/> </td><td><input type="text" style="width:70px;" id="plotDetails' + i + 'NorthP" class="form-control" name="plotNorth" ng-model="plotDetails[' + increamenter + '].plotNorth"/> </td><td><input type="text" style="width:70px;" class="form-control" id="plotDetails' + i + 'SouthP" name="plotSouth" ng-model="plotDetails[' + increamenter + '].plotSouth"/> </td><td><input type="text" style="width:70px;" class="form-control" id="plotDetails' + i + 'plotEastWest" name="plotEastWest" ng-model="plotDetails[' + increamenter + '].plotEastWest" ng-disabled="true"/> </td><td><input type="text" style="width:70px;" class="form-control" id="plotDetails' + i + 'plotNorthSouth" name="plotNorthSouth" ng-model="plotDetails[' + increamenter + '].plotNorthSouth" ng-disabled="true"/> </td><td><input type="text" class="form-control" id="plotDetails' + i + 'plotSuperArea" name="plotSuperArea" id="plotDetails' + i + 'plotSuperArea" ng-model="plotDetails[' + increamenter + '].plotSuperArea" ng-disabled="true"/> </td><td> Release No. </td><td> <input type="checkbox" name="premiumPlot" id="plotDetails' + i + 'premiumPlot" ng-model="plotDetails[' + increamenter + '].premiumPlot"/> </td><td> <input type="checkbox" name="plotCorner" id="plotDetails' + i + 'plotCorner" ng-model="plotDetails[' + increamenter + '].plotCorner"/> </td></tr>';
							
							var plotRowHtmlComplied = $compile(plotRowHtml)($scope);
 							angular.element("#plotRowsCntr").append(plotRowHtmlComplied);
							
							increamenter++;
							plotNo++;
						}
					}
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

    $scope.addSampleVillas = function(formObj, formName) {
        $scope.submit = true;
        formObj.noOfFloors = $scope.plotvillaReleaseNo;
        angular.element(".loader").show();
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
                str1 = '';
                for (var j = 1; j <= $scope.plotvillaReleaseNo; j++) {
                    str1 = str1 + "<option value=" + j + ">" + j + "</option>";
                }
                var i = 1;
                while (i <= unitsPerFloor) {
                    unitNosArr.push(unitNo);
                    var tableRow = '<tr><td><input type="text" style="width:70px;" class="form-control" value="' + floorNo + formObj.seperator + unitNo + '" name="villaNos" ng-required="true"/> </td> <td> <select style="width:70px;" class="form-control" name="villaFacing" ng-model="untDetails[' + i + '].villaFacing"><option value="E">E</option> <option value="W">W</option> <option value="N">N</option> <option value="S">S</option> <option value="NW">NW</option> <option value="NE">NE</option><option value="SW">SW</option> <option value="SE">SE</option></select></td><td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'East" name="villaEast" ng-keyup="calculateEastWest(' + i + ')" ng-model="untDetails[' + i + '].villaEast"/></td> <td><input type="text" style="width:70px;" id="untDetails' + i + 'West" ng-keyup="calculateEastWest(' + i + ')" class="form-control" name="villaWest" ng-model="untDetails[' + i + '].villaWest"/> </td><td><input type="text" style="width:70px;" class="form-control" id="untDetails' + i + 'North" ng-keyup="calculateNorthSouth(' + i + ')" name="plotNorth" ng-model="untDetails[' + i + '].villaNorth"/> </td> <td><input type="text" style="width:70px;" class="form-control" ng-keyup="calculateNorthSouth(' + i + ')" name="villaSouth" id="untDetails' + i + 'South" ng-model="untDetails[' + i + '].villaSouth"/> </td><td><input type="text" style="width:70px;" class="form-control" name="villaEastWest" id="untDetails' + i + 'villaEastWest" ng-model="untDetails[' + i + '].villaEastWest" ng-model-options="{ updateOn: change}" ng-disabled="true"/></td> <td><input type="text" style="width:70px;" class="form-control" name="villaNorthSouth"  id="untDetails' + i + 'villaNorthSouth" ng-model="untDetails[' + i + '].villaNorthSouth" ng-model-options="{ updateOn: change}" ng-disabled="true"/></td><td> <select class="form-control" style="width:60px;" name="villaBedroom" ng-model="untDetails[' + i + '].villaBedroom">  <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option>  <option value="6">6</option> <option value="7">7</option>  <option value="8">8</option>  </select> </td> <td> <select class="form-control" style="width:60px;" name="villaBalconies" ng-model="untDetails[' + i + '].villaBalconies">  <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option></select> </td> <td> <select class="form-control" style="width:60px;" name="villaBathrooms" ng-model="untDetails[' + i + '].villaBathrooms">   <option value="1">1</option> <option value="2">2</option><option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </td> <td><input type="text" style="width:70px;" class="form-control" name="villaSuperArea" id="untDetails' + i + 'villaSuperArea" ng-model="untDetails[' + i + '].villaSuperArea" ng-model-options="{ updateOn: change}" ng-disabled="true"/></td> <td><input style="width:70px;" ng-keyup="calculatePercentageforVilla(' + i + ')" type="number"  id="untDetails' + i + 'villaPercentage"  class="form-control" name="villaPercentage" ng-model="untDetails[' + i + '].villaPercentage"/></td> <td><input type="text" style="width:70px;" class="form-control" ng-disabled="true" name="villaCarpetArea" id="untDetails' + i + 'villaCarpetArea" ng-model="untDetails[' + i + '].villaCarpetArea"  ng-value="" ng-model-options="{ updateOn: change}"/></td><td> <select style="width:60px;" class="form-control" name="villaPremium" ng-model="untDetails[' + i + '].villaPremium">  <option value="1">Y</option> <option value="0">N</option> </select> </td><td>  <select style="width:65px;" class="form-control" name="relaseNo" id="untDetails' + i + 'releaseNo" ng-model="untDetails[' + i + '].releaseNo"> ' + str1 + ' </select> </td> <td> <select style="width:60px;" class="form-control" name="villaCorner" ng-model="untDetails[' + i + '].villaCorner">  <option value="1">Y</option> <option value="0">N</option> </select> </td></tr>';
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
        var area = parseInt(UnitsArr[id].UnitDtls_BuliltupArea);
        var percentage = parseInt(UnitsArr[id].UnitDtls_percentage);

        if (percentage >= 1 && percentage <= 100) {
            var superBuiltArea = UnitsArr[id].UnitDtls_BuliltupArea;
            var carpetArea = superBuiltArea - (superBuiltArea * (percentage / 100));
            UnitsArr[id].UnitDtls_Msrmnt = parseInt(carpetArea);
        } else {
            alert("Percentage value should be between 0-100.");
            return false;
        }


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
                $state.go("/Units", {
                    projId: $scope.projectId,
                    phaseId: $scope.phaseId,
                    blockId: parentObj.block
                });
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };


    ($scope.checkBlockUnits = function(blockId) {
        if (blockId == undefined) {
            blockId = $scope.blockId;
            //$scope.untGeneration.block=blockId;
        }
        if (blockId != "") {
            var compId = $cookieStore.get('comp_guid');
            angular.element(".loader").show();
            myService.getUnitsByBlock(compId, blockId).then(function(response) {
                $scope.units = response.data[0];
                $scope.blockFloorUnits = response.data[1].Blocks_UnitPerfloor;
                $scope.UnitsArr = [];
                console.log($scope.units);
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

                $scope.checkUnitType(unitObj); // We change later.    
                console.log($scope.UnitsArr);
                angular.element(".loader").hide();

            })
        };
    })();

    $scope.checkUnitType = function(unitObj) {
        var typeidvalue = parseInt($scope.typeObj.UnitType_Id);
        if ((typeidvalue != unitObj.UnitDtls_Unit_type_id) && (unitObj.UnitDtls_Unit_type_id != 0)) {
            var typename = "";
            if (unitObj.UnitDtls_Unit_type_id == 1) {
                typename = "Flats";
            }
            if (unitObj.UnitDtls_Unit_type_id == 2) {
                typename = "Plots";
            }
            if (unitObj.UnitDtls_Unit_type_id == 3) {
                typename = "villa";
            }
            alert("Type Mismatch! Please select: " + typename);
        }
    }


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
            url: "http://120.138.8.150/pratham/Proj/Block/Unitdetail/Update",
            ContentType: 'application/json',
            data: unitsData
        }).success(function(data) {
            angular.element(".loader").hide();
            console.log(data);
            $state.go("/ApplyCostSheet", {
                "projectId": $stateParams.projId,
                "phaseId": $stateParams.phaseId,
                "blockId": parentObj.block
            });
        }).error(function() {
            angular.element(".loader").hide();
        });
    }




    $scope.saveAllPlots = function(formName, formObj, parentObj) {
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];

        for (var j = 1; j < formObj.length; j++) {
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
            unitObj.UnitDtls_Msrmnt = 0;
            unitObj.UnitDtls_Directn = formObj[j].plotFacing;
            unitObj.UnitDtls_Floor = parseInt(formObj[j].releaseNo);
            unitObj.UnitDtls_SrvntRoom = "0";
            unitObj.UnitDtls_EstMsrmnt = parseInt(formObj[j].plotEast);
            unitObj.UnitDtls_WstMsrmnt = parseInt(formObj[j].plotWest);
            unitObj.UnitDtls_NrtMsrmnt = parseInt(formObj[j].plotNorth);
            unitObj.UnitDtls_SthMsrmnt = parseInt(formObj[j].plotSouth);
            unitObj.UnitDtls_EstWstMsrmnt = ((unitObj.UnitDtls_EstMsrmnt + unitObj.UnitDtls_WstMsrmnt) / 2);
            unitObj.UnitDtls_NrtSthMsrmnt = ((unitObj.UnitDtls_NrtMsrmnt + unitObj.UnitDtls_SthMsrmnt) / 2);
            unitObj.UnitDtls_BuliltupArea = formObj[j].plotSuperArea;
            unitObj.UnitDtls_Cornerplot = parseInt(formObj[j].plotCorner);
            unitObj.UnitDtls_Premium = parseInt(formObj[j].premiumPlot);
            unitObj.UnitDtls_Status = 1;
            unitObj.UnitDtls_percentage = 0;
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

    $scope.saveAllVillas = function(formName, formObj, parentObj) {
        var initiator = 1;
        if (parentObj.agf == true) {
            initiator = 0;
        }
        var unitsJson = [];

        for (var j = 1; j < formObj.length; j++) {
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
            unitObj.UnitDtls_Cornerplot = parseInt(formObj[j].villaCorner);
            unitObj.UnitDtls_Premium = parseInt(formObj[j].villaPremium);
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