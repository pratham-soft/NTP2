app.service('encyrptSvc', function ($base64) {
	this.encyrpt = function(val){
		return $base64.encode(val);
	}
	
	this.decyrpt = function(val){
		return $base64.decode(val);
	}
});