appImport.controller('importController',['$scope','$q','$filter','commonvariable','sharingSetting','dhisResource','dataSets','dataElementGroups','categories','dataElements','filterResource', function($scope, $q, $filter, commonvariable, sharingSetting, dhisResource,	dataSets, dataElementGroups,categories,	dataElements, filterResource) {

							// variables
							var $translate = $filter('translate');
							$scope.filteredTodos = [];
							$scope.objectSelected = [];
							$scope.changeButton = 0;
							$scope.ugStatus = [];
							$scope.statusChange = [];
							$scope.ugStatusAccess = [];
							$scope.publicAccess;
							$scope.externalAccess;
							$scope.objectSele = [];
							$scope.object = [];
							$scope.respo = [];
							$scope.objects = [];
							$scope.showButtons;
							$scope.uGroupSelected = [];
							$scope.changeColor = 2;
							$scope.alerts = [];
							$scope.objectSelect;
							$scope.show;
							$scope.userGroupAux = [];
							permissions = "update";
							$scope.aux = [];
							$scope.UserGroupsFiltred=[];
							$scope.viewWaiting=false;
							

							// /add alert
							$scope.addAlert = function(msg, type) {
								$scope.alerts.push({
									msg : msg,
									type : type
								});
							};
							// /close alert
							$scope.closeAlert = function(index) {
								$scope.alerts.splice(index, 1);
							};

							// /Object array of api object and type variable in
							// sharing Setting resource
							$scope.elements = [
									{
										type : "dataElement",
										resource : "dataElements",
										name : $translate("OBJ_DATAELEMENT"),
										group: "dataElementGroups",
										groupName:$translate("OBJ_DATAELEMENTGROUP"),
										list : 1
									},
									{
										type : "dataElementGroup",
										resource : "dataElementGroups",
										group: "dataElementGroupSets",
										name : $translate("OBJ_DATAELEMENTGROUP"),
										list : 1
									},
									{
										type : "dataElementGroupSet",
										resource : "dataElementGroupSets",
										group:"",
										name : $translate("OBJ_DATAELEMENTGROUPSETS"),
										list : 1
									},
									{
										type : "category",
										resource : "categories",
										group:"",
										name : $translate("OBJ_CATEGORIES"),
										list : 1
									},
									{
										type : "categoryOption",
										resource : "categoryOptions",
										group:"categories",
										groupName:$translate("OBJ_CATEGORIES"),
										name : $translate("OBJ_CATEGORYOPTIONS"),
										list : 1
									},
									{
										type : "categoryCombo",
										resource : "categoryCombos",
										group:"",
										name : $translate("OBJ_CATEGORYCOMBO"),
										list : 1

									},
									{
										type : "categoryOptionGroup",
										resource : "categoryOptionGroups",
										group:"categoryOptionGroupSets",
										groupName : $translate("OBJ_CATEGORYOPTIONGROUPSETS"),
										name : $translate("OBJ_CATEGORYOPTIONGROUPS"),
										list : 2
									},
									{
										type : "categoryOptionGroupSet",
										resource : "categoryOptionGroupSets",
										group:"",
										name : $translate("OBJ_CATEGORYOPTIONGROUPSETS"),
										list : 2
									},

									{
										type : "indicator",
										resource : "indicators",
										group:"indicatorGroups",
										groupName: $translate("OBJ_INDICATORSGROUPS"),
										name : $translate("OBJ_INDICATORS"),
										list : 2
									},
									{
										type : "indicatorType",
										resource : "indicatorTypes",
										group:"",
										name : $translate("OBJ_INDICATORSTYPES"),
										list : 2
									},
									{
										type : "indicatorGroup",
										resource : "indicatorGroups",
										group:"",
										name : $translate("OBJ_INDICATORSGROUPS"),
										list : 2
									},
									{
										type : "dataSet",
										resource : "dataSets",
										group:"",
										name : $translate("OBJ_DATASETS"),
										list : 2
									},
									{
										type : "organisationUnitGroup",
										resource : "organisationUnitGroups",
										group:"organisationUnitGroupSets",
										groupName : $translate("OBJ_ORGANISATIONUNITGROUPSSETS"),
										name : $translate("OBJ_ORGANISATIONUNITGROUPS"),
										list : 3
									},
									{
										type : "organisationUnitGroupSet",
										resource : "organisationUnitGroupSets",
										group:"",
										name : $translate("OBJ_ORGANISATIONUNITGROUPSSETS"),
										list : 3
									}, {
										type : "optionSet",
										resource : "optionSets",
										group:"",
										name : $translate("OBJ_OPTIONSETS"),
										list : 3
									}, {
										type : "userGroup",
										resource : "userGroups",
										group:"",
										name : $translate("OBJ_USERGROUPS"),
										list : 3
									}, {
										type : "userRole",
										resource : "userRoles",
										group:"",
										name : $translate("OBJ_USERROLES"),
										list : 3
									}, ];

							// Object get userGroups
							$scope.userGr = [ {
								type : "userGroup",
								resource : "userGroups",
								name : $translate("OBJ_USERGROUPS")
							}, ];
							$scope.ClearSearch=function(option){
								$scope.opSearch=option;
								$scope.codeSelect="";
								$scope.nameSelect="";
								$scope.groupSelected="";
								$scope.dataSetselected="";
							}
							// /methods
							$scope.getObjects = function(object) {
								$scope.objectSelect = object;
								$scope.opSearch=0;
								$scope.titleList = object.name;
								$scope.currentResource = object.resource;
								$scope.currentObject = object;
								$scope.type = object.type;
								$scope.page = object.page;
								$scope.viewWaiting=true;
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
											$scope.objectPrincipal = response[object.resource];

											for (a = 0; a < $scope.mObjects.length; a++) {

												$scope.mObjects[a]["key"] = a;
												for (z = 0; z < $scope.mObjects[a].userGroupAccesses.length; z++) {
													sorting(
															$scope.mObjects[a].userGroupAccesses,
															$scope.mObjects[a].userGroupAccesses[z].displayName);
												
														if(z>=$scope.mObjects[a].userGroupAccesses.length-1 && a>=$scope.mObjects.length-1){
															$scope.viewWaiting=false;
														}
												}
											}

											//$scope.viewWaiting=false;

											$scope.pager = response.pager.page;
											$scope.itemsPerPage = response.pager.pageSize;
											$scope.currentPage = response.pager.page;
											$scope.pageCount = response.pager.pageCount;
											$scope.makeTodos($scope.pageCount);
											$scope.total = response.pager.total;
											$scope.id = response.userGroupAccesses;
											$scope.getObjectsAux(object);
											$scope.selectAllButtons(0);
											ugStatusAccess=3;
										});
							}

							$scope.filterUserGroups = function (valSearch) {
								$scope.UserGroupsFiltred=[];
								angular.forEach($scope.uGroups, function (value, key) {

									if(value.displayName.indexOf(valSearch)!=-1){
										$scope.UserGroupsFiltred.push(true);
									}
									else{
										$scope.UserGroupsFiltred.push(false);
									}
								});
							};

							function sorting(json_object, key_to_sort_by) {
								function sortByKey(a, b) {
									var x = a[key_to_sort_by];
									var y = b[key_to_sort_by];
									return ((x < y) ? -1 : ((x > y) ? 1 : 0));
								}

								json_object.sort(sortByKey);

							}

							// /methods
							$scope.getObjectsAux = function(object) {
								dhisResource
										.GET({
											resource : object.resource,
											fields : "id,code,displayName,userGroupAccesses",
											page : $scope.page
										}).$promise
										.then(function(response) {
											$scope.listmObjects = response[object.resource];
											$scope.objectAux = response[object.resource];
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
								dhisResource
										.GET({
											resource : resource,
											fields : "id,displayName,userGroupAccesses",

										}).$promise.then(function(response) {

									$scope.uGroups = response["userGroups"];
									// /init status value(for change color)
									angular.forEach($scope.uGroups, function(
											val, key) {
										$scope.ugStatus[key] = undefined;
									});

								});
							}
							$scope.getUserGroups("userGroups");

							// Get data Elements By code
							$scope.getCode = function(code, object) {
								return filterResource
										.GET({
											resource : $scope.currentResource,
											filter : "code:like:" + code,
											fields : "id,name,displayName,user,userGroupAccesses,code"
										}).$promise
										.then(function(responseDataElements) {
											if (object == "principal") {
												$scope.mObjects = responseDataElements[$scope.currentResource];
											} else {
												$scope.listmObjects = responseDataElements[$scope.currentResource];
											}
											return responseDataElements[$scope.currentResource];
										});
							}

							// Get data Elements By NAME
							$scope.getElementsByName = function(name, object) {
								return filterResource
										.GET({
											resource : $scope.currentResource,
											filter : "displayName:like:" + name,
											fields : "id,name,displayName,user,userGroupAccesses,code"
										}).$promise
										.then(function(responseDataElements) {
											if (object == "principal") {
												$scope.mObjects = responseDataElements[$scope.currentResource];
											} else {
												$scope.listmObjects = responseDataElements[$scope.currentResource];
											}
											return responseDataElements[responseDataElements];
										});
							}

							// Get datasets By name
							$scope.getdataSets = function(name, object) {
								return dataSets.GET({
									filter : "name:like:" + name
								}).$promise
										.then(function(responseDataSet) {
											$scope.show = object;
											if (object == "principal") {
												$scope.mObjects = responseDataSet[$scope.currentResource];
											} else {
												$scope.listmObjects = responseDataSet[$scope.currentResource];
											}
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
											fields : "dataElements[id,name,displayName,user,userGroupAccesses,code]"
										}).$promise
										.then(function(getElementByDataSet) {
											if ($scope.show == "principal") {
												$scope.mObjects = getElementByDataSet.dataElements;
											} else {
												$scope.listmObjects = getElementByDataSet.dataElements;

											}
											return getElementByDataSet;
										});
							}

							// validate the object to push
							$scope.validateObject = function(objects) {
								for (x = 0; x < objects.dataElements.length; x++) {
									if (objects.dataElements[x].userGroupAccesses.length >= 1) {
										try {
											$scope.objects
													.push({
														id : objects.dataElements[x].id,
														displayName : objects.dataElements[x].displayName,
														user : objects.dataElements[x].user,
														userGroupAccesses : [ {
															id : objects.dataElements[x].userGroupAccesses[x].id,
															access : objects.dataElements[x].userGroupAccesses[x].access,
															displayName : objects.dataElements[x].userGroupAccesses[x].displayName,
															name : objects.dataElements[x].userGroupAccesses[x].displayName
														} ]
													});
										} catch (error) {
											console.log("catch");
										}

									} else {
										$scope.objects
												.push({
													id : objects.dataElements[x].id,
													displayName : objects.dataElements[x].displayName,
													user : objects.dataElements[x].user,
													userGroupAccesses : []
												});

									}

								}

								return objects;
							}

							// return object "mObject" to the original List
							$scope.returnMobject = function() {
								$scope.mObjects = $scope.objectPrincipal;
								$scope.objects = [];
								$scope.listmObjects = $scope.objectAux;
							}

							// Get Group By name
							$scope.getGroups = function(nameGroup,object) {
							return dhisResource
										.GET({
											resource :$scope.currentObject.group,	
											filter : "displayName:like:" + nameGroup,										
											page : 1
										}).$promise
										.then(function(responseGroups) {
											$scope.show = object;
											return responseGroups[$scope.currentObject.group];
										});
							}
							

							// element select on groups
							$scope.onSelectGroups = function($item, $model,$label) {								
								$scope.getElementByGrouped($item.id,$scope.currentObject.group);
							};

							// Get DataElements by DataElementsGroups
							$scope.getElementByGrouped = function(id,resourceGroup) {
								return dhisResource
										.GET({
											resource :resourceGroup,	
											uidopt:id,
											fields:$scope.currentResource+"[id,code,displayName,userGroupAccesses]",									
											page : 1
										}).$promise
										.then(function(
												responseGroups) {
											if ($scope.show == "principal") {
												$scope.mObjects = responseGroups[$scope.currentResource];
											} else {
												$scope.listmObjects =  responseGroups[$scope.currentResource];
											}

											return responseGroups;
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
											fields : "categoryOptions[id,name,displayName,user,code,userGroupAccesses]"

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
											$scope.listmObjects = responseCategories.categoryOptions;
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

								console.log($scope.currentObject);
								$scope
										.getPage($scope.currentResource,
												$scope.currentTitle,
												$scope.currentPage);
							};

							$scope.figureOutTodosToDisplay = function() {
								var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
								var end = begin + $scope.itemsPerPage;
								$scope.filteredTodos = $scope.todos.slice(
										begin, end);
							};

							// Method Access depending of the button change
							// public Access and External Access
							$scope.changeButtons = function(changeButton,
									uGroupSelect) {
								access="";
								if (changeButton == 0) {
									access = "";
									$scope.uGroupSelected.push[{}];
								}
								if (changeButton == 1) {
									access = "r------";
									$scope.setValue(uGroupSelect,
											$scope.uGroupSelected, access);
								}
								if (changeButton == 2) {
									access = "rw------";
									$scope.setValue(uGroupSelect,
											$scope.uGroupSelected, access);
								}

								if (changeButton == 3) {
									$scope.publicAccess = "r------";
								}
								if (changeButton == 4) {
									$scope.publicAccess = "rw------";
								}
								if (changeButton == 5) {
									$scope.externalAccess = false;
								}
								if (changeButton == 6) {
									$scope.externalAccess = true;
								}

							}

							$scope.findKey = function(uGroupSelect,
									uGroupSelected) {

								var defered = $q.defer();
								var promise = defered.promise;
								defered.resolve(uGroupSelected
										.findIndex(function(element, index,
												array) {
											if (element.id == uGroupSelect.id) {
												return promise;
											} else {
												return false;
											}

										}));
								return promise;

							}

							$scope.setValue = function(uGroupSelect,
									uGroupSelected, access) {

								$scope
										.findKey(uGroupSelect, uGroupSelected)
										.then(
												function(position) {

													if (position >= 0) {
														uGroupSelected[position].id = uGroupSelect.id;
													} else {

														try {
															if (uGroupSelect.length) {
																for (b = 0; b < uGroupSelect.length; b++) {
																		if((($scope.UserGroupsFiltred.length>1)?$scope.UserGroupsFiltred[b]:true)==true){
																			uGroupSelected
																			.push({
																				id : uGroupSelect[b].id,
																				displayName : uGroupSelect[b].displayName,
																				access : access
																			});
																		}
																
																}
															} else {
																uGroupSelected
																		.push({
																			id : uGroupSelect.id,
																			displayName : uGroupSelect.displayName,
																			access : access
																		})
															}
														} catch (error) {
															uGroupSelected
																	.push({
																		id : uGroupSelect.id,
																		displayName : uGroupSelect.displayName,
																		access : access
																	})
														}
													}
												});
							}

							// /Get and Put the permissions to the object
							$scope.assignPermissions = function(objectSelected) {
								var newShSetting;
								$scope.viewWaiting=true;
								for (c = 0; c < objectSelected.length; c++) {
									$scope.aux.push({displayName : objectSelected[c].displayName});	
								}
								angular
										.forEach(
												objectSelected,
												function(objectSelected) {
													if (permissions == 'keep') {// keep
														// Permissions
														sharingSetting
																.get({
																	id : objectSelected.id,
																	type : $scope.type
																}).$promise
																.then(function(
																		result) {
																	try {
																		newShSetting = result;
																		newShSetting.object.publicAccess = $scope.publicAccess;
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
																					$scope.uGroupSelected = [];
																					$scope.getObjects($scope.objectSelect);

																				});

																	} catch (error) {
																		$scope
																				.addAlert(
																						$translate("ERROR")
																								+ " "
																								+ result.object.displayName,
																						"danger");
																		console.log("catchh");
																	}

																})
												
													} else if (permissions == 'update') {
														// update
														// Permissions

														sharingSetting
																.get({
																	id : objectSelected.id,
																	type : $scope.type
																}).$promise
																.then(function(
																		result) {
																	$scope.newShSetting = result;
																	$scope.newShSetting.object.publicAccess = $scope.publicAccess;
																	$scope.newShSetting.object["userGroupAccesses"] = [];
																	for (int = 0; int < $scope.uGroupSelected.length; int++) {

																		$scope.newShSetting.object.userGroupAccesses
																				.push({

																					id : $scope.uGroupSelected[int].id,
																					displayName : $scope.uGroupSelected[int].displayName,
																					access : $scope.uGroupSelected[int].access
																				});
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
																				$scope.uGroupSelected = [];
																				$scope
																						.getObjects($scope.objectSelect);

																						

																			})
																})
													}
												})
												
								
								var auxiliar=[];
								var auxiliarConcat= "";
								for ( w = 0; w < $scope.aux.length; w++) {
									auxiliar.push({ displayName : $scope.aux[w].displayName});
									
									if (auxiliar.length ==$scope.aux.length ) {
										for (v = 0; v < auxiliar.length; v++) {
											
											auxiliarConcat=auxiliarConcat + ", ";
											auxiliarConcat = auxiliarConcat.concat(auxiliar[v].displayName);
										}
										
										$scope.addAlert($translate("MESSAGE") + " "
												+ auxiliarConcat, "success");
										objectSelected=[];
										
									}
								}
								
							
							}

							// Assign Elements to the Api
							$scope.newShareObject = function(resultGet,
									uGroupSelected, access) {
								var newShSetting;
								var userGroupA = [];
								try {

									for (x = 0; x < resultGet.object.userGroupAccesses.length; x++) {
										for (z = 0; z <= (uGroupSelected.length) - 1; z++) {
											if ((resultGet.object.userGroupAccesses[x].id) == (uGroupSelected[z].id)) {
												resultGet.object.userGroupAccesses
														.splice(x, 1);
												userGroupA
														.push({
															id : uGroupSelected[z].id,
															displayName : uGroupSelected[z].displayName,
															access : $scope.uGroupSelected[z].access
														});

											}
										}
									}
									newShSetting = resultGet;
									for (y = 0; y < uGroupSelected.length; y++) {
										newShSetting.object.userGroupAccesses
												.push({
													id : uGroupSelected[y].id,
													displayName : uGroupSelected[y].displayName,
													access : $scope.uGroupSelected[y].access
												});
									}
									return newShSetting;
								} catch (error) {
									newShSetting = resultGet;
									for (a = 0; a < userGroupA.length; a++) {
										newShSetting.object.userGroupAccesses
												.push({
													id : userGroupA[a].id,
													displayName : userGroupA[a].displayName,
													access : $scope.uGroupSelected[a].access
												});
									}
									return newShSetting;

								}
							}

							// Get Elements selected
							$scope.getOptionSelected = function(objectSelected,
									mObjects) {
								try {
									for (a = 0; a < objectSelected.length; a++) {
										for (i = 0; i < $scope.listmObjects.length; i++) {
											if ((objectSelected[a].id) == ($scope.listmObjects[i].id)) {
												$scope.listmObjects
														.splice(i, 1);
												$scope.objectSele
														.push({
															id : objectSelected[a].id,
															displayName : objectSelected[a].displayName,
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

							// pass all Elements selected
							$scope.passAll = function(objectSelected) {
								if ($scope.listmObjects.length) {
									objectSelected = $scope.listmObjects;
									try {
										for (a = 0; a < objectSelected.length; a++) {
											for (i = 0; i < $scope.listmObjects.length; i++) {
												$scope.objectSele
														.push({
															id : objectSelected[a].id,
															displayName : objectSelected[a].displayName,
															key : objectSelected[a].key
														});
												break;
											}
										}
									} catch (error) {
									}
								}
								$scope.listmObjects = [];

							}
							// remove All Elements selected
							$scope.removeAll = function(objectSelected) {
								try {
									for (x = 0; x <= $scope.listmObjects.length; x++) {
										$scope.listmObjects
												.push({
													id : objectSelected[x].id,
													displayName : objectSelected[x].displayName,
													key : objectSelected[x].key
												});
									}
									$scope.objectSele = [];
								} catch (error) {
									$scope.objectSele = [];
								}
							}

							// Remove Selected Elements
							$scope.removeOptionSelected = function(
									objectSelected) {
								try {

									for (x = 0; x < objectSelected.length; x++) {
										for (z = 0; z < $scope.objectSele.length; z++) {

											if ($scope.objectSele[z].id == objectSelected[x].id) {
												$scope.listmObjects
														.push({
															id : objectSelected[x].id,
															displayName : objectSelected[x].displayName,
															key : objectSelected[x].key
														});
												$scope.objectSele.splice(z, 1)

											}

										}
									}
								} catch (error) {
									console.log("catch", objectSelected);
								}

							}

							// remove Group Access
							$scope.removeGroupAccess = function(access,object,varModal) {
								$scope.groupAccesses = [];
								for (c = 0; c < $scope.mObjects.length; c++) {
									if ($scope.elementToRemove == $scope.mObjects[c].id) {
										for (d = 0; d < $scope.mObjects[c].userGroupAccesses.length; d++) {
											if ($scope.idUgroup == $scope.mObjects[c].userGroupAccesses[d].id) {

												$scope.mObjects[c].userGroupAccesses
														.splice(d, 1);
												break;
											}
										}
										$scope.groupAccesses = $scope.mObjects[c].userGroupAccesses;
										sharingSetting.get({
											id : $scope.mObjects[c].id,
											type : $scope.type
										}).$promise
												.then(function(result) {
													$scope.mobject = result;
													$scope.mobject.object.userGroupAccesses = $scope.mObjects[c].userGroupAccesses;
													$scope.mObjects[c]["userGroupAccesses"] = [];
													if ($scope.groupAccesses.length >= 1) {
														for (n = 0; n < $scope.groupAccesses.length; n++) {
															$scope.mObjects[c].userGroupAccesses[n] = ({
																id : $scope.groupAccesses[n].id,
																displayName : $scope.groupAccesses[n].displayName,
																access : $scope.groupAccesses[n].access
															})

															$scope.mobject.object.userGroupAccesses[n] = ({
																id : $scope.groupAccesses[n].id,
																displayName : $scope.groupAccesses[n].displayName,
																access : $scope.groupAccesses[n].access
															})
														}
													} else {
														$scope.mobject.object.userGroupAccesses = [];
														$scope.mObjects[c].userGroupAccesses = [];

													}
													sharingSetting
															.POST(
																	{
																		id : $scope.mobject.object.id,
																		type : $scope.type
																	},
																	$scope.mobject).$promise
															.then(function(
																	resultPost) {
																if (varModal!="modalDelete") {
																	$scope
																	.addAlert(
																			$translate("MESSAGE")
																					+ " "
																					+ $scope.mobject.object.displayName,
																			"success");
																}
													
																$scope.mobject = [];
															});
												});
										break;

									}
								}
							}

							// /return the Group Access and elements to remove
							$scope.returnObjectToRemove = function(
									objectRemove, element, id) {
								$scope.objectToRemove = objectRemove;
								$scope.elementToRemove = element.id;
								if ($scope.elementToRemove == undefined) {
									$scope.elementToRemove = element[0].id;
								}

								$scope.idUgroup = id;
							}

							// /select all buttons to assign permissions in
							// panel
							$scope.selectAllButtons = function(nval) {
								angular.forEach($scope.ugStatus, function(val,k) {
									if((($scope.UserGroupsFiltred.length>1)?$scope.UserGroupsFiltred[k]:true)==true)
										$scope.ugStatus[k] = nval;
									else{
										if($scope.ugStatus[k]=="")
											$scope.ugStatus[k] = 0;
									}
								});
							}

							// load permissions
							$scope.loadAccess = function(userGroup) {
								angular.forEach($scope.status,
										function(val, k) {
											$scope.status[k] = nval;
										});
							}

							// Do post of user Group changed in principal
							// interface
							$scope.postGroup = function(mObject, access,
									userGroup, id) {
								sharingSetting.get({
									id : mObject.id,
									type : $scope.type
								}).$promise
										.then(function(result) {
											for (x = 0; x < result.object.userGroupAccesses.length; x++) {
												for (z = 0; z < mObject.userGroupAccesses.length; z++) {
													if (id == mObject.userGroupAccesses[z].id) {
														result.object.userGroupAccesses[z] = [];
														result.object.userGroupAccesses = mObject.userGroupAccesses;
														result.object.userGroupAccesses[z].access = access;

														for (w = 0; w < $scope.objectPrincipal.length; w++) {
															if ($scope.objectPrincipal[w].id == result.object.id) {
																for (y = 0; y < $scope.objectPrincipal[w].userGroupAccesses.length; y++) {
																	if ($scope.objectPrincipal[w].userGroupAccesses[y].id == result.object.userGroupAccesses[z].id) {
																		$scope.objectPrincipal[w].userGroupAccesses = mObject.userGroupAccesses;
																		break;
																	}

																}
																break;
															}

														}
																sharingSetting
																		.POST(
																				{
																					id : result.object.id,
																					type : $scope.type
																				},
																				result).$promise
																		.then(function(
																				resultPost) {
																			$scope
																					.addAlert(
																							$translate("MESSAGE")
																									+ " "
																									+ result.object.displayName,
																							"success");

																		}),
																function(error) {
																	$scope
																			.addAlert(
																					error,
																					"danger");

																};
													}
												}
												break;
											}
										});
							}

							// Clean Variables
							$scope.clean = function() {
								$scope.ugStatus = [];
								$scope.objectSelected = [];
								$scope.ugStatusAccess = [];
								$scope.objectSele = [];
								$scope.listmObjects = $scope.objectPrincipal;
								access = "";
								responseDataElements = [];
								$scope.newShSetting = [];
								$scope.getUserGroups("userGroups");
								$scope.changeColor = 2;
								var auxiliar=[];
								var auxiliarConcat= "";
								$scope.aux=[];
								$scope.getObjects($scope.objectSelect);
								permissions="update";
								$scope.publicAccess="";
								$scope.UserGrupsFind="";
								$scope.UserGroupsFiltred=[];
//								$scope.selectAllButtons(0);
							}

						} ]);