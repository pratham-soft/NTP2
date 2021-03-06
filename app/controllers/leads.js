app.controller("leadsCtrl", function($scope,  $http, $cookieStore, $uibModal, $state, $window, $filter) {
    $scope.searchLead = ''; // set the default search/filter term
    $scope.selected = []; //stores checked items only
     $scope.files = []; //Stores Files 
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
            alert("Files uploaded successfully !");
            $scope.importFiles();
            
        }
      
    ($scope.getLeads = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 3,
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
    })();

    function printMe(val) {
        console.log("" + val);
    }

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
    
    $scope.exist = function(item) {
        return $scope.selected.indexOf(item) > -1;
    }
    $scope.toggleSelection = function(item) {
        var idx = $scope.selected.indexOf(item);
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
            //              console.log($scope.selected);
        } else {
            $scope.selected.push(item);
            //              console.log($scope.selected);
        }

    }
    $scope.checkAll = function() {
        if ($scope.selectAll) {
            angular.forEach($scope.leads, function(item) {
               var idx = $scope.selected.indexOf(item.user_id);
                if (idx >= 0) {
                    return true;
                    //                        console.log($scope.selected);
                } else {
                    $scope.selected.push(item.user_id);
                    //                        console.log($scope.selected);
                }
            })
        } else {
            $scope.selected = [];
            //              console.log($scope.selected);
        }
    };

    $scope.leadToProspectBtnClick = function() {
        var str = "" + $scope.selected;
        if (str != "") {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/UserUpdt/leadToProspect",
                ContentType: 'application/json',
                data: {
                    "user_ids": str,
                    "user_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                console.log(data);
                if (data.ErrorDesc == "0 | Update Success") {
                    $scope.selected = [];
                    angular.element(".loader").hide();
                    $window.location.reload();
                } else {
                    alert("Some Error Occurred While Updating");
                    angular.element(".loader").hide();
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Please Select the User")
        }
    } //leadToProspectBtnClick end

    $scope.leadDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'leadDetailCtrl',
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
                 "import_flag":1
            }
        }).success(function(data) {
               var res = data.Comm_ErrorDesc;
               var resSplit = res.split('|');
             if(resSplit[0].toString()=="0 ")
                 {
                    $scope.getLeads(); 
                    angular.element(".loader").hide();
                    alert(resSplit[1].toString() + "-" + resSplit[2].toString()) 
                 }
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
});

app.controller("leadDetailCtrl", function($scope,  $uibModalInstance, encyrptSvc, $state, encyrptSvc, item) {
    $scope.leadType = ['hot', 'warm', 'cold'];
    $scope.states = ["Delhi"];
    $scope.cities = ["New Delhi"];
    $scope.lead = item;
    if ($scope.lead.userprojlist != null) {
        $scope.leadProjects = $scope.lead.userprojlist;
    }

    $scope.ok = function() {
        $uibModalInstance.close();
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
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});

app.controller("addLeadCtrl", function($scope,  $http, $state,encyrptSvc, $cookieStore,myService) {
    $scope.pageTitle = "Add Lead";
    $scope.addLeadBtn = true;
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
    
    $scope.validAge= function(age){
         var result="";
         result= myService.checkAge(age) ;
         if(result==false){
        $scope.addLead.dob="";
   }  
    };
   
    
   // var age=0;
    
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
                    "user_type": 3,
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
                    "user_lead_source_id": parseInt(formObj.leadSource),
                    "user_campaign_id": parseInt(formObj.campaign)
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/ProjectDetails", {
                        "leadID": encyrptSvc.encyrpt(data.user_id)
                    });
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
            }).error(function() {});
        }
    };
});

app.controller("editLeadCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Lead";
    $scope.editLeadBtn = true;
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
    
    ($scope.getLeadDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
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
                    mobileNumber: parseInt(data.user_mobile_no) ,
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
                    campaign: data.user_campaign_id + ''
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.updateLead = function(formObj, formName) {
        //console.log(formObj);
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
                    "user_campaign_id": parseInt(formObj.campaign)
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_ErrorDesc == "0") {
                    //$cookieStore.put('lead_id', data.user_id);
                    $state.go("/Leads");
                } else {
                    alert("Some Error! Update Not Done");
                }
            }).error(function() {});
        }
    };
});

