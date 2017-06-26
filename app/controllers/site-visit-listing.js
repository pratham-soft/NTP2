app.controller("siteVisitListingCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $filter) {
    ($scope.getSiteVisitDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/SiteVisitGet",
            ContentType: 'application/json',
            data: {
                "sitevisit_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            $scope.siteVisitDetail = data;
            angular.element(".loader").hide();
        }).error(function() {});
    })();
});