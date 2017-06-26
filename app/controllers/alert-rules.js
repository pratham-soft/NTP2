app.controller("alertRulesCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Alert Rules";
    ($scope.getAlertRules = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesVwGet",
            ContentType: 'application/json',
            data: {
                "rule_user_id": $cookieStore.get('user_id'),
                "rule_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
			if(data[0].ErrorDesc!="-1 | No Records"){
				$scope.alertRules = data;
                for(var i=0; i<$scope.alertRules.length;i++){
                    if($scope.alertRules[i].rule_swtchflg==0 || $scope.alertRules[i].rule_swtchflg==undefined){
                        $scope.alertRules[i].rule_swtchflg_activate=false;
                    }
                    else{
                        $scope.alertRules[i].rule_swtchflg_activate=true;
                    }
                }
			}
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        })
    })();
    
    $scope.actDeact=function(ruleId,flagVal){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/Rules/UpdtSwtchflg",
            ContentType: 'application/json',
            data: {
                "ruleid":ruleId,
                "rule_swtchflg":flagVal,
                "rule_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
			window.location.reload();
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        })
    }
    
});


app.controller("createNewRuleCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, myService) {
    $scope.pageTitle = "Create New Alert Rule";
    $scope.EditRuleBtn = false;
    $scope.CreateRuleBtn = true;
    $scope.selected = false;
    $scope.createNewRule = {
        rule_moduleid: ''
    };
    
    
    $scope.getModulesFun = (function() {
        angular.element(".loader").show();
        myService.getModules().then(function(response) {
            $scope.res = response.data;
            $scope.modules = $scope.res;
            angular.element(".loader").hide();
        });
    })();
    /*   $scope.getModules = (function() {
           angular.element(".loader").show();
           $http({
               method: "POST",
               url: appConfig.baseUrl+"/Comp/ModulesGet",
               ContentType: 'application/json',
               data: {
                   "module_id": 0
               }
           }).success(function(data) {
               $scope.modules = data;
               angular.element(".loader").hide();
           }).error(function() {
               angular.element(".loader").hide();
           });
       })();*/

    $scope.getActionTypes = function(moduleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/ActiontypeGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId
            }
        }).success(function(data) {
            $scope.actionTypes = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }


    $scope.saveRule = function(formName, formObj) {

        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            formObj.rule_comp_guid = $cookieStore.get('comp_guid');
            formObj.rule_user_id = $cookieStore.get('user_id');
            console.log(JSON.stringify(formObj));
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/Rules/Ins",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                var res = data.ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    if((formObj.rule_actiontypeid==26) || (formObj.rule_actiontypeid==27) || (formObj.rule_actiontypeid==19) || (formObj.rule_actiontypeid==25) || (formObj.rule_actiontypeid==28)){
                        $state.go('/Action', {
                        ruleId: data.ruleid
                    });
                        if((formObj.rule_actiontypeid==19) || (formObj.rule_actiontypeid==25) || (formObj.rule_actiontypeid==28)){ 
                            $scope.preSetRule(formObj.rule_actiontypeid);  
                        }
                    }
                    else{
                        $state.go('/UpdateRule', {
                        ruleId: data.ruleid,
                        moduleId: data.rule_moduleid,
                        actionId: formObj.rule_actiontypeid
                    });
                    }
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    
   $scope.preSetRule = function(rule_actiontypeid) {		
        if(rule_actiontypeid==25 || rule_actiontypeid==19){
           var obj= [{"rulecriteria_modfield_id":"72","rulecriteria_operator":"=","rulecriteria_criteria":"2","rulecriteria_condition":"and"},{"rulecriteria_modfield_id":"65","rulecriteria_operator":">=","rulecriteria_criteria":"TodayOtr"}];
//            console.log("new object");
//            console.log(obj);
        }
       else if(rule_actiontypeid== 28){
           var obj= [{"rulecriteria_modfield_id":"76","rulecriteria_operator":"=","rulecriteria_criteria":"TodayOtrexct"}];
       }
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            if(obj[i].rulecriteriaid==undefined){
                obj[i].rulecriteriaid = 0;
            }
            obj[i].rulecriteria_rule_id = rule_actiontypeid;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
       console.log(JSON.stringify("+++++++++++++check++++++++++++"));
       console.log(JSON.stringify(obj));
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesCrit/Ins",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $state.go("/Action", {
                ruleId: rule_actiontypeid
            });
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    } 
    
    
});

