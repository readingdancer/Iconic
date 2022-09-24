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
                    "/App_Plugins/Iconic/js/build/findPolyfill.min.js",
                    "/App_Plugins/Iconic/js/src/iconic.models.js",
                    "/App_Plugins/Iconic/js/src/iconic.controller.js",
                    "/App_Plugins/Iconic/js/src/iconic.dialog.controller.js",
                    "/App_Plugins/Iconic/js/src/iconic.prevalues.controller.js",
                    "/App_Plugins/Iconic/js/src/iconic.directives.js",
                    "/App_Plugins/Iconic/js/src/iconic.prevalues.editor.controller.js"
                },
                Stylesheets = new[]
                {
                    "/App_Plugins/Iconic/Styles/iconic.css"
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
