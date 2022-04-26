import formatJson from './json.js';
import formatPlain from './plain.js';
import formatStylish from './stylish.js';

export default (tree, format) => {
  switch (format) {
    case 'json':
      return formatJson(tree);
    case 'plain':
      return formatPlain(tree);
    case 'stylish':
      return formatStylish(tree);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};
