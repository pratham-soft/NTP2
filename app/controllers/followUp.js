app.controller("addFollowUpCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, myService, $compile, $uibModal, $rootScope) {
    $scope.selected = [];
    $scope.minDate = new Date().toString();
    $scope.followUpForm={};
    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();
    
    $scope.checkErr = function(startDate,endDate,type) {
        if(startDate != undefined && endDate != undefined){
            var curDate = new Date();
            startDate = startDate.split("/").reverse().join("-");
            endDate = endDate.split("/").reverse().join("-");  
            if((new Date(startDate) > new Date(endDate)) && (endDate!= "0001-01-01")){
            if(type==1){
               alert('End Date should be greater than start date'); 
                $scope.followUpForm.endDate=''; 
            }
             else if(type==2){
                alert('Reminder Date should be greater than Start date'); 
                $scope.followUpForm.reminderDate='';  
             } 
            }
            if(new Date(startDate) < curDate){
              alert ('Start date should not be before today.');
            }}
};

    
    $scope.getUser = function(user_type) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": user_type,
                "user_loggedin_type":$cookieStore.get('user_loggedin_type'),
                "user_id":$cookieStore.get('user_id')
            }
        }).success(function(data) {
            //console.log(data);
            if (data[0].user_ErrorDesc != '-1 | User record does not exist') {
                angular.element(".loader").hide();
                for(var i=0;i<data.length;i++){
                    data[i].fullName=data[i].user_first_name+" "+data[i].user_middle_name+" "+data[i].user_last_name;
                }
                $scope.leads = data; 
//                ctrlRead();
            } else {
                angular.element(".loader").hide();
            }
            //console.log("data:"+JSON.stringify(data));
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
   $scope.checkboxModel = {
       value1 : ""
     };
   $scope.exist = function(item) {
        return $scope.selected.indexOf(item) > -1;
    }
    $scope.toggleSelection = function(item) {
        var idx = $scope.selected.indexOf(item);
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
                        console.log($scope.selected);
        } else {
            $scope.selected.push(item);
                    console.log($scope.selected);
        }

    }
    $scope.checkAll = function() {
        "use strict";
        if ($scope.checkboxModel.value1) {
            angular.forEach($scope.leads, function(item) {
              var idx = $scope.selected.indexOf(item.user_id);
                if (idx >= 0) {
                    return true;
//                                            console.log($scope.selected);
                } else {
                    $scope.selected.push(item.user_id);
//                                          console.log($scope.selected);
                }
            })
        } else {
            $scope.selected = [];
//                      console.log($scope.selected);
        }
    };
    
    
        $scope.addFollowUp = function(formObj, selectedId, formName) {
            $scope.submit = true;
            var newlist = [];
            for(var i=0; i<selectedId.length;i++){
               var rv = {"usrschd_user_id":""};
               rv["usrschd_user_id"] = selectedId[i];
                newlist.push(rv);
            }
            console.log(newlist);
            var startDate = formObj.startDate;
            var newStartDate = startDate.split("/").reverse().join("-");
            var endDate = formObj.endDate;
            var newEndDate = endDate.split("/").reverse().join("-");
            var remDate = formObj.reminderDate;
            var newRemDate = remDate.split("/").reverse().join("-");
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/FollowupInsert",
                ContentType: 'application/json',
                data: {
                    "schedule_comp_guid" : $cookieStore.get('comp_guid'),
                    "schedule_projId" : formObj.projectName,
                    "schedule_Flwuptype_Id" : formObj.followupType,
                    "schedule_subj" : formObj.Subject,
                    "schedule_desc" : formObj.descText,
                    "schedule_stdt" : newStartDate,
                    "schedule_enddt" : newEndDate,
                    "schedule_priority" :formObj.priority,
                    "schedule_status" : formObj.status,
                    "schedule_reminder" : newRemDate,
                    "lstusrschd" : newlist

                }
            }).success(function(data) {
                console.log(data.ErrorDesc);
                $state.go("/FollowUp");
            }).error(function(data) {
                console.log(data.ErrorDesc);
            });
        }
    };
    
    
});

app.controller("followUpCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, myService, $compile, $uibModal, $rootScope) {
    
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
            for(var i=0;i<data.length;i++){
               if(data[i].schedule_Flwuptype_Id==1) {
                   data[i].schedule_Flwuptype_Id="Phone Call";
               }
                else if(data[i].schedule_Flwuptype_Id==2){
                    data[i].schedule_Flwuptype_Id="Appointment";
                }
                else if(data[i].schedule_Flwuptype_Id==3){
                    data[i].schedule_Flwuptype_Id="Others";
                }
                
                if(data[i].schedule_priority==1) {
                   data[i].schedule_priority="Low";
               }
                else if(data[i].schedule_priority==2){
                    data[i].schedule_priority="Medium";
                }
                else if(data[i].schedule_priority==3){
                    data[i].schedule_priority="High";
                }
                
                if(data[i].schedule_status==1) {
                   data[i].schedule_status="Started";
               }
                else if(data[i].schedule_status==2){
                    data[i].schedule_status="In Progress";
                }
                else if(data[i].schedule_status==3){
                    data[i].schedule_status="Completed";
                }
                else if(data[i].schedule_status==4){
                    data[i].schedule_status="Deferred";
                }
                
            }
            angular.element(".loader").hide();
            $scope.allFollowUpData = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.addNewFollowUp=function(){
        $state.go("/AddFollowUp");
    }
    
    
});
               
               
