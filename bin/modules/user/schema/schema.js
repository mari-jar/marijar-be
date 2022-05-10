
/**
 * Struct Schema JSON
 * @props body, query, params, response
 */

module.exports = {
  login: require('./schema_json/login.json'),
  register: require('./schema_json/register.json'),
  getDetail: require('./schema_json/get-detail.json'),
  getProfile: require('./schema_json/get-profile.json'),
  refreshToken: require('./schema_json/refresh-token.json')
}