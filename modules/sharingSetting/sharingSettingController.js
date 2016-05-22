appImport.controller('importController', ['$scope', '$filter', 'commonvariable', 'sharingSetting', function ($scope, $filter, commonvariable, sharingSetting) {

    //variables
    var $translate = $filter('translate');
    $scope.readed = true;
    $scope.alerts = [{ type: "warning", msg: $translate("MSG_INTRO") }];
    $scope.readyForImport = true;
    $scope.webMethod = "POST";
    $scope.Importerror = [];
    $scope.ImportValueError = [];
    $scope.Importfinished = false;
    $scope.kon = 0;
    $scope.objImported = 0;
    $scope.objNoImported = 0;
    $scope.numposition = 0;
    
    var dhisResources = {
        "categotyOptions": categoryOptions
    };


    ///methods

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function (type, message) {
        $scope.alerts = [];
        $scope.alerts.push({ type: type, msg: message});
    };

    $scope.handler = function (e, files) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var string = reader.result;
            $scope.conten = string;
            $scope.readed = false;
            //
            $scope.Importfinished = false;
            $scope.kon = 0;
            $scope.readyForImport = false;
            $scope.objImported = 0;
            $scope.objNoImported = 0;
            $scope.Importerror = [];
            $scope.ImportValueError = [];
          
        }
        reader.readAsText(files[0]);
    }

    $scope.readFile = function () {
        try {
            $scope.dataforImport = JSON.parse($scope.conten);
            $scope.typeinformation = Object.keys($scope.dataforImport);
            $scope.typeinformation = $scope.typeinformation[0];
            $scope.numRegister = $scope.dataforImport[$scope.typeinformation].length;
            $scope.readyForImport = false;
            $scope.addAlert("info", $translate("MSG_READYFORIMPORT"));
        } catch (err) {
            $scope.addAlert("danger", $translate("MSG_ERRORFORIMPORT") + err);
            $scope.readyForImport = true;
        };
        
    }
    $scope.startImport = function (position) {
        $scope.readyForImport = false;
        $scope.kon = Math.round(position * 100 / $scope.numRegister);
        var value = $scope.dataforImport[$scope.typeinformation][position];
        var currentMethod = dhisResources[$scope.typeinformation][$scope.webMethod];
        var uid=$scope.typeinformation.substring(0,$scope.typeinformation.length-1)
        ///setting params needed for 
        if ($scope.webMethod != "POST")
            var param = { id: value[uid] };
        else
            var param = {};
        ////execute method
        currentMethod(param, value).$promise.then(function (result) {
            if ((result.response.imported == 0 && $scope.webMethod == "POST") || (result.response.updated == 0 && $scope.webMethod == "POST") || (result.response.updated == 0 && $scope.webMethod == "PUT")) {
                $scope.Importerror.push(result.response.importSummaries);
                $scope.ImportValueError.push(value);
                $scope.objNoImported=$scope.objNoImported+1;
            }    
            else {
                $scope.objImported = $scope.objImported + 1;
            }

           if (position + 1 < $scope.numRegister) {
                $scope.startImport(position + 1);
            }
            else {
               $scope.addAlert("success", $translate("MSG_FINISHED"));
               $scope.Importfinished = true;
            }
        }, function (error) {
            // error handler
            //capture error
            $scope.objNoImported = $scope.objNoImported + 1;
            try {
                if (error.data.response.conflicts)
                    $scope.Importerror.push(error.data.response.conflicts);
                else
                    $scope.Importerror.push(error.data.response.importSummaries);
            } catch (err) {
                try{
                    $scope.Importerror.push(error.data.response.importSummaries);
                }catch(err2){
                    $scope.Importerror.push(error.data);
                };                
            };
            
            //capture Object with error
            $scope.ImportValueError.push(value);

            console.log(error);
            if (position + 1 < $scope.numRegister) {
                $scope.startImport(position + 1);
            }
            else {
                $scope.addAlert("sucess", $translate("MSG_FINISHED"));
                $scope.Importfinished = true;
            }
        });
       
   
    }

 $scope.saveJson = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var json = JSON.stringify(data),
                blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());


}]);