import serviceConfig from './data-service/config';

export default class RestDataServiceAdapter {
  constructor() {
    this.name = 'REST';
    this.serviceConfig = serviceConfig;
  }

  checkForRecomposition(interfaceInitializedArgs) {
      if (interfaceInitializedArgs.interfaceName === 'ajax' && interfaceInitializedArgs.isDefault) {
        this.initialize();
      }
  }

  initialize() {
      this.ChangeSaver = serviceConfig.ChangeSaver;
      this.QueryExecuter = serviceConfig.QueryExecuter;
      this.JsonResultsAdapter = serviceConfig.JsonResultsAdapter;
      this.visitNode = serviceConfig.visitNode;

      const ajaxImpl = serviceConfig.ajax || breeze.config.getAdapterInstance('ajax');
      this.ajax = createAjaxBundleSaver(ajaxImpl);

      if (!ajaxImpl) {
          throw new Error("Unable to initialize ajax for REST adapter.");
      }

      // don't cache 'ajax' because we then we would need to ".bind" it, and don't want to because of brower support issues. 
      if (!ajaxImpl.ajax) {
          throw new Error("Breeze was unable to find an 'ajax' adapter");
      }
      this.ajaxImpl = ajaxImpl;
  }

  fetchMetadata(metadataStore, dataService) {
    // TODO: In the future support WADL metadata?
    throw new Error("REST DataService adapter does not support metadata, set hasServerMetadata to 'false'");
  }

  executeQuery(mappingContext) {
    return new this.QueryExecuter(mappingContext, {ajax: this.ajaxImpl.ajax})
  }

  saveChanges(saveContext, saveBundle) {
    return new this.ChangeSaver(saveContext, saveBundle).save();
  }

  get jsonResultsAdapter() {
    return new this.JsonResultsAdapter({
        name: 'webApi_default',

        visitNode: this.visitNode
    });
  }
}