using Our.Iconic.Core.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Services;

namespace Our.Iconic.Core
{
    public class ConfiguredPackagesCollection
    {
        private readonly IDictionary<string, IDictionary<Guid, Package>> _packagesCache;
        private readonly IDataTypeService dataTypeService;

        public ConfiguredPackagesCollection(IDataTypeService dataTypeService)
        {
            _packagesCache = new ConcurrentDictionary<string, IDictionary<Guid, Package>>();
            this.dataTypeService = dataTypeService;
        }

        public IDictionary<Guid, Package> GetConfiguratedPackages(IPublishedPropertyType propertyType)
        {
            var uniqueKey = propertyType.ContentType.Alias + "_" + propertyType.Alias;
            if (!_packagesCache.ContainsKey(uniqueKey))
            {

                var dataType = dataTypeService.GetDataType(propertyType.DataType.Id);
                var configurationJson = (IconicPackagesConfiguration)dataType.Configuration;                

                if (!_packagesCache.ContainsKey(uniqueKey))
                {
                    _packagesCache.Add(uniqueKey, configurationJson.Packages.ToDictionary(p => p.Id));
                }
            }

            return _packagesCache[uniqueKey];

        }

    }
}
