app.controller("exchangeUnitCtrl", function($scope,  $http, $state, $cookieStore, $compile, $stateParams, $window, myService) {
	console.log($window.sessionStorage);
 //   var test = $window.sessionStorage.getItem('projId');
    $scope.leadId = $stateParams.leadID;
    $scope.projId = $window.sessionStorage.getItem('projId');
    $scope.phaseId = $window.sessionStorage.getItem('phaseId');
    $scope.blockId = $window.sessionStorage.getItem('blockId');
    $scope.unitDtlsId = $window.sessionStorage.getItem('unitId');
    $scope.projectDetails={};
    $scope.projectDetails.projectName= parseInt($scope.projId);
   
    if ($scope.leadId == undefined) {
        $state.go('/AddLead');
    }
    
    ($scope.getLeadProjects = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            if (data.user_id != 0) {
                if (data.userprojlist != null) {
                    for(var i=0; i<data.userprojlist.length;i++){
                        if(data.userprojlist[i].UnitDtls_Id==parseInt($scope.unitDtlsId)){
                            $scope.leadProjects=[];
                            $scope.leadProjects.push(data.userprojlist[i]);
                        }
                    }
   
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.flatStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.flatStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];

//    ($scope.projectListFun = function() {
//        angular.element(".loader").show();
//        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
//            $scope.projectList = response.data;
//            console.log( $scope.projectList);
//            angular.element(".loader").hide();
//        });
//         $scope.phaseListFun($scope.projectDetails.projectName);
//    })();

    $scope.phaseListFun = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            $scope.projectDetails.phase=parseInt($scope.phaseId);
			
			alert($scope.phaseId);
            $scope.blockListFun($scope.phaseId);
			
			
			
            angular.element(".loader").hide();
        });
    };
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            console.log( $scope.projectList);
            angular.element(".loader").hide();
        });
         
    })();
    
   $scope.phaseListFun($scope.projectDetails.projectName);
       
 
  
    
    $scope.blockListFun = function(phase) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            $scope.projectDetails.blocks= parseInt($scope.blockId);
            angular.element(".loader").hide();
        });
    };
    
    

