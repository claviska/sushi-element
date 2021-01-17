export function getAttributeName(propertyName) {
  return propertyName.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`).replace(/^-/, '');
}

export function getAttributeValue(propValue) {
  if (typeof propValue === 'string' || typeof propValue === 'number') {
    return propValue + '';
  } else if (typeof propValue === 'boolean') {
    // Empty attributes resolve to boolean true, e.g. <input disabled>
    return propValue ? '' : null;
  } else {
    // Other types cannot be stored as attributes
    return null;
  }
}
