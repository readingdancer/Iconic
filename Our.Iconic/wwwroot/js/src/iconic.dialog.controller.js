angular.module("umbraco")
    .controller("Our.Iconic.Dialog.Controller", ['$scope', '$http', 'assetsService', 'umbRequestHelper', function($scope, $http, assetsService, umbRequestHelper) {

        $scope.packages = $scope.model.pickerConfig.packages;
        $scope.pckgselected = null;
        $scope.iconsSize = 16;
        $scope.styles = [];
        $scope.loading = false;
        $scope.icons = [];
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
                            $scope.pckgselected = new Package(pckg);
                            $scope.icons = getIcons();
                        });
                },
                function(response) {
                    displayError("iconicErrors_loading");
                }
            );
        }

        function getIcons() {
            if ($scope.pckgselected == null) return [];
            if ($scope.model.filterIcons) {
                return $scope.pckgselected.getFilteredIcons();
            } else {
                return $scope.pckgselected.extractedStyles;
            }
        }

        $scope.selectIcon = function(icon) {
            if (icon == null) return;

            var iconModel = new Icon(icon, $scope.pckgselected.id);

            var existingIcon = $scope.value.find(x => x.icon == iconModel.icon && x.packageId == iconModel.packageId)
            if (existingIcon != null) {
                $scope.value.slice($scope.value.indexOf(iconModel), 1);
                return;
            }

            if ($scope.model.iconsLimit === 1) {
                $scope.value = [];
                $scope.value.push(iconModel);
                $scope.submit();
            }

            if (!$scope.model.iconsLimit || $scope.value.length < $scope.model.iconsLimit) {
                $scope.value.push(iconModel);
            }

        }

        $scope.submit = function() {
            $scope.model.submit($scope.value); //it passes the model back to the overlay caller            
        }

        $scope.cancel = function() {
            $scope.model.cancel();
        }

        $scope.isInSelectedIcons = function(icon) {
            return $scope.value.find((el) => el.icon === icon && el.packageId === $scope.pckgselected.id) != null;
        }

        function initOverlay() {

            pckg = $scope.packages[0];

            if (angular.isObject(pckg)) {
                $scope.loadPackage(pckg);
            }
        }

        function isExternalUri(uri) {
            return uri.indexOf("://") > -1;
        }

        initOverlay();

    }]);