
const Common = require("../../../repositories/common/pg");
const { COMMON_TYPE } = require("../../../helpers/commons");
const validate = require("validate.js");

module.exports = class {
  constructor (fastify) {
    this.common = new Common(fastify)
  }

  async getUserRole() {
    let result
    result = await this.common.findMany(['id', 'data'], { type: COMMON_TYPE.USER_ROLE })
    if (!validate.isEmpty(result)) {
      result = result.map(elm => {
        const {id, data} = elm
        return { id, ...data }
      })
    }
    return result
  }

}