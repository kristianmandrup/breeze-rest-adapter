import { prepareSaveBundle } from './utils';

export default class ChangeSaver {
  constructor(saveBundle, saveContext, {promiseFactory, $}) {
    this.saveBundle = saveBundle;
    this.saveContext = saveContext;
    this.promiseFactory = promiseFactory || Q;
    this.$ = $;    
  }

  get deferred() {
    return this.promiseFactory.defer();
  }

  // Since the saveBundle can be a collection of changed entities - we
  // need to get the root entity if we assume that all changes are
  // part of an aggregate object graph
  get rootEntity() {
    return this.getRootEntity(this.saveBundle);
  }

  get firstEntityName() {
    return this.rootEntity.entityAspect.entityGroup.entityType.shortName;
  }
    
  
  get bundle() {
    return prepareSaveBundle(this.saveBundle, this.saveContext);
  }

  get entityState() {
    return this.rootEntity.entityAspect.entityState.name;
  }

  get verb() {
      /** Look at the entity state to see which HTTP verb to use
          EntityState.Unchanged
          EntityState.Added
          EntityState.Modified
          EntityState.Deleted
          EntityState.Detached
        **/
      
      switch(this.entityState)
      {
          case breeze.EntityState.Added.name:
              return  'POST';
          case breeze.EntityState.Modified.name:
              return 'PUT';
          case breeze.EntityState.Deleted.name:
              return 'DELETE';
          default:
            return null;
      }
  }

  get baseUrl() {
    return this.saveContext.dataService.serviceName;
  }

  get rootEntityId() {
    return this.rootEntity.id || this.rootEntity.id();
  }
  

  get url() {
    let url = [this.baseUrl, resourceName].join('/');

    if (verb != 'POST') {
        if (!this.rootEntityId) {
            throw new Error("[breeze.dataService.rest] - Entity type: " + this.firstEntityName + " must have an 'id' key property");
        }
        url = [url, rootEntity.id()].join('/');
    }
    // replace any double // with a single / 
    url = url.replace(/\/\//, '/');
    return url;
  }

  get entityType() {
    this.saveContext.entityManager.metadataStore.getEntityType(this.firstEntityName);
  }

  get resourceName() {
    const entityType = this.entityType;
    return entityType.resourceName || entityType.defaultResourceName;
  }

  get apiManagerToken() {
    return this.$.cookie('cvp_api_access_token');
  }

  save() {            
    if(this.entityType == null) {
      throw new Error(`[Breeze DataService REST] entity type: ${this.firstEntityName} not supported to save changes as root entity`);
    }

    // if no verb for change, then return resolved promise
    if (!this.verb) {
      //logger.log("Skipping changes to entity: " + firstEntityName + " entity state: " + entityState);

      let saveResult = { entities: [], keyMappings: { forEach: function(){}}, XHR: null };
      this.deferred.resolve(saveResult);

      return deferred.promise;
    }

    // TODO
    this.saveBundleChanges({
      url: this.url, 
      verb: this.verb, 
      bundle: this.bundle, 
      saveBundle: this.saveBundle
      // successCb
      // errorCb
    });

    return this.deferred.promise; 
  } 
}