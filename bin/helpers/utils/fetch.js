const nodeFetch = require('node-fetch');
const validate = require('validate.js');
const httpError = require("http-errors");

const { env } = require('../../../config');

module.exports = {
  marijar: async (api, opts) => {
    const endpoint = `${env.API_BASE_URL}/api/${api}`
    const res = await fetch(endpoint, opts)
    if (!validate.isEmpty(res.error)) {
      throw httpError[res.statusCode](`${res.message}`)
    }
    return res.data
  }
}

/**
   * To fetch API
   * 
   * @param {String} api 
   * @param {Object} opts
   * @returns {Object}
   */
async function fetch (api, opts) {
  opts.body = JSON.stringify(opts.body || {}) 
  opts.headers['content-type'] = 'application/json'
  const fetch = await nodeFetch(api, opts)
  return await fetch.json() 
   
}