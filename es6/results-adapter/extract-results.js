// TODO: Use underscore or another library to do this reliably

/**
 * Gets the type of 'thing'
 * @param thing
 * @returns {string}
 */
function get_type(thing){
    if (thing === null) {
      // special case
      return "[object Null]";
    } 
    return Object.prototype.toString.call(thing);
}

export function extractResults(data) {
  data = data.results;
  let results;

  // Get the name of the first property from the results object
  // Normally this could be a wrapper property for the results e.g.
  // Countries or Users, etc...
  // Although this is not technically required

    const propName = Object.keys(data)[0];
    const typeName = get_type(data[propName]);

    // If we have a list of entities
    if (typeName.indexOf("Array") >= 0) {        
        results = data[propName];
    }
    else { // If we have a single entity        
        results = [ data[propName] ];
    }

    if (!results) {
      throw new Error("[breezeRestJsonResultsAdapter] Unable to resolve property that contains results");
    }

    return results;
}