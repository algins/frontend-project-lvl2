import formatStylish from './stylish.js';

export default (tree, format) => {
  switch (format) {
    case 'stylish':
      return formatStylish(tree);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};
