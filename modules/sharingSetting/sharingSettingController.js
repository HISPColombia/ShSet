appImport
		.controller(
				'importController',
				[
						'$scope',
						'$filter',
						'commonvariable',
						'sharingSetting',
						'dhisResource',
						'commonvariable',
						function($scope, $filter, commonvariable,
								sharingSetting, dhisResource, commonvariable) {

							// variables
							var $translate = $filter('translate');
							$scope.filteredTodos = [];
							$scope.objectSelected = [];
							$scope.changeButton = 0;
							$scope.ugStatus = [ 0, 0, 0, 0 ];
							$scope.statusChange = [ 0, 0, 0, 0 ];
							$scope.ugStatusAccess = [ 0, 0, 0, 0 ];
							$scope.ugStatusAccessExternal = [ 0, 0, 0, 0 ];
							$scope.objectSele = [];
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
								// $scope.object.name =
								// (commonvariable.OptionSetSelected.departamento
								// != undefined) ?
								// commonvariable.OptionSetSelected.departamento.code
								// : "";

								dhisResource
										.GET({
											resource : object.resource,
											fields : "id,code,displayName,userGroupAccesses",
											page : $scope.page
										}).$promise
										.then(function(response) {
											$scope.mObjects = response[object.resource];
											for (a = 0; a < $scope.mObjects.length; a++) {
												$scope.mObjects[a]["status"] = "1";
												$scope.mObjects[a]["key"] = a;
											}
											console.log("objetosssss",
													$scope.mObjects);
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
								$scope.objectSele = [];

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
									console.log("PUBLIC ACCESS FALSE ",
											publicAccess)

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
								angular
										.forEach(
												$scope.objectSelected,
												function(objectSelected) {
													sharingSetting.get({
														id : objectSelected,
														type : $scope.type
													}).$promise
															.then(function(
																	result) {

																console
																		.log(
																				"ugroupsss",
																				$scope.uGroups);
																newShSetting = $scope
																		.newShareObject(
																				result,
																				$scope.uGroups);
																sharingSetting
																		.POST(
																				{
																					id : objectSelected,
																					type : $scope.type
																				},
																				newShSetting).$promise
																		.then(function(
																				resultPost) {
																			console
																					.log(resultPost);
																		});
																console
																		.log(
																				"RESULT",
																				result);
															})
												})
							}

							// Assign Elements to the Api
							$scope.newShareObject = function(result, uGroups) {
								console.log("compare", result);
								console.log("uGroupslength", uGroups.length);
								var newShSetting = result;
								try {
									for (i = 0; i < (uGroups.length) - 1; i++) {
										console
												.log(
														"iiiii",
														result.object.userGroupAccesses.length);

										// for (a = 0; a <
										// (result.object.userGroupAccesses.length)-1;
										// a++) {
										if ((result.object.userGroupAccesses[i].id) == (uGroups[i].id)) {
											console.log("iguales");
											// (uGroups.object).splice(i,
											// i);
											console.log("ifffffff", uGroups);
											newShSetting = result;
											newShSetting.object.userGroupAccesses
													.push({
														access : access,
														id : uGroups[i].id
													});
										} else {
											console.log("Diferentes");
											newShSetting = result;
											newShSetting.object.userGroupAccesses
													.push({
														access : access,
														id : uGroups[i].id
													});
											return newShSetting;
										}
										// return newShSetting;

										// }
									}
									return newShSetting;
								} catch (error) {

									newShSetting.object["userGroupAccesses"] = [ {
										access : access,
										id : uGroups[i].id
									} ];
									newShSetting.object.userGroupAccesses
											.push({
												access : access,
												id : uGroups[i].id
											});
									return newShSetting;
								}
							}

							// Get Elements selected
							$scope.getOptionSelected = function(objectSelected,
									mObjects) {
								for (i = 0; i < mObjects.length - 1; i++) {
									for (a = 0; a < objectSelected.length; a++) {
										if ((objectSelected[a].key) == ($scope.mObjects[i].key)) {

											console.log("keyyyIFFFF");
											$scope.mObjects[i]["status"] = "2";

										} else {
											a--;
											i++;
										}
									}
									break;
								}

								// try {
								// for (i = 0; i < objectSelected.length; i++) {
								// if(objectSelected[i].key== mObjects[i].key){
								//											
								// console.log("keyyy",$scope.mObjects[i].key);
								// }
								// $scope.mObjects[i]["status"] = "2";
								//
								// // $scope.objectSele
								// // .push({
								// // id : objectSelected[i].id,
								// // name : objectSelected[i].displayName,
								// // status : "2",
								// // });
								//										
								// console.log("objeto seleccionado",
								// $scope.objectSele);
								// console.log("mObjectsssss",
								// $scope.mObjects);
								// }
								// } catch (error) {
								// $scope.objectSelected.length = 0;
								// }

							}

							// Remove Selected Elements
							$scope.removeOptionSelected = function(mObjects) {
								for (i = 0; i < mObjects.length - 1; i++) {
											$scope.mObjects[i]["status"] = "1";
										} 
							}

							// remove Group Access
							$scope.removeGroupAccess = function(objectSelected) {

							}

						} ]);