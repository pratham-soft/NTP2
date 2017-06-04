app.controller("bookUnitStep2Ctrl", function($scope, $http, $rootScope, $stateParams, $compile, $cookieStore, $filter, httpSvc,$state){
    $scope.leadId = $stateParams.leadID;
	$scope.pageTitle = "Book Unit - Add Customer";
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    $scope.exchangeUnit=$cookieStore.get('skip3rdStep');
    
    if($cookieStore.get('skip3rdStep') != undefined){
     var skip3rdStep=$cookieStore.get('skip3rdStep'); // It's true here ,  and Its mean exchange will happen. and Cust already exists
     $scope.exchangeUnit=true;
    }
    else{
          var skip3rdStep=false;             
         $scope.exchangeUnit=false; // Here it means Its a new Bookiing and Cust data would be saved. It will go to next step 3
    }
    
	$scope.stepsData = [
		{
			stepName: "Cost Details",
			status: "done"
		},
		{
			stepName: "Customer Details",
			status: "active"
		},
		{
			stepName: "Advance Payment",
			status: "pending"
		},
		{
			stepName: "Payment Schedule",
			status: "pending"
		}
	];
	
     $scope.appendFields = function() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv =  '<div class="field"><label ng-show="customer.child' + i + 'Name" class="show-hide">Child ' + i + ' Name*</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div class="field has-feedback"><label ng-show="customer.child' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B. (DD/MM/YYYY)</label><datepicker date-format="dd/MM/yyyy"><input type="text" placeholder="Child ' + i + ' D.O.B. (DD/MM/YYYY)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/><i class="form-control-feedback glyphicon glyphicon-calendar"></i></datepicker></div><br>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };
    
    
    
    
    function editAppendFields() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div class="field"><label ng-show="customer.child' + i + 'Name" class="show-hide">Child ' + i + ' Name</label><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div class="field"><label ng-show="customer.child' + i + 'Dob" class="show-hide">Child ' + i + ' D.O.B.</label><datepicker date-format="dd/MM/yyyy"><input type="text" placeholder="Child ' + i + ' D.O.B. (DD/MM/YYYY)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/><i class="form-control-feedback glyphicon glyphicon-calendar"></i></datepicker></div><br>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };
    
    
    $scope.movetoStep3 = function(formObj, formName)
    {
       $scope.submit = true;
        
        if(formObj.spouseDob!=undefined)
            {
            var dobspouse = formObj.spouseDob;
            var newdobspouse = dobspouse.split("/").reverse().join("-");
            }
       
        if(formObj.gpaDob!=undefined)
            {   
             var dobgpa = formObj.gpaDob;
             var newdobgpa = dobgpa.split("/").reverse().join("-");
            }
         if(formObj.weddingAnniversary!=undefined)
             {
            var wedAnniversary = formObj.weddingAnniversary;
            var newwedAnniversary = wedAnniversary.split("/").reverse().join("-");       
             }
           if(formObj.child1Dob!=undefined)
             {
              var dobchild1 = formObj.child1Dob;
              var newdobchild1 = dobchild1.split("/").reverse().join("-");   
             }
            if(formObj.child2Dob!=undefined)
             {
              var dobchild2 = formObj.child2Dob;
              var newdobchild2 = dobchild2.split("/").reverse().join("-"); 
             }
         if(formObj.child3Dob!=undefined)
             {
               var dobchild3 = formObj.child3Dob;
               var newdobchild3 = dobchild3.split("/").reverse().join("-"); 
             }
         if(formObj.child4Dob!=undefined)
             {
             var dobchild4 = formObj.child4Dob;
             var newdobchild4 = dobchild4.split("/").reverse().join("-");
             }
             

        if ($scope[formName].$valid) {
            angular.element(".loader").show();

            var relationType = 0;
            var statusType = 0;
            var noOfChildren = 0;
            var gpaRelation = 0;

            if (formObj.relationType != undefined && formObj.relationType != '') {
                relationType = formObj.relationType;
            }

            if (formObj.gpaRelation != undefined && formObj.gpaRelation != '') {
                gpaRelation = formObj.gpaRelation;
            }

            if (formObj.residentType != undefined && formObj.residentType != '') {
                statusType = formObj.residentType;
            }

            if (formObj.childrenNo != undefined && formObj.childrenNo != '') {
                noOfChildren = formObj.childrenNo;
            }

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Cust/SaveCust",
                ContentType: 'application/json',
                data: {
                    "user_id": prospectId,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "Cust_User_Id_Assgnto": 1,
                    "Cust_relationtype": relationType,
                    "Cust_relationname": formObj.relationName,
                    "Cust_status_type": statusType,
                    "Cust_perm_add": formObj.address2,
                    "Cust_status_other": "",
                    "Cust_pan": formObj.pan,
                    "Cust_aadhar": formObj.aadhar,
                    "Cust_alt_contactno": formObj.alternateContact,
                    "Cust_qualification": formObj.qualification,
                    "Cust_Profession": formObj.profession,
                    "Cust_company": formObj.company,
                    "Cust_desig": formObj.designation,
                    "Cust_off_add": formObj.officeAddress,
                    "Cust_off_email": formObj.officeEmailId,
                    "Cust_spouse_nm": formObj.spouseName,
                    "Cust_spouse_dob": newdobspouse,
                    "Cust_spouse_pan": formObj.spousePan,
                    "Cust_spouse_aadhar": formObj.spouseAadhar,
                    "Cust_noof_childrn": noOfChildren,
                    "Cust_child1_nm": formObj.child1Name,
                    "Cust_child1_dob":newdobchild1 ,
                    "Cust_child2_nm": formObj.child2Name,
                    "Cust_child2_dob": newdobchild2,
                    "Cust_child3_nm": formObj.child3Name,
                    "Cust_child3_dob": newdobchild3,
                    "Cust_child4_nm": formObj.child4Name,
                    "Cust_child4_dob": newdobchild4,
                    "Cust_wedanv": newwedAnniversary,
                    "Cust_bankloan": formObj.bankloan,
                    "Cust_banknm": formObj.bankName,
                    "Cust_bankaccno": formObj.accountNumber,
                    "Cust_bankadd": formObj.bankAdress,
                    "Cust_bankifsccode": formObj.ifscCode,
                    "Cust_bankemailid": formObj.bankEmailId,
                    "Cust_gpaholdr": formObj.gpaHolder,
                    "Cust_gpa_nm": formObj.gpaName,
                    "Cust_gpa_relationtype": gpaRelation,
                    "Cust_gpa_dob": newdobgpa,
                    "Cust_gpa_add": formObj.gpaAddress,
                    "Cust_gpa_permadd": formObj.permanentAddress,
                    "Cust_gpa_reltnwithcusty": formObj.relationWithcustomer,
                    "Cust_gpa_pan": formObj.gpaPan,
                    "Cust_gpa_aadhar": formObj.gpaAadhar
                }
            }).success(function(data) {
                if(skip3rdStep==false){
                    if(data.user_ErrorDesc =="0")
                    {
                         alert("Customer data Saved");
                         $state.go('/BookUnit-Step3') ;
                        angular.element(".loader").hide();  
                    }
                else{
                   alert("Error in save customer");
                  angular.element(".loader").hide();
                }
                    
                }
                else{
                    if(data.user_ErrorDesc =="0")
                    {
                         alert("Customer data Saved");
                         $state.go('/BookUnit-Step4') ;
                        angular.element(".loader").hide();  
                    }
                else{
                   alert("Error in save customer");
                  angular.element(".loader").hide();
                }
                    
                }
                
            }).error(function() {
                
            });
        }
            
    }
    
    $scope.updateCustomer = function(formObj, formName) {
        $scope.submit = true;
        
        if(formObj.spouseDob!=undefined)
            {
            var dobspouse = formObj.spouseDob;
            var newdobspouse = dobspouse.split("/").reverse().join("-");
            }
       
        if(formObj.gpaDob!=undefined)
            {   
             var dobgpa = formObj.gpaDob;
             var newdobgpa = dobgpa.split("/").reverse().join("-");
            }
         if(formObj.weddingAnniversary!=undefined)
             {
            var wedAnniversary = formObj.weddingAnniversary;
            var newwedAnniversary = wedAnniversary.split("/").reverse().join("-");       
             }
           if(formObj.child1Dob!=undefined)
             {
              var dobchild1 = formObj.child1Dob;
              var newdobchild1 = dobchild1.split("/").reverse().join("-");   
             }
            if(formObj.child2Dob!=undefined)
             {
              var dobchild2 = formObj.child2Dob;
              var newdobchild2 = dobchild2.split("/").reverse().join("-"); 
             }
         if(formObj.child3Dob!=undefined)
             {
               var dobchild3 = formObj.child3Dob;
               var newdobchild3 = dobchild3.split("/").reverse().join("-"); 
             }
         if(formObj.child4Dob!=undefined)
             {
             var dobchild4 = formObj.child4Dob;
             var newdobchild4 = dobchild4.split("/").reverse().join("-");
             }
             

        if ($scope[formName].$valid) {
            angular.element(".loader").show();

            var relationType = 0;
            var statusType = 0;
            var noOfChildren = 0;
            var gpaRelation = 0;

            if (formObj.relationType != undefined && formObj.relationType != '') {
                relationType = formObj.relationType;
            }

            if (formObj.gpaRelation != undefined && formObj.gpaRelation != '') {
                gpaRelation = formObj.gpaRelation;
            }

            if (formObj.residentType != undefined && formObj.residentType != '') {
                statusType = formObj.residentType;
            }

            if (formObj.childrenNo != undefined && formObj.childrenNo != '') {
                noOfChildren = formObj.childrenNo;
            }

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Cust/CustUpdate",
                ContentType: 'application/json',
                data: {                 
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no":formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "Cust_User_Id": $scope.leadId,
                    "Cust_comp_guid": $cookieStore.get('comp_guid'),
                    "Cust_User_Id_Assgnto": 1,
                    "Cust_relationtype": relationType,
                    "Cust_relationname": formObj.relationName,
                    "Cust_status_type": statusType,
                    "Cust_perm_add": formObj.address2,
                    "Cust_status_other": "Cust_status_other",
                    "Cust_pan": formObj.pan,
                    "Cust_aadhar": formObj.aadhar,
                    "Cust_alt_contactno": formObj.alternateContact,
                    "Cust_qualification": formObj.qualification,
                    "Cust_Profession": formObj.profession,
                    "Cust_company": formObj.company,
                    "Cust_desig": formObj.designation,
                    "Cust_off_add": formObj.officeAddress,
                    "Cust_off_email": formObj.officeEmailId,
                    "Cust_spouse_nm": formObj.spouseName,
                    "Cust_spouse_dob": newdobspouse,
                    "Cust_spouse_pan": formObj.spousePan,
                    "Cust_spouse_aadhar": formObj.spouseAadhar,
                    "Cust_noof_childrn": noOfChildren,
                    "Cust_child1_nm": formObj.child1Name,
                    "Cust_child1_dob":newdobchild1 ,
                    "Cust_child2_nm": formObj.child2Name,
                    "Cust_child2_dob": newdobchild2,
                    "Cust_child3_nm": formObj.child3Name,
                    "Cust_child3_dob": newdobchild3,
                    "Cust_child4_nm": formObj.child4Name,
                    "Cust_child4_dob": newdobchild4,
                    "Cust_wedanv": newwedAnniversary,
                    "Cust_bankloan": formObj.bankloan,
                    "Cust_banknm": formObj.bankName,
                    "Cust_bankaccno": formObj.accountNumber,
                    "Cust_bankadd": formObj.bankAdress,
                    "Cust_bankifsccode": formObj.ifscCode,
                    "Cust_bankemailid": formObj.bankEmailId,
                    "Cust_gpaholdr": formObj.gpaHolder,
                    "Cust_gpa_nm": formObj.gpaName,
                    "Cust_gpa_relationtype": gpaRelation,
                    "Cust_gpa_dob": newdobgpa,
                    "Cust_gpa_add": formObj.gpaAddress,
                    "Cust_gpa_permadd": formObj.permanentAddress,
                    "Cust_gpa_reltnwithcusty": formObj.relationWithcustomer,
                    "Cust_gpa_pan": formObj.gpaPan,
                    "Cust_gpa_aadhar": formObj.gpaAadhar
                }
            }).success(function(data) {
                
                
                console.log(data);
                 alert(" Customer Data Updated");
                if($scope.exchangeUnit==true)
                    {
                       $state.go('/BookUnit-Step4');   
                    }
              else{
                   $state.go('/BookUnit-Step3') ;
              }
                angular.element(".loader").hide();
            }).error(function() {
                alert("Error in save customer");
                angular.element(".loader").hide();
            });
        }
       
    };
    
	$scope.getUserDetails = (function() {
        angular.element(".loader").show();
        httpSvc.getUserDetails(prospectId, $cookieStore.get('comp_guid')).then(function(response) {
            var data = response.data;
            if(data.Cust_User_Id == 0 || data.Cust_User_Id == undefined)
                {
                 $scope.CustIdPreset=false;
                }
            else{
                $scope.CustIdPreset=true;
            }
          
            var dateArray = [];
            dateArray.push($filter('date')(data.user_dob, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_spouse_dob, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_wedanv, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_gpa_dob, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_child1_dob, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_child2_dob, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_child3_dob, 'dd/MM/yyyy'));
            dateArray.push($filter('date')(data.Cust_child4_dob, 'dd/MM/yyyy'));

            for (var i = 0; i < dateArray.length; i++) {
                if (dateArray[i] == "Jan 01, 0001") {
                    dateArray[i] = "";
                }
            }

            var state = data.user_state;
            var city = data.user_city;

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }

            if (data.user_id != 0) {
                $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dateArray[0],
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0,
                        relationType: ((data.Cust_relationtype != 0) ? data.Cust_relationtype + '' : ''),
                        relationName: data.Cust_relationname,
                        residentType: ((data.Cust_status_type != 0 ? data.Cust_status_type + '' : '')),
                        address2: data.Cust_perm_add,
                        pan: data.Cust_pan,
                        aadhar: data.Cust_aadhar,
                        weddingAnniversary: dateArray[2],
                        alternateContact: data.Cust_alt_contactno,
                        qualification: data.Cust_qualification,
                        profession: data.Cust_Profession,
                        company: data.Cust_company,
                        designation: data.Cust_desig,
                        officeAddress: data.Cust_off_add,
                        officeEmailId: data.Cust_off_email,
                        spouseName: data.Cust_spouse_nm,
                        spouseDob: dateArray[1],
                        spousePan: data.Cust_spouse_pan,
                        spouseAadhar: data.Cust_spouse_aadhar,
                        childrenNo: data.Cust_noof_childrn + "",
                        child1Name: data.Cust_child1_nm,
                        child1Dob: dateArray[4],
                        child2Name: data.Cust_child2_nm,
                        child2Dob: dateArray[5],
                        child3Name: data.Cust_child3_nm,
                        child3Dob: dateArray[6],
                        child4Name: data.Cust_child4_nm,
                        child4Dob: dateArray[7],
                        bankloan: data.Cust_bankloan,
                        bankName: data.Cust_banknm,
                        accountNumber: data.Cust_bankaccno,
                        ifscCode: data.Cust_bankifsccode,
                        bankAdress: data.Cust_bankadd,
                        bankEmailId: data.Cust_bankemailid,
                        gpaHolder: data.Cust_gpaholdr,
                        gpaRelation: ((data.Cust_gpa_relationtype != 0 ? data.Cust_gpa_relationtype + '' : '')),
                        gpaName: data.Cust_gpa_nm,
                        gpaDob: dateArray[3],
                        gpaAddress: data.Cust_gpa_add,
                        permanentAddress: data.Cust_gpa_permadd,
                        relationWithcustomer: data.Cust_gpa_reltnwithcusty,
                        gpaPan: data.Cust_gpa_pan,
                        gpaAadhar: data.Cust_gpa_aadhar
                    }
            }
        });
        angular.element(".loader").hide();
    })();
});