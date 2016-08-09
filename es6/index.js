import { default as ServiceAdapter } from './rest-data-service-adapter';

export const ServiceAdapter;
export { default as ResultsAdapter } from './rest-data-service-adapter';

export default function register(breeze) {
  breeze.config.registerAdapter('dataService', ServiceAdapter);
}
