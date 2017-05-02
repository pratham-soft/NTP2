app.service('httpSvc', function($http) {
    this.getUnitCostSheet = function(unitId, compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Blk/UntCstSheet/Gt",
            ContentType: 'application/json',
            data: {
			  "UnitDtls_Id": unitId,
			  "UnitDtls_comp_guid": compId
			}
        }).success(function(data) {
            unitCostSheetDetail = data;
            return unitCostSheetDetail;
        }).error(function() {});
        return promise;
	}
	
	this.getUserDetails = function(userId, compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": userId,
                "user_comp_guid": compId
            }
        }).success(function(data) {
            userDetail = data;
            return userDetail;
        }).error(function() {});
        return promise;
	}
	
	this.generateCustomerCostSheet = function(obj){
		var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Cust/BldValforUtCtSt",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            apiRsponse = data;
            return apiRsponse;
        }).error(function() {});
        return promise;
	}
    
    this.updatePaymentDetails = function(obj){
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Cust/Cmpunitpymntsave",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            apiRsponse = data;
            return apiRsponse;
        }).error(function() {});
        return promise;
    }
	
	this.getPaymentStages = function(obj){
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Cust/GetCustPymntStg",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            apiRsponse = data;
            return apiRsponse;
        }).error(function() {});
        return promise;
    }
    this.updateUnitStatus = function(obj){
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UpdtUnitDtls/ByUnitDtlsID",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {
            apiRsponse = data;
            return apiRsponse;
        }).error(function() {});
        return promise;
    }
});
	
app.service('myService', function($http) {
    this.sampleFun = function(compId) {
        return compId;
    };

    this.getProjectList = function(compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": compId
            }
        }).success(function(data) {
            projectList = data;
            return projectList;
        }).error(function() {});
        return promise;
    };

    this.getPhaseList = function(compId,projectName) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": compId
            }
        }).success(function(data) {
            phaseList = data;
            return phaseList;
        }).error(function() {});
        return promise;
    };
    
    this.getBlockList = function(phase, compId) {
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": compId
            }
        }).success(function(data) {
            blockList = data;
            return blockList;
        }).error(function() {});
        return promise;
    };
    
    this.getUnitsByBlock = function(compId, blockId) {
        console.log("blockId: "+blockId);
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                  "UnitDtls_Block_Id":blockId,
                  "UnitDtls_comp_guid":compId
                }
        }).success(function(data) {
            units = data;
            return units;
        }).error(function() {});
        return promise;
    };
    
    /* RD 26/04/2017 get email tempaltes */
    this.getEmailTempls = function(compId){
        
		var promise =$http({
			method:"POST",
			url:"http://120.138.8.150/pratham/Comp/Emltmplt/gt",
			ContentType: 'application/json',
            data: {
			  "tempemailid" : 0,
			  "tempemail_comp_guid" : compId
			}
	 }).success(function(data) {
            emltmplts = data;
            return emltmplts;
        }).error(function() {});
        return promise;
	};
    
      /* RD 02/05/2017 get email tempaltes */
    this.getModules = function(){
        
		var promise =$http({
			method:"POST",
			url:"http://120.138.8.150/pratham/Comp/ModulesGet",
			ContentType: 'application/json',
            data: {
			     "module_id": 0
			}
	 }).success(function(data) {
            modules = data;
            return modules;
        }).error(function() {});
        return promise;
	};
    
});