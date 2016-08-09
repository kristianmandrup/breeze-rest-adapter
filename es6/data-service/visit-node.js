const MetadataStore = breeze.MetadataStore;

export default function visitNode(node, mappingContext, nodeContext) {
    if (node == null) return {};

    let entityTypeName = MetadataStore.normalizeTypeName(node.$type);
    let entityType = entityTypeName && mappingContext.entityManager.metadataStore._getEntityType(entityTypeName, true);
    let propertyName = nodeContext.propertyName;
    let ignore = propertyName && propertyName.substr(0, 1) === '$';

    return {
        entityType: entityType,
        nodeId: node.$id,
        nodeRefId: node.$ref,
        ignore: ignore
    };
}
