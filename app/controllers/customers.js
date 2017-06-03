app.controller("customerCtrl", function($scope, $http, $cookieStore, $state, $uibModal) {
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
    
    $scope.getCustomers = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 4
            }
        }).success(function(data) {
            if (data[0].user_ErrorDesc !="-1 | User record does not exist")
                {
                angular.element(".loader").hide();
                for(var i=0;i<data.length;i++){
                        data[i].fullName=data[i].user_first_name+" "+data[i].user_middle_name+" "+data[i].user_last_name;
                    }
                $scope.customers = data;

                }
            else{
                alert("No Customer Data Found !");
                 angular.element(".loader").hide();
            }
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getCustomers();

    $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerDetail.html',
            controller: 'customerDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
    
    $scope.unitOperations = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerReceivePaymentDetail.html',
            controller: 'unitOperationCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
});

app.controller("customerDetailCtrl", function($scope, $http, $cookieStore, $state, $uibModalInstance, item,$window,$uibModal,encyrptSvc) {
    $scope.customer = item;
    $scope.unitStatus = [];
    $scope.unitStatus[2] = "Interested";
    $scope.unitStatus[4] = "Blocked by paying advance";
    $scope.unitStatus[5] = "Blocked by not paying advance";
    $scope.unitStatus[6] = "Sold";
    $scope.unitStatus[7] = "Cancelled";

    $scope.leadId = $scope.customer.user_id;
     
    if ($scope.customer.userprojlist != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.customer.userprojlist.length; i++) {
            $scope.leadUnitObj = $scope.customer.userprojlist[i];
            $scope.leadUnitObj.unitViewStatus = "N/A";
            if ($scope.customer.userprojlist[i].ProjDtl_Status != 0)
                $scope.leadUnitObj.unitViewStatus = $scope.unitStatus[$scope.customer.userprojlist[i].ProjDtl_Status];
            $scope.leadProjects.push($scope.leadUnitObj);
        }
    }

    $scope.deleteRow = function(projId, rowId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitDel",
            ContentType: 'application/json',
            data: [{
                "comp_guid": $cookieStore.get('comp_guid'),
                "ProjDtl_Id": projId
            }]
        }).success(function(data) {
            if (data.Comm_ErrorDesc == '0|0') {
                $("tr#" + rowId).remove();
                $("#unit" + rowId).removeClass('selected');
            }
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID": encyrptSvc.encyrpt($scope.leadId)
        });
    };

    $scope.exchangeLeadProjects = function(unitObj,leadId) {
        $window.sessionStorage.setItem('projId', unitObj.ProjId);
        $window.sessionStorage.setItem('phaseId', unitObj.Phase_Id);
        $window.sessionStorage.setItem('blockId', unitObj.Blocks_Id);
        $window.sessionStorage.setItem('unitId', unitObj.UnitDtls_Id);
        $cookieStore.put("unitObj",unitObj);
        $uibModalInstance.close();
        $state.go("/ExchangeUnit", {
            "leadID": $scope.leadId
        });
    };

     var leadFullName=$scope.customer.user_first_name+' '+$scope.customer.user_middle_name+' '+$scope.customer.user_last_name;
     $scope.bookUnit = function(unitObj,prospectId){
         // I don't see the need of below code . WHy are we doing this !
//        unitObj.Proj_Name=$scope.projectDetails.projectName;
//        unitObj.Blocks_Name =$scope.projectDetails.phase;
//        unitObj.Phase_Name =$scope.projectDetails.blocks;
        $cookieStore.put("leadName",leadFullName);
		$cookieStore.put("unitObj",unitObj);
		$cookieStore.put("prospectId",prospectId);
		$state.go('/BookUnit-Step1');
        $uibModalInstance.close();
	};
    
    $scope.ok = function() {
        $uibModalInstance.close();
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
    
});



