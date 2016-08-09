import visitNode from './data-service/visit-node';
import createAjaxBundleSaver from './data-service/bundle-saver';
import ChangeSaver from './data-service/change-saver';
import QueryExecuter from './data-service/query-executer';
import RestJsonResultsAdapter from '../result-adapter/rest-json-results-adapter';

export default {
  visitNode: visitNode,
  createAjaxBundleSaver: createAjaxBundleSaver,
  ChangeSaver: ChangeSaver,
  QueryExecuter: QueryExecuter
  RestJsonResultsAdapter: RestJsonResultsAdapter,
  JsonResultsAdapter: breeze.JsonResultsAdapter,
  ajax: null
}


