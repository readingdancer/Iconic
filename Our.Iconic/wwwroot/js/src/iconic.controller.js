angular.module("umbraco")
    .controller("Our.Iconic.Controller", ['$scope', 'assetsService', 'umbRequestHelper', 'editorService', function($scope, assetsService, umbRequestHelper, editorService) {
        var config = $scope.model.config;

        $scope.pckg;
        $scope.modelIsValid = false;
        $scope.icon;

        $scope.selectIcon = function(model) {
            if (model.icon && model.packageId) {
                $scope.pckg = loadPackage(config.packages, model.packageId);
                $scope.model.value = model;
                $scope.modelIsValid = true;
            } else {
                $scope.modelIsValid = false;
            }

        };


        $scope.removeIcon = function() {
            $scope.model.value = {};
            $scope.modelIsValid = false;
        };

        var overlay = {
            view: umbRequestHelper.convertVirtualToAbsolutePath("~/App_plugins/Iconic/Views/iconic.dialog.html"),
            title: "Select an icon",
            size: 'small',
            iconLimit: 1,
            submit: function(icons) {
                $scope.selectIcon(icons[0]);
                editorService.close();
            },
            cancel: function() {
                editorService.close();
            },
            pickerData: $scope.model.value,
            pickerConfig: config
        };

        $scope.openOverlay = function() {
            editorService.open(overlay);
        }


        function loadPackage(packages, packageId) {
            return packages.find((el) => el.id === packageId);
        }

        function initPicker() {
            $scope.loading = true;
            if (!angular.isObject($scope.model.value)) {
                $scope.model.value = {};
            }

            if ($scope.model.value && $scope.model.value.packageId && $scope.model.value.icon) {

                $scope.pckg = loadPackage(config.packages, $scope.model.value.packageId);
                if ($scope.pckg) {
                    assetsService.loadCss('~/' + $scope.pckg.cssfile.replace(/wwwroot\//i, ''));
                    $scope.modelIsValid = true;
                }
            } else {
                $scope.modelIsValid = false;
            }
            $scope.loading = false;
        }

        initPicker();

    }]);