import { getFlatEntityListFromGraph } from './utils';

// Breeze expects that the responses from the server dont include
// the entityAspect propert, so we make our server responses look 'raw'
function makeRawEntity(entity) {
    if (entity.entityAspect != null) {
        delete entity.entityAspect;
    }
}

function createPrepareEntity({keyMappings, rawEntities, saveContext}) {
    return function prepareEntity(idx, entity){
        // If there is no key mapping - then dont need to return the entity
        // to breeze for any merging of server updated properties
        if (entity.keyMapping == null) {
            return;
        }

        var keyMap = {
            tempValue: entity.keyMapping.tempValue,
            realValue: entity.keyMapping.realValue,
            entityTypeName: entity.entityAspect.entityType
        };

        if (keyMap.tempValue == null) {
            // If the server side doesn't return a tempValue then assume
            // we don't need to fix up a client key
            return;
        }

        // If the entity type name does not contain the namespace - manually
        // add the CVP namespace
        if (keyMap.entityTypeName.indexOf(":") < 0) {
            var entityType = saveContext.entityManager.metadataStore.getEntityType(keyMap.entityTypeName);
            keyMap.entityTypeName = entityType.name;
        }
        keyMappings[keyMappings.length] = keyMap;

        makeRawEntity(entity);
        rawEntities[rawEntities.length] = entity;
    }
}


function defaultSuccessCb(data, textStatus, XHR) {

    // Mark all the entities as unchanged since the save was successful
    var entities = saveBundle.entities;
    $.each(saveBundle.entities, (i, entity) => {
        entity.entityAspect.setUnchanged();
    });

    // Need to pass the following to Breeze in order for it process
    // the save correctly
    // entities - an array of all the entities that were saved/updated
    //            on the server in order for it to merge id values from the server
    //            on the client entities if the server generated ids.  There is
    //            no problematic behavior if you dont return any entities here if
    //            the server didnt generate an id.  However in cases where the server
    //            generates an id (entity is added) - you will need to return it here
    //            in order to update the client
    // keyMappings - an array of Key map objects that tell Breeze, for this entity type with this
    //               'old' id (named tempValue), the server updated the id to 'realValue'.  Each key map
    //               in this array should correspond to the entity in the same index in the 'entities' array
    //               This means that although the server may have responded with many entities, only the
    //               entities with server generated keys should an item in 'entities' and 'keyMappings' array
    // XHR - the raw XHR response object (from jQuery)

    var responseEntities = getFlatEntityListFromGraph(saveContext, data);

    var rootEntity = data;
    var keyMappings = [];
    var rawEntities = [];

    // create the function used for iterating responseEntities
    const prepareEntity = createPrepareEntity({
        keyMappings: keyMappings, 
        rawEntities: rawEntities,
        saveContext: saveContext
    });

    responseEntities.forEach(prepareEntity);

    var saveResult = { entities: rawEntities, keyMappings: keyMappings, XHR: XHR };
    deferred.resolve(saveResult);
}

function defaultErrorCb(XHR, textStatus, errorThrown) {
    config.handleXHRError(deferred, XHR);
}

export default function createAjaxBundleSaver(ajaxImpl) {
  return function ({url, verb, bundle, saveBundle, succesCb, errorCb}) {
    errorCb = errorCb || defaultErrorCb;
    succesCb = succesCb || defaultSuccesCb;

    ajaxImpl.ajax({
        url: url,
        type: verb,
        dataType: 'json',
        contentType: 'application/json',
        data: bundle,
        success: succesCb,
        error: errorCb
    });
  }
}