const { send } = require("../../../helpers/utils/wrapper");
const httpError = require("http-errors");
const validate = require("validate.js");
const fileValidator = require('../../../helpers/utils/fileValidator');

const S3 = require('../../../helpers/db/aws/s3/index');

module.exports = class {
  constructor() {
    this.s3 = new S3();
  }

  async uploadImage(payload) {
    if (validate.isEmpty(payload.image)) {
      return httpError.BadRequest('Image cannot be empty');
    }

    const validatedObject = fileValidator.validateImageBase64(payload.image);
    if (validatedObject.err) {
      return httpError.BadRequest('Image base64 format is invalid')
    }

    const uploadImage = await this.s3.uploadObjectStream({ image: payload.image, ext: validatedObject.extension });
    if (!uploadImage) {
      return httpError.InternalServerError('Fail to upload image');
    }

    return send({ image: uploadImage.Location })
  }
}