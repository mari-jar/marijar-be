const httpError = require("http-errors");
const validate = require("validate.js");

const S3 = require('../../../helpers/db/aws/s3/index');
const { send } = require("../../../helpers/utils/wrapper");
const fileValidator = require('../../../helpers/utils/fileValidator');

module.exports = class {
  constructor() {
    this.s3 = new S3();
  }

  async uploadImage(payload) {
    if (validate.isEmpty(payload)) {
      return httpError.BadRequest('Image file cannot be empty');
    }

    const validatedObject = fileValidator.validateImageExtension(payload);
    if (validatedObject.err) {
      return httpError.BadRequest('Extension is invalid');
    }

    const uploadImage = await this.s3.uploadObjectStream({ image: payload, ext: validatedObject.extension });
    if (!uploadImage) {
      return httpError.InternalServerError('Fail to upload image');
    }

    return send({ image: uploadImage.Location })
  }
}