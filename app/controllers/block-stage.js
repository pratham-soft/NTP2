app.controller("blockStageCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $rootScope, myService) {
    $scope.projectId = $stateParams.projId;
    $scope.phaseId = $stateParams.phaseId;
    $scope.blockId =$stateParams.blockId;
    $scope.Ugid =$stateParams.Ugid;
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
                    $scope.blkStage = {
                        projectName: $scope.projectId,
                        phase: $scope.phaseId,
                    
                        typeId: $scope.phaseList[i].Phase_UnitType.UnitType_Id,
                        block: $scope.blockId
                    }; 
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
//
//   $scope.phaseListFun = function(projectName) {
//        $scope.perFloorUnits = [];
//        $scope.units = [];
//        $scope.flatType = "";
//        $scope.projectDetails.phase = "";
//        $scope.projectDetails.blocks = "";
//        $scope.blockList = {};
//        angular.element(".loader").show();
//        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
//            $scope.phaseList = response.data;
//            angular.element(".loader").hide();
//        });
//    };
     $scope.stepsData = [
		{
			stepName: "Phase",
			status: "done"
		},
		{
			stepName: "Phase Details",
			status: "done"
		},
		{
			stepName: "Unit Generation",
			status: "done"
		},
		{
			stepName: "Apply Cost Sheet",
			status: "done"
		},
        {
			stepName: "Generate Cost Sheet",
			status: "done"
		},
        {
			stepName: "Payment Schedule",
			status: "active"
		}
	];
     $scope.stepsDataEdit = [
		{
			stepName: "Unit Generation",
			status: "done"
		},
		{
			stepName: "Apply Cost Sheet",
			status: "done"
		},
        {
			stepName: "Generate Cost Sheet",
			status: "done"
		},
        {
			stepName: "Payment Schedule",
			status: "active"
		}
	];
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
            angular.element(".loader").hide();
        });
    };

    $scope.getBlockStageList = function(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/BlockStage/ByblockstageBlockId",
            ContentType: 'application/json',
            data: {
                "blockstageCompGuid": $cookieStore.get('comp_guid'),
                "blockstageBlockId": blockId
            }
        }).success(function(data) {
               if(data[0].blocksatgeErrorDesc!='-1 | Block Stage Record does not exist')
                   {
                     $rootScope.blockStageList = data;
                   }
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went wrong.');
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockStageList($scope.blockId);
     $scope.getPaymentScheduleList = function(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
                console.log(data);
                if(data[0].paymentscheduleByBlockErrorDesc!='-1 | Payment Schedule and Block Stage  Record does not exist')
                   {
                    $rootScope.paymentScheduleList = data;
                   }
               
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };

     $scope.getPaymentScheduleList($stateParams.blockId);
    
    $scope.updatePaymentSchedule = function(formObj, formName) {
        $scope.submit = true;
        var paymentScheduleValue = formObj.paymentScheduleValue;
         var PaymentScheduleCalcTypeValue =1;
        if(paymentScheduleValue.includes('%'))
            {
             PaymentScheduleCalcTypeValue=0;
            }
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/PaymentSchedule/Update",
                ContentType: 'application/json',
                data: {
                    "PaymentScheduleId": item.PaymentScheduleId,
                    "PaymentScheduleBlockstageId": item.blockstageId,
                    "PaymentScheduleCompGuid": $cookieStore.get('comp_guid'),
                    "PaymentScheduleCalcTypeValue": PaymentScheduleCalcTypeValue,
                    "PaymentScheduleCalcValue": formObj.paymentScheduleValue
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getPaymentScheduleList(item.blockstageBlockId);
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    $scope.addStatusChange = function(blockId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'blockStatusChange.html',
            controller: 'blockStageChangeCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    var blocks = {};
                    blocks.blockId = blockId;
                    blocks.action = 'add' ;
                    return blocks;
                }
            }
        });
        
    };

    $scope.editStatusChange = function(blockstageId, currentBlockId, paymentScheduleValue) {
        var modalInstance = $uibModal.open({
            templateUrl: 'blockStatusChange.html',
            controller: 'blockStageChangeCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    var blocks = {};
                    blocks.blockstageId = blockstageId;
                    blocks.action = 'edit';
                    blocks.blockId = currentBlockId;
                    blocks.PaymentScheduleCalcValue = paymentScheduleValue;
                    return blocks;
                }
            }
        });
    };
    

    $scope.editPaymentSchedule = function(paymentSchduleObj) {
        var modalInstance = $uibModal.open({
            templateUrl: 'paymentScheduleChange.html',
            controller: 'paymentScheduleChangeCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return paymentSchduleObj;
                }
            }
        });
    };
});

