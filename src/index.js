import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const types = {
  added: 'added',
  changed: 'changed',
  removed: 'removed',
  root: 'root',
  unchanged: 'unchanged',
};

const readFile = (filePath) => {
  const fullFilePath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullFilePath, 'utf-8');
};

const buildTree = (object1, object2) => {
  const buildNodes = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));

    return _.sortBy(keys).map((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (!_.has(obj1, key)) {
        return {
          key,
          type: types.added,
          value: value2,
        };
      }

      if (!_.has(obj2, key)) {
        return {
          key,
          type: types.removed,
          value: value1,
        };
      }

      if (value1 !== value2) {
        return {
          key,
          type: types.changed,
          value1,
          value2,
        };
      }

      return {
        key,
        type: types.unchanged,
        value: value1,
      };
    });
  };

  return {
    type: 'root',
    children: buildNodes(object1, object2),
  };
};

const format = (tree) => {
  const iter = (node) => {
    switch (node.type) {
      case types.added:
        return `  + ${node.key}: ${node.value}`;
      case types.removed:
        return `  - ${node.key}: ${node.value}`;
      case types.changed:
        return [
          `  - ${node.key}: ${node.value1}`,
          `  + ${node.key}: ${node.value2}`,
        ].join('\n');
      case types.unchanged:
        return `    ${node.key}: ${node.value}`;
      case types.root:
        return [
          '{',
          ...node.children.map((child) => iter(child)),
          '}',
        ].join('\n');
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  };

  return iter(tree);
};

export default (filePath1, filePath2) => {
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const object1 = JSON.parse(data1);
  const object2 = JSON.parse(data2);
  const tree = buildTree(object1, object2);

  return format(tree);
};
