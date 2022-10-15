using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace Our.Iconic.Core
{
    public class IconicPackagesConfigurationEditor : ConfigurationEditor<IconicPackagesConfiguration>
    {
        public IconicPackagesConfigurationEditor(IIOHelper ioHelper, IEditorConfigurationParser editorConfigurationParser) : base(ioHelper, editorConfigurationParser)
        {
        }
    }
}
