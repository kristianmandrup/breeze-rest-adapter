import visitNode from './visit-node';
import createAjaxBundleSaver from './bundle-saver';
import ChangeSaver from './change-saver';
import QueryExecuter from './query-executer';
import RestJsonResultsAdapter from '../rest-json-results-adapter';
import { createError, handleXHRError } from './error-handlers';

export default {
  visitNode: visitNode,
  createError: createError,
  handleXHRError: handleXHRError,
  createAjaxBundleSaver: createAjaxBundleSaver,
  ChangeSaver: ChangeSaver,
  QueryExecuter: QueryExecuter,
  RestJsonResultsAdapter: RestJsonResultsAdapter,
  JsonResultsAdapter: breeze.JsonResultsAdapter,
  ajax: null,
  promiseFactory: null,
}


