breeze-rest-adapter
===================

A dataservice adapter for BreezeJS to connect to a generic REST API.

## Usage

`npm i breeze-rest-adapter --save`

Just use ES6 `import`

```js
import 'breeze-rest-adapter';
```

## Experimental ES6 support

```js
import 'breeze-rest-adapter/es6';
```

You can also include the classes directly in order to customize for your needs: 

```js
`import { ServiceAdapter, ResultsAdapter, default as register } from 'breeze-rest-adapter/es6';`
```

Then register the `ServiceAdapter` with breeze: `register(breeze);`

This will call `breeze.config.registerAdapter('dataService', ServiceAdapter);`

The `ServiceAdapter` class has a property `name = 'REST'` which identifies it.

Now configure breeze to use the registered `REST` data service as follows:

`breeze.config.initializeAdapterInstances({dataService: 'REST'});`

The ES6 code should be much easier to understand and customize if you need to. 
This conversion has not yet been tested so consider it a WIP.

Suggestion: Ideally you would somehow swap out the use of old school XHR with the new Fetch API.

### Creating your own ServiceAdapter

Simply extend the provided `ServiceAdapter` and replace the `serviceConfig` with your own. Then register the adapter.

```js
import { ServiceAdapter } from 'breeze-rest-adapter/es6';
import myServiceConfig from './myServiceConfig';

class MyServiceAdapter extends ServiceAdapter {
	constructor() {
		super();
		this.serviceConfig = myServiceConfig;
	}
}

breeze.config.registerAdapter('dataService', MyServiceAdapter);
```

