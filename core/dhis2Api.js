/*
 *	Architeture 
 * 	Helder Yesid Castrillón
 * 	Hisp Colombia 2014
 * 
 * Core Module for using WebApi of dhis2
 * It is the persistence in the FrontEnd
 * 
 * */
var Dhis2Api = angular.module("Dhis2Api", [ 'ngResource', ]);

var urlApi = "../../../api";
// Create all common variables of the apps
Dhis2Api.factory("commonvariable", function() {
	var Vari = {
		url : urlApi
	};

	return Vari;
});

Dhis2Api.constant("urlApi", urlApi);

// //Api Category option
Dhis2Api.factory("sharingSetting", [ '$resource', 'commonvariable',
		function($resource, commonvariable) {
			return $resource(commonvariable.url + "/sharing", {
				id : '@id',
				type : '@type'
			}, {
				GET : {
					method : "GET"
				},
				POST : {
					method : "POST"
				},
				DELETE : {
					method : "DELETE"
				},
				PUT : {
					method : "PUT"
				},
				PATCH : {
					method : "PATCH"
				}
			});
		} ]);

// /get Resource
Dhis2Api.factory("dhisResource", [ '$resource', 'commonvariable',
		function($resource, commonvariable) {
			return $resource(commonvariable.url + "/:resource", {
				resource : '@resource',

			}, {
				GET : {
					method : "GET"
				},
				POST : {
					method : "POST"
				},
				DELETE : {
					method : "DELETE"
				},
				PUT : {
					method : "PUT"
				},
				PATCH : {
					method : "PATCH"
				}
			});
		} ]);

Dhis2Api.factory("dataSets", [ '$resource', 'commonvariable',
		function($resource, commonvariable) {
			return $resource(commonvariable.url + "/dataSets/:id", {
				id : '@id',

			}, {
				GET : {
					method : "GET"
				}
			});
		} ]);

Dhis2Api.factory("dataElements", [ '$resource', 'commonvariable',
		function($resource, commonvariable) {
			return $resource(commonvariable.url + "/dataElements/:id", {
				id : '@id',

			}, {
				GET : {
					method : "GET"
				}
			});
		} ]);

Dhis2Api.factory("dataElementGroups", [ '$resource', 'commonvariable',
		function($resource, commonvariable) {
			return $resource(commonvariable.url + "/dataElementGroups/:id", {
				id : '@id',

			}, {
				GET : {
					method : "GET"
				}
			});
		} ]);

Dhis2Api.factory("categories", [ '$resource', 'commonvariable',
		function($resource, commonvariable) {
			return $resource(commonvariable.url + "/categories/:id", {
				id : '@id',

			}, {
				GET : {
					method : "GET"
				}
			});
		} ]);

Dhis2Api.factory("filterResource", [ '$resource', 'commonvariable',
                         		function($resource, commonvariable) {
                         			return $resource(commonvariable.url + "/:resource/:id", {
                        				resource : '@resource',

                         				id : '@id',

                         			}, {
                         				GET : {
                         					method : "GET"
                         				}
                         			});
                         		} ]);
