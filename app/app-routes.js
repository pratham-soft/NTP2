app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'partials/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .state('/Leads', {
            url: '/Leads',
            templateUrl: 'partials/leads.html',
            controller: 'leadsCtrl'
        })
        .state('/AddLead', {
            url: '/AddLead',
            templateUrl: 'partials/addLead.html',
            controller: 'addLeadCtrl'
        })
        .state('/Customers', {
            url: '/Customers',
            templateUrl: 'partials/customers.html',
            controller: 'customerCtrl'
        })
        .state('/Campaigns', {
            url: '/Campaigns',
            templateUrl: 'partials/campaignDetails.html',
            controller: 'campaignDetailCtrl'
        })
        .state('/EditLead', {
            url: '/EditLead/:leadID',
            templateUrl: 'partials/addLead.html',
            controller: 'editLeadCtrl'
        })
        .state('/ProjectDetails', {
            url: '/ProjectDetails/:leadID',
            templateUrl: 'partials/projectDetails.html',
            controller: 'projectDetailsCtrl'
        })
        .state('/ExchangeUnit', {
            url: '/ExchangeUnit/:leadID',
            templateUrl: 'partials/exchangeUnit.html',
            controller: 'exchangeUnitCtrl'
        })
        .state('/ConvertCustomer', {
            url: '/ConvertCustomer/:action/:leadID',
            templateUrl: 'partials/convertCustomer.html',
            controller: 'convertCustomerCtrl'
        })
        .state('/AddAgent', {
            url: '/AddAgent',
            templateUrl: 'partials/addAgent.html',
            controller: 'addAgentCtrl'
        })
        .state('/Agents', {
            url: '/Agents',
            templateUrl: 'partials/agents.html',
            controller: 'agentsCtrl'
        })
        .state('/EditAgent', {
            url: '/EditAgent/:agentID',
            templateUrl: 'partials/addAgent.html',
            controller: 'editAgentCtrl'
        })
        .state('/ProspectsUnitAllocation', {
            url: '/ProspectsUnitAllocation',
            templateUrl: 'partials/prospectsUnitAllocation.html',
            controller: 'prospectsUnitAllocationCtrl'
        })
        .state('/Projects', {
            url: '/Projects',
            templateUrl: 'partials/projects.html',
            controller: 'projectsCtrl'
        })
        .state('/AddProject', {
            url: '/AddProject',
            templateUrl: 'partials/addProject.html',
            controller: 'addProjectCtrl'
        })
        .state('/EditProject', {
            url: '/EditProject/:projId',
            templateUrl: 'partials/addProject.html',
            controller: 'editProjectCtrl'
        })
        .state('/Phases', {
            url: '/Phases',
            templateUrl: 'partials/phases.html',
            controller: 'phasesCtrl'
        })
        .state('/AccessRights', {
            url: '/AccessRights',
            templateUrl: 'partials/accessRights.html',
            controller: 'accessRightsCtrl'
        })
        .state('/AddPhases', {
            url: '/AddPhases/:projId',
            templateUrl: 'partials/addPhases.html',
            controller: 'addPhasesCtrl'
        })
        .state('/EditPhases', {
            url: '/EditPhases/:projId/:phaseId',
            templateUrl: 'partials/addPhases.html',
            controller: 'editPhasesCtrl'
        })
        .state('/AddUnit', {
            url: '/AddUnit/:projId/:phaseId',
            templateUrl: 'partials/addUnit.html',
            controller: 'addUnitCtrl'
        })
        .state('/EditUnit', {
            url: '/EditUnit/:projId/:phaseId',
            templateUrl: 'partials/addUnit.html',
            controller: 'editUnitCtrl'
        })
        .state('/UnitGeneration', {
            url: '/UnitGeneration/:projId/:phaseId/:blockId',
            templateUrl: 'partials/unitGeneration.html',
            controller: 'unitGenerationCtrl'
        })
        .state('/Units', {
            url: '/Units/:projId/:phaseId/:blockId',
            templateUrl: 'partials/units.html',
            controller: 'unitsCtrl'
        })
        .state('/CostSheetTemplate', {
            url: '/CostSheetTemplate',
            templateUrl: 'partials/costSheetTemplate.html',
            controller: 'costSheetTemplateCtrl'
        })
        .state('/BlockCostSheet', {
            url: '/BlockCostSheet',
            templateUrl: 'partials/blockCostSheet.html',
            controller: 'blockCostSheetCtrl'
        })
        .state('/EditBlockCostSheet', {
            url: '/EditBlockCostSheet/:blockId',
            templateUrl: 'partials/editBlockCostSheet.html',
            controller: 'editBlockCostSheetCtrl'
        })
      .state('/unitListingAfterEdit', {
            url: '/unitListingAfterEdit/:blockId',
            templateUrl: 'partials/unitListingAfterEdit.html',
            controller: 'unitListingAfterEditCtrl'
        })
        .state('/EditCostSheetTemplate', {
            url: '/EditCostSheetTemplate/:templateId',
            templateUrl: 'partials/costSheetTemplate.html',
            controller: 'costSheetTemplateCtrl'
        })
        .state('/CostSheetTemplates', {
            url: '/CostSheetTemplates',
            templateUrl: 'partials/costSheetTemplates.html',
            controller: 'costSheetTemplatesCtrl'
        })
        .state('/BlockStage', {
            url: '/BlockStage',
            templateUrl: 'partials/blockStage.html',
            controller: 'blockStageCtrl'
        })
        .state('/PaymentSchedule', {
            url: '/PaymentSchedule',
            templateUrl: 'partials/paymentSchedule.html',
            controller: 'paymentScheduleCtrl'
        })
        .state('/EmployeeDetails', {
            url: '/EmployeeDetails',
            templateUrl: 'partials/employeeDetails.html',
            controller: 'employeeDetailsCtrl'
        })
        .state('/AddEmployee', {
            url: '/AddEmployee',
            templateUrl: 'partials/addEmployee.html',
            controller: 'addEmployeeCtrl'
        })
        .state('/EditEmployee', {
            url: '/EditEmployee/:employeeId',
            templateUrl: 'partials/addEmployee.html',
            controller: 'editEmployeeCtrl'
        })
        .state('/Heirarchy', {
            url: '/Heirarchy',
            templateUrl: 'partials/heirarchy.html',
            controller: 'heirarchyCtrl'
        })
        .state('/SalaryComponentDetails', {
            url: '/SalaryComponentDetails',
            templateUrl: 'partials/salaryComponentDetails.html',
            controller: 'salaryComponentDetailsCtrl'
        })
        .state('/AddSalaryComponent', {
            url: '/AddSalaryComponent',
            templateUrl: 'partials/addSalaryComponent.html',
            controller: 'addSalaryComponentCtrl'
        })
        .state('/EditSalaryComponent', {
            url: '/EditSalaryComponent/:salaryHeadId',
            templateUrl: 'partials/addSalaryComponent.html',
            controller: 'editSalaryComponentCtrl'
        })
        .state('/AddDepartment', {
            url: '/AddDepartment',
            templateUrl: 'partials/addDepartment.html',
            controller: 'addDepartmentCtrl'
        })
        .state('/ApplyCostSheet', {
            url: '/ApplyCostSheet/:projectId/:phaseId/:blockId',
            templateUrl: 'partials/applyCostSheet.html',
            controller: 'applyCostSheetCtrl'
        })
        .state('/GenerateCostSheet', {
            url: '/GenerateCostSheet/:blockId',
            templateUrl: 'partials/generateCostSheet.html',
            controller: 'generateCostSheetCtrl'
        })
        .state('/GeneratedCostSheetDetails', {
            url: '/GeneratedCostSheetDetails/:blockId',
            templateUrl: 'partials/generateCostSheet.html',
            controller: 'generatedCostSheetDetailsCtrl'
        })
        .state('/Attendance', {
            url: '/Attendance',
            templateUrl: 'partials/attendance.html',
            controller: 'attendanceCtrl'
        })
        .state('/UnitsListing', {
            url: '/UnitsListing',
            templateUrl: 'partials/unitsListing.html',
            controller: 'unitsListingCtrl'
        })
        .state('/AlertRules', {
            url: '/AlertRules',
            templateUrl: 'partials/alertRules.html',
            controller: 'alertRulesCtrl'
        })
    
    
        .state('/EditPlot', {
            url: '/EditPlot/:projId/:phaseId/:blockId',
            templateUrl: 'partials/editPlot.html',
            controller: 'plotGenerationCtrl'
        })
        .state('/EditVillas', {
            url: '/EditVillas/:projId/:phaseId/:blockId',
            templateUrl: 'partials/editVillas.html',
            controller: 'villaGenerationCtrl'
        })
        .state('/CreateNewRule', {
            url: '/CreateNewRule',
            templateUrl: 'partials/createNewRule.html',
            controller: 'createNewRuleCtrl'
        })
        .state('/EditRule', {
            url: '/EditRule/:ruleId',
            templateUrl: 'partials/editRule.html',
            controller: 'editRuleCtrl'
        })
        .state('/SalesFunnel', {
            url: '/SalesFunnel',
            templateUrl: 'partials/salesFunnelListing.html',
            controller: 'salesFunnelCtrl'
        })
        .state('/Prospects', {
            url: '/Prospects',
            templateUrl: 'partials/prospects.html',
            controller: 'updateProspectsCtrl'
        })
        /*.state('/UpdateProspects', {
            url: '/UpdateProspects',
            templateUrl: 'partials/updateProspects.html',
            controller: 'updateProspectsCtrl'
        })*/
        .state('/AddProspect', {
            url: '/AddProspect',
            templateUrl: 'partials/addProspect.html',
            controller: 'addProspectCtrl'
        })
        .state('/EditProspect', {
            url: '/EditProspect/:leadID',
            templateUrl: 'partials/addProspect.html',
            controller: 'editProspectCtrl'
        })
        .state('/SiteVisitListing', {
            url: '/SiteVisitListing',
            templateUrl: 'partials/siteVisitListing.html',
            controller: 'siteVisitListingCtrl'
        })
        .state('/UpdateRule', {
            url: '/UpdateRule/:ruleId/:moduleId/:actionId',
            templateUrl: 'partials/updateRule.html',
            controller: 'updateRuleCtrl'
        })
      .state('/UpdateRuleCriteria', {
            url: '/UpdateRuleCriteria/:ruleId/:moduleId/:actionId',
            templateUrl: 'partials/updateRuleCriteria.html',
            controller: 'updateRuleCriteriaCtrl'
        })
        .state('/Action', {
            url: '/Action/:ruleId',
            templateUrl: 'partials/action.html',
            controller: 'actionCtrl'
        })
        .state('/Schedule', {
            url: '/Schedule/:ruleId',
            templateUrl: 'partials/schedule.html',
            controller: 'scheduleCtrl'
        })
        .state('/EmailTemplates', {
            url: '/EmailTemplates',
            templateUrl: 'partials/emailTemplates.html',
            controller: 'emailTemplatesCtrl'
        })
        .state('/CreateNewEmailTemplate', {
            url: '/CreateNewEmailTemplate',
            templateUrl: 'partials/createNewEmailTemplate.html',
            controller: 'createNewEmailTemplateCtrl'
        })
      .state('/EditEmailTemplate', {
            url: '/EditEmailTemplate/:tempemailid',
            templateUrl: 'partials/createNewEmailTemplate.html',
            controller: 'editEmailTemplateCtrl'
        })
        .state('/UnitVwEdit', {
            url: '/UnitVwEdit',
            templateUrl: 'partials/UnitVwEdit.html',
            controller: 'unitVwEditCtrl'
        })
        .state('/AddFollowUp', {
            url: '/AddFollowUp',
            templateUrl: 'partials/addFollowUp.html',
            controller: 'addFollowUpCtrl'
        })
        .state('/EditFollowUp', {
            url: '/EditFollowUp/:scheduleId',
            templateUrl: 'partials/addFollowUp.html',
            controller: 'editFollowUpCtrl'
        })
        .state('/FollowUp', {
            url: '/FollowUp',
            templateUrl: 'partials/followUp.html',
            controller: 'followUpCtrl'
        })
		.state('/BookUnit-Step1', {
            url: '/BookUnit-Step1',
            templateUrl: 'partials/bookUnitStep1.html',
            controller: 'bookUnitStep1Ctrl'
        })
		.state('/BookUnit-Step2', {
            url: '/BookUnit-Step2',
            templateUrl: 'partials/bookUnitStep2.html',
            controller: 'bookUnitStep2Ctrl'
        })
		.state('/BookUnit-Step3', {
            url: '/BookUnit-Step3',
            templateUrl: 'partials/bookUnitStep3.html',
            controller: 'bookUnitStep3Ctrl'
        })
		.state('/BookUnit-Step4', {
            url: '/BookUnit-Step4',
            templateUrl: 'partials/bookUnitStep4.html',
            controller: 'bookUnitStep4Ctrl'
        })
        .state('Incentive', {
            url: '/Incentive',
            templateUrl: 'partials/incentive.html',
            controller: 'incentiveCtrl'
        })
       .state('ReceivePayment', {
            url: '/ReceivePayment',
            templateUrl: 'partials/receivePayment.html',
            controller: 'receivePaymentCtrl'
        })
});