app.controller("editRuleCtrl", function($scope,  $http, $state, $cookieStore, $stateParams, $filter, myService) {
    $scope.pageTitle = "Edit Alert Rule";
    var ruleid = $stateParams.ruleId;
    var moduleid = '';
    var actionId=0;
    $scope.createNewRule = {};
    $scope.modules = [{}];
    $scope.actionTypes = [{}];
    $scope.readonly = true;
    $scope.EditRuleBtn = true;
    $scope.CreateRuleBtn = false;
    // $scope.selected= '';
   
    $scope.MoveToUpdateRulePage = function() {
        if(($scope.actionTypes[0].actiontypeid==26) || ($scope.actionTypes[0].actiontypeid==27) || ($scope.actionTypes[0].actiontypeid==19) || ($scope.actionTypes[0].actiontypeid==25) || ($scope.actionTypes[0].actiontypeid==28) ){
                        $state.go('/Action', {
                        ruleId: $scope.ruleid
                    });
                    }
                    else{
                         var actionIdNo=$scope.actionTypes[0].actiontypeid;
                        $state.go('/UpdateRuleCriteria', {
                        ruleId: $scope.ruleid,
                        moduleId: $scope.modules[0].module_id,
                        actionId: actionIdNo
                    });
                    }

    };

    ($scope.geteditRule = function() {
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesVwGet",
            ContentType: 'application/json',
            data: {
                "rule_user_id": $cookieStore.get('user_id'),
                "rule_comp_guid": $cookieStore.get('comp_guid'),
                "ruleid": ruleid
            }
        }).success(function(data) {
            console.log(data);
            if (data[0].ErrorDesc == '0') {
                $scope.createNewRule.rule_description = data[0].rule_description;
                $scope.createNewRule.rule_name = data[0].rule_name;
				$scope.createNewRule.rule_actiontypeid = data[0].rule_actiontypeid;
                $scope.modules[0].module_id = data[0].rule_moduleid;
                $scope.modules[0].module_name = data[0].rule_modname;
                $scope.actionTypes[0].action_name = data[0].rule_actname;
                $scope.actionTypes[0].actiontypeid = data[0].rule_actiontypeid;
                $scope.ruleid = data[0].ruleid;
                //  $scope.selected= data[0].rule_moduleid.toString();
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });

    })();

});

