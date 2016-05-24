appImport.controller('importController', ['$scope', '$filter', 'commonvariable', 'sharingSetting', function ($scope, $filter, commonvariable, sharingSetting) {

    // variables
    var $translate = $filter('translate');
    $scope.readed = true;
    $scope.alerts = [{ type: "warning", msg: $translate("MSG_INTRO") }];
    $scope.elements = [{"DataElements":"DataElements","DataElementsGroups":"DataElementsGroups",
                       "CategoryOptions":"CategoryOptions","CategoryCombo":"CategoryCombo",
                       "indicators":"indicators","indicatorsgroups";"indicatorsgroups","datasets":"datasets",
                       "organisationunitsgroups":"organisationunitsgroups","organisationunitsgroupssets":"organisationunitsgroupssets",
                       "optionsets":"optionsets","usergroups":"usergroups"}];
    
    $scope.permisos = [{"Edit":"CANEDIT","EditView":"Edit-View"},{"None":"None"}];
    $scope.webMethod = "POST";
    $scope.seleccion = true;
   
    var dhisResources = {
        "categotyOptions": sharingSetting
    };

  
    } 
    
    