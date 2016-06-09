appImport
		.controller(
				'importController',
				[
						'$scope',
						'$filter',
						'commonvariable',
						'sharingSetting',
						'dhisResource',
						function($scope, $filter, commonvariable,
								sharingSetting, dhisResource) {

							// variables
							var $translate = $filter('translate');
							$scope.filteredTodos = [];
							$scope.objectSelected = [];
							$scope.changeButton = 0;
							$scope.ugStatus = [ 0, 0, 0, 0 ];
							$scope.ugStatusAccess = [ 0, 0, 0, 0 ];
							$scope.ugStatusAccessExternal = [ 0, 0, 0, 0 ];
							$scope.publicAccess;
							$scope.externalAccess;
							// /Object array of api object and type variable in
							// sharing Setting resource
							$scope.elements = [
									{
										type : "dataElement",
										resource : "dataElements",
										name : $translate("OBJ_DATAELEMENT")
									},
									{
										type : "dataElementGroup",
										resource : "dataElementGroups",
										name : $translate("OBJ_DATAELEMENTGROUP")
									},
									{
										type : "categoryOptions",
										resource : "categoryOptions",
										name : $translate("OBJ_CATEGORYOPTIONS")
									},
									{
										type : "categoryCombo",
										resource : "categoryCombos",
										name : $translate("OBJ_CATEGORYCOMBO")
									},
									{
										type : "indicators",
										resource : "indicators",
										name : $translate("OBJ_INDICATORS")
									},
									{
										type : "indicatorGroup",
										resource : "indicatorGroups",
										name : $translate("OBJ_INDICATORSGROUPS")
									},
									{
										type : "dataSet",
										resource : "dataSets",
										name : $translate("OBJ_DATASETS")
									},
									{
										type : "organisationUnitGroup",
										resource : "organisationUnitGroups",
										name : $translate("OBJ_ORGANISATIONUNITGROUPS")
									},
									{
										type : "organisationUnitGroupSet",
										resource : "organisationUnitGroupSets",
										name : $translate("OBJ_ORGANISATIONUNITGROUPSSETS")
									}, {
										type : "optionset",
										resource : "optionSets",
										name : $translate("OBJ_OPTIONSETS")
									}, {
										type : "userGroup",
										resource : "userGroups",
										name : $translate("OBJ_USERGROUPS")
									}, ];

							// Object get userGroups
							$scope.userGr = [ {
								type : "userGroup",
								resource : "userGroups",
								name : $translate("OBJ_USERGROUPS")
							}, ];

							// /methods
							$scope.getObjects = function(object) {
								$scope.titleList = object.name;
								$scope.currentResource = object.resource;
								$scope.currentObject = object;
								$scope.type = object.type;
								$scope.page = object.page;
								dhisResource
										.GET({
											resource : object.resource,
											fields : "id,code,displayName,userGroupAccesses",
											page : $scope.page
										}).$promise
										.then(function(response) {
											$scope.mObjects = response[object.resource];
											$scope.objectToSelected = [];
											angular
													.forEach(
															$scope.mObjects,
															function(value, key) {
																$scope.objectToSelected
																		.push({
																			value : value.id,
																			label : value.displayName
																		});
															})

											$scope.pager = response.pager.page;
											$scope.itemsPerPage = response.pager.pageSize;
											$scope.currentPage = response.pager.page;
											$scope.pageCount = response.pager.pageCount;
											$scope.makeTodos($scope.pageCount);
											$scope.total = response.pager.total;
											$scope.id = response.userGroupAccesses;
										});
							}

							// /Get Pager for Pagination
							$scope.getPage = function(resource, title, page) {
								$scope.currentResource = resource;
								$scope.currentTitle = title;
								if ($scope.page == undefined) {
									$scope.page = 1
								}
								dhisResource
										.GET({
											resource : resource,
											fields : "id,code,displayName,userGroupAccesses",
											page : page
										}).$promise
										.then(function(response) {
											$scope.mObjects = response.dataElements;
											$scope.pager = response.pager.page;
											$scope.itemsPerPage = response.pager.pageSize;
											$scope.currentPage = response.pager.page;
											$scope.pageCount = response.pager.pageCount;
											$scope.makeTodos($scope.pageCount);
											$scope.total = response.pager.total;
										});
							}

							// get the User Groups from the Api
							$scope.getUserGroups = function(resource) {
								$scope.currentResource = resource;
								dhisResource.GET({
									resource : resource,
									fields : "id,displayName",

								}).$promise.then(function(response) {

									$scope.uGroups = response["userGroups"];

								});
							}
							$scope.getUserGroups("userGroups");

							// pagination methods
							$scope.makeTodos = function() {
								$scope.todos = [];

								for (i = 1; i <= $scope.pageCount; i++) {
									$scope.todos.push({
										text : 'todos' + i,
										done : false
									});
								}
							};

							$scope.makeTodos($scope.pageCount);
							$scope.pageChanged = function() {
								$scope.figureOutTodosToDisplay();

								// $scope.getObjects($scope.currentObject);
								$scope
										.getPage($scope.currentResource,
												$scope.currentTitle,
												$scope.currentPage);
							};

							$scope.figureOutTodosToDisplay = function() {
								console.log($scope.itemsPerPage);
								var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
								var end = begin + $scope.itemsPerPage;
								$scope.filteredTodos = $scope.todos.slice(
										begin, end);
							};

// function removeRole(context) {
// removeItem(context.id, context.name,
// i18n_confirm_delete,
// 'removeRole.action');
// }

							// Clean Variables
							$scope.clean = function() {
								console.log("Cleannnning");
								$scope.ugStatus = [ 0, 0, 0, 0 ];
								$scope.objectSelected = [];
								$scope.ugStatusAccess = [ 0, 0, 0, 0 ];
								$scope.ugStatusAccessExternal = [ 0, 0, 0, 0 ];

							}

							// Method Access depending of the button change
							// public Access and External Access
							$scope.changeButtons = function(changeButton) {
								if (changeButton == 0) {
									access = "";
								}
								if (changeButton == 1) {
									access = "r------";
									console.log("R", access);
								}
								if (changeButton == 2) {
									access = "rw------";
									console.log("RW ", access);
								}

								if (changeButton == 3) {
									publicAccess = false;
									console.log("PUBLIC ACCESS FALSE ", publicAccess)

								}
								if (changeButton == 4) {
									publicAccess = true;
									console.log("PUBLIC ACCESS TRUE",
											publicAccess);
								}
								if (changeButton == 5) {
									externalAccess = false;
									console.log("EXTERNAL ACCESS FALSE",
											externalAccess);
								}
								if (changeButton == 6) {
									externalAccess = true;
									console.log("EXTERNAL ACCESS TRUE",
											externalAccess);
								}

							}

							// /Get and Put the permissions to the object
							$scope.assignPermissions = function(objectSelected) {
								console.log(objectSelected);
								angular.forEach($scope.objectSelected,
										function(objectSelected) {
											sharingSetting.get({
												id : objectSelected,
												type : $scope.type
											}).$promise.then(function(result) {
												
												
												console.log("ugroupsss",$scope.uGroups);
												newShSetting = $scope.newShareObject(result,$scope.uGroups);
												sharingSetting.POST({
													id : objectSelected,
													type : $scope.type
												},newShSetting).$promise.then(function(resultPost) {
													console.log(resultPost);
												});	
												console.log("RESULT", result);
											})
										})
							}	






							$scope.newShareObject=function(result,uGroups){

								console.log("compare", result);
								console.log("uGroupslength", uGroups.length);
								var newShSetting;
								try{
								for (a = 0; a < result.object.userGroupAccesses.length; a++) {
									console.log("iiiii", i);
									for (i = 0; i < uGroups.length; i++) {
										if ((result.object.userGroupAccesses[a].id) == (uGroups[a].id)) {
											console.log("iguales");
//											(uGroups).splice(0,uGroups[a]);
											newShSetting=result;	
//											newShSetting.object.userGroupAccesses.push(
//													{access:access,
//														id:uGroups[a].id}
//													);
										} else {
											console.log("Diferentes");
											newShSetting=result;
											newShSetting.object.userGroupAccesses.push(
													{access:access,
														id:uGroups[a].id}
													);
//											return newShSetting;
										}
										return newShSetting;
										
									}
								}}catch(error){
									newShSetting=result;
									newShSetting.object["userGroupAccesses"]=[
											{access:access,
												id:uGroups[a].id}
											];
									return newShSetting;
								}
								
								
							}

						} ]);