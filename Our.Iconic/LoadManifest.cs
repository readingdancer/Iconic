using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Manifest;

namespace Our.Iconic.RCL
{
    internal class IconicManifestFilter : IManifestFilter
    {
        public void Filter(List<PackageManifest> manifests)
        {

            manifests.Add(new PackageManifest
            {
                PackageName = "Iconic",
                Scripts = new[]
                {
                    "/app_plugins/Iconic/js/build/findPolyfill.min.js",
                    "/app_plugins/Iconic/js/src/iconic.models.js",
                    "/app_plugins/Iconic/js/src/iconic.controller.js",
                    "/app_plugins/Iconic/js/src/iconic.dialog.controller.js",
                    "/app_plugins/Iconic/js/src/iconic.prevalues.controller.js",
                    "/app_plugins/Iconic/js/src/iconic.directives.js",
                    "/app_plugins/Iconic/js/src/iconic.prevalues.editor.controller.js"
                },
                Stylesheets = new[]
                {
                    "/app_plugins/Iconic/Styles/iconic.css"
                }
            });
        }
    }

    public class ManifestComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.ManifestFilters().Append<IconicManifestFilter>();
        }
    }
}
