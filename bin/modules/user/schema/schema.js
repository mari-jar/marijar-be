
/**
 * Struct Schema JSON
 * @props body, query, params, response
 */

module.exports = {
  login: require('./schema_json/login.json'),
  register: require('./schema_json/register.json'),
  insertMany: require('./schema_json/insert-many.json'),
  getDetail: require('./schema_json/get-detail.json'),
  getProfile: require('./schema_json/get-profile.json'),
  refreshToken: require('./schema_json/refresh-token.json'),
  sendVerify: require('./schema_json/send-verify.json'),
  verify: require('./schema_json/verify.json'),
  logout: require('./schema_json/logout.json'),
}