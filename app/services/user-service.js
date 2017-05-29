'use strict';

angular.module('pratham')
  .service('UserService', function GetUserService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
        this.getUsersDataByUserTypeId = function ($http, $q, dataobj) {
            var apiPath = "http://120.138.8.150/pratham/User/UserDtls/ByUserType";
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: apiPath,
                data: dataobj,
                type: JSON
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject("An error occured while validating User");
            })
            return deferred.promise;
        };

//        this.get_cart_by_email = function ($http, $q, email_id) {
//            var apiPath = cat_service_url + "/store/cart?email_id=" + email_id + "&json=true";
//            var deferred = $q.defer();
//
//            $http({
//                method: 'GET',
//                url: apiPath,
//                type: JSON
//            }).success(function (data) {
//                deferred.resolve(data);
//            }).error(function (data) {
//                deferred.reject("An error occured while validating User");
//            })
//            return deferred.promise;
//        };
//
//        this.get_wishlist_by_email = function ($http, $q, email_id) {
//
//            var apiPath = cat_service_url + "/store/wishlist?email_id=" + email_id + "&json=true";
//            var deferred = $q.defer();
//
//            $http({
//                method: 'GET',
//                url: apiPath,
//                type: JSON
//
//            }).success(function (data) {
//                deferred.resolve(data);
//            }).error(function (data) {
//                deferred.reject("An error occured while validating User");
//            })
//            return deferred.promise;
//        };
//
//        this.get_bulk_cart_by_email = function ($http, $q, email_id) {
//           // var apiPath = 'http://localhost:8185' + "/store/bulk_cart?email_id=" + email_id + "&json=true";
//            var apiPath = cat_service_url  + "/store/bulk_cart?email_id=" + email_id + "&json=true";
//
//            var deferred = $q.defer();
//
//            $http({
//                method: 'GET',
//                url: apiPath,
//                type: JSON
//            }).success(function (data) {
//                deferred.resolve(data);
//            }).error(function (data) {
//                deferred.reject("An error occured while validating User");
//            })
//            return deferred.promise;
//        };



    });
