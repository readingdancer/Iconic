using System;
using Newtonsoft.Json;

namespace Our.Iconic.Core.Models
{
    public class SelectedIcon
    {
        [JsonProperty(PropertyName = "packageId")]
        public Guid PackageId { get; set; }

        [JsonProperty(PropertyName = "icon")]
        public string Icon { get; set; }
    }
}
