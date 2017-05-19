app.controller("campaignDetailCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $rootScope) {

    ($scope.getCampaignDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/CampaginGet",
            ContentType: 'application/json',
            data: {
                "campaign_compguid":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $scope.allCampaignDetails = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.editCampaign = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addNewCampaign.html',
            controller: 'editCampaignCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.allCampaignDetails[selectedItem];
                }
            }
        });
    };

    $scope.addNewCampaign = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'addNewCampaign.html',
            controller: 'addNewCampaignCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return 0;
                }
            }
        });
    };
});

app.controller("addNewCampaignCtrl", function($scope, $http, myService, $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Add New Campaign";
    $scope.addNewCampaignBtn = true;
    var blockId=0;
    
        (   $scope.getProjectList = function() {
        angular.element(".loader").show();
        $scope.unitsList="";
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
//            console.log($scope.projectList);
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
           
    })();

    $scope.getPhaseList = function(projectName) {
        $scope.unitsList="";
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.selectedToTopSettings = { selectedToTop: true, }
        $scope.blockList = {};       
        
        //$scope. = '-1';
        angular.element(".loader").show();
         myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });

    };
     
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        $scope.unitsList="";
        myService.getBlockList(phase, $cookieStore.get('comp_guid')).then(function(response) {
            $scope.blockList = response.data;
            angular.element(".loader").hide();
        });
        
        $scope.checkBlockUnits = function(formObj) {    
            blockId = formObj.block;
             };
    };

    $scope.saveNewCampaign = function(formObj, formName) {
        $scope.submit = true;
        
        if ($scope[formName].$valid) {
            console.log(formObj);
            var startDate = formObj.campaign_startdate;
            var newStartDate = startDate.split("/").reverse().join("-");
            var endDate = formObj.campaign_enddate;
            var newEndDate = endDate.split("/").reverse().join("-");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/CampaginInsert",
                ContentType: 'application/json',
                data: {                   
                    "campaign_compguid" :$cookieStore.get('comp_guid'),
                    "campaign_name" : formObj.campaign_name,
                    "campaign_blockid" : parseInt(blockId),
                    "campaign_startdate" : newStartDate,
                    "campaign_enddate" : newEndDate,
                    "campaign_status_id" : 1,
                    "campaign_vendor_id" : 2,
                    "campaign_budgetedcost" :parseInt(formObj.campaign_budgetedcost),
                    "campaign_actualcost" : parseInt(formObj.campaign_actualcost),
                    "campaign_expectedresponse" : parseInt(formObj.campaign_expectedresponse),
                    "campaign_trackleads" : parseInt(formObj.campaign_trackleads),
                    "campaign_flag" :1

                }
            }).success(function(data) {
                console.log(data);
                $state.reload();
                $uibModalInstance.close();
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    
});

app.controller("editCampaignCtrl", function($scope, $http,  $cookieStore, $state, $stateParams, $filter, $compile, $uibModalInstance, $rootScope, item) {
    $scope.pageTitle = "Edit Campaign";
    $scope.editCampaignBtn = true;
    $scope.addNewCampaignBtn = false;
    

    ($scope.getSalaryComponentDetails = function() {
        console.log(item);
//        var dateOut = new Date(item.campaign_startdate);
        var startDate = item.campaign_startdate;
        var oldStartDate = startDate.split("/").reverse().join("-");
        var endDate = item.campaign_enddate;
        var oldEndDate = endDate.split("-").reverse().join("/");
        $scope.addNewCampaign = {
            campaign_name: item.campaign_name,
            campaign_startdate: startDate,
            campaign_enddate: endDate,
            campaign_actualcost: item.campaign_actualcost+'',
            campaign_budgetedcost: item.campaign_budgetedcost + '',
            campaign_expectedresponse: item.campaign_expectedresponse + '',
            campaign_trackleads: item.campaign_trackleads + ''
            
        };
    })();

    $scope.editCampaignComponent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
//            console.log(formObj);
            var startDate = formObj.campaign_startdate;
            var newStartDate = startDate.split("/").reverse().join("-");
            var endDate = formObj.campaign_enddate;
            var newEndDate = endDate.split("/").reverse().join("-");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/CampaginUpdate",
                ContentType: 'application/json',
                data: {
                    "campaign_id":item.campaign_id,
                    "campaign_compguid" :$cookieStore.get('comp_guid'),
                    "campaign_name" : formObj.campaign_name,
                    "campaign_blockid" : parseInt(item.campaign_blockid),
                    "campaign_startdate" : newStartDate,
                    "campaign_enddate" : newEndDate,
                    "campaign_status_id" : 2,
                    "campaign_budgetedcost" :parseInt(formObj.campaign_budgetedcost),
                    "campaign_actualcost" : parseInt(formObj.campaign_actualcost),
                    "campaign_expectedresponse" : parseInt(formObj.campaign_expectedresponse),
                    "campaign_trackleads" : parseInt(formObj.campaign_trackleads),
                    "campaign_flag" :2
                }
            }).success(function(data) {
                $uibModalInstance.close();
                if(data.ErrorDesc=="0 | Record Updated"){
                    $state.reload();
                }
                else{
                    alert("Something went wrong...!")
                }
                 console.log(data);
                 angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

});