import formatPlain from './plain.js';
import formatStylish from './stylish.js';

export default (tree, format) => {
  switch (format) {
    case 'plain':
      return formatPlain(tree);
    case 'stylish':
      return formatStylish(tree);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};
