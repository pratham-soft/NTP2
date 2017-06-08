app.controller("followUpCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, $rootScope) {

    ($scope.getFollowUpData = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/FollowupGet",
            ContentType: 'application/json',
            data: {
                "schedule_comp_guid":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $scope.allFollowUpData = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    
    
});
