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
        alert("updateUnitStatus");
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
    
      this.ExChangeunit = function(obj){
       
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Cust/Changeunit",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {        
            apiRsponse = data;
             alert("Exchange Unit - Done ");
            return apiRsponse;
        }).error(function() {});
        return promise;
    }
      
       this.CustPaymentInfo = function(obj){
       
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Cust/UnitCost/Pymtstg",
            ContentType: 'application/json',
            data: obj
        }).success(function(data) {        
            apiRsponse = data;
            return apiRsponse;
        }).error(function() {});
        return promise;
    }
       
         this.CustPaymentHistory = function(obj){
       
        var promise = $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Cust/Unit/PaymentHistory",
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
    
   this.convertNumberToWords = function (amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}
   
   /* Atul 24/05/2017 This is just a Temporary service to Check the Query. Later it will be reomved */
   this.tempGetEmbeddedMysqlQuery = function(comp_guid,rule_id){
        
		var promise =$http({
			method:"POST",
			url:"http://120.138.8.150/pratham/Comp/Rulescrit/Gtebmsq",
			ContentType: 'application/json',
            data: {
			     "rulecriteria_comp_guid": comp_guid,
                 "rulecriteria_rule_id" :rule_id
			}
	 }).success(function(data) {
            query = data;
            return query;
        }).error(function() {});
        return promise;
	};
    
     this.removeCriteriaRow = function(comp_guid,rulecriteriaid){
        
		var promise =$http({
			method:"POST",
			url:"http://120.138.8.150/pratham/Comp/RulesCrit/Del",
			ContentType: 'application/json',
            data: {
                    "rulecriteria_comp_guid" :comp_guid,
                    "rulecriteriaid" : rulecriteriaid
                }
	 }).success(function(data) {
            query = data;
            return query;
        }).error(function() {});
        return promise;
	};
    
 this.checkAge = function(dateString) {
    var date = dateString;
    var datearray = date.split("/");
    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    var today = new Date();
    var birthDate = new Date(newdate);
     var year=   birthDate.getFullYear();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if(age<18 || age==NaN){
        alert("Age should be greater than 18 years...!!");
       return false;
    }
     else{
         return true;
     }
};
    
});



