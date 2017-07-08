app.controller("generateCostSheetCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService, encyrptSvc) {
    
    $scope.title = "Generate Cost Sheet";
     $scope.projectId = encyrptSvc.decyrpt($stateParams.projectId);
    $scope.phaseId = encyrptSvc.decyrpt($stateParams.phaseId);
    $scope.blockId = encyrptSvc.decyrpt($stateParams.blockId);
    $scope.Ugid = encyrptSvc.decyrpt($stateParams.Ugid);
    var    blockId= encyrptSvc.decyrpt($stateParams.blockId);
    // $scope.activeBtn=true;
    $scope.pressCount=0;
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
			status: "done",
            Num: "3"
		},
		{
			stepName: "Apply Cost Sheet",
			status: "done",
            Num: "4"
		},
        {
			stepName: "Generate Cost Sheet",
			status: "active",
            Num: "5"
		},
        {
			stepName: "Payment Schedule",
			status: "pending",
            Num: "6"
		}
	];
 

    var blockId = $scope.blockId;
    ($scope.getBlockCostSheet = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": blockId
            }
        }).success(function(data) {
            $scope.blockCostSheetId = data[0].untctcm_Id;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getUnitsWithCostSheet = function(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntdtlsViewGrd/Gt",
            ContentType: 'application/json',
            data: {
                "Blocks_Id": blockId,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
           // console.log(data);
            $scope.showGrid = true;
            for(var i =0;i<data.length;i++){
                if(data[i].UnitDtls_Premium==0){
                    data[i].UnitDtls_Premium="No";
                }
                else{
                    data[i].UnitDtls_Premium="Yes";
                }
            }
            $scope.unitsWCost = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.unitCostSheetModal = function(unitId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitId;
                }
            }
        });
    };
    $scope.generateCostSheetUnits = function(templId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/BldValforUtCtSt",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Blocks_Id": parseInt($scope.blockId),
                "untctcm_Id": templId
            }
        }).success(function(data) {
           // console.log(data);
            var res = data.Comm_ErrorDesc;
            var resSplit = res.split('|');
            if (resSplit[0] == 0) {
                $scope.getUnitsWithCostSheet(blockId);
            }
            $scope.pressCount=1;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
     $scope.generateCostSheetUnitsNext = function(templId) {
         $state.go('/BlockStage',{
             
                "projId": encyrptSvc.encyrpt($scope.projectId),
                "phaseId": encyrptSvc.encyrpt($scope.phaseId),
                "blockId": encyrptSvc.encyrpt($scope.blockId),
                "Ugid" : encyrptSvc.encyrpt($scope.Ugid)
            });   }
});
app.controller("generatedCostSheetDetailsCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService) {
    $scope.title = "Generated Cost Sheet Details";
    var blockId = $stateParams.blockId;
    ($scope.getBlockCostSheet = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntCstTempl/Getall",
            ContentType: 'application/json',
            data: {
                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
                "untctcm_Id": 0,
                "untctcm_Blocks_Id": blockId
            }
        }).success(function(data) {
            $scope.blockCostSheetId = data[0].untctcm_Id;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getUnitsWithCostSheet = function(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/UntdtlsViewGrd/Gt",
            ContentType: 'application/json',
            data: {
                "Blocks_Id": blockId,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.showGrid = true;
            for(var i =0;i<data.length;i++){
                if(data[i].UnitDtls_Premium==0){
                    data[i].UnitDtls_Premium="No";
                }
                else{
                    data[i].UnitDtls_Premium="Yes";
                }
            }
            $scope.unitsWCost = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.unitCostSheetModal = function(unitId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitId;
                }
            }
        });
    };
    
    // Below Code Commented as Cost Sheet was Aplied on page load, Cost sheet apply to units multiple times 24june 
//    ($scope.generateCostSheetUnits = function(templId) {
//        angular.element(".loader").show();
//        $http({
//            method: "POST",
//            url: appConfig.baseUrl+"/Proj/Blk/BldValforUtCtSt",
//            ContentType: 'application/json',
//            data: {
//                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
//                "untctcm_Blocks_Id": parseInt(blockId),
//                "untctcm_Id": templId
//            }
//        }).success(function(data) {
//            console.log(data);
//            var res = data.Comm_ErrorDesc;
//            var resSplit = res.split('|');
//            if (resSplit[0] == 0) {
//                $scope.getUnitsWithCostSheet(blockId);
//            }
//            angular.element(".loader").hide();
//        }).error(function() {
//            angular.element(".loader").hide();
//        });
//    })();
     $scope.getUnitsWithCostSheet(blockId);

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
            //console.log("Atul Test " + JSON.stringify(data));
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


