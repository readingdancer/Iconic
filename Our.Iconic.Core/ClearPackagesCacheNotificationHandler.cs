using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace Our.Iconic.Core
{
    public class ClearPackagesCacheNotificationHandler : INotificationHandler<DataTypeSavedNotification>
    {
        private readonly ConfiguredPackagesCollection configuredPackagesCollection;

        public ClearPackagesCacheNotificationHandler(ConfiguredPackagesCollection configuredPackagesCollection)
        {
            this.configuredPackagesCollection = configuredPackagesCollection;
        }

        public void Handle(DataTypeSavedNotification notification)
        {
            foreach (var ent in notification.SavedEntities)
            {
                configuredPackagesCollection.Remove(ent.Id.ToString());
            }
        }

    }

    public class ClearCacheComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.AddNotificationHandler<DataTypeSavedNotification, ClearPackagesCacheNotificationHandler>();
        }
    }
}
