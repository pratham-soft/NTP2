app.controller("addEmployeeCtrl", function($scope,  $http, $state, $cookieStore, $compile, $stateParams, myService, $window) {
    $scope.pageTitle = "Add Employee";
    $scope.addEmployeeBtn = true;
    
    ($scope.getRolesList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RoleGet",
            ContentType: 'application/json',
            data: {
                "role_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.rolesList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getParentDepartmentDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/Department",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.parentDepartmentList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getDesignationDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/Designations",
            ContentType: 'application/json',
            data: {
                "designation_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.designationList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    
    $scope.validAge= function(age){
         var result="";
         result= myService.checkAge(age) ;
         if(result==false){
        if($scope.addEmployee.employeeSpouseDob==age){
            $scope.addEmployee.employeeSpouseDob="";
        }
        else if($scope.addEmployee.employeeDob==age){
            $scope.addEmployee.employeeDob="";
        }
        
    }
};
    
    
    $scope.addEmployee = function(formObj, formName) {
        $scope.submit = true;
        var dobuser = formObj.employeeDob;
        var newdobuser = dobuser.split("/").reverse().join("-");
        var dojuser = formObj.employeeDoj;
        var newdoj = dojuser.split("/").reverse().join("-");
        
        var dobspouse = formObj.employeeSpouseDob;
        var newdobspouse = "";
        if(dobspouse!=undefined){
         newdobspouse = dobspouse.split("/").reverse().join("-");   
        }
        
        var dobchild1 = formObj.employeeChild1Dob;
        var newdobchild1 = "";
        if(dobchild1!=undefined){
         newdobchild1 = dobchild1.split("/").reverse().join("-");   
        }
        
        var dobchild2 = formObj.employeeChild2Dob;
        var newdobchild2 = "";
        if(dobchild2!=undefined){
         newdobchild2 = dobchild2.split("/").reverse().join("-");   
        }
        
        var dobchild3 = formObj.employeeChild3Dob;
        var newdobchild3 = "";
        if(dobchild3!=undefined){
         newdobchild3 = dobchild3.split("/").reverse().join("-");   
        }
        
        var dobchild4 = formObj.employeeChild4Dob;
        var newdobchild4 = "";
        if(dobchild4!=undefined){
         newdobchild4 = dobchild4.split("/").reverse().join("-");   
        }
        
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_createdby": $cookieStore.get('user_id'),
                    "user_type": 2,
                    "user_first_name": formObj.employeeFirstName,
                    "user_middle_name": formObj.employeeMiddleName,
                    "user_last_name": formObj.employeeLastName,
                    "user_mobile_no": formObj.employeeMobileNumber,
                    "user_address": formObj.employeeAddress,
                    "user_dob": newdobuser,
                    "user_doj": newdoj,
                    "user_email_address": formObj.employeeEmail,
                    "user_password": formObj.employeePassword,
                    "Emp_pan": formObj.employeePanNumber,
                    "Emp_aadhar": formObj.employeeAadharNumber,
                    "Emp_ctc": formObj.employeeCtc,
                    "Emp_netSallary": formObj.employeeNetSalary,
                    "Emp_BankName": formObj.employeeBankName,
                    "Emp_BankBranch": formObj.employeeBankBranch,
                    "Emp_bankaccno": formObj.employeeBankAccountNo,
                    "Emp_bankadd": formObj.employeeBankAddress,
                    "Emp_bankifsccode": formObj.employeeBankIfscCode,
                    "Emp_alt_contactno": formObj.employeeAlternateNumber1,
                    "Emp_off_email": formObj.employeeAlternateEmail,
                    "Emp_Hobbies": formObj.employeeHobbies,
                    "Emp_Reference1Address": formObj.employeeReference1Address,
                    "Emp_Reference1ContactNumber": formObj.employeeReference1ContactNumber,
                    "Emp_Reference1EmailID": formObj.employeeReference1Email,
                    "Emp_Reference1Name": formObj.employeeReference1Name,
                    "Emp_Reference2Address": formObj.employeeReference2Address,
                    "Emp_Reference2ContactNumber": formObj.employeeReference2ContactNumber,
                    "Emp_Reference2EmailID": formObj.employeeReference2Email,
                    "Emp_Reference2Name": formObj.employeeReference2Name,
                    "Emp_SourceofRecruitment": formObj.employeeSourceOfRecruit,
                    "Emp_spouse_aadhar": formObj.employeeSpouseAadhar,
                    "Emp_spouse_dob": newdobspouse,
                    "Emp_spouse_nm": formObj.employeeSpouseName,
                    "Emp_spouse_pan": formObj.employeeSpousePan,
                    "Emp_child1_dob": newdobchild1,
                    "Emp_child1_nm": formObj.employeeChild1Name,
                    "Emp_child2_dob": newdobchild2,
                    "Emp_child2_nm": formObj.employeeChild2Name,
                    "Emp_child3_dob": newdobchild3,
                    "Emp_child3_nm": formObj.employeeChild3Name,
                    "Emp_child4_dob": newdobchild4,
                    "Emp_child4_nm": formObj.employeeChild4Name,
                    "Emp_noof_childrn": formObj.employeeChildrenNo,
                    "user_dept_id": formObj.employeeDepartment,
                    "user_designation_id": formObj.employeeDesignation,
                    "user_role_id": formObj.employeeRole,
                    "user_code": formObj.employeeCode
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/EmployeeDetails");
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };

    $scope.appendFields = function(noOfChild) {
        angular.element("#children").html('');
        for (i = 1; i <= noOfChild; i++) {
            var childDiv = '<div class="field"><label ng-show="addEmployee.employeeChild' + i + 'Name" class="show-hide">Child ' + i + ' Name*</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="addEmployee.employeeChild' + i + 'Name" /></div><div class="field has-feedback"><label ng-show="addEmployee.employeeChild' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B. (DD/MM/YYYY)</label><datepicker date-format="dd/MM/yyyy"><input type="text" placeholder="Child ' + i + ' D.O.B. (DD/MM/YYYY)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="addEmployee.employeeChild' + i + 'Dob"/><i class="form-control-feedback glyphicon glyphicon-calendar"></i></datepicker></div><br>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);
        }
    };
});

app.controller("editEmployeeCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal) {
    $scope.pageTitle = "Edit Employee";
    $scope.editEmployeeBtn = true;
    $scope.employeeId = $stateParams.employeeId;

    ($scope.getRolesList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RoleGet",
            ContentType: 'application/json',
            data: {
                "role_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.rolesList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getEmployeeDetail = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/EmployeeUserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.employeeId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);

            var dateArray = [];
            dateArray.push((data.user_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.user_dob, 'dd-MM-yyyy'));
            dateArray.push((data.user_doj == '0001-01-01T00:00:00') ? '' : $filter('date')(data.user_doj, 'dd-MM-yyyy'));
            dateArray.push((data.Emp_spouse_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_spouse_dob, 'dd-MM-yyyy'));
            dateArray.push((data.Emp_child1_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child1_dob, 'dd-MM-yyyy'));
            dateArray.push((data.Emp_child2_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child2_dob, 'dd-MM-yyyy'));
            dateArray.push((data.Emp_child3_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child3_dob, 'dd-MM-yyyy'));
            dateArray.push((data.Emp_child4_dob == '0001-01-01T00:00:00') ? '' : $filter('date')(data.Emp_child4_dob, 'dd-MM-yyyy'));

            $scope.addEmployee = {
                employeeFirstName: data.user_first_name,
                employeeMiddleName: data.user_middle_name,
                employeeLastName: data.user_last_name,
                employeeMobileNumber: parseInt(data.user_mobile_no),
                employeeAddress: data.user_address,
                employeeDob: dateArray[0],
                employeeDoj: dateArray[1],
                employeeEmail: data.user_email_address,
                employeePassword: data.user_password,
                employeeAadharNumber: parseInt(data.Emp_aadhar),
                employeePanNumber: data.Emp_pan,
                employeeCtc: data.Emp_ctc,
                employeeNetSalary: data.Emp_netSallary,
                employeeBankName: data.Emp_BankName,
                employeeBankBranch: data.Emp_BankBranch,
                employeeBankAccountNo: data.Emp_bankaccno,
                employeeBankAddress: data.Emp_bankadd,
                employeeBankIfscCode: data.Emp_bankifsccode,
                employeeAlternateNumber1: parseInt(data.Emp_alt_contactno),
                employeeAlternateEmail: data.Emp_off_email,
                employeeHobbies: data.Emp_Hobbies,
                employeeReference1Address: data.Emp_Reference1Address,
                employeeReference1ContactNumber: data.Emp_Reference1ContactNumber,
                employeeReference1Email: data.Emp_Reference1EmailID,
                employeeReference1Name: data.Emp_Reference1Name,
                employeeReference2Address: data.Emp_Reference2Address,
                employeeReference2ContactNumber: data.Emp_Reference2ContactNumber,
                employeeReference2Email: data.Emp_Reference2EmailID,
                employeeReference2Name: data.Emp_Reference2Name,
                employeeSourceOfRecruit: data.Emp_SourceofRecruitment,
                employeeSpouseAadhar: data.Emp_spouse_aadhar,
                employeeSpouseDob: dateArray[2],
                employeeSpouseName: data.Emp_spouse_nm,
                employeeSpousePan: data.Emp_spouse_pan,
                employeeChild1Dob: dateArray[3],
                employeeChild1Name: data.Emp_child1_nm,
                employeeChild2Dob: dateArray[4],
                employeeChild2Name: data.Emp_child2_nm,
                employeeChild3Dob: dateArray[5],
                employeeChild3Name: data.Emp_child3_nm,
                employeeChild4Dob: dateArray[6],
                employeeChild4Name: data.Emp_child4_nm,
                employeeChildrenNo: data.Emp_noof_childrn,
                employeeDepartment: data.user_dept_id + "",
                employeeDesignation: data.user_designation_id + "",
                employeeRole: data.user_role_id + '',
                employeeCode: data.user_code
            };
            appendFields(data.Emp_noof_childrn);
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getParentDepartmentDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/Department",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.parentDepartmentList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    ($scope.getDesignationDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/Designations",
            ContentType: 'application/json',
            data: {
                "designation_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.designationList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.editEmployee = function(formObj, formName) {
        $scope.submit = true;
        
        var dobuser = formObj.employeeDob;
        var newdobuser = dobuser.split("/").reverse().join("-");
        var dojuser = formObj.employeeDoj;
        var newdoj = dojuser.split("/").reverse().join("-");
        
        var dobspouse = formObj.employeeSpouseDob;
        var newdobspouse = "";
        if(dobspouse!=undefined){
         newdobspouse = dobspouse.split("/").reverse().join("-");   
        }
        
        var dobchild1 = formObj.employeeChild1Dob;
        var newdobchild1 = "";
        if(dobchild1!=undefined){
         newdobchild1 = dobchild1.split("/").reverse().join("-");   
        }
        
        var dobchild2 = formObj.employeeChild2Dob;
        var newdobchild2 = "";
        if(dobchild2!=undefined){
         newdobchild2 = dobchild2.split("/").reverse().join("-");   
        }
        
        var dobchild3 = formObj.employeeChild3Dob;
        var newdobchild3 = "";
        if(dobchild3!=undefined){
         newdobchild3 = dobchild3.split("/").reverse().join("-");   
        }
        
        var dobchild4 = formObj.employeeChild4Dob;
        var newdobchild4 = "";
        if(dobchild4!=undefined){
         newdobchild4 = dobchild4.split("/").reverse().join("-");   
        }
        
        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/UpdateUserEmployee",
                ContentType: 'application/json',
                data: {
                    "Emp_comp_guid": $cookieStore.get('comp_guid'),
                    "Emp_User_Id": $scope.employeeId,
                    "user_first_name": formObj.employeeFirstName,
                    "user_middle_name": formObj.employeeMiddleName,
                    "user_last_name": formObj.employeeLastName,
                    "user_mobile_no": formObj.employeeMobileNumber,
                    "user_address": formObj.employeeAddress,
                    "user_dob": newdobuser,
                    "user_doj": newdoj,
                    "user_email_address": formObj.employeeEmail,
                    "user_password": formObj.user_password,
                    "Emp_pan": formObj.employeePanNumber,
                    "Emp_aadhar": formObj.employeeAadharNumber,
                    "Emp_ctc": formObj.employeeCtc,
                    "Emp_netSallary": formObj.employeeNetSalary,
                    "Emp_BankName": formObj.employeeBankName,
                    "Emp_BankBranch": formObj.employeeBankBranch,
                    "Emp_bankaccno": formObj.employeeBankAccountNo,
                    "Emp_bankadd": formObj.employeeBankAddress,
                    "Emp_bankifsccode": formObj.employeeBankIfscCode,
                    "Emp_alt_contactno": formObj.employeeAlternateNumber1,
                    "Emp_off_email": formObj.employeeAlternateEmail,
                    "Emp_Hobbies": formObj.employeeHobbies,
                    "Emp_Reference1Address": formObj.employeeReference1Address,
                    "Emp_Reference1ContactNumber": formObj.employeeReference1ContactNumber,
                    "Emp_Reference1EmailID": formObj.employeeReference1Email,
                    "Emp_Reference1Name": formObj.employeeReference1Name,
                    "Emp_Reference2Address": formObj.employeeReference2Address,
                    "Emp_Reference2ContactNumber": formObj.employeeReference2ContactNumber,
                    "Emp_Reference2EmailID": formObj.employeeReference2Email,
                    "Emp_Reference2Name": formObj.employeeReference2Name,
                    "Emp_SourceofRecruitment": formObj.employeeSourceOfRecruit,
                    "Emp_spouse_aadhar": formObj.employeeSpouseAadhar,
                    "Emp_spouse_dob": newdobspouse,
                    "Emp_spouse_nm": formObj.employeeSpouseName,
                    "Emp_spouse_pan": formObj.employeeSpousePan,
                    "Emp_child1_dob": newdobchild1,
                    "Emp_child1_nm": formObj.employeeChild1Name,
                    "Emp_child2_dob": newdobchild2,
                    "Emp_child2_nm": formObj.employeeChild2Name,
                    "Emp_child3_dob": newdobchild3,
                    "Emp_child3_nm": formObj.employeeChild3Name,
                    "Emp_child4_dob": newdobchild4,
                    "Emp_child4_nm": formObj.employeeChild4Name,
                    "Emp_noof_childrn": formObj.employeeChildrenNo,
                    "user_dept_id": formObj.employeeDepartment,
                    "user_designation_id": formObj.employeeDesignation,
                    "user_role_id": formObj.employeeRole,
                    "user_code": formObj.employeeCode
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/EmployeeDetails");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
        else{
            console.log($scope[formName].$error)
        }
    };

    $scope.appendFields = function(noOfChild) {
        angular.element("#children").html('');
        for (i = 1; i <= noOfChild; i++) {
            var childDiv = '<div class="field"><label ng-show="addEmployee.employeeChild' + i + 'Name" class="show-hide">Child ' + i + ' Name*</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="addEmployee.employeeChild' + i + 'Name" /></div><div class="field"><label ng-show="addEmployee.employeeChild' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B. (DD/MM/YYYY) *</label><datepicker date-format="dd/MM/yyyy"><input type="text" placeholder="Child ' + i + ' D.O.B. (DD//MM/YYYY)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="addEmployee.employeeChild' + i + 'Dob"/><i class="form-control-feedback glyphicon glyphicon-calendar"></i></datepicker></div><br>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);
        }
    };

    function appendFields(noOfChild) {
        angular.element("#children").html('');
        for (i = 1; i <= noOfChild; i++) {
            var childDiv = '<div class="field"><label ng-show="addEmployee.employeeChild' + i + 'Name" class="show-hide">Child ' + i + ' Name*</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="addEmployee.employeeChild' + i + 'Name" /></div><div class="field"><label ng-show="addEmployee.employeeChild' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B. (DD/MM/YYYY) *</label><datepicker date-format="dd/MM/yyyy"><input type="text" placeholder="Child ' + i + ' D.O.B. (DD/MM/YYYY)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="addEmployee.employeeChild' + i + 'Dob"/><i class="form-control-feedback glyphicon glyphicon-calendar"></i></datepicker></div><br>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);
        }
    };

    $scope.ctcDetail = function(addEmployee) {
        var modalInstance = $uibModal.open({
            templateUrl: 'ctcDetail.html',
            controller: 'ctcDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return addEmployee;
                }
            }
        });
    };
});
app.controller("employeeDetailsCtrl", function($scope,  $http, $cookieStore, $uibModal, $state) {
    $scope.selected=[];
    $scope.roleIdValues=[];
    $scope.roleIdDetails=[];
    $scope.assigntoNamesDetails=[];
    $scope.assigntoNameValue=[];
    $scope.employees=[];
    $scope.files = []; //Stores Import files
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
    
    
        // GET THE FILE INFORMATION.
        $scope.getFileDetails = function (e) {

            
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
        };

        // NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            //FILL FormData WITH FILE DETAILS.
            if($scope.files.length>0)
                {
                    var data = new FormData();

                    for (var i in $scope.files) {
                        data.append("uploadedFile", $scope.files[i]);
                    }

                    // ADD LISTENERS.
                    var objXhr = new XMLHttpRequest();
                    objXhr.addEventListener("progress", updateProgress, false);
                    objXhr.addEventListener("load", transferComplete, false);

                    // SEND FILE DETAILS TO THE API.
                    objXhr.open("POST", appConfig.baseUrl+"/Test/fileupload");


                    objXhr.send(data);
                }
            else{
                alert("Please Select the File !")
            }
        }

        // UPDATE PROGRESS BAR.
        function updateProgress(e) {
            if (e.lengthComputable) {
                document.getElementById('pro').setAttribute('value', e.loaded);
                document.getElementById('pro').setAttribute('max', e.total);
            }
        }

        // CONFIRMATION.
        function transferComplete(e) {
            alert("Files uploaded successfully!");
            $scope.importFiles();
        }
    
    

    $scope.getAssigntoNamesDetails = function() {
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
             $scope.assigntoNameValue = data;            
                for(var i=0; i<$scope.assigntoNameValue.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.assigntoNameValue[i].user_first_name +" " + $scope.assigntoNameValue[i].user_middle_name+" "+$scope.assigntoNameValue[i].user_last_name;
                        $scope.obj.value = $scope.assigntoNameValue[i].user_id;
                        $scope.assigntoNamesDetails.push($scope.obj)   
//                        console.log("yo");    
                    }  
            //console.log($scope.assigntoNamesDetails);
            angular.element(".loader").hide();          
            $scope.employees = data;
            $scope.getRoleIdDetails();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getAssigntoNamesDetails();
    $scope.getRoleIdDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/RoleGet",
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
                        $scope.roleIdValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }          
//                console.log($scope.roleIdValues);              
                angular.element(".loader").hide();
                $scope.getEmployeesDetails();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
        };
    ($scope.getParentDepartmentDetails = function() {
        
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/Department",
            ContentType: 'application/json',
            data: {
                "dept_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.parentDepartmentList = [];
            for (var i = 0; i < data.length; i++) {
                $scope.parentDepartmentList[data[i].dept_id] = data[i].dept_name;
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    

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
            angular.forEach($scope.employees,function(item){
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

    ($scope.getDesignationDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/Designations",
            ContentType: 'application/json',
            data: {
                "designation_compguid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            angular.element(".loader").hide();
            $scope.designationList = [];
            for (var i = 0; i < data.length; i++) {
                $scope.designationList[data[i].designation_id] = data[i].designation;
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

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
             for(var i=0;i<data.length;i++)
                {     
                    for(var j=0;j<$scope.roleIdValues.length;j++){
                    if (data[i].user_role_id == $scope.roleIdValues[j].value)
                        {
                           data[i].user_role_name=$scope.roleIdValues[j].name;
                        }
                     if (data[i].user_role_id == "0")
                        {
                           data[i].user_role_name="Not Assigned";
                        }
                    }
           
                    for(var j=0;j<$scope.assigntoNamesDetails.length;j++){
                    if (data[i].user_assingedto == $scope.assigntoNamesDetails[j].value)
                        {
                           data[i].user_assingedto_name=$scope.assigntoNamesDetails[j].name;
                        }
                     if (data[i].user_assingedto == "0")
                        {
                           data[i].user_assingedto_name="Not Assigned";
                        }
                    }
                    
                    data[i].fullName=data[i].user_first_name+" "+data[i].user_middle_name+" "+data[i].user_last_name;
                }
            
            angular.element(".loader").hide();          
            $scope.employees = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    

    
    $scope.roleUpdate = function(userids) {
        var str2=""+$scope.selected;
        //console.log("the real slim:"+str2);
        var modalInstance = $uibModal.open({
            templateUrl: 'updateRoleId.html',
            controller: 'updateRoleIdAndAssignedToCtrl',
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
    
     $scope.importFiles = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/ImportCSVFile",
            ContentType: 'application/json',
            data: {            
                 "import_path":"csvupload",
                 "import_filename": $scope.files[0].name,
                 "import_compguid": $cookieStore.get('comp_guid'),
                 "import_flag":2
            }
        }).success(function(data) {
               var res = data.Comm_ErrorDesc;
               var resSplit = res.split('|');
             if(resSplit[0].toString()=="0 ")
                 {
                   $scope.getEmployeesDetails(); 
                    angular.element(".loader").hide();
                    alert(resSplit[1].toString() + "-" + resSplit[2].toString()) 
                 }
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    
});