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

app.controller("updateRoleIdAndAssignedToCtrl", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
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