app.controller("unitOperationCtrl", function($scope, $http, $cookieStore, $state, $uibModalInstance, item,$window,$uibModal,httpSvc) {
    $scope.customer = item;
    $scope.unitStatus = [];
    $scope.unitStatus[2] = "Interested";
    $scope.unitStatus[4] = "Blocked by paying advance";
    $scope.unitStatus[5] = "Blocked by not paying advance";
    $scope.unitStatus[6] = "Sold";
    $scope.unitStatus[7] = "Cancelled";
    $scope.payHistoryClick=false;
   
    if ($scope.customer.userprojlist != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.customer.userprojlist.length; i++) {
            $scope.leadUnitObj = $scope.customer.userprojlist[i];
            $scope.leadUnitObj.unitViewStatus = "N/A";
            if ($scope.customer.userprojlist[i].ProjDtl_Status > 2 && $scope.customer.userprojlist[i].ProjDtl_Status <6)
                {
                $scope.leadUnitObj.unitViewStatus = $scope.unitStatus[$scope.customer.userprojlist[i].ProjDtl_Status];
                $scope.leadProjects.push($scope.leadUnitObj);  
                }
            
        }
    }  

    $scope.leadId = $scope.customer.user_id;
    
    
    $scope.exchangeLeadUnits = function(unitObj) {
        $window.sessionStorage.setItem('projId', unitObj.ProjId);
        $window.sessionStorage.setItem('phaseId', unitObj.Phase_Id);
        $window.sessionStorage.setItem('blockId', unitObj.Blocks_Id);
        $window.sessionStorage.setItem('unitId', unitObj.UnitDtls_Id);
        $cookieStore.put("unitObj",unitObj);
        $uibModalInstance.close();
        $state.go("/ExchangeUnit", {
            "leadID": $scope.leadId
        });
    };
    
    

     
     $scope.getCustPaymentHistory = function(custinfo){ 
         $scope.payHistoryClick=true;
            var apiPostObj ={};     
            apiPostObj["UnitDtls_Id"] = custinfo.UnitDtls_Id;
            apiPostObj["UnitDtls_Cust_UserId"] = $scope.customer.user_id;
            apiPostObj["UnitDtls_comp_guid"] = $cookieStore.get('comp_guid');
         
            var postObj ={};     
            postObj["usruntpymtrec_unitdtls_id"] = custinfo.UnitDtls_Id;
            postObj["usruntpymtrec_user_id"] = $scope.customer.user_id;
            postObj["usruntpymtrec_comp_guid"] = $cookieStore.get('comp_guid');
         
			httpSvc.CustPaymentInfo(apiPostObj).then(function(response){
				var res = response.data[0].ErrorDesc;
                if(res=="0")
                    {
                        $scope.custPayinfo=response.data;
                        httpSvc.CustPaymentHistory(postObj).then(function(response){
                                    var res = response.data[0].ErrorDesc;
                                    if(res=="0")
                                        {
                                            $scope.custPayHistoryinfo=response.data;
                                        }
                                     else
                                        {
                                         alert(response.data[0].ErrorDesc.toString());
                                        }

                                })
                      
                    }
                 else
                    {
                     alert(res.toString());
                    }							               			
			})
        
    }
     
     
      $scope.cancelUnit = function(unitObj) {
        unitObj["customer"]= $scope.customer;
        unitObj['CustId']= $scope.leadId
        $uibModalInstance.close();
        $scope.custCancelUnit(unitObj);
    };
    
    
    $scope.custCancelUnit = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'cancelUnit.html',
            controller: 'cancelUnitCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
     
     
     

   $scope.custPayment = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'custPayment.html',
            controller: 'custPaymentCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
    


     $scope.receivePayment = function(unitObj) {
        unitObj["customer"]= $scope.customer;
        unitObj['CustId']= $scope.leadId
        $uibModalInstance.close();
        $scope.custPayment(unitObj);
    };

    
    
    
    $scope.ok = function() {
        $uibModalInstance.close();
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



app.controller("custPaymentCtrl", function($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc,item,$uibModalInstance,$uibModal, myService){
   // myService.convertNumberToWords($scope.unitCostSheetDetail.unitcostcal_custtotcost);
    $scope.convertNumToWords = function (numvalue)
    {
       $scope.amountInWords= myService.convertNumberToWords(numvalue)+"Rupees Only";
    }
    
     $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerReceivePaymentDetail.html',
            controller: 'unitOperationCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
    
    var unitObj=item;
    $scope.customerData=item.customer;
    $scope.unitinfo=[];
    $scope.unitinfo.push(unitObj);
    var comp_guid = $cookieStore.get('comp_guid');
  
    $scope.paymentDetails = {
        usruntpymtrec_pymttype: "1"
    };
   
    $scope.receivePayment = function(formName, formObj){
        $scope.submit = true;
        if ($scope[formName].$valid) {            
            formObj.usruntpymtrec_user_id = unitObj.CustId;
            formObj.usruntpymtrec_unitdtls_id = unitObj.UnitDtls_Id;
            formObj.usruntpymtrec_comp_guid = comp_guid;
			formObj.usruntpymtrec_bookng = "false";
			
			httpSvc.updatePaymentDetails(formObj).then(function(response){
				var res = response.data.Comm_ErrorDesc;
				resArr = res.split('|');
				if(resArr[0] == 0){                      
					    alert("Payment of INR " + formObj.usruntpymtrec_amtpaid +  " Received Successfully. Now Your Balance Pending Amount is INR " + resArr[3]);
                       // $state.go('ReceivePayment');
                        $scope.ok();
                   
				}
                else{
                   alert("Some Error Occured While Receiving Payment For This UNIT"); 
                }
			})
        }
    }
    
      $scope.ok = function() {
        $uibModalInstance.close();
        $scope.customerDetail($scope.customerData);
    };
});


app.controller("cancelUnitCtrl", function($scope, $rootScope, $stateParams, $uibModal, $cookieStore, $state, $http, httpSvc, item, $uibModalInstance){
    var unitObj=item;
     $scope.customerData=item.customer;
    $scope.unitinfo=[];
    $scope.unitinfo.push(unitObj);
    $scope.amountPaid=0;
    $scope.totalAmount=0;
    $scope.pendingAmount=0;
    $scope.paneltyAmount=0;
    $scope.refundAmount=0;
    $scope.remarks="";
    $scope.cancelTableShow=true;
    

    
    
    $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerReceivePaymentDetail.html',
            controller: 'unitOperationCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return selectedItem;
                }
            }
        });
    };
  
        $scope.ok = function() {
        $uibModalInstance.close();
        $scope.customerDetail($scope.customerData);
    };
   
    $scope.getCustPaymentHistory = function(unitObj){ 
            $scope.payHistoryClick=true;
            var apiPostObj ={};     
            apiPostObj["UnitDtls_Id"] = unitObj.UnitDtls_Id;
            apiPostObj["UnitDtls_Cust_UserId"] = unitObj.CustId;
            apiPostObj["UnitDtls_comp_guid"] = $cookieStore.get('comp_guid');
         
			httpSvc.CustPaymentInfo(apiPostObj).then(function(response){
				var res = response.data[0].ErrorDesc;
                if(res=="0")
                    {
                        $scope.custPayinfo=response.data;
                        for(var i=0;i<$scope.custPayinfo.length;i++){
                            $scope.totalAmount=$scope.custPayinfo[i].UnitTotCost;
                            $scope.amountPaid=$scope.custPayinfo[i].Total_amt_paid;
                            $scope.pendingAmount=$scope.totalAmount-$scope.amountPaid;
                            $scope.refundAmount=$scope.amountPaid;
                        }
                      
                    }
                 else
                    {
                     alert(res.toString());
                    $scope.cancelTableShow=false;
                    $scope.ok();
                    }
			})
        
    };
     $scope.getCustPaymentHistory(unitObj); 
    
    $scope.calculateRefund = function(){ 
        $scope.refundAmount=$scope.amountPaid-$scope.paneltyAmount;
    };
    
    
    $scope.saveCancelUnit = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Cust/Cancelunit",
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
                "UnitCancel_Flag"  : 2 ,
                "UnitCancel_Confirmed"  : 2  ,
                "UnitCancel_blockid" :unitObj.Blocks_Id,
                "comp_gui_id":$cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.cancelData=data;
            angular.element(".loader").hide();
            console.log($scope.cancelData);
            $state.go('ReceivePayment');
            $scope.ok();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
      
});


