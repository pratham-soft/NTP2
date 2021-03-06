app.controller("updateProspectsCtrl", function($scope,  $http, $cookieStore, $uibModal,$state,httpSvc) {
    $scope.searchLead = '';//set the default search/filter term
    $scope.selected=[];//stores checked items only
    $scope.salesfunnelnameValues=[];
    $scope.assignedtoValues=[];
    $scope.leads=[];
    
    $scope.sortColumn = "fullName";
            $scope.reverseSort = false;

            $scope.sortData = function (column) {
                $scope.reverseSort = ($scope.sortColumn == column) ?
                    !$scope.reverseSort : false;
                $scope.sortColumn = column;
            }

            $scope.getSortClass = function (column) {

                if ($scope.sortColumn == column) {
                    return $scope.reverseSort
                      ? 'arrow-down'
                      : 'arrow-up';
                }

                return '';
            }
    
    
    $scope.getSalesFunnelDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/SalesFunnelGet",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.SalesFunnelDetails = data;            
                for(var i=0; i<$scope.SalesFunnelDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.SalesFunnelDetails[i].salesfunnel_name;
                        $scope.obj.value = $scope.SalesFunnelDetails[i].salesfunnel_id;
                        $scope.salesfunnelnameValues.push($scope.obj)                      
                        
                    }          
                //console.log($scope.secondDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
        };
    
    
    
    $scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            $scope.EmployeesDetails = data;
            for(var i=0; i<$scope.EmployeesDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.EmployeesDetails[i].user_first_name +" " + $scope.EmployeesDetails[i].user_last_name;
                        $scope.obj.value = $scope.EmployeesDetails[i].user_id;
                        $scope.assignedtoValues.push($scope.obj)                      
                        
                    }  
            //console.log($scope.assignedtoValues);
         
          $scope.getSalesFunnelDetails();
          $scope.getLeads();
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }();
    
    
    ($scope.getLeads = function() {
       
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 7,
                "user_loggedin_type":$cookieStore.get('user_loggedin_type'),
                "user_id":$cookieStore.get('user_id')
            }
        }).success(function(data) {
            if (data[0].user_ErrorDesc !="-1 | User record does not exist")
                {
//              $scope.getEmployeesDetails();
//             $scope.getSalesFunnelDetails();
            angular.element(".loader").hide();
            for(var i=0;i<data.length;i++)
                {                   
                    if (data[i].user_lead_status_id == 1)
                        {
                           data[i].user_lead_status_id="HOT" ;
                        }
                    else if (data[i].user_lead_status_id == 2)
                        {
                              data[i].user_lead_status_id="WARM";
                        }
                    else{
                         data[i].user_lead_status_id="COLD";
                    }
                     
                    for(var j=0;j<$scope.salesfunnelnameValues.length;j++){
                    if (data[i].user_salesfunnel_id == $scope.salesfunnelnameValues[j].value)
                        {
                           data[i].user_salesfunnel_name=$scope.salesfunnelnameValues[j].name;
                        }
                    else if(data[i].user_salesfunnel_id ==0)
                        {
                           data[i].user_salesfunnel_name="Not Assigned";
                        }
                    }
                     
                    for(var j=0;j<$scope.assignedtoValues.length;j++){
                    if (data[i].user_assingedto == $scope.assignedtoValues[j].value)
                        {
                           data[i].user_assingedto_name=$scope.assignedtoValues[j].name;
                        }
                    else if(data[i].user_assingedto ==0)
                        {
                           data[i].user_assingedto_name="Not Assigned";
                        }
                    }
                  data[i].fullName=data[i].user_first_name+" "+data[i].user_middle_name+" "+data[i].user_last_name;  
                }
               //Start
            //Written to filter the Data on basis of to whom it is assinged to (Which Prospect is assinged to Which User-(Employee or Agnet))        
//                     for(var k=0;k<data.length;k++)
//                        {
//                            if((data[k].user_type !=1)) // Not Equal to 1 Means User is not Admin - Then only it will filter Data 
//                                {
//                                     if( data[k].user_assingedto == parseInt($cookieStore.get('user_id')))  
//                                        {
//                                           $scope.leads[k]= data[k];
//                                        }
//                                }
//                            else{
//                                $scope.leads = data
//                            }  
//
//                        }            
            //End
            
            $scope.leads = data; //Need to uncomment the above  test
                }
            else{
                
                alert("No Prospect Record Found");
                angular.element(".loader").hide();
            }
            
        }).error(function() {
            angular.element(".loader").hide();
        });
    })

    
    $scope.prospectDetail = function(userids) {
        var str2=""+$scope.selected;
        //console.log("the real slim:"+str2)
        var modalInstance = $uibModal.open({
            templateUrl: 'updateProPage.html',
            controller: 'updateProPageCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    userids=str2;
                    return userids;
                }
            }
        });
        
    };

    $scope.exist=function(item){
        return $scope.selected.indexOf(item)>-1;
    }
    $scope.toggleSelection=function(item){
        var idx =$scope.selected.indexOf(item);
        if(idx > -1){
            $scope.selected.splice(idx, 1);
             //console.log($scope.selected);
        }
        else{
            $scope.selected.push(item);
             //console.log($scope.selected);
        }
    }
    $scope.checkAll = function(){
        if($scope.selectAll){
            angular.forEach($scope.leads,function(item){
                    idx=$scope.selected.indexOf(item.user_id);
                    if(idx>=0){
                        return true;
                    }
                    else{
                        $scope.selected.push(item.user_id);
                         //console.log($scope.selected);
                    }
            })
        }
        else{
            $scope.selected = [];
             //console.log($scope.selected);
        }
    };
    $scope.ok = function() {
        $uibModalInstance.close();
    };
    $scope.leadDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'prospectDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
    
   

    $scope.addSiteVisit = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addSiteVisit.html',
            controller: 'prospectDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };

    $scope.viewLeadStatus = function(leadNo) {
        alert("View Lead Status: " + leadNo);
    };
    
  
    
});
app.controller("prospectDetailCtrl", function($scope, $window, $uibModalInstance, $state, $cookieStore, $http, myService, item, $filter,$uibModal, encyrptSvc,httpSvc) {
    $scope.timeslots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM', '07:30 PM', '08:30 PM'];
    $scope.leadType = ['hot', 'warm', 'cold'];
    $scope.states = ["Delhi"];
    $scope.cities = ["New Delhi"];
    $scope.lead = item;
    if ($scope.lead.userprojlist != null) {
        $scope.leadProjects = $scope.lead.userprojlist;
    }

    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    $scope.phaseListFun = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.addSiteVisit.phase = "";
        $scope.addSiteVisit.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        myService.getPhaseList($cookieStore.get('comp_guid'), projectName).then(function(response) {
            $scope.phaseList = response.data;
            angular.element(".loader").hide();
        });
    };

    $scope.blockListFun = function(phase) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.addSiteVisit.blocks = "";
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

    $scope.ok = function() {
        $uibModalInstance.close();
    };

     $scope.cancelUnit = function(unitObj) {
         var result = confirm("Are you sure you want to Cancel this in Progress Booking Unit?");
            if (result) {
                unitObj["customer"]= $scope.lead;
                unitObj['CustId']= $scope.lead.user_id
                $uibModalInstance.close();
                $scope.saveCancelUnit(unitObj);
            }
       
    };
     $scope.saveCancelUnit = function(unitObj) {
         
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Cust/Cancelunit",
            ContentType: 'application/json',
            data: {
                "UnitCancel_Cust_User_Id"  : unitObj.CustId,
                "UnitCancel_UnitDtls_Id"  : unitObj.UnitDtls_Id,
                "UnitCancel_PenaltyVal"  : 1,
                "UnitCancel_Paymentmade" :$scope.amountPaid,
                "UnitCancel_RefundAmt":$scope.remarks,
                "UnitCancel_UnitTotcost":$scope.totalAmount,
                "UnitCancel_Penalty": $scope.paneltyAmount,
                "UnitCancel_Feedback":  $scope.remarks,
                "UnitCancel_Flag"  : 3 ,
                "UnitCancel_Confirmed"  : 2  ,
                "UnitCancel_blockid" :unitObj.Blocks_Id,
                "comp_gui_id":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.cancelData=data;
            angular.element(".loader").hide();
           // console.log($scope.cancelData);
            //$state.go('/Customers');
            $uibModalInstance.close();
            $window.location.reload();
            
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
   
    $scope.deleteRow = function(rowId) {
        angular.element("tr#" + rowId).remove();
    };

    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID":  encyrptSvc.encyrpt(leadId)
        });
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Plots';
                break;
            case 3:
                typeName = 'Villaments';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }

    $scope.getPreviousSiteVisits = (function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/UserSiteVisitGet",
            ContentType: 'application/json',
            data: {
                "sitevisit_userid": $scope.lead.user_id,
                "sitevisit_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            for(var i=0;i<data.length ;i++)
                {
                    if(data[i].sitevisit_walkin==2)
                       {
                       data[i].sitevisit_walkin="No"
                       }
                    else
                        {
                             data[i].sitevisit_walkin="Yes"
                        }
                     if(data[i].sitevisit_done==2)
                       {
                       data[i].sitevisit_done="Pending"
                       }
                    else
                        {
                             data[i].sitevisit_done="Done"
                        }
                }
            $scope.siteVisitData = data;
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something Went Wrong...');
            angular.element(".loader").hide();
        });
    })();

    $scope.addSiteVisit = function(formObj, formName) {
        $scope.submit = true;
       var time = formObj.time.toString();
       var  newtime= time.replace( ' AM','');
       var  nwtime= newtime.replace( ' PM','');
        formObj.datetime=$filter('date')(new Date(formObj.datetime),'yyyy-MM-dd'+' '+ nwtime);
 
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/SiteVisitInsert",
                ContentType: 'application/json',
                data: {
                    "sitevisit_userid": $scope.lead.user_id,
                    "sitevisit_compguid": $cookieStore.get('comp_guid'),
                    "sitevisit_projectid": formObj.projectName,
                    "sitevisit_phaseid": formObj.phase,
                    "sitevisit_blockid": formObj.blocks,
                    "sitevisit_walkin": formObj.walkIn,
                    "sitevisit_pickupdatetime": formObj.datetime,
                    "sitevisit_contactperson_name": formObj.personName,
                    "sitevisit_contactperson_mobile": formObj.personMobile,
                    "sitevisit_pickupaddress": formObj.personAddress,
                    "sitevisit_done": 2
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                alert('Site Visit Schedule Sucessfully.');
                console.log(data);
                $uibModalInstance.close();
            }).error(function() {
                alert('Something Went Wrong...');
                angular.element(".loader").hide();
            });
        }
    };
    
     var leadFullName=$scope.lead.user_first_name+' '+$scope.lead.user_middle_name+' '+$scope.lead.user_last_name;
	
	$scope.bookUnit = function(unitObj,prospectId){
         var objBookingCheck={};
        objBookingCheck.UnitDtls_Id=unitObj.UnitDtls_Id;
        objBookingCheck.UnitDtls_comp_guid=$cookieStore.get('comp_guid');
          httpSvc.BookingCheck(objBookingCheck).then(function(response) {
            var data = response.data;
            if((data.UnitDtls_Status == 7))
                { 
                 if ((data.UnitDtls_Cust_UserId == prospectId))
                        {
                           $uibModalInstance.close();
                           $cookieStore.put("leadName",leadFullName)
                           $cookieStore.put("unitObj",unitObj);
                           $cookieStore.put("prospectId",prospectId);
                           $state.go('/BookUnit-Step1');   
                        }
                    else{
                         alert("Booking is under progress for this Unit by another Customer. ");
                    }
                  
                 }
            else{
                  $uibModalInstance.close();
                   $cookieStore.put("leadName",leadFullName)
                   $cookieStore.put("unitObj",unitObj);
                   $cookieStore.put("prospectId",prospectId);
                   $state.go('/BookUnit-Step1');  
                }
              });
		
	}
       $scope.viewUnitCostSheet = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }
       $scope.UniqueCostSheet = function(unitObj,prospectId) {
        $cookieStore.put("leadName",leadFullName)
		$cookieStore.put("unitObj",unitObj);
		$cookieStore.put("prospectId",prospectId);
        var modalInstance = $uibModal.open({
            templateUrl: 'quoteCostSheet.html',
            controller: 'quoteCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }
});

app.controller("addProspectCtrl", function($scope,  $http, $state, $cookieStore, myService,encyrptSvc) {
    $scope.pageTitle = "Add Prospect";
    $scope.addLeadBtn = true;
    ($scope.getLeadSource = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/LeadSourceGet",
            ContentType: 'application/json',
            data: {
                "lead_source_compguid":"d0cb84c5-6b52-4dff-beb5-50b2f4af5398"
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    ($scope.getCampaignDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/CampaginGet",
            ContentType: 'application/json',
            data: {
                "campaign_compguid":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.campaign_list = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    ($scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
           $scope.employees_list = data;        
           angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
     $scope.validAge= function(age){
         var result="";
         result= myService.checkAge(age) ;
         if(result==false){
        $scope.addLead.dob="";
   }  
    };
    
    
//    var age=0;
//    
//    $scope. getAge=function(dateString) {
//    var date = dateString;
//    var datearray = date.split("/");
//    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
//    var today = new Date();
//    var birthDate = new Date(newdate);
//     var year=   birthDate.getFullYear();
//    var age = today.getFullYear() - birthDate.getFullYear();
//    var m = today.getMonth() - birthDate.getMonth();
//    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//        age--;
//    }
//    if(age<18 || age==NaN){
//        alert("Age should be greater than 18 years...!!");
//        $scope.addLead.dob="";
//    }
//};
    
    
    $scope.addLead = function(formObj, formName) {
        $scope.submit = true;
        var date = formObj.dob;
        var newdate = date.split("/").reverse().join("-");
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_type": 7,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": newdate,
                    "user_gender": parseInt(formObj.gender),
                    "user_code": formObj.leadCode,
                    "user_lead_status_id": parseInt(formObj.leadStage),
                    "user_createdby": $cookieStore.get('user_id'),
                    "user_campaign_id": parseInt(formObj.campaign),
                    "user_assingedto": parseInt(formObj.assingedto)
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/ProjectDetails", {
                        "leadID":  encyrptSvc.encyrpt(data.user_id)
                    });
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
            }).error(function() {});
        }
    };
});

app.controller("editProspectCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Prospect";
    $scope.editLeadBtn = true;
    ($scope.getLeadDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        
         ($scope.getLeadSource = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/LeadSourceGet",
            ContentType: 'application/json',
            data: {
                "lead_source_compguid": "d0cb84c5-6b52-4dff-beb5-50b2f4af5398"
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.lead_source_list = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
        
    ($scope.getCampaignDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/CampaginGet",
            ContentType: 'application/json',
            data: {
                "campaign_compguid":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.campaign_list = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
        
        ($scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
           $scope.employees_list = data;        
           angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
        
        
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            var state = data.user_state;
            var city = data.user_city;
            var dob = $filter('date')(data.user_dob, 'dd/MM/yyyy');

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }
            if (dob == "01/01/0001") {
                dob = "";
            }
            if (data.user_id != 0) {
                $scope.addLead = {
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    mobileNumber:parseInt(data.user_mobile_no),
                    emailId: data.user_email_address,
                    dob: dob,
                    gender: data.user_gender,
                    country: data.user_country,
                    state: state + "",
                    city: city + "",
                    address: data.user_address,
                    zip: data.user_zipcode,
                    leadCode: data.user_code,
                    officeNumber: data.user_office_no,
                    leadStage: data.user_lead_status_id.toString(),
                    leadSource: data.user_lead_source_id + '',
                    campaign: data.user_campaign_id + '',
                    assingedto:data.user_assingedto + ''
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Prospects");
            }
        }).error(function() {});
    })();

    $scope.updateLead = function(formObj, formName) {
        $scope.submit = true;
        var date = formObj.dob;
        var newdate = date.split("/").reverse().join("-");
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/UpdateUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_id": $scope.leadId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": newdate,
                    "user_gender": parseInt(formObj.gender),
                    "user_code": formObj.leadCode,
                    "user_lead_status_id": parseInt(formObj.leadStage),
                    "user_lead_source_id": parseInt(formObj.leadSource),
                    "user_campaign_id": parseInt(formObj.campaign),
                    "user_assingedto": parseInt(formObj.assingedto)
                }   
            }).success(function(data) {
                if (data.user_ErrorDesc == "0") {
                    $state.go("/Prospects");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});
app.controller("prospectsUnitAllocationCtrl", function($scope,  $http, $cookieStore, $state, $uibModal) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];
    ($scope.getProjectList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.bookUnit = function(unitObj,prospectId,prospectName){
        unitObj.Proj_Name=$scope.projectDetails.projectName;
        unitObj.Blocks_Name =$scope.projectDetails.phase;
        unitObj.Phase_Name =$scope.projectDetails.blocks;
         $cookieStore.put("leadName",prospectName);
		$cookieStore.put("unitObj",unitObj);
		$cookieStore.put("prospectId",prospectId);
		$state.go('/BookUnit-Step1');
	};
    

    $scope.getPhaseList = function(projectName) {
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/AllocByUserType",
                ContentType: 'application/json',
                data: {
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "Projusrtyp": 7,
                    "Phase_Id": obj.phase,
                    "Blocks_Id": obj.blocks
                }
            }).success(function(data) {
                console.log(data);
                $scope.unitAllocationData = [];
                for (h = 0; h < data.length; h++) {
                    if (data[h].userprojlist != null) {
                        for (i = 0; i < data[h].userprojlist.length; i++) {
                            if (data[h].userprojlist[i].ProjDtl_Status != 7) {
                                $scope.unitAllocationObj = {};

                                $scope.unitAllocationObj.name = data[h].user_first_name + ' ' + data[h].user_middle_name + ' ' + data[h].user_last_name;
                                $scope.unitAllocationObj.email = data[h].user_email_address;
                                $scope.unitAllocationObj.mobile = data[h].user_mobile_no;
                                /*$scope.unitAllocationObj.projName = data[h].userprojlist[i].Proj_Name;
                                $scope.unitAllocationObj.phaseName = data[h].userprojlist[i].Phase_Name;
                                $scope.unitAllocationObj.phaseType = 'Temp Phase Type';
                                $scope.unitAllocationObj.blockName = data[h].userprojlist[i].Blocks_Name;*/
                                $scope.unitAllocationObj.unitObj = data[h].userprojlist[i];
                                $scope.unitAllocationObj.leadID = data[h].user_id;

                                $scope.unitAllocationData.push($scope.unitAllocationObj);
                            }
                        }
                    }
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    $scope.viewUnitCostSheet = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }
      $scope.UniqueCostSheet = function(unitObj,prospectId) {
        $cookieStore.put("leadName",leadFullName)
		$cookieStore.put("unitObj",unitObj);
		$cookieStore.put("prospectId",prospectId);
        var modalInstance = $uibModal.open({
            templateUrl: 'quoteCostSheet.html',
            controller: 'quoteCostSheetCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }

    $scope.updateUnitAllocationStatus = function(unitData) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitStatusUpdate.html',
            controller: 'unitUpdateController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitData;
                }
            }
        });
    };
});
        
               
app.controller("updateProPageCtrl", function($scope,  $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
      $scope.secondDropValues=[];
      $scope.myModel = "";
      $scope.firstDropValues=[{name:"Lead Staus", value:1},{name:"Sales Funnel", value:2},{name:"Assigned to", value:3},{name:"Campaign", value:4}];

    
   $scope.onChangeSelectOption=function(val){
    $scope.checkOneValue=val.value};
    
    $scope.getSalesFunnelDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/SalesFunnelGet",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.SalesFunnelDetails = data;            
                for(var i=0; i<$scope.SalesFunnelDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.SalesFunnelDetails[i].salesfunnel_name;
                        $scope.obj.value = $scope.SalesFunnelDetails[i].salesfunnel_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    }          
               // console.log($scope.secondDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
              //  console.log("something went wrong.");
            }); 
        };
    
    $scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            $scope.EmployeesDetails = data;
            for(var i=0; i<$scope.EmployeesDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.EmployeesDetails[i].user_first_name +" " + $scope.EmployeesDetails[i].user_last_name;
                        $scope.obj.value = $scope.EmployeesDetails[i].user_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    }  
           // console.log($scope.secondDropValues);
            angular.element(".loader").hide();
            $scope.employees = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.getCampaignDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/CampaginGet",
            ContentType: 'application/json',
            data: {
                "campaign_compguid":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.campaign_list = data;
             for(var i=0; i<$scope.campaign_list.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.campaign_list[i].campaign_name;
                        $scope.obj.value = $scope.campaign_list[i].campaign_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    } 
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
   $scope.action=function(){
     //  console.log(item);
      // console.log($scope.myModel);
       if($scope.myModel=="1"){
         $scope.secondDropValues.length=0;
        // console.log("something happened in Leads Status.");
         $scope.secondDropValues=[{name:"Hot", value:1},{name:"Warm", value:2},{name:"Cold", value:3}];
       }
      
       if($scope.myModel=="2"){   
         $scope.secondDropValues.length=0;
         $scope.getSalesFunnelDetails();
        // console.log("something happened in salesFunnel.");
       }
      
       if($scope.myModel=="3"){
         $scope.secondDropValues.length=0;
         $scope.getEmployeesDetails();
        // console.log("something happened in assigned to.");
       }
       
         if($scope.myModel=="4"){
         $scope.secondDropValues.length=0;
        $scope.getCampaignDetail();
        // console.log("something happened in assigned to.");
       }
       
       
   };
    
    
        $scope.updateLeadStatus = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserUpdt/leadStatus",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Lead Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
        }).error(function() {
            angular.element(".loader").hide();
        });
     };
    
    
        $scope.updateUserFunnel = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserUpdt/SalesFunnel",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Sales Funnel Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateAssignedTo = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserUpdt/AssignedTo",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Assignment Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
      $scope.updateCampaign = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserUpdt/Campaign",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Campaign Updated Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();      
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.actionSecond=function(){
       
        if($scope.myModel=="1"){
            $scope.updateLeadStatus();
        }
        
        if($scope.myModel=="2"){
            $scope.updateUserFunnel();
        }
        
        if($scope.myModel=="3"){
            $scope.updateAssignedTo();
        } 
        
         if($scope.myModel=="4"){
         $scope.updateCampaign();
        } 
    };
    
    $scope.ok = function() {
    $uibModalInstance.close();    
        $window.location.reload();
    };

});