app.controller("blockStageChangeCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, $rootScope, $window,item) {
$scope.blockId =$stateParams.blockId;
    ($scope.getBlockStageDetail = function() {
        if (item.action == 'add') {
            $scope.blkStage = {
                completed: "0",
                action: "add"
            };
        }
        if (item.action == 'edit') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/BlockStage/ByblockstageId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageId": item.blockstageId
                }
            }).success(function(data) {
                $scope.blockStage = {
                    completed: data.blocksatgeCompleted + "",
                    name: data.blockstageName,
                    PaymentScheduleCalcValue : data.PaymentScheduleCalcValue,
                    action: "edit"
                };
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    })();

    $scope.ok = function() {
        $uibModalInstance.close();
    };


    $scope.addBlockStage = function(formObj, formName) {
         var pymtschdValue = formObj.PaymentScheduleCalcValue;
         var pymtschdCalcTypeValue =1;
        if(pymtschdValue.includes('%'))
            {
             pymtschdCalcTypeValue=0;
            }
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/BlockStage/Save",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageName": formObj.name,
                    "blocksatgeCompleted": parseInt(formObj.completed),
                    "blockstageBlockId": item.blockId,
                    "PaymentScheduleCalcValue":formObj.PaymentScheduleCalcValue,
                    "PaymentScheduleCalcTypeValue" : pymtschdCalcTypeValue
                }
            }).success(function(data) {
                $uibModalInstance.close();
               // getBlockStageList(data.blockstageBlockId);
               // $scope.getBlockStageList(data.blockstageBlockId);
                 $window.location.reload();
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    function getBlockStageList(blockId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/Blk/BlockStage/ByblockstageBlockId",
            ContentType: 'application/json',
            data: {
                "blockstageCompGuid": $cookieStore.get('comp_guid'),
                "blockstageBlockId": blockId
            }
        }).success(function(data) {
            if(data[0].paymentscheduleByBlockErrorDesc!='-1 | Payment Schedule and Block Stage  Record does not exist')
                   {
                    $rootScope.paymentScheduleList = data;
                   }
               
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.editBlockStage = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/BlockStage/Update",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageName": formObj.name,
                    "blocksatgeCompleted": parseInt(formObj.completed),
                    "blockstageBlockId": item.blockId,
                    "blockstageId": item.blockstageId,
                    "PaymentScheduleCalcValue":formObj.PaymentScheduleCalcValue
                }
            }).success(function(data) {
                
                $uibModalInstance.close();
               // getBlockStageList(data.blockstageBlockId);
                 $window.location.reload();
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };
     ($scope.getPaymentScheduleDetail = function() {
        $scope.blockStage = {
            paymentScheduleValue: item.PaymentScheduleCalcValue
        };
    })();

    $scope.updatePaymentSchedule = function(formObj, formName) {
        $scope.submit = true;
        var paymentScheduleValue = formObj.paymentScheduleValue;
         var PaymentScheduleCalcTypeValue =1;
        if(paymentScheduleValue.includes('%'))
            {
             PaymentScheduleCalcTypeValue=0;
            }
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/PaymentSchedule/Update",
                ContentType: 'application/json',
                data: {
                    "PaymentScheduleId": item.PaymentScheduleId,
                    "PaymentScheduleBlockstageId": item.blockstageId,
                    "PaymentScheduleCompGuid": $cookieStore.get('comp_guid'),
                    "PaymentScheduleCalcTypeValue": PaymentScheduleCalcTypeValue,
                    "PaymentScheduleCalcValue": formObj.paymentScheduleValue
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                $uibModalInstance.close();
                getPaymentScheduleList(item.blockstageBlockId);
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    }

    function getPaymentScheduleList(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
                console.log(data);
                $rootScope.paymentScheduleList = data;
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});