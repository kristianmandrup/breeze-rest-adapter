import { default as ServiceAdapter } from './rest-data-service-adapter';
export const ServiceAdapter;

export { default as ResultsAdapter } from './rest-json-results-adapter';

export { default as serviceConfig } from './data-service/config';

export default function register(breeze) {
  breeze.config.registerAdapter('dataService', ServiceAdapter);
}