app.controller("projectDetailsCtrl", function($scope,  $http, $state, $cookieStore, $compile, $stateParams, $window, myService, $uibModal,encyrptSvc) {
    $scope.leadId = encyrptSvc.decyrpt($stateParams.leadID);
    if ($scope.leadId == undefined) {
        $state.go('/AddLead');
    }
    ($scope.getLeadProjects = function() {
        angular.element(".loader").show();
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
                $scope.leadInfo = {
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    mobileNumber: parseInt(data.user_mobile_no) ,
                    emailId: data.user_email_address
                }
                if (data.userprojlist != null) {
                    $scope.leadProjects = data.userprojlist;
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.flatStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.flatStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];

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
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
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
        $scope.projectDetails.blocks = "";
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

    $scope.getUnits = function(blocks) {		
        $scope.units = [];
        $scope.perFloorUnits = [];
        if (blocks == "") {
            return;
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Block_Id": blocks,
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockFloors = data[1].Blocks_Floors;
            $scope.blockFloorUnits = data[1].Blocks_UnitPerfloor;

            var dataOfUnits = data[0];
			
			$scope.startZero = 0;
			if(dataOfUnits[0].UnitDtls_Floor == 0){
				$scope.startZero = 1;
			}
			
			console.log(dataOfUnits);
			
			$scope.floorStartingNumber = dataOfUnits[0].UnitDtls_Floor;

            $scope.selectedUnits = [];
            $(".dispNone").each(function(index) {
                var projObj = $(this).text();
                projObj = angular.fromJson(projObj);
                $scope.selectedUnits.push(projObj.UnitDtls_Id);
            });

            for (i = 0; i < dataOfUnits.length; i++) {
                for (j = 0; j < $scope.selectedUnits.length; j++) {
                    if (dataOfUnits[i].UnitDtls_Id == $scope.selectedUnits[j]) {
                        dataOfUnits[i].markUp = "selected";
                        break;
                    }
                }
            }
            var count = 0;
            for (k = 0; k < $scope.blockFloors; k++) {
                var floorUnits = [];
                for (l = 0; l < $scope.blockFloorUnits; l++) {
                    floorUnits.push(dataOfUnits[count]);
                    count++;
                }
                $scope.perFloorUnits.push(floorUnits);
            }
			console.log($scope.perFloorUnits);
            $scope.units = dataOfUnits;
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.markUnits = function() {
        alert($scope.selectedUnits);
    };
    $scope.selectUnit = function(unitId, projectDetails) {
        for (i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].UnitDtls_Id == unitId) {
                if ($scope.units[i].UnitDtls_Status == 1 || $scope.units[i].UnitDtls_Status == 2) {
                    if ($("#unit" + $scope.units[i].UnitDtls_Id).hasClass('selected')) {
                        $scope.deleteRow($scope.projectDetails.projectName, $scope.units[i].UnitDtls_Id);
                    } else {
                        var projObj = {};
                        projObj.ProjId = parseInt($scope.projectDetails.projectName);
                        projObj.Phase_Id = parseInt($scope.projectDetails.phase);
                        projObj.Blocks_Id = parseInt($scope.projectDetails.blocks);
                        projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                        projObj = JSON.stringify(projObj);

                        //                      console.log($scope.projectDetails);

                        var projectRow = '<tr id="' + $scope.units[i].UnitDtls_Id + '"><td>' + $scope.projectDetails.projectName + '</td><td>' + $scope.projectDetails.phase + '</td><td>' + $scope.projectDetails.blocks + '</td><td>' + 'Flat Type' + '</td><td><div class="dispNone">' + projObj + '</div>' + $scope.units[i].UnitDtls_Rooms + 'BHK - ' + $scope.units[i].UnitDtls_No + ' - ' + $scope.units[i].UnitDtls_Floor + ' Floor</td><td>' + $scope.units[i].UnitDtls_BuliltupArea + ' sq ft</td><td class="text-center"><a class="link" ng-click="viewUnitCostSheet('+ $scope.units[i].UnitDtls_Id +')">View</a></td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow(' + projectDetails.projectName + ',' + $scope.units[i].UnitDtls_Id + ')"></span></td></tr>';
                        var projectRowComplied = $compile(projectRow)($scope);
                        angular.element(document.getElementById('projectList')).append(projectRowComplied);
                    }
                    $("#unit" + $scope.units[i].UnitDtls_Id).addClass('selected');
                } else {
                    alert($scope.flatStatusText[$scope.units[i].UnitDtls_Status - 1]);
                }
            }
        }
    };

    $scope.saveLead = function(projectObj) {
        var projJson = [];
        $(".dispNone").each(function(index) {
            //console.log(index + ": " + $(this).text());
            var projObj = $(this).text();
            projObj = angular.fromJson(projObj);
            projObj.comp_guid = $cookieStore.get('comp_guid');
            projObj.Projusrid = $scope.leadId;
            projObj.ProjDtl_Status = 2;
            projJson.push(projObj);
        });
        //console.log(projJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/User/ProjUnitSave",
            ContentType: 'application/json',
            data: projJson
        }).success(function(data) {
            angular.element(".loader").hide();
            if (data.Comm_ErrorDesc == '0|0') {
                $cookieStore.remove('lead_id');
                $state.go('/Prospects');
                angular.element(".loader").hide();
            } else {
                alert('Something went wrong.');
            }
            //console.log(JSON.stringify(data));
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }

    function getTypeNameById(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
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
         $scope.deleteRow = function(projId, rowId) {
        clickCounter=0;
        var deleteUser = $window.confirm('Are you sure you want to delete ?');

        if (deleteUser) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/User/ProjUnitDel",
                ContentType: 'application/json',
                data: [{
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "ProjDtl_Id": projId
                }]
            }).success(function(data) {
                if (data.Comm_ErrorDesc == '0|0') {
                    $("tr#" + rowId).remove();
                    $("#unit" + rowId).removeClass('selected');
                    $("#unit" + rowId).removeClass('userinterest');
                    $("#unit" + rowId).addClass('vacant');
                    
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
});
