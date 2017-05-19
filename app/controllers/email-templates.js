app.controller("editEmailTemplateCtrl", function($scope, $http, $cookieStore, $state, $compile, $stateParams, myService) {
    var Tempemail_Id = $stateParams.tempemailid;
    var tempbpdy = $('#contentEditor').summernote('code');

    $scope.pageTitle = "Edit Email Template";
    
    ($scope.getEmlTmpl = function() {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/Emltmplt/gt",
            ContentType: 'application/json',
            data: {
                "tempemail_comp_guid": $cookieStore.get('comp_guid'),
                "tempemailid": Tempemail_Id
            }
        }).success(function(data) {
            //console.log(data);
           
           
        $scope.template = {
                templateNm: data[0].tempemail_name,
                templateSub: data[0].tempemail_subject,
               tempbpdy: data[0].tempemail_body
            };
            
        $("#contentEditor").summernote("code", $scope.template.tempbpdy);
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();    
    
     $scope.editEmltmplt = function(formObj, formName) {
        $scope.submit = true;
        var tmpcontedt =  $('#contentEditor').summernote('code');
        var tmpname = formObj.templateNm.$viewValue;
        var tmpsubj = formObj.templateSub.$viewValue;      
        var Tempemail_Id =0;
        if ($stateParams.tempemailid > 0)
            Tempemail_Id = $stateParams.tempemailid;
        
            
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/Emltmplt/Ins",
                ContentType: 'application/json',
                data: {
                    "tempemail_comp_guid": $cookieStore.get('comp_guid'),
                    "tempemail_createdby": $cookieStore.get('user_id'),
                    "tempemail_ruleid":0,
                    "tempemail_attachment":2,
                    "tempemail_recpto":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_recpcc":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_recpbcc":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_name" :tmpname,
                    "tempemail_subject": tmpsubj,
                    "tempemail_body":tmpcontedt, 
                    "tempemailid": Tempemail_Id
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/EmailTemplates");
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
  
});
app.controller("emailTemplatesCtrl", function($scope, $http, $cookieStore, $state, $stateParams,myService, $filter, $compile) {
        $scope.pageTitle = "Email Templates";
    $scope.getEmailTempls = (function() {
        angular.element(".loader").show();
        myService.getEmailTempls($cookieStore.get('comp_guid')).then(function(response) {
            $scope.emailTemplates = response.data;
            angular.element(".loader").hide();
        });
    })();
  /*  ($scope.getEmailTempls = function(){
		angular.element(".loader").show();
		$http({
			method:"POST",
			url:"http://120.138.8.150/pratham/Comp/Emltmplt/gt",
			ContentType: 'application/json',
            data: {
			  "tempemailid" : 0,
			  "tempemail_comp_guid" : $cookieStore.get('comp_guid')
			}
		}).success(function(data){
			$scope.emailTemplates = data;
			angular.element(".loader").hide();
		}).error(function(){
			angular.element(".loader").hide();
		})
	})()*/;
    
    
});
app.controller("createNewEmailTemplateCtrl", function($scope, $rootScope, $http, $state,$stateParams, $cookieStore) {
    $scope.pageTitle = "Create New Email Template";
    $scope.template = {
        mergeFieldType:"",
        fields:""        
    };
   
    ($scope.loadEditor = function(){
            $('#contentEditor').summernote();
    })();
    
    $scope.getMergedFieldTypes = (function(){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ModulesGetAlrt",
            ContentType: 'application/json',
            data: {
                "module_id": 0
            }
        }).success(function(data) {
            $scope.mergeFieldTypes = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    
    $scope.addEmltmplt = function(formObj, formName) {
        $scope.submit = true;
        var tmpcontedt =  $('#contentEditor').summernote('code');
        var tmpname = formObj.templateNm.$viewValue;
        var tmpsubj = formObj.templateSub.$viewValue;      
        var Tempemail_Id =0;
        /*if ($stateParams.tempemailid > 0)
            Tempemail_Id = $stateParams.tempemailid;*/
        
            
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/Emltmplt/Ins",
                ContentType: 'application/json',
                data: {
                    "tempemail_comp_guid": $cookieStore.get('comp_guid'),
                    "tempemail_createdby": $cookieStore.get('user_id'),
                    "tempemail_ruleid":0,
                    "tempemail_attachment":2,
                    "tempemail_recpto":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_recpcc":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_recpbcc":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_name" :tmpname,
                    "tempemail_subject": tmpsubj,
                    "tempemail_body":tmpcontedt, 
                    "tempemailid": Tempemail_Id
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/EmailTemplates");
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    $scope.getFields = function(moduleId){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId,
                "ruleid" : ruleId
            }
        }).success(function(data) {
            if(data[0].modfield_ErrorDesc == "-1 | Module fields do not exist for this Module"){
                $rootScope.appMsg = "Module fields do not exist for this Module";
                $rootScope.showAppMsg = true;
                $scope.fields = [];
                $scope.template.fields = "";
                $scope.template.copyMergedFields = "";
            }
            else{
                $rootScope.appMsg = "";
                $rootScope.showAppMsg = false;
                $scope.fields = data;   
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    
    $scope.copyMergedFields = function(field){
        $scope.template.copyMergedFields = field;
    }
});