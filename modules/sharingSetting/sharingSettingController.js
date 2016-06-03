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
							$scope.change=1;
							
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
										type : "optionsets",
										resource : "optionSets",
										name : $translate("OBJ_OPTIONSETS")
									}, {
										type : "userGroups",
										resource : "userGroups",
										name : $translate("OBJ_USERGROUPS")
									}, ];
							

							$scope.userGr = [{
								type : "userGroups",
								resource : "userGroups",
								name : $translate("OBJ_USERGROUPS")
							},];
							
							// /methods
							$scope.getObjects = function(resource, title, page) {
								$scope.titleList = title;
								$scope.currentResource = resource;
								$scope.currentTitle = title;
								if (page == undefined) {
									page = 1
								}
								dhisResource
										.GET({
											resource : resource,
											fields : "id,code,displayName,userGroupAccesses",
											page : page
										}).$promise
										.then(function(response) {
											$scope.mObjects = response[resource];
											$scope.objectToSelected =[];
											
											angular.forEach($scope.mObjects, function(value,key){
												$scope.objectToSelected.push({value :value.id ,
													label : value.displayName });	
											})
											
											$scope.uGroup=response[resource="userGroups"];
											$scope.pager = response.pager.page;
											$scope.itemsPerPage = response.pager.pageSize;
											$scope.currentPage = response.pager.page;
											$scope.pageCount = response.pager.pageCount;
											$scope.makeTodos($scope.pageCount);
											$scope.total = response.pager.total;
											$scope.id=response.userGroupAccesses;
										});
							}
							
							
							$scope.getUserGroups = function(resource) {
							  $scope.currentResource = resource;
							 dhisResource
										.GET({
											resource : resource,
											fields : "id,displayName",
											
										}).$promise
										.then(function(response) {
											
											$scope.uGroups=response["userGroups"];
											
										});
							}
							$scope.getUserGroups("userGroups");
							$scope.putObjects = function(publicAccess,user,userGroupAccesses){
								$scope.publicAccess = false;
								$scope.userGroupAccesses;
								$scope.id=response.id;							
							};

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

								$scope
										.getObjects($scope.currentResource,
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

							function removeRole( context ) {
								  removeItem(context.id, context.name, i18n_confirm_delete, 'removeRole.action');
								}
							

							$().ready(function() 
									{
										$('.pass').click(function() {
													console.log(destino);	
											return !$('#origen option:selected').remove().appendTo('#destino'); 
										});  
										$('.remove').click(function() {
											return !$('#destino option:selected').remove().appendTo('#origen'); 
											});
										$('.passAll').click(function() {
											$('#origen option').each(function() {
												$(this).remove().appendTo('#destino'); 
												});
											});
										$('.removeAll').click(function() {
											$('#destino option').each(function() {
												$(this).remove().appendTo('#origen'); 
												});
											});
									
									});
							
						}]);