import isObject from 'lodash/isObject.js';

const getIndent = (depth, replacer = ' ', spacesCount = 4) => {
  const indentSize = depth * spacesCount;
  return replacer.repeat(indentSize);
};

const stringify = (value, depth) => {
  if (!isObject(value)) {
    return `${value}`;
  }

  const indent = getIndent(depth);
  const bracketIndent = getIndent(depth - 1);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

export default (tree) => {
  const iter = (node, depth = 1) => {
    const indent = getIndent(depth);

    switch (node.type) {
      case 'added': {
        return `${indent.slice(2)}+ ${node.key}: ${stringify(node.value, depth + 1)}`;
      }

      case 'removed': {
        return `${indent.slice(2)}- ${node.key}: ${stringify(node.value, depth + 1)}`;
      }

      case 'changed': {
        return [
          `${indent.slice(2)}- ${node.key}: ${stringify(node.value1, depth + 1)}`,
          `${indent.slice(2)}+ ${node.key}: ${stringify(node.value2, depth + 1)}`,
        ].join('\n');
      }

      case 'unchanged': {
        return `${indent}${node.key}: ${stringify(node.value, depth + 1)}`;
      }

      case 'nested': {
        const lines = node.children.map((child) => iter(child, depth + 1));
        const value = [
          '{',
          ...lines,
          `${indent}}`,
        ].join('\n');
        return `${indent}${node.key}: ${value}`;
      }

      case 'root': {
        const lines = node.children.map((child) => iter(child, depth));
        return [
          '{',
          ...lines,
          '}',
        ].join('\n');
      }

      default: {
        throw new Error(`Unknown type: ${node.type}`);
      }
    }
  };

  return iter(tree);
};
