const envSchema = require('env-schema')

const schema = {
  type: 'object',
  required: [
    'APP_NAME',
    'BASIC_AUTH_USERNAME', 
    'BASIC_AUTH_PASSWORD', 
    'PRIVATE_KEY_PATH',
    'PUBLIC_KEY_PATH',
    'POSTGRES_HOST', 
    'POSTGRES_PORT', 
    'POSTGRES_USER', 
    'POSTGRES_PASSWORD', 
    'POSTGRES_DATABASE',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_PASSWORD',
    'REDIS_FAMILY',
    'EMAIL',
    'EMAIL_PASSWORD'
  ],
  properties: {
    // Commons
    PORT: { type: 'number', default: 9000 },
    HOST: { type: 'string', default: '0.0.0.0' },
    APP_NAME: { type: 'string' },

    // Authentication
    BASIC_AUTH_USERNAME: { type: 'string' },
    BASIC_AUTH_PASSWORD: { type: 'string' },
    PRIVATE_KEY_PATH: { type: 'string' },
    PUBLIC_KEY_PATH: { type: 'string' },

    // Database
    POSTGRES_HOST: { type: 'string' },
    POSTGRES_PORT: { type: 'number' },
    POSTGRES_USER: { type: 'string' },
    POSTGRES_PASSWORD: { type: 'string' },
    POSTGRES_DATABASE: { type: 'string' },

    REDIS_HOST: { type: 'string' },
    REDIS_PORT: { type: 'number' },
    REDIS_PASSWORD: { type: 'string' },
    REDIS_FAMILY: { type: 'string' },

    // Email
    EMAIL: { type: 'string' },
    EMAIL_PASSWORD: { type: 'string' }
  }
}

module.exports = envSchema({
  schema: schema,
  dotenv: true 
})