import { readFileSync } from 'fs';
import has from 'lodash/has.js';
import isPlainObject from 'lodash/isPlainObject.js';
import sortBy from 'lodash/sortBy.js';
import union from 'lodash/union.js';
import { extname, resolve } from 'path';
import render from './formatters/index.js';
import parse from './parsers.js';

const readFile = (filePath) => {
  const fullFilePath = resolve(process.cwd(), filePath);
  return readFileSync(fullFilePath, 'utf-8');
};

const getFileType = (filePath) => extname(filePath).split('.').join('');

const buildTree = (object1, object2) => {
  const buildNodes = (obj1, obj2) => {
    const keys = union(Object.keys(obj1), Object.keys(obj2));

    return sortBy(keys).map((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (!has(obj1, key)) {
        return {
          key,
          type: 'added',
          value: value2,
        };
      }

      if (!has(obj2, key)) {
        return {
          key,
          type: 'removed',
          value: value1,
        };
      }

      if (isPlainObject(value1) && isPlainObject(value2)) {
        return {
          key,
          type: 'nested',
          children: buildNodes(value1, value2),
        };
      }

      if (value1 !== value2) {
        return {
          key,
          type: 'changed',
          value1,
          value2,
        };
      }

      return {
        key,
        type: 'unchanged',
        value: value1,
      };
    });
  };

  return {
    type: 'root',
    children: buildNodes(object1, object2),
  };
};

export default (filePath1, filePath2, format = 'stylish') => {
  const object1 = parse(
    readFile(filePath1),
    getFileType(filePath1),
  );

  const object2 = parse(
    readFile(filePath2),
    getFileType(filePath2),
  );

  const tree = buildTree(object1, object2);

  return render(tree, format);
};
