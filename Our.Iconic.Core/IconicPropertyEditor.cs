using Our.Iconic.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace Our.Iconic.RCL
{
    [DataEditor(
        alias: "our.iconic",
        name: "Iconic",
        view: "/app_plugins/Iconic/Views/iconic.html",
        Icon = "icon-binoculars",
        Group = "Pickers",
        ValueType = ValueTypes.Json)]
    public class IconicPropertyEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        private readonly IEditorConfigurationParser _editorConfigurationParser;

        public IconicPropertyEditor(IDataValueEditorFactory dataValueEditorFactory,
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser)
            : base(dataValueEditorFactory)
        {
            _ioHelper = ioHelper;
            _editorConfigurationParser = editorConfigurationParser;
        }


        protected override IConfigurationEditor CreateConfigurationEditor()
        {
            return new IconicPackagesConfigurationEditor(_ioHelper, _editorConfigurationParser);
        }
    }
}
