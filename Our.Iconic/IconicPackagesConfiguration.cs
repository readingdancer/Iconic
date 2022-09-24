using Umbraco.Cms.Core.PropertyEditors;

namespace Our.Iconic.RCL
{
    public class IconicPackagesConfiguration
    {
        [ConfigurationField("packages", "Packages configuration", "/App_Plugins/Iconic/Views/iconic.prevalues.html", Description = "Add the font packages you want to use")]
        public object[]? Packages { get; set; }
    }
}
