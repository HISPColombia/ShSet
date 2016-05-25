appImport.controller('importController', ['$scope', '$filter', 'commonvariable', 'sharingSetting','dhisResource', function ($scope, $filter, commonvariable, sharingSetting,dhisResource) {

    // variables
    var $translate = $filter('translate');
    
    // /Object array of api object and type variable in sharing Setting resource
    $scope.elements=[
                     {type:"dataElement",
                      resource:"dataElements",
                      name:$translate("OBJ_DATAELEMENT")},
                      {type:"dataElementGroup",
                       resource:"dataElementGroups",
                       name:$translate("OBJ_DATAELEMENTGROUP")},
                       {type:"categoryOptions",
                       resource:"categoryOptions",
                       name:$translate("OBJ_CATEGORYOPTIONS")},
                       {type:"categoryCombo",
                       resource:"categoryCombos",
                       name:$translate("OBJ_CATEGORYCOMBO")},
                       {type:"indicators",
                       resource:"indicators",
                       name:$translate("OBJ_INDICATORS")},
                       {type:"indicatorGroup",
                       resource:"indicatorGroups",
                       name:$translate("OBJ_INDICATORSGROUPS")},
                       {type:"dataSet",
                       resource:"dataSets",
                       name:$translate("OBJ_DATASETS")},
                       {type:"organisationUnitGroup",
                       resource:"organisationUnitGroups",
                       name:$translate("OBJ_ORGANISATIONUNITGROUPS")},
                       {type:"organisationUnitGroupSet",
                       resource:"organisationUnitGroupSets",
                       name:$translate("OBJ_ORGANISATIONUNITGROUPSSETS")},
                       {type:"optionsets",
                       resource:"optionSets",
                       name:$translate("OBJ_OPTIONSETS")},
                       {type:"userGroups",
                           resource:"userGroups",
                           name:$translate("OBJ_USERGROUPS")},
                     ];
    
    $scope.permissions = [{"Edit":"CANEDIT","EditView":"Edit-View"},{"None":"None"}];
  
   // /methods
    $scope.getObjects=function(resource,title,page){
    	$scope.titleList=title;
    	$scope.page=page;
    	dhisResource.GET({resource:resource,fields:"id,displayName,userGroupAccesses,page"})
    	.$promise.then(function(response) {
    		$scope.mObjects=response.dataElements;
    		
    	});
    }
    
    
    // pagination variables
    $scope.filteredTodos = [];
    $scope.itemsPerPage = 30;
    $scope.currentPage = 1;

    //pagintation methods
    $scope.makeTodos = function() {
      $scope.todos = [];
      for (i=1;i<=1000;i++) {
        $scope.todos.push({ text:'todo '+i, done:false});
      }
    };

    $scope.figureOutTodosToDisplay = function() {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.filteredTodos = $scope.todos.slice(begin, end);
    };

    $scope.makeTodos(); 
    $scope.figureOutTodosToDisplay();

    $scope.pageChanged = function() {
      $scope.figureOutTodosToDisplay();
    };
    
    
     //GET DROPDOWNLIST
//    alert(document.getElementById("<%=dropdownElements.ClientID%>").options[document.getElementById("<%=dropdownElements.ClientID%>").selectedIndex].text)
    
 
    }]);
    
    