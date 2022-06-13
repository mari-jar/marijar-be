const validate = require('validate.js');
const httpError = require('http-errors');
const S3Instance = require('aws-sdk/clients/s3');

const { v4: uuid } = require('uuid');
const { env } = require('../../../../../config');

const config = {
  bucket: env.AWS_BUCKET_NAME,
  region: env.AWS_BUCKET_REGION,
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY
};

const s3 = new S3Instance(config);

module.exports = class {
  async uploadObjectStream(payload) {
    console.log(payload)
    const params = {
      Bucket: config.bucket,
      Body: payload.image,
      Key: `${uuid()}.${payload.ext}`
    };

    const isUploaded = await s3.upload(params).promise();
    if (validate.isPromise(isUploaded)) {
      return httpError.InternalServerError(isUploaded);
    }

    return isUploaded;
  }
}
