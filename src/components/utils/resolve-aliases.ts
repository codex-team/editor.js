/**
 * Resolves aliases in specified object according to passed aliases info
 *
 * @example resolveAliases(obj, { label: 'title' })
 * here 'label' is alias for 'title'
 * @param obj - object with aliases to be resolved
 * @param aliases - object with aliases info where key is an alias property name and value is an aliased property name
 */
export function resolveAliases<ObjectType>(obj: ObjectType, aliases: { [alias: string]: string }): ObjectType {
  const result = {} as ObjectType;

  Object.keys(obj).forEach(property => {
    const aliasedProperty = aliases[property];

    if (aliasedProperty !== undefined) {
      result[aliasedProperty] = obj[property];
    } else {
      result[property] = obj[property];
    }
  });

  return result;
}
