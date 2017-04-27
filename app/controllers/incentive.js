app.controller("incentiveCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, myService) {
    
    //initialize the project list dropdown on page load -Atul 26 April 
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
          $scope.paymentScheduleList=''; //Empty the Grid Data while Page Load;
    })();

    //Populating Phaselist dropdown by passing project id - showing phase list on selection of previous project dropdown -Atul 26 April 
    $scope.phaseListFun = function(projectid) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectid).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };
   
     //Populating Blocklist dropdown by passing Phase id - showing Block list on selection of previous Phase dropdown -Atul 26 April 
    $scope.blockListFun = function(phaseid) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phaseid) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        myService.getBlockList(phaseid, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
    };

    //Populating Block Stage Name and Payment Schedule Value for a Particular Block (By Passing Block Id) -Atul 26 April 
    $scope.getPaymentScheduleList = function(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/ByblockId",
                ContentType: 'application/json',
                data: {
                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
                    "blockstageBlockId": blockId
                }
            }).success(function(data) {
               // console.log(data);
                
                $scope.paymentScheduleList = data;
                $scope.getIncentiveDataByBlockid(blockId);
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };
    
     $scope.getIncentiveDataByBlockid = function(blockId) {
        if (blockId != '') {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/IncentiveGet",
                ContentType: 'application/json',
                data: {
                    "incentive_compguid": $cookieStore.get('comp_guid'),
                    "incentive_blockid": blockId
                }
            }).success(function(data) {
               // console.log(data);
                $scope.incentive = data;
                for (var i=0 ;i<$scope.incentive.length;i++){
                     for (var j=0 ;j<$scope.paymentScheduleList.length;j++){
                            if ($scope.paymentScheduleList[j].PaymentScheduleId==$scope.incentive[i].incentive_paymnt_stageid)
                             {
                              $scope.paymentScheduleList[j].incentivevalue= $scope.incentive[i].incentive_value;
                              $scope.paymentScheduleList[j].incentivetype= $scope.incentive[i].incentive_type;
                               $scope.paymentScheduleList[j].incentivetype=$scope.paymentScheduleList[j].incentivetype.toString();
                             }  
                         }
                   
                }
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
    };
    
    $scope.saveIncentive=function(paymentSchedule) {
        if (paymentSchedule.incentivetype != "0" && paymentSchedule.incentivevalue != "" ) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/IncentiveInsert",
                ContentType: 'application/json',
                data: {
                    "incentive_name": "My client Incentive",
                    "incentive_compguid":$cookieStore.get('comp_guid'),
                    "incentive_blockid":paymentSchedule.blockstageBlockId,
                    "incentive_paymnt_stageid": paymentSchedule.PaymentScheduleId,
                    "incentive_type":paymentSchedule.incentivetype,
                     "incentive_value":paymentSchedule.incentivevalue
                    }

            }).success(function(data) {
                alert(data.ErrorDesc.toString());
               $scope.getPaymentScheduleList(paymentSchedule.blockstageBlockId);
                angular.element(".loader").hide();
            }).error(function() {
                alert('Something Went wrong.');
                angular.element(".loader").hide();
            });
        }
        else{
             alert("Please Fill in All Incentive data");
        }
    };

//    $scope.editPaymentSchedule = function(paymentSchduleObj) {
//        var modalInstance = $uibModal.open({
//            templateUrl: 'paymentScheduleChange.html',
//            controller: 'paymentScheduleChangeCtrl',
//            size: 'lg',
//            backdrop: 'static',
//            resolve: {
//                item: function() {
//                    return paymentSchduleObj;
//                }
//            }
//        });
//    };
});

//app.controller("paymentScheduleChangeCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $compile, $uibModal, $uibModalInstance, $rootScope, item) {
//
//    ($scope.getPaymentScheduleDetail = function() {
//        $scope.blockStage = {
//            paymentScheduleValue: item.PaymentScheduleCalcValue
//        };
//    })();
//
//    $scope.updatePaymentSchedule = function(formObj, formName) {
//        $scope.submit = true;
//        if ($scope[formName].$valid) {
//            angular.element(".loader").show();
//            $http({
//                method: "POST",
//                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/Update",
//                ContentType: 'application/json',
//                data: {
//                    "PaymentScheduleId": item.PaymentScheduleId,
//                    "PaymentScheduleBlockstageId": item.blockstageId,
//                    "PaymentScheduleCompGuid": $cookieStore.get('comp_guid'),
//                    "PaymentScheduleCalcTypeValue": 1,
//                    "PaymentScheduleCalcValue": formObj.paymentScheduleValue
//                }
//            }).success(function(data) {
//                angular.element(".loader").hide();
//                $uibModalInstance.close();
//                getPaymentScheduleList(item.blockstageBlockId);
//            }).error(function() {
//                alert('Something Went wrong.');
//                angular.element(".loader").hide();
//            });
//        }
//    }
//
//    function getPaymentScheduleList(blockId) {
//        if (blockId != '') {
//            angular.element(".loader").show();
//            $http({
//                method: "POST",
//                url: "http://120.138.8.150/pratham/Proj/Blk/PaymentSchedule/ByblockId",
//                ContentType: 'application/json',
//                data: {
//                    "blockstageCompGuid": $cookieStore.get('comp_guid'),
//                    "blockstageBlockId": blockId
//                }
//            }).success(function(data) {
//                console.log(data);
//                $rootScope.paymentScheduleList = data;
//                angular.element(".loader").hide();
//            }).error(function() {
//                alert('Something Went wrong.');
//                angular.element(".loader").hide();
//            });
//        }
//    };
//
//    $scope.ok = function() {
//        $uibModalInstance.close();
//    };
//});