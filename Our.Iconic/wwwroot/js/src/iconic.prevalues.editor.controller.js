angular
  .module("umbraco")
  .controller(
    "Our.Iconic.Prevalues.Editor",
    function (
      $scope,
      $http,
      $timeout,
      localizationService,
      editorService,
      umbRequestHelper,
      assetsService,
      notificationsService
    ) {
      $scope.configType = "custom";
      $scope.selectedPreConfig = null;
      $scope.previewIcon = null;
      $scope.previewButtonState = "init";
      $scope.analysing = "init";

      $scope.loadPreview = function () {
        $scope.previewButtonState = "busy";
        if ($scope.model.package.cssfile) {
          extractStyles(
            $scope.model.package,
            function (extractedStyles) {
              $scope.previewIcon = extractedStyles[0];
              loadCss($scope.model.package.cssfile);
              $scope.previewButtonState = "success";
            },
            function () {
              $scope.previewIcon = null;
              $scope.previewButtonState = "error";
            }
          );
        }
      };

      $scope.submit = function () {
        $scope.analysing = "busy";
        if ($scope.packageForm.$valid) {
          extractStyles(
            $scope.model.package,
            function () {
              $scope.analysing = "success";
              $scope.selectedPreConfig = null;

              if ($scope.model.saved) {
                $scope.model.saved();
              }
              editorService.close();
            },
            function () {
              $scope.analysing = "error";
            }
          );
        }
      };

      $scope.cancel = function () {
        if ($scope.model.cancel) {
          $scope.model.cancel();
        }
        editorService.close();
      };

      $scope.changeConfigType = function (value) {
        $scope.configType = value;
      };

      $scope.openCssFilePicker = function () {
        const config = {
          select: function (node) {
            const id = unescape(node.id);
            $scope.model.package.cssfile = id;
            editorService.close();
          },
        };
        openTreePicker(config);
      };

      $scope.openRulesFilePicker = function () {
        const config = {
          select: function (node) {
            const id = unescape(node.id);
            $scope.model.package.sourcefile = id;
            editorService.close();
          },
        };
        openTreePicker(config);
      };

      $scope.selectPreConfig = function (config) {
        Object.assign($scope.model.package, config);
      };

      $scope.filterIconsOverlay = {
        view: umbRequestHelper.convertVirtualToAbsolutePath(
          "~/App_Plugins/Iconic/Views/iconic.dialog.html"
        ),
        title: "Select icons",
        size: "small",
        submit: function (icons) {
          $scope.model.package.filteredIcons = icons;
          editorService.close();
        },
        cancel: function () {
          editorService.close();
        },
        pickerIcons: $scope.model.package.filteredIcons,
        pickerPackageId: $scope.model.package.id,
        pickerConfig: {
          packages: [$scope.model.package]
        }
      };

      $scope.openFilterIconsOverlay = function () {
        $scope.filterIconsOverlay.pickerIcons =
          $scope.model.package.filteredIcons;
        editorService.open($scope.filterIconsOverlay);
      };

      $scope.removeFilteredIcon = function (idx) {
        $scope.model.package.filteredIcons.splice(idx, 1);
      };

      $scope.removeCssFile = function () {
        $scope.model.package.cssfile = null;
      };

      $scope.removeRulesFile = function () {
        $scope.model.package.sourcefile = null;
      };

      function loadCss(uri) {
        var cssUri = isExternalUri(uri)
          ? uri
          : umbRequestHelper.convertVirtualToAbsolutePath(
              `~/${uri.replace(/wwwroot\//i, "")}`
            );

        $http.get(cssUri).then(
          function () {
            assetsService.loadCss(cssUri);
          },
          function () {
            displayError("iconicErrors_loadingCss");
          }
        );
      }

      function loadPreConfigs() {
        $http
          .get(
            umbRequestHelper.convertVirtualToAbsolutePath(
              "~/App_Plugins/Iconic/preconfigs.json"
            )
          )
          .then(
            function (response) {
              $scope.preconfig = response.data.preconfigs;
            },
            function () {
              displayError("iconicErrors_loading_preconfigs");
            }
          );
      }

      function isExternalUri(uri) {
        return uri.indexOf("://") > -1;
      }

        function displayError(alias) {
            var invalidConfigStr;
            localizationService.localize("iconicConfig_invalidConfig").then(function (response) {
              invalidConfigStr = response;
          });

          localizationService.localize(alias).then(function (response) {
              notificationsService.error(invalidConfigStr, response);
        });
      }

      function openTreePicker(config) {
        const picker = {
            title: "Select file",
            section: "settings",
            treeAlias: "files",
            entityType: "file",
            filter: function (i) {
                if (
                    i.name.indexOf(".min.css") === -1 &&
                        i.name.indexOf(".css") === -1 &&
                        i.name.indexOf(".codepoints") === -1
                ) {
                    return true;
                }
                return false;
            },
            filterCssClass: "not-allowed",
            close: function () {
                editorService.close();
            }
        };

        const args = _.assign(picker, config);

        editorService.treePicker(args);
      }

      function extractStyles(item, successCallback, errorCallback) {
        $scope.error = null;

        if (!item.selector || item.selector.length <= 0) {
          errorCallback();
          displayError("iconicErrors_selector");
        }

        if (!item.sourcefile) item.sourcefile = item.cssfile;

        const path = isExternalUri(item.sourcefile)
            ? item.sourcefile
            : umbRequestHelper.convertVirtualToAbsolutePath(
                `~/${item.sourcefile.replace("wwwroot/", "")}`
            );

        $http.get(path).then(
          function (response) {
            var pattern;
            item.extractedStyles = [];
            try {
              pattern = new RegExp(item.selector, "g");
            } catch (e) {
              $scope.error = e.message;
              displayError("iconicErrors_regexIssue");
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
            function (response) {
                if (response.config.url.indexOf(".codepoints") > -1 && response.status === 404) {
                    displayError("iconicErrors_codepointsError");
                } else {
                    displayError("iconicErrors_loadingCss");
                }
                errorCallback();
          }
        );
      }

      loadPreConfigs();
      $scope.loadPreview();
    }
  );