Please see the docs for [Breeze DataServiceAdapter](http://breeze.github.io/doc-js/server-dataserviceadapter.html)

Note: You can also create/use a [custom ajax adapter](http://breeze.github.io/doc-js/server-ajaxadapter.html)

`breeze.config.registerAdapter('ajax', myAjaxAdapter);`

Alternatively configure this on the `serviceConfig` object f.ex by merging on top of the base `serviceConfig` we provide.  

```js
const myServiceConfig = Object.assign(serviceConfig, {
	// ...
  ajax: null,
  promiseFactory: null,
})
```

The default promiseFactory is [Q](https://github.com/kriskowal/q) 

The full config object:

```js
export default {
  visitNode: visitNode,
  createError: createError,
  handleXHRError: handleXHRError,
  createAjaxBundleSaver: createAjaxBundleSaver,
  ChangeSaver: ChangeSaver,
  QueryExecuter: QueryExecuter,
  RestJsonResultsAdapter: RestJsonResultsAdapter,
  JsonResultsAdapter: breeze.JsonResultsAdapter,
  ajax: null, // “jQuery” adapter is the default AJAX adapter
  promiseFactory: null, // Q by default
}
```

## Sample customization

Install node `inflection` for pluralize functionality.

`npm install inflection --save`

```js
import { serviceConfig } from 'breeze-rest-adapter/es6/data-service/';
import inflection from 'inflection';

class MyChangeSaver extends serviceConfig.ChangeSaver {
	constructor() {
		super();
		this.serviceConfig = serviceConfig;		
	}

	// we pluralize the resource name
	// this will make the url for a Person entityType
	// something like `persons/id` 
	// instead of the default `person/id`
  get remoteApiResourceName() {
    return inflection.pluralize( this.resourceName() ); 
  }	
}

// use our custom ChangeSaver
serviceConfig.ChangeSaver = MyChangeSaver;

// ...
```


# Overview

This adapter was implemented to allow integration between BreezeJS entities in the browser to a REST-ful service.
There are many examples that the BreezeJS team has provided on data service adapters for various backends like:

- [Breeze on the MEAN stack](http://www.breezejs.com/samples/zza)
- [Edmunds service example - generic read only service](http://www.breezejs.com/samples/edmunds)
- [Breeze with Ruby backend](http://www.breezejs.com/samples/intro-spa-ruby)

This example differs in that it makes the assumption that your resources can actually be object graphs of multiple entity types.  For example:

	{
	    "orderHeader" : {
		    "creator": "Bob",
			"createdDate": "20140101 00:00:00",
			"entityAspect": {
			    "entityType": "OrderHeader",
				"entityState": "Modified"
			}
		},
		"orderLineItems": [
		    {
			    productId: 3,
				amount: 1,
				"entityAspect": {
			        "entityType": "OrderLineItem",
				    "entityState": "Added"
			    }
			},
			{
			    productId: 10,
				amount: 5,
				"entityAspect": {
			        "entityType": "OrderLineItem",
				    "entityState": "Added"
			    }
			}
		],
		"entityAspect": {
			"entityType": "Order",
			"entityState": "Modified"
		}
	}

Here we have an `Order` entity, with child properties that also entities, an `OrderHeader` entity, and a collection of `OrderLineItem` entities.
The data service adapter will look at all the changed entities in the local cache and build an object graph (based on the defined relationships
in the metadata).

Additionally this adapter makes the assumption that the backend service provides an `entityAspect` object that is a property of every entity.
This is a helper property that allows the adapter to know which type of entity is being provided.

The adapter will also craft REST-like URLs for its requests.  E.g.:

```
/service/order/3
/service/order/4/orderItem/6
```

Note: The entity names are not pluralised by default, but if you can assign a plural `resourceName` to `entityType` it might just work ;)

```js
function saveChanges(...) {
	// ...
	var resourceName = entityType.resourceName || entityType.defaultResourceName;

	url = baseUrl + resourceName
	// ...
	url = url + "/" + rootEntity.id();
	// ...
}
```

This can be further customized as described in the [saveChanges](http://breeze.github.io/doc-js/saving-changes.html) documentation.

You call `EntityManager.saveChanges` and pass in a `SaveOptions` object that specifies the `resourceName` to handle the request. The server should route the request to a suitable controller action method. You’d also set the `SaveOptions.dataService` if you need also to target a different controller.

Assuming that you want to save all pending changes to a custom endpoint, you could write:

```js
let so = new SaveOptions({ resourceName: 'myCustomSave' });
// null = 'all-pending-changes'; saveOptions is the 2nd parameter
myEntityManager.SaveChanges(null, so ); 
```

You are more likely to assemble a list of entities to save to that endpoint, a list consistent with the semantics of `MyCustomSave` in which case you’d probably pass that list in the `saveChanges` call:

`myEntityManager.SaveChanges(selectedEntities, so );`

The Breeze client still sends a JSON change-set bundle to `MyCustomSave` as it would with a normal `saveChanges` call. The POST method on the server that handles the `MyCustomSave` endpoint should have the same as signature as the `SaveChanges` method.

### REST Adapters

The adapters works in concert with a `JsonResultsAdapter` that parses the results from the service, looks at the `entityAspect` property
and returns to Breeze all the entities it finds in the result.

# Installation

Include the following code when setting up your Breeze Data Service:

`breeze.config.initializeAdapterInstances({dataService: "REST"});`

## More

From the RubyOnRails sample app, we find the following function.
Notice how the url is constructed based on `entityType.shortName` in `var entityTypeShortName =  entity.entityType.shortName;` 
and then pluralised: `var url = saveContext.dataService.makeUrl(this.pluralize(entityTypeShortName));

```js
function getRequestInfo(saveContext, saveBundle){

		var em = saveContext.entityManager;
		var helper = em.helper;
		var metadataStore = em.metadataStore;
		var entityInfos = [];
		saveContext.entityInfos = entityInfos;

		// TODO: handle multiple entities in single saveChanges() request
		if (saveBundle.entities.length > 1) {
				throw new Error("Can only save one entity at a time; multi-entity save is not yet implemented.")
		}

		var entity = saveBundle.entities[0]
		var aspect = entity.entityAspect;
		var key =  aspect.getKey();
		var id =  key.values.join(',');
		var entityTypeShortName =  entity.entityType.shortName;
		var serverTypeName = entityTypeShortName.toLowerCase();

		var entityInfo = {
				entityState: aspect.entityState,
				key: key,
				serverTypeName: serverTypeName
		};
		entityInfos.push(entityInfo);

		var url = saveContext.dataService.makeUrl(this.pluralize(entityTypeShortName));
		var data = {};
		var entityStateName =  aspect.entityState.name;
		switch (entityStateName){
				case 'Added':
						var raw =  helper.unwrapInstance(entity, true, true);
						delete raw.id; // hack until we augment unwrapInstance in Breeze
						data[serverTypeName] = raw;
						return {
								method: 'POST',
								url: url,
								data: JSON.stringify(data)
						}
				case 'Modified':
						data[serverTypeName] = helper.unwrapChangedValues(entity, metadataStore, true);
						return {
								method: 'PUT',
								url: url+'/'+id,
								data: JSON.stringify(data)
						}

				case 'Deleted':
						return {
								method: 'DELETE',
								url: url+'/'+id
						}
				default:
						throw new Error('Cannot save an entity with state = '+entityStateName);
		}
}
```		



