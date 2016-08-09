export function visitNode(node, parseContext, nodeContext) {
  const entityManager = parseContext.entityManager;
  const metadataStore = entityManager.metadataStore;

  if (node.entityAspect != null) {
      if (node.entityAspect.entityType == null) {
          throw new Error("[breezeRestJsonResultsAdapter] - Unable to parse node with null entity type");
      }

      var entityType = metadataStore.getEntityType(node.entityAspect.entityType);
      if (entityType == null) {
          throw new Error("[breezeRestJsonResultsAdapter] - Unable to parse node with unknown entity type: " + node.entityAspect.entityType);
      }
      // Then we are on a top level entity
      return { entityType: node.entityAspect.entityType };
  }

  if (nodeContext.propertyName == "entityAspect") {
      // Parsing the entityAspect object
      return;
  }
}