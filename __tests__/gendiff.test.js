import { test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  'json',
  'yaml',
])('Compare %s files', (type) => {
  const filePath1 = getFixturePath(`file1.${type}`);
  const filePath2 = getFixturePath(`file2.${type}`);
  const actual = genDiff(filePath1, filePath2);
  const expected = readFile('stylish');
  expect(actual).toBe(expected);
});
