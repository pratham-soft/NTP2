app.controller("receivePaymentCtrl", function($scope, $http, $cookieStore, $state, $uibModal) {
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
            //console.log(data);
            angular.element(".loader").hide();
            for(var i=0;i<data.length;i++){
                    data[i].fullName=data[i].user_first_name+" "+data[i].user_middle_name+" "+data[i].user_last_name;
                }
            $scope.customers = data;
            //console.log($scope.customers);
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getCustomers();

    $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerReceivePaymentDetail.html',
            controller: 'customerReceivePaymentDetailCtrl2',
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

app.controller("customerReceivePaymentDetailCtrl2", function($scope, $http, $cookieStore, $state, $uibModalInstance, item,$window,$uibModal,httpSvc) {
     $scope.showPaymentHistoryView=false;
    $scope.customer = item;
    $scope.unitStatus = [];
    $scope.unitStatus[2] = "Interested";
    $scope.unitStatus[4] = "Blocked by paying advance";
    $scope.unitStatus[5] = "Blocked by not paying advance";
    $scope.unitStatus[6] = "Sold";
    $scope.unitStatus[7] = "Cancelled";
   
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

    $scope.leadId = $scope.customer.user_id;
    
     $scope.getCustPaymentHistory = function(custinfo){ 
         $scope.showPaymentHistoryView=true;
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

     
   $scope.custPayment = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'custPayment.html',
            controller: 'custPaymentCtrl2',
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

app.controller("custPaymentCtrl2", function($scope, $rootScope, $stateParams, $cookieStore, $state, httpSvc,item,$uibModalInstance,$uibModal, myService){
   // myService.convertNumberToWords($scope.unitCostSheetDetail.unitcostcal_custtotcost);
    $scope.convertNumToWords = function (numvalue)
    {
       $scope.amountInWords= myService.convertNumberToWords(numvalue);
    }
    
     $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerReceivePaymentDetail.html',
            controller: 'customerReceivePaymentDetailCtrl2',
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