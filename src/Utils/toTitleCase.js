// stringUtils.js

export function toTitleCase(str) {
  return str
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}
