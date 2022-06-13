const fileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf'
];

/**
 * Helper function to validate base64 image format
 * 
 * @param {string} base64String 
 * @returns Response object
 */
const validateImageBase64 = (base64String) => {
  const mimeType = base64String.substring('data:'.length, base64String.indexOf(';base64'));
  if (fileTypes.indexOf(mimeType) === -1) {
    return ({ err: true, extension: '' });
  }

  return ({ err: false, extension: mimeType.slice(6) });
};

module.exports = {
  validateImageBase64
};
