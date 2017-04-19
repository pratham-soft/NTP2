app.controller("unitUpdateController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.unit = item;
    $scope.ok = function() {
        $uibModalInstance.close();
    };
    $scope.updateStatus = function(formObj) {
        if (formObj.updateStatus != undefined && formObj.updateStatus != '') {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UpdtUnitDtls/ByUnitDtlsID",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Id": $scope.unit.unitObj.UnitDtls_Id,
                    "UnitDtls_Status": formObj.updateStatus,
                    "UnitDtls_user_id": formObj.leadID
                }
            }).success(function(data) {
                console.log(data);
                $uibModalInstance.close();
                if (data[0].UnitDtls_ErrorDesc == '0') {
                    $uibModalInstance.close();
                    $state.go("/ConvertCustomer", {
                        "leadID": $scope.unit.leadID,
                        "action": 'addCustomer'
                    });
                } else {
                    alert('some error in changing unit status.');
                }
            }).error(function() {
                alert('some error!!');
            });
        } else {
            alert('Please select any option first.');
        }
    };
});


app.controller("updateRoleIdAndAssignedTo", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
    $scope.firstDropValues=[];
    $scope.repotingDetails =[];
    $scope.roleIdDetails =[];
    $scope.updateTypeValues=[{name:"Role", value:1},{name:"Reporting to", value:2}];
    

        $scope.onChangeSelectOption=function(val){
        $scope.checkOneValue=val.value};
    
        $scope.selectUpdate=function(){
//      console.log(item);
//      console.log($scope.myModelFirst);
      
       if($scope.myModelFirst=="1"){   
         $scope.firstDropValues.length=0;
         $scope.getRoleIdDetails();
        // console.log("something happened in salesFunnel.");
       }
      
       if($scope.myModelFirst=="2"){
         $scope.firstDropValues.length=0;
         $scope.getReportingToDetails();
        // console.log("something happened in assigned to.");
       }
       
       
   };
   

        $scope.getRoleIdDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/RoleGet",
                ContentType: 'application/json',
                data: {
                    "role_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.roleIdDetails = data;            
                for(var i=0; i<$scope.roleIdDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.roleIdDetails[i].role_name;
                        $scope.obj.value = $scope.roleIdDetails[i].role_id;
                        $scope.firstDropValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }               
                //console.log("myitem:"+item);
                //console.log($scope.firstDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
            
        };
        

        $scope.getReportingToDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
                }
            }).success(function(data) {
                $scope.repotingDetails = data;            
                for(var i=0; i<$scope.repotingDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.repotingDetails[i].user_first_name +" " + $scope.repotingDetails[i].user_last_name;
                        $scope.obj.value = $scope.repotingDetails[i].user_id;
                        $scope.firstDropValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }          
                //console.log($scope.firstDropValues);               
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
        };
    
    
    $scope.updateAssignedTo = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/AssignedTo",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModel,
            }
        }).success(function(data) {
//            console.log("start");
//            console.log(item);
//            console.log($scope.myModel);
//            console.log("finish");
            alert("Assignment Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
    $scope.updateRoleFunction= function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/RoleId",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModel,
            }
        }).success(function(data) {
            
            alert("Role Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.action=function(){
       
        if($scope.myModelFirst=="1"){
            console.log(item);
            console.log("kuch hua 1");
            $scope.updateRoleFunction();
        }
        
        if($scope.myModelFirst=="2"){
            console.log(item);
            console.log("kuch hua 2");
            $scope.updateAssignedTo();
        }
    };

    
    $scope.ok = function() {
    $uibModalInstance.close();
    $window.location.reload();
    };


});











app.controller("updateProPage", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
      $scope.secondDropValues=[];
      $scope.myModel = "";
      $scope.firstDropValues=[{name:"Lead Staus", value:1},{name:"Sales Funnel", value:2},{name:"Assigned to", value:3}];

    
   $scope.onChangeSelectOption=function(val){
    $scope.checkOneValue=val.value};
    
    $scope.getSalesFunnelDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
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
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
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
       
       
   };
    
    
        $scope.updateLeadStatus = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/leadStatus",
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
            $state.go('/UpdateProspects');
            //$scope.lead_source_list= data;
           // $scope.getLeads();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateUserFunnel = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/SalesFunnel",
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
            $state.go('/UpdateProspects');
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateAssignedTo = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/AssignedTo",
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
            $state.go('/UpdateProspects');
           // $scope.lead_source_list= data;
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
    };
    
    $scope.ok = function() {
    $uibModalInstance.close();
         //$state.go('/UpdateProspects');
        $window.location.reload();
    };

});