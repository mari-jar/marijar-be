
const schema = require("../schema/schema");
const Usecase = require("../usecase/usecase");

module.exports = class {
  constructor(fastify) {
    this.usecase = new Usecase(fastify)
  }

  async server(fastify) {
    await fastify.post('/utility/upload', { schema: schema.uploadImage, onRequest: fastify.basicAuth }, this.uploadImage);
  }

  uploadImage = async (request, reply) => {
    const { body: payload } = request
    const response = await this.usecase.uploadImage(payload)

    reply.send(response)
  }
}
