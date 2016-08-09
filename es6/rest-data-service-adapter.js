import createAjaxBundleSaver from './data-service/bundle-saver';
import visitNode from './data-service/visit-node';

import ChangeSaver from './data-service/change-saver';
import QueryExecuter from './data-service/query-executer';
import RestJsonResultsAdapter from './rest-json-results-adapter';

const core = breeze.core;

const JsonResultsAdapter = breeze.JsonResultsAdapter;

export default class RestDataServiceAdapter {
  constructor() {
    this.name = 'REST';
  }

  checkForRecomposition(interfaceInitializedArgs) {
      if (interfaceInitializedArgs.interfaceName === 'ajax' && interfaceInitializedArgs.isDefault) {
        this.initialize();
      }
  }

  initialize() {
      const ajaxImpl = breeze.config.getAdapterInstance('ajax');
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
    return new QueryExecuter(mappingContext, {ajax: this.ajaxImpl.ajax})
  }

  saveChanges(saveContext, saveBundle) {
    return new ChangeSaver(saveContext, saveBundle).save();
  }  

  get jsonResultsAdapter() {
    return new JsonResultsAdapter({
        name: 'webApi_default',

        visitNode: visitNode
    });
  }      
}