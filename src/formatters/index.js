import formatJson from './json.js';
import formatPlain from './plain.js';
import formatStylish from './stylish.js';

export default (format) => {
  switch (format) {
    case 'json':
      return formatJson;
    case 'plain':
      return formatPlain;
    case 'stylish':
      return formatStylish;
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};
