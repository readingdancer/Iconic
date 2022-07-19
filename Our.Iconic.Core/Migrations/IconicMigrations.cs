#if NET6_0_OR_GREATER
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
using Umbraco.Cms.Infrastructure.Scoping;
#elif NET5_0
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
#else
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Core.Logging;
using Umbraco.Core.Migrations;
using Umbraco.Core.Migrations.Upgrade;
using Umbraco.Core.Scoping;
using Umbraco.Core.Services;

#endif

namespace Our.Iconic.Core.Migrations
{
    public class IconicMigrationsComposer : ComponentComposer<IconicMigrations>
    {
    }

#if NET5_0_OR_GREATER

    public class IconicMigrations : IComponent
    {
        private readonly IScopeProvider _scopeProvider;
        private readonly IKeyValueService _keyValueService;
        private readonly IRuntimeState _runtimeState;


        private readonly IMigrationPlanExecutor _migrationPlanExecutor;

        public IconicMigrations(
            IScopeProvider scopeProvider,
            IMigrationPlanExecutor migrationPlanExecutor,
            IKeyValueService keyValueService,
            IRuntimeState runtimeState)
        {
            _scopeProvider = scopeProvider;
            _migrationPlanExecutor = migrationPlanExecutor;
            _keyValueService = keyValueService;
            _runtimeState = runtimeState;
        }
        public void Initialize()
        {
            if (_runtimeState.Level < RuntimeLevel.Run)
            {
                return;
            }

            var migrationPlan = new MigrationPlan("Iconic");

            migrationPlan.From(string.Empty)
                        .To<ChangePackageId>("our-packageIdChange");

            var upgrader = new Upgrader(migrationPlan);
            upgrader.Execute(_migrationPlanExecutor, _scopeProvider, _keyValueService);
        }

        public void Terminate()
        {
        }
    }

#else


    [RuntimeLevel(MinLevel = RuntimeLevel.Run)]
    public class IconicMigrations : IComponent
    {
        private readonly IScopeProvider _scopeProvider;
        private readonly IMigrationBuilder _migrationBuilder;
        private readonly IKeyValueService _keyValueService;
        private readonly ILogger _logger;

        public IconicMigrations(IScopeProvider scopeProvider,
                          IMigrationBuilder migrationBuilder,
                          IKeyValueService keyValueService,
                          ILogger logger)
        {
            _scopeProvider = scopeProvider;
            _migrationBuilder = migrationBuilder;
            _keyValueService = keyValueService;
            _logger = logger;
        }


        public void Initialize()
        {
            var migrationPlan = new MigrationPlan("Iconic");

            migrationPlan.From(string.Empty)
                        .To<ChangePackageId>("ChangePackageId");

            var upgrader = new Upgrader(migrationPlan);
            upgrader.Execute(_scopeProvider, _migrationBuilder, _keyValueService, _logger);
        }

        public void Terminate()
        {
        }
    }

#endif


    public class ChangePackageId : MigrationBase
    {
        public ChangePackageId(IMigrationContext context) : base(context)
        {
        }

#if NET5_0_OR_GREATER
        protected override void Migrate()
        {
            Logger.LogDebug("Running migration {MigrationStep}", "ChangePackageId");

#else
        public override void Migrate()
        {
            Logger.Debug(typeof(ChangePackageId), "Running migration 'ChangePackageId'");
#endif
            var query = @"UPDATE umbracoDataType
                        SET propertyEditorAlias = REPLACE(CAST(propertyEditorAlias AS nvarchar(4000)), 'koben.iconic', 'our.iconic')
                        WHERE propertyEditorAlias like '%koben.iconic%'";

            Database.Execute(query);

        }
    }
}
