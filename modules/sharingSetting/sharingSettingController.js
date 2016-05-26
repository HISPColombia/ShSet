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

							$scope.permissions = [ {
								"Edit" : "CANEDIT",
								"EditView" : "Edit-View"
							}, {
								"None" : "None"
							} ];

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
											fields : "id,displayName,userGroupAccesses",
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
							// /scroll

							// $scope.elemVals = {};
							// $scope.parentScrollable = true;
							// $scope.parentRelative = true;
							//
							// $scope.getValues = function() {
							// var divEl = $window.document
							// .querySelector('#posdemodiv');
							// var btnEl = $window.document
							// .querySelector('#posdemobtn');
							//
							// var offsetParent = $uibPosition
							// .offsetParent(divEl);
							// $scope.elemVals.offsetParent = 'type: '
							// + offsetParent.tagName + ', id: '
							// + offsetParent.id;
							//
							// var scrollParent = $uibPosition
							// .scrollParent(divEl);
							// $scope.elemVals.scrollParent = 'type: '
							// + scrollParent.tagName + ', id: '
							// + scrollParent.id;
							//
							// $scope.scrollbarWidth = $uibPosition
							// .scrollbarWidth();
							//
							// $scope.elemVals.position = $uibPosition
							// .position(divEl);
							//
							// $scope.elemVals.offset = $uibPosition
							// .offset(divEl);
							//
							// $scope.elemVals.viewportOffset = $uibPosition
							// .viewportOffset(divEl);
							//
							// $scope.elemVals.positionElements = $uibPosition
							// .positionElements(btnEl, divEl,
							// 'auto bottom-left');
							// };

							// urgadultos@gmail.com
						} ]);
