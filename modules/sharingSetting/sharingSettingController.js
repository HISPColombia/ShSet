appImport
		.controller(
				'importController',
				[
						'$scope',
						'$q',
						'$filter',
						'commonvariable',
						'sharingSetting',
						'dhisResource',
						'commonvariable',
						'dataSets',
						'dataElementGroups',
						'categories',
						'dataElements',
						function($scope,$q, $filter, commonvariable,
								sharingSetting, dhisResource, commonvariable,
								dataSets, dataElementGroups, categories,
								dataElements) {

							// variables
							var $translate = $filter('translate');
							$scope.filteredTodos = [];
							$scope.objectSelected = [];
							$scope.changeButton = 0;
							$scope.ugStatus = [ 0, 0, 0, 0 ];
							$scope.statusChange = [ 0, 0, 0, 0 ];
							$scope.ugStatusAccess = [ 0, 0, 0, 0 ];
							$scope.publicAccess;
							$scope.externalAccess;
							$scope.objectSele = [];
							$scope.object = [];
							$scope.respo = [];
							$scope.objects = [];
							$scope.showButtons;
							$scope.permissions;
							$scope.uGroupSelected = [];

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
										type : "dataElementGroupSets",
										resource : "dataElementGroupSets",
										name : $translate("OBJ_DATAELEMENTGROUPSETS")
									},
									{
										type : "categories",
										resource : "categories",
										name : $translate("OBJ_CATEGORIES")
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
										type : "categoryOptionCombos",
										resource : "categoryOptionCombos",
										name : $translate("OBJ_CATEGORYOPTIONCOMBOS")
									},
									{
										type : "categoryOptionGroups",
										resource : "categoryOptionGroups",
										name : $translate("OBJ_CATEGORYOPTIONGROUPS")
									},
									{
										type : "categoryOptionGroupSets",
										resource : "categoryOptionGroupSets",
										name : $translate("OBJ_CATEGORYOPTIONGROUPSETS")
									},

									{
										type : "indicators",
										resource : "indicators",
										name : $translate("OBJ_INDICATORS")
									},
									{
										type : "indicatorTypes",
										resource : "indicatorTypes",
										name : $translate("OBJ_INDICATORSTYPES")
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

								if (object.name == ($translate("OBJ_DATAELEMENT"))) {
									$scope.showButtons = true;
								} else if (object.name == ($translate("OBJ_CATEGORIES"))) {
									$scope.showButtons = false;
								}

								dhisResource
										.GET({
											resource : object.resource,
											fields : "id,code,displayName,userGroupAccesses",
											page : $scope.page
										}).$promise
										.then(function(response) {
											$scope.mObjects = response[object.resource];
											$scope.listmObjects = $scope.mObjects;
											$scope.objectPrincipal = response[object.resource];
											;

											for (a = 0; a < $scope.mObjects.length; a++) {
												$scope.mObjects[a]["status"] = "1";
												$scope.mObjects[a]["key"] = a;
											}
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

							// Get data Elements By code
							$scope.getCode = function(code) {

								return dataElements
										.GET({
											filter : "code:like:" + code,
											fields : "id,name,displayName,user,userGroupAccesses"
										}).$promise
										.then(function(responseDataElements) {
											console.log("codeee",
													responseDataElements);
											$scope.mObjects = responseDataElements.dataElements;
											return responseDataElements;
										});
							}

							// Get datasets By name
							$scope.getdataSets = function(name) {
								return dataSets.GET({
									filter : "name:like:" + name
								}).$promise.then(function(responseDataSet) {
									return responseDataSet.dataSets;
								});
							}

							$scope.onSelect = function($item, $model, $label) {
								$scope.getElementByDataSet($item.id);

							};

							// Get DataElements by DataSet
							$scope.getElementByDataSet = function(id) {
								return dataSets
										.GET({
											id : id,
											fields : "dataElements[id,name,displayName,user,userGroupAccesses]"
										}).$promise.then(function(
										getElementByDataSet) {
									$scope.validateObject(getElementByDataSet);
									$scope.mObjects = $scope.objects;
									return getElementByDataSet;
								});
							}

							// validate the object to push
							$scope.validateObject = function(objects) {
								for (x = 0; x < objects.dataElements.length; x++) {
									$scope.objects
											.push({
												id : objects.dataElements[x].id,
												displayName : objects.dataElements[x].displayName,
												user : objects.dataElements[x].user
											});
								}
								return objects;
							}

							// return object "mObject" to the original List
							$scope.returnMobject = function() {
								$scope.mObjects = $scope.objectPrincipal;
								$scope.objects = [];
								console.log($scope.mObjects);
							}

							// Get dataElementsGroups By name
							$scope.getDataElementsGroups = function(
									nameElementGroup) {
								return dataElementGroups.GET({
									filter : "name:like:" + nameElementGroup
								}).$promise
										.then(function(responseElementGroup) {
											return responseElementGroup.dataElementGroups;
										});
							}

							// element select on groups
							$scope.onSelectGroups = function($item, $model,
									$label) {
								$scope.getElementByDataElementsGroups($item.id);

							};

							// Get DataElements by DataElementsGroups
							$scope.getElementByDataElementsGroups = function(id) {
								return dataElementGroups
										.GET({
											id : id,
											fields : "dataElements[id,name,displayName,user,userGroupAccesses]"
										}).$promise
										.then(function(
												responseByDataElementsGroups) {
											$scope
													.validateObject(responseByDataElementsGroups);
											$scope.mObjects = $scope.objects;
											return responseByDataElementsGroups;
										});
							}

							// Get categories By name
							$scope.getCategories = function(name) {
								return categories.GET({
									filter : "name:like:" + name
								}).$promise.then(function(responseCategories) {
									return responseCategories.categories;
								});
							}

							// /get categories
							$scope.onSelectCategories = function($item, $model,
									$label) {
								$scope.getElementByCategory($item.id);

							};

							// Get categoryOptions by categories
							$scope.getElementByCategory = function(id) {
								return categories
										.GET({
											id : id,
											fields : "categoryOptions[id,name,displayName,user,userGroupAccesses]"

										}).$promise
										.then(function(responseCategories) {
											for (x = 0; x < responseCategories.length; x++) {
												$scope.objects
														.push({
															id : responseCategories.categoryOptions[x].id,
															displayName : responseCategories.categoryOptions[x].displayName,
															user : responseCategories.categoryOptions[x].user
														});
											}
											$scope.mObjects = responseCategories.categoryOptions;
											return responseCategories;
										});
							}

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

							// Clean Variables
							$scope.clean = function() {
								console.log("Cleannnning");
								$scope.ugStatus = [ 0, 0, 0, 0 ];
								$scope.objectSelected = [];
								$scope.objectSele = [];
								$scope.ugStatusAccess = [ 0, 0, 0, 0 ];
								$scope.objectSele = [];
								mObjects = $scope.objectPrincipal;
								$scope.permissions = null;
//								$scope.uGroupSelected =[];

							}

							// Method Access depending of the button change
							// public Access and External Access
							$scope.changeButtons = function(changeButton,
									uGroupSelect) {

								if (changeButton == 0) {
									access = "";
									$scope.setValue(uGroupSelect,
											$scope.uGroupSelected,access);
								}
								if (changeButton == 1) {
									access = "r------";
									console.log("R", access);
									$scope.setValue(uGroupSelect,
											$scope.uGroupSelected,access);
								}
								if (changeButton == 2) {
									access = "rw------";
									$scope.setValue(uGroupSelect,
											$scope.uGroupSelected,access);
								}

								if (changeButton == 3) {
									publicAccess = false;

								}
								if (changeButton == 4) {
									publicAccess = true;
								}
								if (changeButton == 5) {
									externalAccess = false;
								}
								if (changeButton == 6) {
									externalAccess = true;
								}

							}
							
							

							$scope.findKey = function(uGroupSelect,
									uGroupSelected) {
								
								var defered = $q.defer();
						        var promise = defered.promise;
								defered.resolve(uGroupSelected.findIndex(function(element, index,
												array) {
											if (element.id == uGroupSelect.id) {
												return promise;
											} else {
												return false;
											}

										}));
								return promise;
							
							}
							
							
							$scope.setValue = function(uGroupSelect,uGroupSelected,access) {
								
								$scope.findKey(uGroupSelect,uGroupSelected).then(function(position){ 
									if (position >= 0) {
										uGroupSelected[position].id = uGroupSelect.id;
									} else  {
										uGroupSelected.push({
											id : uGroupSelect.id,
											displayName : uGroupSelect.displayName,
											access : access
										})
										console.log(uGroupSelected);
									}
								});
							}
							
							

							// get uGroupsSelected
							$scope.ugroupsSelected = function() {

							}

							// /Get and Put the permissions to the object
							$scope.assignPermissions = function(objectSelected) {

								angular
										.forEach(
												objectSelected,
												function(objectSelected) {
													if (permissions == 'keep') {// keep
														// Permissions
														console.log("keepppp");
														sharingSetting
																.get({
																	id : objectSelected.id,
																	type : $scope.type
																}).$promise
																.then(function(
																		result) {

																	newShSetting = $scope
																			.newShareObject(
																					result,
																					$scope.uGroupSelected);
																	sharingSetting
																			.POST(
																					{
																						id : newShSetting.object.id,
																						type : $scope.type
																					},
																					newShSetting).$promise
																			.then(function(

																			resultPost) {

																			});
																})
													} else if (permissions == 'update') {// update
														// Permissions
														console.log("update");
														sharingSetting
																.get({
																	id : objectSelected.id,
																	type : $scope.type
																}).$promise
																.then(function(
																		result) {

																	$scope.newShSetting = result;
																	$scope.newShSetting.object["userGroupAccesses"] = [];
																	for (int = 0; int < $scope.uGroupSelected.length; int++) {
																		
																		$scope.newShSetting.object.userGroupAccesses
																				.push({
																					
																					id : $scope.uGroupSelected[int].id,
																					displayName : $scope.uGroupSelected[int].displayName,
																					access : $scope.uGroupSelected[int].access
																				});console.log("updateeee uGroupSelected",$scope.uGroupSelected );
																	}
																	sharingSetting
																			.POST(
																					{
																						id : $scope.newShSetting.object.id,
																						type : $scope.type
																					},
																					$scope.newShSetting).$promise
																			.then(function(
																					resultPost) {
//																				$scope.uGroupSelected=[];
																			});
																})
													}
												})
							}

							// Assign Elements to the Api
							$scope.newShareObject = function(result,
									uGroupSelected) {
								
								
								var newShSetting = result;
								try {
									for (z = 0; z <= (uGroupSelected.length) - 1; z++) {
										if ((result.object.userGroupAccesses[z].id) == (uGroupSelected[z].id)) {
											newShSetting = result;
											newShSetting.object.userGroupAccesses
													.push({
														id : uGroupSelected[z].id,
														displayName : uGroupSelected[z].displayName,
														access: uGroupSelected[z].access
													});
											
										} else {
											console.log("elseee accesss",$scope.uGroupSelected[z].access );
											newShSetting = result;
											newShSetting.object.userGroupAccesses
													.push({
														id : uGroupSelected[z].id,
														displayName : uGroupSelected[z].displayName,
														access:uGroupSelected[z].access
													});
										}
									}
									return newShSetting;
								} catch (error) {
									console.log("updateeee accesss",$scope.uGroupSelected[z].access );
									newShSetting.object["userGroupAccesses"] = [];
									newShSetting.object.userGroupAccesses
											.push({
												id : uGroupSelected[z].id,
												displayName : uGroupSelected[z].displayName,
												access: uGroupSelected[z]	.access
											});
									return newShSetting;
								}
							}

							// Get Elements selected
							$scope.getOptionSelected = function(objectSelected,
									mObjects) {
								$scope.listmObjects = mObjects;
								try {
									for (a = 0; a < objectSelected.length; a++) {
										for (i = 0; i < mObjects.length; i++) {
											if ((objectSelected[a].key) == ($scope.mObjects[i].key)) {
												$scope.mObjects[i]["status"] = "2";
												$scope.mObjects.splice(i, 1);
												$scope.objectSele
														.push({
															id : objectSelected[a].id,
															displayName : objectSelected[a].displayName,
															status : "2",
															key : objectSelected[a].key
														});
												break;
											}
										}
									}
								} catch (error) {
									$scope.objectSelected.length = 0;
								}
							}

							// Remove Selected Elements
							$scope.removeOptionSelected = function(object,
									mObjects) {
								try {
									for (a = 0; a < object.length; a++) {
										for (i = 0; i < mObjects.length; i++) {
											$scope.mObjects
													.push({
														id : object[a].id,
														displayName : object[a].displayName,
														status : "1",
														key : object[a].key
													});
											$scope.objectSele.splice(i, 1);
											break;
										}
									}
								} catch (error) {
									$scope.object.length = 0;
								}
							}

							// remove Group Access
							$scope.removeGroupAccess = function(objectSelected) {

							}

						} ]);