app.controller("updateRuleCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile, myService, $uibModal) {

$scope.pageTitle = "Set Rule";
    var ruleId = $stateParams.ruleId;
    var moduleId = $stateParams.moduleId;
    var comp_guid= $cookieStore.get('comp_guid');
    var actionId = $stateParams.actionId;
    $scope.subModules = [];
    $scope.subModulesobj = [{
        modfieldid: '',
        modfield_name: ''
    }];

    $scope.recordType = 0;

    $scope.rules = [];
    $scope.rulesobj = {};

    $scope.getSubModules = function(moduleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId,
                "ruleid" : ruleId
            }
        }).success(function(data) {
			console.log(data);
            $scope.subModulesaddRow = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
	$scope.getSubModules(moduleId);
	
    $scope.getRuleCriteria = function(ruleId) {
		//alert("getRuleCriteria");
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RuleCriteriaGet",
            ContentType: 'application/json',
            data: {
                "rulecriteria_rule_id": ruleId,
                "rulecriteria_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
			if(data.length == 0){
				$scope.defaultRow = true;
			}
			else{
            for (var i = 0; i < data.length; i++) {
				var htmlRow = '<tr> <td> <input type="hidden" ng-model="rules[' + i + '].rulecriteriaid"/> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModulesaddRow" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option><option value=">">&#62;</option> <option value="<">&#60;</option> <option value="Starts with">Starts with</option> <option value="Ends With">Ends With</option><option value="Contains">Contains</option></select> </td> <td class="inputType"> <input type="text" class="form-control" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td> <td><button type="button" class="btn btn-default" ng-click="removeRow(rules[' + i + '].rulecriteriaid)">Remove</button></td></tr>';
				htmlRow = $compile(htmlRow)($scope);
				angular.element(".alertRuleTable").append(htmlRow);
            }
			
			for (var i = 0; i < data.length; i++) {
				$scope.rules[i] = 
					{
					rulecriteriaid: (data[i].rulecriteriaid).toString(),
                    rulecriteria_modfield_id: (data[i].modfieldid).toString(),
                    rulecriteria_operator: (data[i].rulecriteria_operator).toString(),
                    rulecriteria_criteria: (data[i].rulecriteria_criteria).toString(),
                    rulecriteria_condition: (data[i].rulecriteria_condition).toString()
				}
			}
			}
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getRuleCriteria(ruleId);
    $scope.showInput0 = true;
    $scope.getFieldValues = function(fieldId, index) {
        var fieldValues = 'fieldValues' + index;
        var showDrodown = 'showDrodown' + index;
        var showInput = 'showInput' + index;
        var disableOperator = 'disableOperator' + index;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/ModfldvaluesGet",
            ContentType: 'application/json',
            data: {
                "module_id": fieldId
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            if (data.length == 1 && data[0].ErrorDesc == "-1 | No Module field Values do not exist for this Module") {
                $scope[showDrodown] = false;
                $scope[showInput] = true;
                $scope[disableOperator] = false;
            } else {
                $scope[fieldValues] = data;
                $scope[showInput] = false;
                $scope[showDrodown] = true;
                $scope.rules[index].rulecriteria_condition = "=";
                $scope[disableOperator] = true;
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }

    $scope.addRow = function(selectedVal) {
        if (selectedVal == "" || selectedVal == undefined) {
            alert("Select a condition first...!");
            return;
        }

        var i = $(".alertRuleTable tr").length;
        var showInput = 'showInput' + i;
        var htmlRow = '<tr> <td> <input type="hidden" ng-model="rules[' + i + '].rulecriteriaid" /> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModulesaddRow" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option><option value=">">&#62;</option> <option value="<">&#60;</option> <option value="Starts with">Starts with</option> <option value="Ends With">Ends With</option><option value="Contains">Contains</option> </select> </td> <td class="inputType"> <input type="text" class="form-control" ng-show="showInput' + i + '" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td> <td><button type="button" class="btn btn-default" ng-click="removeRow(rules[' + i + '].rulecriteriaid)">Remove</button></td></tr>';

        htmlRow = $compile(htmlRow)($scope);
        angular.element(".alertRuleTable").append(htmlRow);
        $scope[showInput] = true;
    }
    
    
   $scope.removeRow = function(rulecriteriaid){
       var i = ($(".alertRuleTable tr").length)-1;
       if(rulecriteriaid != undefined){
            myService.removeCriteriaRow(comp_guid,rulecriteriaid).then(function(response){
                $scope.response= response.data;  
            });
           if((i-1)>=0){
                   $scope.rules[i-1].rulecriteria_condition=undefined; 
                }
            $scope.updateRemoveRow($scope.rules);
       }
        else{
            window.location.reload(); 
        }   
    
//     window.location.reload() ; 
  };

    
       $scope.updateRemoveRow = function(obj) {		
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            if(obj[i].rulecriteriaid==undefined){
                obj[i].rulecriteriaid = 0;
            }
            obj[i].rulecriteria_rule_id = ruleId;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
        console.log(JSON.stringify(obj));
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesCrit/Ins",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            console.log(JSON.stringify(data));
            angular.element(".loader").hide();
            window.location.reload() ;
        }).error(function() {
            angular.element(".loader").hide();
        });
    } 
    
    
    

    $scope.updateRule = function(obj) {		
//        console.log(obj);
//        console.log(JSON.stringify(obj));
        
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            if(obj[i].rulecriteriaid==undefined){
                obj[i].rulecriteriaid = 0;
            }
            obj[i].rulecriteria_rule_id = ruleId;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
//        console.log(JSON.stringify(obj));
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesCrit/Ins",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $state.go("/Action", {
                ruleId: ruleId
            });
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    
    $scope.checkQuery = function(obj){
		$scope.disableUpdateQuery = false;
       
        myService.tempGetEmbeddedMysqlQuery(comp_guid,ruleId).then(function(response){
              $scope.query= JSON.parse(response.data);
             if($scope.query[0].nVarErrorMsg =="-9999  Object reference not set to an instance of an object.")
                  {
                       alert("Sorry No Data Returned . Error Message" + $scope.query[0].nVarErrorMsg.toString());
                  }
                   
                 if($scope.query[0].nVarErrorMsg == "-9999  There is no row at position 0.")
                     {
                         alert("Sorry No Data Returned . Error Message" + $scope.query[0].nVarErrorMsg.toString());
                     }
             if($scope.query.length>0 && $scope.query.nVarErrorMsg !="-9999 Object reference not set to an instance of an object.")
                {
                     $scope.testQueryResult($scope.query);
                }
             
			})
       
        
	}
    
    $scope.testQueryResult = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'testQueryResult.html',
            controller: 'testQueryResultCtrl',
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

app.controller("updateRuleCriteriaCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile,myService,$uibModal) {	
    $scope.pageTitle = "Update Criteria Rule";
    var ruleId = $stateParams.ruleId;
    var moduleId = $stateParams.moduleId;
    var comp_guid= $cookieStore.get('comp_guid');
    var actionId= $stateParams.actionId;
    $scope.disableMatchingCondition=false;
    $scope.subModules = [];
    $scope.subModulesobj = [{
        modfieldid: '',
        modfield_name: ''
    }];

    $scope.recordType = 0;

    $scope.rules = [];
    $scope.rulesobj = {};
    
    ($scope.selectAllRecords=function(){
      if(actionId==24 || actionId==25 || actionId==26 || actionId==27 || actionId==28 || actionId==19){
            $scope.recordType=1;
            $scope.disableMatchingCondition=true;
        }  
    })();

    $scope.getSubModules = function(moduleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId,
                "ruleid" : ruleId
            }
        }).success(function(data) {
			console.log(data);
            $scope.subModulesaddRow = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
	$scope.getSubModules(moduleId);
	
    $scope.getRuleCriteria = function(ruleId) {
		//alert("getRuleCriteria");
        
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RuleCriteriaGet",
            ContentType: 'application/json',
            data: {
                "rulecriteria_rule_id": ruleId,
                "rulecriteria_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
			if(data.length == 0){
				$scope.defaultRow = true;
			}
			else{
            for (var i = 0; i < data.length; i++) {
                if(i==0){
                    var yes=true;
                }
                else{
                    var yes=false;
                }
				var htmlRow = '<tr> <td> <input type="hidden" ng-model="rules[' + i + '].rulecriteriaid"/> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModulesaddRow" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option><option value=">">&#62;</option> <option value="<">&#60;</option> <option value="Starts with">Starts with</option> <option value="Ends With">Ends With</option><option value="Contains">Contains</option></select> </td> <td class="inputType"> <input type="text" class="form-control" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td> <td><button type="button" class="btn btn-default" ng-click="removeRow(rules[' + i + '].rulecriteriaid)" ng-disabled="'+yes+'">Remove</button></td></tr>';
				htmlRow = $compile(htmlRow)($scope);
				angular.element(".alertRuleTable").append(htmlRow);
            }
			
			for (var i = 0; i < data.length; i++) {
				$scope.rules[i] = 
					{
					rulecriteriaid: (data[i].rulecriteriaid).toString(),
                    rulecriteria_modfield_id: (data[i].modfieldid).toString(),
                    rulecriteria_operator: (data[i].rulecriteria_operator).toString(),
                    rulecriteria_criteria: (data[i].rulecriteria_criteria).toString(),
                    rulecriteria_condition: (data[i].rulecriteria_condition).toString()
				}
			}
			}
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getRuleCriteria(ruleId);
    $scope.showInput0 = true;
    $scope.getFieldValues = function(fieldId, index) {
        var fieldValues = 'fieldValues' + index;
        var showDrodown = 'showDrodown' + index;
        var showInput = 'showInput' + index;
        var disableOperator = 'disableOperator' + index;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/ModfldvaluesGet",
            ContentType: 'application/json',
            data: {
                "module_id": fieldId
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            if (data.length == 1 && data[0].ErrorDesc == "-1 | No Module field Values do not exist for this Module") {
                $scope[showDrodown] = false;
                $scope[showInput] = true;
                $scope[disableOperator] = false;
            } else {
                $scope[fieldValues] = data;
                $scope[showInput] = false;
                $scope[showDrodown] = true;
                $scope.rules[index].rulecriteria_condition = "=";
                $scope[disableOperator] = true;
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }

    $scope.addRow = function(selectedVal) {
        if (selectedVal == "" || selectedVal == undefined) {
            alert("Select a condition first...!");
            return;
        }

        var i = $(".alertRuleTable tr").length;
        var showInput = 'showInput' + i;
        var htmlRow = '<tr> <td> <input type="hidden" ng-model="rules[' + i + '].rulecriteriaid" /> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModulesaddRow" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option><option value=">">&#62;</option> <option value="<">&#60;</option> <option value="Starts with">Starts with</option> <option value="Ends With">Ends With</option><option value="Contains">Contains</option> </select> </td> <td class="inputType"> <input type="text" class="form-control" ng-show="showInput' + i + '" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td> <td><button type="button" class="btn btn-default" ng-click="removeRow(rules[' + i + '].rulecriteriaid)">Remove</button></td></tr>';

        htmlRow = $compile(htmlRow)($scope);
        angular.element(".alertRuleTable").append(htmlRow);
        $scope[showInput] = true;
    }
    
    
   $scope.removeRow = function(rulecriteriaid){
       var i = ($(".alertRuleTable tr").length)-1;
       if(rulecriteriaid != undefined){
            myService.removeCriteriaRow(comp_guid,rulecriteriaid).then(function(response){
                $scope.response= response.data;  
            });
           if((i-1)>=0){
                   $scope.rules[i-1].rulecriteria_condition=undefined; 
                }
            $scope.updateRemoveRow($scope.rules);
       }
        else{
            window.location.reload() ; 
        }   
    
//     window.location.reload() ; 
  };

    
       $scope.updateRemoveRow = function(obj) {		
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            if(obj[i].rulecriteriaid==undefined){
                obj[i].rulecriteriaid = 0;
            }
            obj[i].rulecriteria_rule_id = ruleId;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
        console.log(JSON.stringify(obj));
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesCrit/Ins",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            console.log(JSON.stringify(data));
            angular.element(".loader").hide();
            window.location.reload() ;
        }).error(function() {
            angular.element(".loader").hide();
        });
    } 
    
    
    

    $scope.updateRule = function(obj) {	
        console.log("obj: ");console.log(obj);
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            if(obj[i].rulecriteriaid==undefined){
                obj[i].rulecriteriaid = 0;
            }
            obj[i].rulecriteria_rule_id = ruleId;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
    //    console.log(JSON.stringify(obj));
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesCrit/Ins",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            console.log(JSON.stringify(data));
            $state.go("/Action", {
                ruleId: ruleId
            });
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    
    $scope.checkQuery = function(obj){
		$scope.disableUpdateQuery = false;
       
        myService.tempGetEmbeddedMysqlQuery(comp_guid,ruleId).then(function(response){
              $scope.query= JSON.parse(response.data);
             if($scope.query[0].nVarErrorMsg =="-9999  Object reference not set to an instance of an object.")
                  {
                       alert("Sorry No Data Returned . Error Message" + $scope.query[0].nVarErrorMsg.toString());
                  }
                   
                 if($scope.query[0].nVarErrorMsg == "-9999  There is no row at position 0.")
                     {
                         alert("Sorry No Data Returned . Error Message" + $scope.query[0].nVarErrorMsg.toString());
                     }
             if($scope.query.length>0 && $scope.query.nVarErrorMsg !="-9999 Object reference not set to an instance of an object.")
                {
                     $scope.testQueryResult($scope.query);
                }
             
			})
       
        
	}
    
    $scope.testQueryResult = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'testQueryResult.html',
            controller: 'testQueryResultCtrl',
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

app.controller("testQueryResultCtrl", function($scope,  $uibModalInstance,item) {
	$(function(){
		 $scope.query = item;
		
	});

	$scope.ok = function(){
		$uibModalInstance.close();
	}
});

app.controller("actionCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $rootScope, $filter, $compile, $uibModal, myService) {
    $scope.pageTitle = "Choose Action";
    $scope.showTempDropDown = true;
    $scope.addEditorBtn=true;
    var ruleId = $stateParams.ruleId;
    $scope.action = {
        actionType: "email",
        template: ""
    }
    /* $scope.saveAction = function(formName, formObj){
         $state.go("/Schedule",{
                 ruleId: ruleId
         });
     }*/
    $scope.newSave="true";  // If it is a new new save of rule , False if it is a update
    
     
    $scope.getMergedFieldTypes = (function(){
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/ModulesGetAlrt",
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
    
    
     $scope.getFields = function(moduleId){
        var ruleid =0;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId,
                "ruleid" : ruleid
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
        $scope.template.copyMergedFields = '$'+field+'$ ';
        $scope.addEditorBtn=false;
    }
    $scope.action.smsTxt="";
    $scope.addEditor = function(){
           $scope.action.smsTxt= $scope.action.smsTxt+ " " + $scope.template.copyMergedFields;
           $scope.addEditorBtn=false;
    };
    
    
    $scope.saveRuleEml = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/rulEmltmplt/Ins",
                ContentType: 'application/json',
                data: {
                    "tempemail_comp_guid": $cookieStore.get('comp_guid'),
                    "tempemail_createdby": $cookieStore.get('user_id'),
                    "tempemail_ruleid": ruleId,
                    "tempemail_recpcc": formObj.cctxtar,
                    "tempemail_recpbcc": formObj.bcctxtar,
                    "tempemailid": formObj.templateid,
                    "tempemail_rule": $scope.newSave,
                    "tempemail_subject":formObj.subject
                }
            }).success(function(data) {
                if (data.user_id != 0) {
                    $state.go("/Schedule", {
                        ruleId: ruleId
                    });
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Your Form is not valid")
            console.log($scope[formName].$error)
        }
    };
    $scope.getEmailTemplsFun = (function() {
        angular.element(".loader").show();
        myService.getEmailTempls($cookieStore.get('comp_guid')).then(function(response) {
            $scope.emltmlptList = response.data;
            console.log($scope.emltmlptList);
            angular.element(".loader").hide();
        });
    })();

    $scope.getEmailTmplt = function(ruleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/EmailTmpltGet",
            ContentType: 'application/json',
            data: {
                "tempemail_ruleid": ruleId,
                "tempemail_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            if(data[0].ErrorDesc!="-1|No Template Exists for this Record"){
                $scope.newSave="false";
                $scope.tempemail_name=data[0].tempemail_name;
				$scope.showTempDropDown = true;
				$scope.action.tempName = data[0].tempemail_name;
                $scope.action.cctxtar = data[0].tempemail_recpcc;
                $scope.action.bcctxtar = data[0].tempemail_recpbcc;
                $scope.action.subject = data[0].tempemail_subject;
				$scope.action.tempBody = data[0].tempemail_body;
                $scope.action.templateid = data[0].tempemailid.toString();
				
				$("#contentEditor").summernote("code", $scope.action.tempBody);
            }
            else
                {
                   $scope.newSave="true";  
                }
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getEmailTmplt(ruleId);
	
	
	$scope.previewTemplate = function(tempObj){
		var modalInstance = $uibModal.open({
            templateUrl: 'previewTemp.html',
            controller: 'previewTempCtrl',
            scope: $scope, 
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return tempObj;
                }
            }
        });
    }
});

// $scope.getEmailTemplsFun();

app.controller("previewTempCtrl", function($scope,  $uibModalInstance, $window, $compile, $http, $cookieStore, $stateParams, item) {
	var tempId = item.tempId;
	var ruleId = $stateParams.ruleId;
	$(function(){
		var mailBody = item.tempBody;
		$("#contentEditor").summernote("code", mailBody);
	});
    $scope.ok = function(){
		$uibModalInstance.close();
	}
	$scope.saveTemplate = function(){
		var templateBody = $("#contentEditor").summernote("code");
		$http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/Emltmplt/Ins",
                ContentType: 'application/json',
                data: {
                    "tempemail_comp_guid": $cookieStore.get('comp_guid'),
                    "tempemail_createdby": $cookieStore.get('user_id'),
                    "tempemail_ruleid":ruleId,
                    /*"tempemail_attachment":2,
                    "tempemail_recpto":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_recpcc":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_recpbcc":"diwakar.rao@gmail.com;divu26@yahoo.com;diw26@yahoo.com",
                    "tempemail_name" :tmpname,
                    "tempemail_subject": tmpsubj,*/
                    "tempemail_body":templateBody, 
                    "tempemailid": tempId
                }
            }).success(function(data) {
				console.log(data);
                /*if (data.user_id != 0) {
                    $state.go("/EmailTemplates");
                } else {
                    alert("Error! " + data.user_ErrorDesc);
                }*/
                angular.element(".loader").hide();
                alert("template Save!")
                $scope.ok();
                $window.location.reload();
            }).error(function() {
                angular.element(".loader").hide();
            });
	}
	
});

app.controller("scheduleCtrl", function($scope,  $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.monthDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    $scope.pageTitle = "Schedule Alert";
    $scope.ruleId = $stateParams.ruleId;
    $scope.minDate = new Date().toDateString();
    
    ($scope.geteditRule = function() {
        $http({
            method: "POST",
            url: appConfig.baseUrl+"/Comp/RulesVwGet",
            ContentType: 'application/json',
            data: {
                "rule_user_id": $cookieStore.get('user_id'),
                "rule_comp_guid": $cookieStore.get('comp_guid'),
                "ruleid": $scope.ruleId
            }
        }).success(function(data) {
            console.log(data);
            if (data[0].ErrorDesc == '0') {
                var startDate = data[0].rule_trigstartdate;
                startDate = startDate.split("T");
                startDate = startDate[0];
                startDate = startDate.split("-").reverse().join("/");
                
                var endDate = data[0].rule_trigenddate;
                endDate = endDate.split("T");
                endDate = endDate[0];
                endDate = endDate.split("-").reverse().join("/");
                $scope.scheduleAlert = {
                    execStartDate:startDate,
                    execEndDate:endDate,
                    frequency: data[0].rule_freq.toString()
                };
				
				if (data[0].rule_freq == 3) {
					$scope.scheduleAlert.weekDay = data[0].rule_schdwkday.toString();
				} else if(data[0].rule_freq == 4){
					$scope.scheduleAlert.monthDate = data[0].rule_schdwkday.toString();
				}
				
			}
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });

    })();
    
  
    
    $scope.checkErr = function(startDate,endDate) {
    $scope.errMessage = '';
    var curDate = new Date();
    startDate = startDate.split("/").reverse().join("-");
    endDate = endDate.split("/").reverse().join("-");  
    if((new Date(startDate) > new Date(endDate)) && (endDate!= "0001-01-01")){
      alert('End Date should be greater than start date'); 
        $scope.scheduleAlert.execEndDate='';
    }
    if(new Date(startDate) < curDate){
      alert ('Start date should not be before today.');
    }
};
    

    $scope.saveSchedule = function(formObj, formName) {
//        $scope.checkErr(formObj.execStartDate,formObj.execEndDate);
        $scope.submit = true;
        var ruleId = $stateParams.ruleId;
        var exstrtdt = formObj.execStartDate.split("/").reverse().join("-");
        var exendt = formObj.execEndDate.split("/").reverse().join("-");
        var schdwkday = '';
        if (formObj.frequency == 3) {
            schdwkday = formObj.weekDay;
        } else if(formObj.frequency == 4){
			schdwkday = formObj.monthDate;
		}
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: appConfig.baseUrl+"/Comp/Rules/UpdtSchd",
                ContentType: 'application/json',
                data: {
                    "rule_comp_guid": $cookieStore.get('comp_guid'),
                    "ruleid": ruleId,
                    "rule_trigstartdate": exstrtdt,
                    "rule_trigenddate": exendt,
                    "rule_freq": formObj.frequency,
                    "rule_schdwkday": schdwkday,
					"rule_ecectime": formObj.execTime,
                    "rule_alterttyp": 1
                }
            }).success(function(data) {
                console.log(data.ErrorDesc);
                if (data.user_id != 0) {
                    $state.go("/AlertRules", {
                        ruleId: ruleId
                    });
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