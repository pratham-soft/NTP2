app.controller("bookUnitStep2Ctrl", function($scope, $rootScope, $stateParams, $cookieStore, $filter, httpSvc){
	$scope.pageTitle = "Book Unit - Add Customer";
    var unitObj = $cookieStore.get("unitObj");
	var prospectId = $cookieStore.get('prospectId');
    
	$scope.getUserDetails = (function() {
        angular.element(".loader").show();
        httpSvc.getUserDetails(prospectId, $cookieStore.get('comp_guid')).then(function(response) {
            var data = response.data;
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
                        bankName: data.Cust_bankloan,
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