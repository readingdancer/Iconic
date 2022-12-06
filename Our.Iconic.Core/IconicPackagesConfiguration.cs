using System;
using System.Collections.Generic;
using Umbraco.Cms.Core.PropertyEditors;
using Our.Iconic.Core.Models;

namespace Our.Iconic.Core
{
    public class IconicPackagesConfiguration
    {
        [ConfigurationField("packages", "Packages configuration", "/App_Plugins/Iconic/Views/iconic.prevalues.html", Description = "Add the font packages you want to use")]
        public IEnumerable<Package> Packages { get; set; }
    }
}
