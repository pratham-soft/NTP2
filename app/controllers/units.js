app.controller("unitsCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $compile, myService, encyrptSvc) {
    $scope.title = "Unit Generation";
     $scope.projId = encyrptSvc.decyrpt($stateParams.projId);
    $scope.phaseId = encyrptSvc.decyrpt($stateParams.phaseId);
    $scope.blockId = encyrptSvc.decyrpt($stateParams.blockId);
     $scope.Ugid = encyrptSvc.decyrpt($stateParams.Ugid);
        $scope.stepsData = [
		{
			stepName: "Phase",
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
    $scope.projectListFun = function() {
        angular.element(".loader").show();
        $scope.projectList = myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.phaseListFun = function(projectName) {
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        angular.element(".loader").show();
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    if ($scope.projId != "") {
        $scope.projectListFun();
        $scope.disableProject = true;
    }
    if ($scope.phaseId != "") {
        $scope.phaseListFun($scope.projId);
        $scope.disablePhase = true;
    }
    if ($scope.blockId != "") {
        $scope.blockListFun($scope.phaseId, $cookieStore.get('comp_guid'));
        $scope.disableBlock = true;
    }
    $scope.unts = {
        projectName: $scope.projId,
        phase: $scope.phaseId,
        block: $scope.blockId
    };
    $scope.unitListFun = function(compId, blockId) {
        angular.element(".loader").show();
        myService.getUnitsByBlock(compId, blockId).then(function(response) {
            $scope.units = response.data[0];
            console.log($scope.units);
            $scope.UnitsArr = [];
            for (i = 0; i < $scope.units.length; i++) {
                var unitObj = {};
                unitObj.UnitDtls_No = $scope.units[i].UnitDtls_No;
                unitObj.UnitDtls_Name = $scope.units[i].UnitDtls_Name;
                unitObj.UnitDtls_Type = $scope.units[i].UnitDtls_Type;
                unitObj.UnitDtls_Unit_type_id = $scope.units[i].UnitDtls_Unit_type_id;
                unitObj.UnitDtls_Rooms = $scope.units[i].UnitDtls_Rooms + "";
                unitObj.UnitDtls_BRoom = $scope.units[i].UnitDtls_BRoom + "";
                unitObj.UnitDtls_ComBRoom = $scope.units[i].UnitDtls_ComBRoom + "";
                unitObj.UnitDtls_Balcn = $scope.units[i].UnitDtls_Balcn + "";
                unitObj.UnitDtls_BuliltupArea = $scope.units[i].UnitDtls_BuliltupArea;
                unitObj.UnitDtls_Msrmnt = $scope.units[i].UnitDtls_Msrmnt;
                unitObj.UnitDtls_Premium = $scope.units[i].UnitDtls_Premium + "";
                unitObj.UnitDtls_Directn = $scope.units[i].UnitDtls_Directn;
                unitObj.UnitDtls_Floor = $scope.units[i].UnitDtls_Floor;
                unitObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                unitObj.UnitDtls_Cornerplot = 0;
                unitObj.UnitDtls_EstMsrmnt = 0;
                unitObj.UnitDtls_WstMsrmnt = 0;
                unitObj.UnitDtls_NrtMsrmnt = 0;
                unitObj.UnitDtls_SthMsrmnt = 0;
                unitObj.UnitDtls_Status = $scope.units[i].UnitDtls_Status;
                unitObj.UnitDtls_percentage=$scope.units[i].UnitDtls_percentage;
                unitObj.UnitDtls_SrvntRoom = $scope.units[i].UnitDtls_SrvntRoom + "";
                $scope.UnitsArr.push(unitObj);
            }
            angular.element(".loader").hide();
        });
    };

    $scope.unitListFun($cookieStore.get('comp_guid'), $scope.blockId);
 $scope.addBlockUnit = function(formObj, formName, parentObj){
                                  $state.go("/ApplyCostSheet", {
                "projectId": encyrptSvc.encyrpt($scope.projId),
                "phaseId": encyrptSvc.encyrpt($scope.phaseId),
                "blockId": encyrptSvc.encyrpt($scope.blockId),
                "Ugid" : encyrptSvc.encyrpt($scope.Ugid)
            });
                                 
}
//    $scope.addBlockUnit = function(formObj, formName, parentObj) {
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
//
//        $http({
//            method: "POST",
//            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Update",
//            ContentType: 'application/json',
//            data: unitsData
//        }).success(function(data) {
//            console.log(data);
//            $state.go("/ApplyCostSheet", {
//                "projectId": $scope.projId,
//                "phaseId": $scope.phaseId,
//                "blockId": $stateParams.blockId,
//                "Ugid" : $stateParams.Ugid
//            });
//        }).error(function() {});
//    }
     $scope.addBlockUnitSave = function(formObj, formName, parentObj) {
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
            url: appConfig.baseUrl+"/Proj/Block/Unitdetail/Update",
            ContentType: 'application/json',
            data: unitsData
        }).success(function(data) {
            alert("Unit Details Saved");
            //console.log(data);
//            $state.go("/ApplyCostSheet", {
//                "projectId": $scope.projId,
//                "phaseId": $scope.phaseId,
//                "blockId": $stateParams.blockId
////            });
        }).error(function() {});
    }
});