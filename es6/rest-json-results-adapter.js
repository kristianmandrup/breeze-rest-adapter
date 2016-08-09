import { extractResults, visitNode } from './results-adapter';

export default class RestJsonResultsAdapter {
  constructor() {
  }

  get resultsAdapter() {
    return new breeze.JsonResultsAdapter({
      name: 'breezeRestJsonResultsAdapter',
      extractResults: extractResults,
      visitNode: visitNode
    });
  }
}
