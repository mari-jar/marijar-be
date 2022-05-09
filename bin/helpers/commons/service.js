
const Common = require("../../repositories/common/pg");
const { camelCase } = require("change-case");

// ================================
// #Commons Service
// ================================
/**
 * List Commons Type
 * @userRole
 * @userStatus
 */
module.exports = {
  init: async (fastify) => {
    fastify.register(async (fastify, _, done) => {
      try {
        const common = new Common(fastify)
    
        const types = await common.findManyGroup(['type'], {}, 'type')
        
        for (const [_, elm] of types.entries()) {
          const { type } = elm
          await fastify.redis.del(type)
          let data = await common.findMany(['data'], { type })
          const reduce = data.reduce((obj, v) => {
            const { data } = v
            obj[camelCase(data.name)] = data.disguise || data.name
            
            return obj
          }, {})
          
          await fastify.redis.set(type, JSON.stringify(reduce))
        }
      }
      catch (error) {
        throw error
      }
      done()
    })
  }
}