//    $scope.getUnits = function(blocks) {
//        $scope.units = [];
//        $scope.perFloorUnits = [];
//        if (blocks == "") {
//            return;
//        }
//        /*for (i = 0; i < $scope.blockList.length; i++) {
//            if ($scope.blockList[i].Blocks_Id == blocks) {
//                $scope.blockFloors = $scope.blockList[i].Blocks_Floors;
//                $scope.blockFloorUnits = $scope.blockList[i].Blocks_UnitPerfloor;
//            }
//        }*/
//        angular.element(".loader").show();
//        $http({
//            method: "POST",
//            url: appConfig.baseUrl+"/Proj/UnitDtls/ByUnitDtlsBlocksId",
//            ContentType: 'application/json',
//            data: {
//                "UnitDtls_Block_Id": blocks,
//                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
//            }
//        }).success(function(data) {
//            //console.log(JSON.stringify(data));
//
//            $scope.blockFloors = data[1].Blocks_Floors;
//            $scope.blockFloorUnits = data[1].Blocks_UnitPerfloor;
//
//            var dataOfUnits = data[0];
//
//            console.log($scope.blockFloors + " - " + $scope.blockFloorUnits);
//
//            $scope.selectedUnits = [];
//            $(".dispNone").each(function(index) {
//                var projObj = $(this).text();
//                projObj = angular.fromJson(projObj);
//                $scope.selectedUnits.push(projObj.UnitDtls_Id);
//            });
//
//            for (i = 0; i < dataOfUnits.length; i++) {
//                for (j = 0; j < $scope.selectedUnits.length; j++) {
//                    if (dataOfUnits[i].UnitDtls_Id == $scope.selectedUnits[j]) {
//                        dataOfUnits[i].markUp = "selected";
//                        break;
//                    }
//                }
//            }
//            var count = 0;
//            for (k = 0; k < $scope.blockFloors; k++) {
//                var floorUnits = [];
//                for (l = 0; l < $scope.blockFloorUnits; l++) {
//                    floorUnits.push(dataOfUnits[count]);
//                    count++;
//                }
//                $scope.perFloorUnits.push(floorUnits);
//            }
//            $scope.units = dataOfUnits;
//            angular.element(".loader").hide();
//
//        }).error(function() {
//            angular.element(".loader").hide();
//        });
//    };
    $scope.getUnits = function(blocks) {		
        $scope.units = [];
        $scope.perFloorUnits = [];
        if (blocks == "") {
            return;
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Block_Id": blocks,
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockFloors = data[1].Blocks_Floors;
            $scope.blockFloorUnits = data[1].Blocks_UnitPerfloor;

            var dataOfUnits = data[0];
			
			$scope.startZero = 0;
			if(dataOfUnits[0].UnitDtls_Floor == 0){
				$scope.startZero = 1;
			}
			
			console.log(dataOfUnits);
			
			$scope.floorStartingNumber = dataOfUnits[0].UnitDtls_Floor;

            $scope.selectedUnits = [];
            $(".dispNone").each(function(index) {
                var projObj = $(this).text();
                projObj = angular.fromJson(projObj);
                $scope.selectedUnits.push(projObj.UnitDtls_Id);
            });

            for (i = 0; i < dataOfUnits.length; i++) {
                for (j = 0; j < $scope.selectedUnits.length; j++) {
                    if (dataOfUnits[i].UnitDtls_Id == $scope.selectedUnits[j]) {
                        dataOfUnits[i].markUp = "selected";
                        break;
                    }
                }
            }
            var count = 0;
            for (k = 0; k < $scope.blockFloors; k++) {
                var floorUnits = [];
                for (l = 0; l < $scope.blockFloorUnits; l++) {
                    floorUnits.push(dataOfUnits[count]);
                    count++;
                }
                $scope.perFloorUnits.push(floorUnits);
            }
			console.log($scope.perFloorUnits);
            $scope.units = dataOfUnits;
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.getUnits($scope.blockId);
    
    
    $scope.markUnits = function() {
        alert($scope.selectedUnits);
    };
    
    var clickCounter=0;
    $scope.selectUnit = function(unitId, projectDetails) {
        for (i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].UnitDtls_Id == unitId && clickCounter==0) {
                if ($scope.units[i].UnitDtls_Status == 1 || $scope.units[i].UnitDtls_Status == 2) {
                    if ($("#unit" + $scope.units[i].UnitDtls_Id).hasClass('selected')) {
                        $scope.deleteRow($scope.projectDetails.projectName, $scope.units[i].UnitDtls_Id);
                    } else {
                        var projObj = {};
                        projObj.ProjId = parseInt($scope.projId);
                        projObj.Phase_Id = parseInt($scope.phaseId);
                        projObj.Blocks_Id = parseInt($scope.blockId);
                        projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                        projObj = JSON.stringify(projObj);

                        //                      console.log($scope.projectDetails);

                        var projectRow = '<tr id="' + $scope.units[i].UnitDtls_Id + '"><td>' + $scope.projId + '</td><td>' + $scope.phaseId + '</td><td>' + 'Flat Type' + '</td><td><div class="dispNone">' + projObj + '</div>' + $scope.units[i].UnitDtls_BRoom + 'BHK - ' + $scope.units[i].UnitDtls_No + ' - ' + $scope.units[i].UnitDtls_Floor + ' Floor</td><td>' + $scope.units[i].UnitDtls_BuliltupArea + ' sq ft</td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow(' + $scope.projId + ',' + $scope.units[i].UnitDtls_Id + ')"></span></td></tr>';
                        var projectRowComplied = $compile(projectRow)($scope);
                        angular.element(document.getElementById('projectList')).append(projectRowComplied);
                       
                    }
                    $("#unit" + $scope.units[i].UnitDtls_Id).addClass('selected');
                    $cookieStore.put("newUnitDtls_Id",$scope.units[i].UnitDtls_Id);
                        $cookieStore.put("newUnitDtls_No",$scope.units[i].UnitDtls_No);
                        console.log($cookieStore.get("unitObj.UnitDtls_Id"));
                     
                } else {
                    alert($scope.flatStatusText[$scope.units[i].UnitDtls_Status - 1]);
                }
                clickCounter++;
            }
            
        }
       
    };
    $scope.deleteRow = function(projId, rowId) {
        clickCounter=0;
        var deleteUser = $window.confirm('Are you sure you want to delete ?');

        if (deleteUser) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/ProjUnitDel",
                ContentType: 'application/json',
                data: [{
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "ProjDtl_Id": projId
                }]
            }).success(function(data) {
                if (data.Comm_ErrorDesc == '0|0') {
                    $("tr#" + rowId).remove();
                    $("#unit" + rowId).removeClass('selected');
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    $scope.saveLead = function(projectObj) {
        var projJson = [];
        $(".dispNone").each(function(index) {
            //console.log(index + ": " + $(this).text());
            var projObj = $(this).text();
            projObj = angular.fromJson(projObj);
            projObj.comp_guid = $cookieStore.get('comp_guid');
            projObj.Projusrid = $scope.leadId;
            projObj.ProjDtl_Status = 2;
            projJson.push(projObj);
        });
        //console.log(projJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/ProjUnitSave",
            ContentType: 'application/json',
            data: projJson
        }).success(function(data) {
            angular.element(".loader").hide();
            if (data.Comm_ErrorDesc == '0|0') {
                $cookieStore.remove('lead_id');
                $cookieStore.put("skip3rdStep",true);
                $cookieStore.put("prospectId",$scope.leadId);
                
                $state.go('/BookUnit-Step1',{
                   
                });
                angular.element(".loader").hide();
            } else {
                alert('Something went wrong.');
            }
            //console.log(JSON.stringify(data));
        }).error(function() {
            angular.element(".loader").hide();
        });
//        alert("Need API for exchange..!!")
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Plots';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Plots';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});