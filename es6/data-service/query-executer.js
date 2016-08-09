import config from './config';

function createSuccessCb(defereed) {
  return function successCb(data, textStatus, XHR) {
    try {
      var rData;
      if (data.Results) {
          rData = { results: data.Results, inlineCount: data.InlineCount, XHR: XHR };
      } else {
          rData = { results: data, XHR: XHR };
      }

      deferred.resolve(rData);
      XHR.onreadystatechange = null;
      XHR.abort = null;
    } catch(e) {
      var error = e instanceof Error ? e : config.createError(XHR);
      // needed because it doesn't look like jquery calls .fail if an error occurs within the function
      deferred.reject(error);
      XHR.onreadystatechange = null;
      XHR.abort = null;
    }
  }
}

export default class QueryExecuter {
  constructor(mappingContext, {ajax, promiseFactory}) {
    this.promiseFactory = promiseFactory || config.promiseFactory || Q;
  }
    
  get deferred() {
    return this.promiseFactory.defer();
  } 
  
  get params() {
    return {
        url: mappingContext.url,
        dataType: 'json',
        success: createSuccessCb(this.deferred),
        error: function(XHR, textStatus, errorThrown) {
            config.handleXHRError(deferred, XHR);
        }
    };
  }

  query() {
      if (this.mappingContext.dataService.useJsonp) {
          params.dataType = 'jsonp';
          params.crossDomain = true;
      }
      this.ajax(this.params);
      return this.deferred.promise;
  }
}

