app.controller("alertRulesCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Alert Rules";
    ($scope.getAlertRules = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RulesVwGet",
            ContentType: 'application/json',
            data: {
                "rule_user_id": $cookieStore.get('user_id'),
                "rule_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
			if(data[0].ErrorDesc!="-1 | No Records"){
				$scope.alertRules = data;	
			}
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        })
    })();
});
app.controller("createNewRuleCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, myService) {
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
               url: "http://120.138.8.150/pratham/Comp/ModulesGet",
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
            url: "http://120.138.8.150/pratham/Comp/ActiontypeGet",
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
                url: "http://120.138.8.150/pratham/Comp/Rules/Ins",
                ContentType: 'application/json',
                data: formObj
            }).success(function(data) {
                var res = data.ErrorDesc;
                var resSplit = res.split('|');
                if (resSplit[0] == 0) {
                    $state.go('/UpdateRule', {
                        ruleId: data.ruleid,
                        moduleId: data.rule_moduleid
                    });
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
});

app.controller("editRuleCtrl", function($scope, $http, $state, $cookieStore, $stateParams, $filter, myService) {
    $scope.pageTitle = "Edit Alert Rule";
    var ruleid = $stateParams.ruleId;
    var moduleid = '';
    $scope.createNewRule = {};
    $scope.modules = [{}];
    $scope.actionTypes = [{}];
    $scope.readonly = true;
    $scope.EditRuleBtn = true;
    $scope.CreateRuleBtn = false;
    // $scope.selected= '';
    $scope.MoveToUpdateRulePage = function() {
        $state.go('/UpdateRuleCriteria', {
            ruleId: $scope.ruleid,
            moduleId: $scope.modules[0].module_id
        });

    };

    ($scope.geteditRule = function() {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RulesVwGet",
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

app.controller("updateRuleCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Set Rule";
    var ruleId = $stateParams.ruleId;
    var moduleId = $stateParams.moduleId;
    $scope.subModules = [{}];
    $scope.recordType = 0;

    $scope.rules = [{}];

    $scope.getSubModules = function(moduleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId
            }
        }).success(function(data) {
            $scope.subModules = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getRuleCriteria = function(ruleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RuleCriteriaGet",
            ContentType: 'application/json',
            data: {
                "rulecriteria_rule_id": ruleId,
                "rulecriteria_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.ruleCriteria = data[0];
            $scope.subModules[0].modfieldid = $scope.ruleCriteria.modfieldid;
            $scope.subModules[0].modfield_name = $scope.ruleCriteria.modfield_name;
            $scope.rules[0].rule_criteria_operator = $scope.ruleCriteria.rulecriteria_operator;
            $scope.rules[0].rulecriteria_criteria = $scope.ruleCriteria.rulecriteria_criteria;
            $scope.rules[0].rulecriteria_condition = $scope.ruleCriteria.rulecriteria_condition;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getSubModules(moduleId);
    //  $scope.getRuleCriteria(ruleId);
    $scope.showInput0 = true;
    $scope.getFieldValues = function(fieldId, index) {
        var fieldValues = 'fieldValues' + index;
        var showDrodown = 'showDrodown' + index;
        var showInput = 'showInput' + index;
        var disableOperator = 'disableOperator' + index;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ModfldvaluesGet",
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
            alert("AA");
            return;
        }

        var i = $(".alertRuleTable tr").length;
        var showInput = 'showInput' + i;
        var htmlRow = '<tr> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModules" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option> <option value="<>">&#60;&#62;</option> <option value=">">&#62;</option> <option value="<">&#60;</option> <option value=">=">&#62;=</option> <option value="<=">&#60;</option> </select> </td> <td class="inputType"> <input type="text" class="form-control" ng-show="showInput' + i + '" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td></tr>';

        htmlRow = $compile(htmlRow)($scope);
        angular.element(".alertRuleTable").append(htmlRow);
        $scope[showInput] = true;
    }

    $scope.updateRule = function(obj) {
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            obj[i].rulecriteria_rule_id = ruleId;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RulesCrit/Ins",
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
});

app.controller("updateRuleCriteriaCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.pageTitle = "Update Criteria Rule";
    var ruleId = $stateParams.ruleId;
    var moduleId = $stateParams.moduleId;
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
            url: "http://120.138.8.150/pratham/Comp/SubModulesGet",
            ContentType: 'application/json',
            data: {
                "module_id": moduleId
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
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RuleCriteriaGet",
            ContentType: 'application/json',
            data: {
                "rulecriteria_rule_id": ruleId,
                "rulecriteria_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
			console.log(data);
            for (var i = 0; i < data.length; i++) {
				
				var htmlRow = '<tr> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModulesaddRow" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option> <option value="<>">&#60;&#62;</option> <option value=">">&#62;</option> <option value="<">&#60;</option> <option value=">=">&#62;=</option> <option value="<=">&#60;</option> </select> </td> <td class="inputType"> <input type="text" class="form-control" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td></tr>';
				htmlRow = $compile(htmlRow)($scope);
				angular.element(".alertRuleTable").append(htmlRow);
				
                /*$scope.subModulesobj.modfieldid = data[i].modfieldid;
                $scope.subModulesobj.modfield_name = data[i].modfield_name;
                $scope.rulesobj.rule_criteria_operator = data[i].rulecriteria_operator;
                $scope.rulesobj.rulecriteria_criteria = data[i].rulecriteria_criteria;
                $scope.rulesobj.rulecriteria_condition = data[i].rulecriteria_condition;
                $scope.subModules.push($scope.subModulesobj);
                $scope.rules.push($scope.rulesobj);
                $scope.subModulesobj = {};
                $scope.rulesobj = {};*/
            }
			
			for (var i = 0; i < data.length; i++) {
				$scope.rules[i] = 
					{
					rulecriteria_modfield_id: (data[i].modfieldid).toString(),
                    rulecriteria_operator: (data[i].rulecriteria_operator).toString(),
                    rulecriteria_criteria: (data[i].rulecriteria_criteria).toString(),
                    rulecriteria_condition: (data[i].rulecriteria_condition).toString()
				}
			}
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getRuleCriteria(ruleId);
    /*$scope.showInput0 = true;*/
    $scope.getFieldValues = function(fieldId, index) {
        var fieldValues = 'fieldValues' + index;
        var showDrodown = 'showDrodown' + index;
        var showInput = 'showInput' + index;
        var disableOperator = 'disableOperator' + index;
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/ModfldvaluesGet",
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
            alert("AA");
            return;
        }

        var i = $(".alertRuleTable tr").length;
        var showInput = 'showInput' + i;
        var htmlRow = '<tr> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_modfield_id" ng-change="getFieldValues(rules[' + i + '].rulecriteria_modfield_id,' + i + ')"> <option value="">Field</option> <option ng-repeat="x in subModulesaddRow" value="{{x.modfieldid}}">{{x.modfield_name}}</option> </select> </td> <td> <select class="form-control" class="form-control" ng-model="rules[' + i + '].rulecriteria_operator" ng-disabled="disableOperator' + i + '"> <option value="">Operator</option> <option value="=">=</option> <option value="<>">&#60;&#62;</option> <option value=">">&#62;</option> <option value="<">&#60;</option> <option value=">=">&#62;=</option> <option value="<=">&#60;</option> </select> </td> <td class="inputType"> <input type="text" class="form-control" ng-show="showInput' + i + '" placeholder="Value" ng-model="rules[' + i + '].rulecriteria_criteria"/> <select ng-show="showDrodown' + i + '" class="form-control" ng-model="rules[' + i + '].rulecriteria_criteria"> <option value="">Value</option> <option ng-repeat="x in fieldValues' + i + '" value="{{x.modfieldvalues_defdbvalue}}">{{x.modfieldvalues_value}}</option> </select> </td> <td> <select class="form-control" ng-model="rules[' + i + '].rulecriteria_condition"> <option value="">Condition</option> <option value="and">AND</option> <option value="or">OR</option> </select> </td> <td><button type="button" class="btn btn-default" ng-click="addRow(rules[' + i + '].rulecriteria_condition)">Add</button></td></tr>';

        htmlRow = $compile(htmlRow)($scope);
        angular.element(".alertRuleTable").append(htmlRow);
        $scope[showInput] = true;
    }

    $scope.updateRule = function(obj) {		
        angular.element(".loader").show();
        for (i = 0; i < obj.length; i++) {
            obj[i].rulecriteria_rule_id = ruleId;
            obj[i].rule_user_id = $cookieStore.get('user_id');
            obj[i].rulecriteria_comp_guid = $cookieStore.get('comp_guid');
        }
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RulesCrit/Ins",
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
});

app.controller("actionCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile, $uibModal, myService) {
    $scope.pageTitle = "Choose Action";
	$scope.showTempDropDown = true;
	
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
    $scope.saveRuleEml = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/rulEmltmplt/Ins",
                ContentType: 'application/json',
                data: {
                    "tempemail_comp_guid": $cookieStore.get('comp_guid'),
                    "tempemail_createdby": $cookieStore.get('user_id'),
                    "tempemail_ruleid": ruleId,
                    "tempemail_recpcc": formObj.cctxtar,
                    "tempemail_recpbcc": formObj.bcctxtar,
                    "tempemailid": formObj.templateid,
                    "tempemail_rule": "true"
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
            angular.element(".loader").hide();
        });
    })();

    $scope.getEmailTmplt = function(ruleId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/EmailTmpltGet",
            ContentType: 'application/json',
            data: {
                "tempemail_ruleid": ruleId,
                "tempemail_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(JSON.stringify(data));
            if(data.length!=0){
				$scope.showTempDropDown = false;
				$scope.action.tempName = data[0].tempemail_name;
                $scope.action.cctxtar = data[0].tempemail_recpcc;
                $scope.action.bcctxtar = data[0].tempemail_recpbcc;
                $scope.action.subject = data[0].tempemail_subject;
				$scope.action.tempBody = data[0].tempemail_body;
                $scope.action.templateid = data[0].tempemailid.toString();
            }
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    }
    $scope.getEmailTmplt(ruleId);
	
	$scope.previewTemplate = function(tempContent){
		var modalInstance = $uibModal.open({
            templateUrl: 'previewTemp.html',
            controller: 'previewTempCtrl',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return tempContent;
                }
            }
        });
    }
});

// $scope.getEmailTemplsFun();

app.controller("previewTempCtrl", function($scope, $uibModalInstance, $compile, item) {
	$scope.tempContent = item;
	$scope.ok = function(){
		$uibModalInstance.close();
	}
});

app.controller("scheduleCtrl", function($scope, $http, $cookieStore, $state, $stateParams, $filter, $compile) {
    $scope.monthDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    $scope.pageTitle = "Schedule Alert";
    $scope.ruleId = $stateParams.ruleId;
    
    ($scope.geteditRule = function() {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Comp/RulesVwGet",
            ContentType: 'application/json',
            data: {
                "rule_user_id": $cookieStore.get('user_id'),
                "rule_comp_guid": $cookieStore.get('comp_guid'),
                "ruleid": $scope.ruleId
            }
        }).success(function(data) {
            console.log(data);
            if (data[0].ErrorDesc == '0') {
                $scope.scheduleAlert = {
                    execStartDate:data[0].rule_trigstartdate,
                    execEndDate:data[0].rule_trigenddate
                }
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });

    })();

    $scope.saveSchedule = function(formObj, formName) {
        $scope.submit = true;
        var ruleId = $stateParams.ruleId;
        var exendt = formObj.execEndDate.split("/").reverse().join("-");
        var exstrtdt = formObj.execEndDate.split("/").reverse().join("-");
        var schdwkday = '';
        if (formObj.frequency == 3) {
            schdwkday = formObj.weekDay;
        } else if (formObj.frequency == 4) {
            schdwkday = formObj.monthDate
        }
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            console.log(formObj);
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/Rules/UpdtSchd",
                ContentType: 'application/json',
                data: {
                    "rule_comp_guid": $cookieStore.get('comp_guid'),
                    "ruleid": ruleId,
                    "rule_trigstartdate": exstrtdt,
                    "rule_trigenddate": exstrtdt,
                    "rule_freq": formObj.frequency,
                    "rule_schdwkday": schdwkday,
                    "rule_alterttyp": 1
                }
            }).success(function(data) {
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