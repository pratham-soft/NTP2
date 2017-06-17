
app.controller("unitListingAfterEditCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService) {
    $scope.title = "Unit Listing After Edit";
    var blockId = $stateParams.blockId;
//    ($scope.getBlockCostSheet = function() {
//        angular.element(".loader").show();
//        $http({
//            method: "POST",
//            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstTempl/Getall",
//            ContentType: 'application/json',
//            data: {
//                "untctcm_comp_guid": $cookieStore.get('comp_guid'),
//                "untctcm_Id": 0,
//                "untctcm_Blocks_Id": blockId
//            }
//        }).success(function(data) {
//            $scope.blockCostSheetId = data[0].untctcm_Id;
//            angular.element(".loader").hide();
//        }).error(function() {
//            angular.element(".loader").hide();
//        });
//    })();

    ($scope.getUnitsWithCostSheet = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntdtlsViewGrd/Gt",
            ContentType: 'application/json',
            data: {
                "Blocks_Id": blockId,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
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
    })();

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
//    ($scope.generateCostSheetUnits = function(templId) {
//        angular.element(".loader").show();
//        $http({
//            method: "POST",
//            url: "http://120.138.8.150/pratham/Proj/Blk/BldValforUtCtSt",
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
});


app.controller("unitCostSheetCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $uibModalInstance, item ,myService) {
    
    $scope.unitId = item;
    ($scope.getUnitCostSheetDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstSheet/Gt",
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