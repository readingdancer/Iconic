﻿angular.module("umbraco").controller("Our.Iconic.Prevalues.Editor",
    function($scope, $http, $timeout, localizationService, editorService, umbRequestHelper, assetsService) {

        $scope.configType = "custom";
        $scope.selectedPreConfig = null;
        $scope.previewIcon = null;
        $scope.previewButtonState = "init";
        $scope.analysing = "init";


        $scope.loadPreview = function() {
            $scope.previewButtonState = "busy";
            if ($scope.model.package.cssfile) {
                extractStyles(
                    $scope.model.package,
                    function(extractedStyles) {
                        $scope.previewIcon = extractedStyles[0];

                        loadCss();

                        $scope.previewButtonState = "success";
                    },
                    function() {
                        $scope.previewIcon = null;
                        displayError("iconicErrors_no_rules");
                        $scope.previewButtonState = "error";
                    }
                );
            }
        };


        $scope.submit = function() {
            $scope.analysing = "busy";
            if ($scope.packageForm.$valid) {
                extractStyles(
                    $scope.model.package,
                    function() {
                        $scope.analysing = "success";
                        $scope.selectedPreConfig = null;

                        if ($scope.model.saved) {
                            $scope.model.saved();
                        }
                        editorService.close();
                    },
                    function() {
                        $scope.analysing = "error";
                    }
                );

            }
        };

        $scope.cancel = function() {
            if ($scope.model.cancel) {
                $scope.model.cancel();
            }
            editorService.close();

        }

        $scope.changeConfigType = function(value) {
            $scope.configType = value;
        }

        $scope.toggleOverrideTemplate = function() {
            $scope.model.package.overrideTemplate = !$scope.model.package.overrideTemplate;
        }

        $scope.openCssFilePicker = function() {
            const config = {
                select: function(node) {
                    const id = unescape(node.id);
                    $scope.model.package.cssfile = id;
                    editorService.close();
                }
            };
            openTreePicker(config);
        };

        $scope.openRulesFilePicker = function() {
            const config = {
                select: function(node) {
                    const id = unescape(node.id);
                    $scope.model.package.sourcefile = id;
                    editorService.close();
                }
            };
            openTreePicker(config);
        };

        $scope.selectPreConfig = function(config) {
            Object.assign($scope.model.package, config);
        };


        var overlay = {
            view: umbRequestHelper.convertVirtualToAbsolutePath("~/App_plugins/Iconic/Views/iconic.dialog.html"),
            title: "Select an icon",
            size: "small",
            submit: function(model) {
                $scope.model.package.filteredIcons = $scope.model.package.filteredIcons || [];
                $scope.model.package.filteredIcons.push(model.pickerData.icon);
                editorService.close();
            },
            close: function() {
                editorService.close();
            },
            pickerConfig: {
                packages: [$scope.model.package]
            }
        };

        $scope.openOverlay = function() {
            editorService.open(overlay);
        }


        $scope.removeFilteredIcon = function(idx) {
            $scope.model.package.filteredIcons.splice(idx, 1);
        }

        $scope.removeCssFile = function() {
            $scope.model.package.cssfile = null;
        };

        $scope.removeRulesFile = function() {
            $scope.model.package.sourcefile = null;
        };


        function loadCss() {
            var cssUri = isExternalUri($scope.model.package.cssfile) ? $scope.model.package.cssfile :
                umbRequestHelper.convertVirtualToAbsolutePath('~/' + $scope.model.package.cssfile.replace(/wwwroot\//i, ''));

            $http.get(cssUri).then(
                function(response) {
                    assetsService.loadCss(cssUri);
                },
                function(response) {
                    displayError("iconicErrors_loading");
                }
            );
        }

        function loadPreconfigs() {
            $http.get(umbRequestHelper.convertVirtualToAbsolutePath("~/App_Plugins/Iconic/preconfigs.json")).then(
                function(response) {
                    $scope.preconfig = response.data.preconfigs;
                },
                function(response) {
                    displayError("iconicErrors_loading");
                }
            );
        }

        function isExternalUri(uri) {
            return uri.indexOf("://") > -1;
        }

        function displayError(alias) {
            localizationService.localize(alias).then(function(response) {
                $scope.error = response.value;
            });
        }

        function openTreePicker(config) {
            var picker = {
                title: "Select file",
                section: "settings",
                treeAlias: "files",
                entityType: "file",
                filter: function(i) {
                    if (i.name.indexOf(".min.css") === -1 &&
                        i.name.indexOf(".css") === -1) {
                        return true;
                    }
                },
                filterCssClass: "not-allowed",
                close: function() {
                    editorService.close();
                }
            };

            var args = _.assign(picker, config);

            editorService.treePicker(args);
        }

        function extractStyles(item, successCallback, errorCallback) {
            $scope.error = null;

            if (!item.selector || item.selector.length <= 0) {
                errorCallback();
                displayError("iconicErrors_selector");
            }

            if (!item.sourcefile) item.sourcefile = item.cssfile;


            var path = isExternalUri(item.sourcefile) ?
                item.sourcefile :
                umbRequestHelper.convertVirtualToAbsolutePath("~/" + item.sourcefile.replace("wwwroot/", ""));

            $http.get(path).then(
                function(response) {
                    item.extractedStyles = [];

                    try {
                        var pattern = new RegExp(item.selector, "g");
                    } catch (e) {
                        $scope.error = e.message;
                        errorCallback();
                        return;
                    }

                    var match = pattern.exec(response.data);
                    while (match !== null) {
                        item.extractedStyles.push(match[1]);
                        match = pattern.exec(response.data);
                    }

                    if (item.extractedStyles.length > 0) {
                        successCallback(item.extractedStyles);
                    } else {
                        displayError("iconicErrors_no_rules");
                        errorCallback();
                    }
                },
                function(response) {
                    displayError("iconicErrors_loadingCss");
                    errorCallback();
                }
            );
        }

        loadPreconfigs();
        $scope.loadPreview();
    });