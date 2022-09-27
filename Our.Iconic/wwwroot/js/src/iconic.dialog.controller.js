angular.module("umbraco")
    .controller("Our.Iconic.Dialog.Controller", ['$scope', '$http', 'assetsService', 'umbRequestHelper', function($scope, $http, assetsService, umbRequestHelper) {

        $scope.packages = $scope.model.pickerConfig.packages;
        $scope.pckgselected = null;
        $scope.iconsSize = 16;
        $scope.styles = [];
        $scope.loading = false;

        $scope.loadPackage = function(pckg) {

            if (pckg == null) return;

            $scope.loading = true;            

            var cssUri = isExternalUri(pckg.cssfile) ? pckg.cssfile :
                umbRequestHelper.convertVirtualToAbsolutePath('~/' + pckg.cssfile.replace(/wwwroot\//i, ''));

            $http.get(cssUri).then(
                function (response) {
                    assetsService.loadCss(cssUri)
                        .then(function () {
                            $scope.loading = false;
                            $scope.pckgselected = pckg;
                        });
                },
                function (response) {
                    displayError("iconicErrors_loading");
                }
            );                       
        }



        $scope.selectIcon = function(icon) {
            $scope.model.pickerData = new Icon(icon, $scope.pckgselected.id);
            $scope.model.submit($scope.model); //it passes the model back to the overlay caller            
        }



        function initOverlay() {
            var pckg;

            if ($scope.model.pickerData && $scope.model.pickerData.packageId) {
                pckg = $scope.model.pickerConfig.packages.find((el) => el.id == $scope.model.pickerData.packageId);
            }

            //if there is only one package we select that one, regardless what the stored values says.
            if ($scope.packages.length === 1) {
                pckg = $scope.packages[0];
            }

            if (angular.isObject(pckg)) {
                $scope.loadPackage(pckg);
            }
        }

        function isExternalUri(uri) {
            return uri.indexOf("://") > -1;
        }

        initOverlay();

    }]);