
const jwt = require('fastify-jwt')
const config = require('../../config')
const fs = require('fs');
const validate = require('validate.js');
const httpError = require('http-errors');

const getKey = keyPath => fs.readFileSync(keyPath, 'utf8');

const init = (fastify) => {
  fastify.register(jwt, {
    secret: {
      public: getKey(config.env.PUBLIC_KEY_PATH),
      private: getKey(config.env.PRIVATE_KEY_PATH),
    },
    decode: { complete: false },
    sign: {
      aud: config.env.APP_NAME,
      expiresIn: '1h'
    },
    verify: { allowedIss: config.env.APP_NAME },
    formatUser: async user => {
      const key = `user-data-${user.sub}`
      const redis = await fastify.redis.get(key)
      if (validate.isEmpty(redis)) {
        throw httpError.Unauthorized(`Please log-in to continue`)
      }
      return JSON.parse(redis);
    }
  })
  fastify.decorate('bearerToken', verifyToken)
}

/**
 * To generate token
 * 
 * @param {Any} fastify package fastify
 * @param {String} subject userId
 * @returns {String} Token
 */
const generateToken = async (fastify, subject) => {
  const opts = Object.assign({
    sub: subject
  }, fastify.jwt.options.sign)

  return await fastify.jwt.sign(opts)
}

const verifyToken = async (request, _) => {
  const authorization = request.headers.authorization
  if(validate.isEmpty(authorization) || !authorization.includes('Bearer')) {
    throw httpError.BadRequest('Bearer token not found')
  }
  
  try {
    const token = authorization.split(' ')[1];
    await request.jwtVerify(token)
  } catch (error) {
    throw error
  }
}

module.exports = {
  init,
  generateToken,
  verifyToken
}
