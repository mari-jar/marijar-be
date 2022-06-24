const imageFileType = [
  'image/png',
  'image/jpg',
  'image/jpeg'
];

/**
 * Helper function to validate image extension
 * 
 * @param {string} payload 
 * @returns Response object
 */
const validateImageExtension = (payload) => {
  if (imageFileType.includes(payload.mimetype)) {
    return ({ err: false, extension: payload.mimetype.slice(6) });
  }

  return ({ err: true, extension: '' });
};

module.exports = {
  validateImageExtension
};
