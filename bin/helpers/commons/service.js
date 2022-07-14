
const Common = require("../../repositories/common/pg");
const { camelCase, snakeCase } = require("change-case");

// ================================
// #Commons Service
// ================================
/**
 * List Commons Type
 * @userRole
 * @userStatus
 * @schoolSubscriptionStatus
 */
const listCommons = [
  'userRoles',
  'userStatuses',
  'schoolStatuses',
  'schoolLevels'
];

module.exports = {
  init: async (fastify) => {
    fastify.register(async (fastify, _, done) => {
      try {
        for (const table of listCommons) {
          const common = new Common(fastify, snakeCase(table))
          
          await fastify.redis.del(table)
          let data = await common.findMany([], {})
          const reduce = data.reduce((obj, v) => {
            obj[camelCase(v.name)] = v.disguise || v.name
            
            return obj
          }, {})
          
          await fastify.redis.set(table, JSON.stringify(reduce))
          
        }
      }
      catch (error) {
        throw error
      }
      done()
    })
  }

}