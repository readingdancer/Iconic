angular.module("umbraco")
    .controller("Our.Iconic.Dialog.Controller", ['$scope', '$http', 'assetsService', 'umbRequestHelper', function($scope, $http, assetsService, umbRequestHelper) {

        $scope.packages = $scope.model.pickerConfig.packages;
        $scope.pckgselected = null;
        $scope.iconsSize = 16;
        $scope.styles = [];
        $scope.loading = false;
        $scope.value = angular.copy($scope.model.pickerData, []);

        $scope.loadPackage = function(pckg) {

            if (pckg == null) return;

            $scope.loading = true;

            var cssUri = isExternalUri(pckg.cssfile) ? pckg.cssfile :
                umbRequestHelper.convertVirtualToAbsolutePath('~/' + pckg.cssfile.replace(/wwwroot\//i, ''));

            $http.get(cssUri).then(
                function(response) {
                    assetsService.loadCss(cssUri)
                        .then(function() {
                            $scope.loading = false;
                            $scope.pckgselected = pckg;
                        });
                },
                function(response) {
                    displayError("iconicErrors_loading");
                }
            );
        }



        $scope.selectIcon = function(icon) {
            $scope.value.push(new Icon(icon, $scope.pckgselected.id));

            if ($scope.model.iconLimit && $scope.value.length >= $scope.model.iconLimit) {
                $scope.submit();
            }
        }

        $scope.submit = function() {
            $scope.model.submit($scope.value); //it passes the model back to the overlay caller            
        }

        $scope.cancel = function() {
            $scope.model.cancel();
        }

        $scope.isInSelectedIcons = function() {
            return $scope.value.find((el) => el.icon === icon && el.packageId === $scope.pckgselected.id);
        }

        function initOverlay() {
            var pckg;

            if ($scope.value && $scope.value.packageId) {
                pckg = $scope.model.pickerConfig.packages.find((el) => el.id == $scope.value.packageId);
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