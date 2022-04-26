import has from 'lodash/has';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

const stringify = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  if (isString(value)) {
    return `'${value}'`;
  }

  return `${value}`;
};

export default (tree) => {
  const iter = (node, parentKeys = []) => {
    const keys = has(node, 'key') ? [...parentKeys, node.key] : parentKeys;
    const property = keys.join('.');

    switch (node.type) {
      case 'added':
        return `Property '${property}' was added with value: ${stringify(node.value)}`;

      case 'removed':
        return `Property '${property}' was removed`;

      case 'changed':
        return `Property '${property}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;

      case 'unchanged':
        return null;

      case 'nested':
      case 'root':
        return node.children
          .map((child) => iter(child, keys))
          .filter((line) => line !== null)
          .join('\n');

      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  };

  return iter(tree);
};
