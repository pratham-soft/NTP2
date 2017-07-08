app.controller("addFollowUpCtrl", function($scope,  $http, $cookieStore, myService, $state, $stateParams, $filter, myService, $compile, $uibModal, $rootScope) {
    $scope.timeslots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM', '07:30 PM', '08:30 PM'];
    $scope.addFollowUpBtn=true;
    $scope.pagetitle="Add Follow Up";
    $scope.selected = [];
    $scope.minDate = new Date().toDateString();
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
            }
};

    
    $scope.getUser = function(user_type) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls/ByUserType",
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
     //                   console.log($scope.selected);
        } else {
            $scope.selected.push(item);
      //              console.log($scope.selected);
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
            var time = formObj.reminderTime.toString();
            var  nwtime= myService.convertTime(time);
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
            var newRemDate = remDate.split("/").reverse().join("-")+'T'+nwtime;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/FollowupInsert",
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
                    "schedule_user_id_crtdby":$cookieStore.get('user_id'),
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

app.controller("editFollowUpCtrl", function($scope, myService, $http, $cookieStore, $state, $stateParams, $filter, myService, $compile, $uibModal, $rootScope) {
    $scope.timeslots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM', '07:30 PM', '08:30 PM'];
    $scope.pagetitle="Edit Follow Up";
    $scope.editFollowUpBtn=true;
    $scope.selected = [];
    $scope.minDate = new Date().toDateString();
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
            }
};

    
    $scope.getUser = function(user_type) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls/ByUserType",
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
                                           console.log($scope.selected);
                } else {
                    $scope.selected.push(item.user_id);
                                         console.log($scope.selected);
                }
            })
        } else {
            $scope.selected = [];
                      console.log($scope.selected);
        }
    };
    
    
    $scope.lstusrschd=[];
    $scope.getLeadDetail = function(userId) {
        angular.element(".loader").show();
        $scope.leadId = userId;
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            if (data.user_id != 0) {
                $scope.user={
                    userName: data.user_first_name+" "+data.user_middle_name+" "+data.user_last_name,
                    userId:data.user_id
                }
                
                $scope.lstusrschd.push($scope.user);
                angular.element(".loader").hide();
            } 
        }).error(function() {});
    };
    
    $scope.checkAll2 = function() {
        if ($scope.checkAllBox) {
            angular.forEach($scope.lstusrschd, function(item) {
              var idx = $scope.selected.indexOf(item.userId);
                if (idx >= 0) {
                    return true;
                                           console.log($scope.selected);
                } else {
                    $scope.selected.push(item.userId);
                                         console.log($scope.selected);
                }
            })
        } else {
            $scope.selected = [];
                      console.log($scope.selected);
        }
    };
    
    
    
    ($scope.getFollowUpData = function(){
        angular.element(".loader").show();
        $scope.scheduleId = $stateParams.scheduleId;
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/FollowupGetByScheduleId",
            ContentType: 'application/json',
            data: {
                "schedule_comp_guid": $cookieStore.get('comp_guid'),
                "scheduleId": $scope.scheduleId,
                "schedule_user_id_crtdby":$cookieStore.get('user_id')
            }
        }).success(function(data) {
         //   console.log(data);
            var startDate = $filter('date')(data[0].schedule_stdt, 'dd/MM/yyyy');
            var endDate = $filter('date')(data[0].schedule_enddt, 'dd/MM/yyyy');
            var reminderDate = $filter('date')(data[0].schedule_reminder, 'dd/MM/yyyy');
            var splitDate = data[0].schedule_reminder.split('T');
            var timePortion = splitDate[1];
            var splitTime = timePortion.split(':');
            var hrsPart=parseInt(splitTime[0]);
            if(hrsPart>12){
                hrsPart=hrsPart-12;
                var hrsStr=hrsPart+':';
                var reminderTime='0'+hrsStr+splitTime[1]+' PM';
            }
            else{
                var reminderTime=splitTime[0]+':'+splitTime[1]+' AM';
            }
                
                
            if (data[0].scheduleId != 0) {
                var lstusrschd=[];  // Declared to get the List of users_id and there respective usrschdId , help in update
                for(var i=0;i<data[0].lstusrschd.length;i++) 
                {
                    var usrschdObj={};
                    usrschdObj.usrschdId = data[0].lstusrschd[i].usrschdId;
                    usrschdObj.usrschd_user_id =data[0].lstusrschd[i].usrschd_user_id;
                    lstusrschd.push(usrschdObj);
                }
                                                   
                for(var i=0;i<lstusrschd.length;i++){
                    var idNo=lstusrschd[i].usrschd_user_id;
                    $scope.getLeadDetail(idNo); 
                }
                $scope.followUpForm={
                     Subject: data[0].schedule_subj,
                     followupType:data[0].schedule_Flwuptype_Id + "",
                     projectName:data[0].schedule_projId + "",
                     descText:data[0].schedule_desc,
                     startDate:startDate,
                     endDate:endDate,
                     priority:data[0].schedule_priority + "",
                     status:data[0].schedule_status + "",
                     reminderDate:reminderDate,
                     lstusrschd: lstusrschd,
                     reminderTime: reminderTime
                    
                }
                console.log(JSON.stringify($scope.followUpForm)) //Later you can remove it 
                angular.element(".loader").hide();
            } else {
                //$state.go("/Leads");
            }
        }).error(function() {});
    })();
    
    
     $scope.editFollowUp = function(formObj, selectedId, formName) {
            $scope.submit = true;
            var time = formObj.reminderTime.toString();
            var  nwtime= myService.convertTime(time);
            var newlist = [];
            for(var i=0; i<selectedId.length;i++){
               var rv = {"usrschdId":"",
                         "usrschd_user_id":""};
               rv["usrschdId"] = selectedId[i];
               rv["usrschd_user_id"] = selectedId[i];
                newlist.push(rv);
            }
          //  console.log(newlist);
            var startDate = formObj.startDate;
            var newStartDate = startDate.split("/").reverse().join("-");
            var endDate = formObj.endDate;
            var newEndDate = endDate.split("/").reverse().join("-");
            var remDate = formObj.reminderDate;
            var newRemDate = remDate.split("/").reverse().join("-") +'T'+ nwtime;
            
          if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/FollowUpUpdate",
                ContentType: 'application/json',
                data: {
                    "scheduleId":$scope.scheduleId,
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


app.controller("followUpCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, myService, $compile, $uibModal, $rootScope) {
    
    ($scope.getFollowUpData = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/FollowupGet",
            ContentType: 'application/json',
            data: {
                "schedule_comp_guid":$cookieStore.get('comp_guid'),
               "schedule_user_id_crtdby":$cookieStore.get('user_id')
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
               
               
