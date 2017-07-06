app.controller("leadsGeneratedRepCtrl", function($scope, $http, $cookieStore, $state) {
    
    ($scope.getLeadList = function(lead) {
        if(lead!= undefined)
            {   
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Reports/LeadsGeneratedRpt",
            ContentType: 'application/json',
            data: {
                "user_code" :"",  
                "user_first_name" : lead.user_first_name ,
                "user_middle_name" :lead.user_middle_name,
                "user_last_name" :lead.user_last_name,
                "user_mobile_no" :lead.user_mobile_no ,
                "user_email_address" :lead.user_email_address,
                "user_address" :"",
                "registration_date" :"",
                "lead_source" :"",
                "lead_status" :"",
                "lead_campaign_name" :"",
                "lead_campaign_date" :"",
                "lead_assingedto" :"",
                "user_type" :3,
                "user_comp_guid" : $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
//            for (var i = 0; i < data.length; i++) {
//                if (data[i].Proj_ErrorDesc == "0") {
//                    if (data[i].Proj_Types.length > 1) {
//                        var types = data[i].Proj_Types.split('#');
//                        var typeValue = '';
//                        for (var j = 0; j < types.length; j++) {
//                            if (!(j == types.length - 1))
//                                typeValue = typeValue + ' , ' + getTypeNameById(types[j]);
//                            else
//                                typeValue = typeValue + ' & ' + getTypeNameById(types[j]);
//                        }
//                        data[i].Proj_Types = typeValue.substring(2, typeValue.length);
//                    } else {
//                        data[i].Proj_Types = getTypeNameById(data[i].Proj_Types);
//                    }
//                }
//            }
//            if(data.LeadList>0)
//                {
//                    
//                } 
            $scope.LeadList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
        else{
            alert("Please Select Some Seach Parameter")
        }
    });

});
app.controller("unitsBlockedReportCtrl", function($scope) {});
app.controller("custRepCtrl", function($scope) {});
app.controller("unitsAvailReportCtrl", function($scope) {});
app.controller("agentReportCtrl", function($scope) {});
app.controller("employeeReportCtrl", function($scope) {});
app.controller("prospectReportCtrl", function($scope) {});