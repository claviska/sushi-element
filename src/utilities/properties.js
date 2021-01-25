export function getPropertyName(attributeName) {
  return attributeName.replace(/-./g, m => m.toUpperCase()[1]);
}

export function getPropertyValue(attrValue) {
  if (attrValue === '') {
    // Empty attributes resolve to boolean true, e.g. <input disabled>
    return true;
  } else if (Number(attrValue).toString() === attrValue) {
    return Number(attrValue);
  } else {
    return attrValue;
  }
}

export function getReservedProperties() {
  return ['id', 'class'].concat(Object.keys(HTMLElement.prototype));
}
