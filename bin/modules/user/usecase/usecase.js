const { send } = require("../../../helpers/utils/wrapper");
const { v4: uuid } = require('uuid');
const httpError = require("http-errors");
const validate = require("validate.js");
const bcrypt = require('bcryptjs');
const jwt = require("../../../middlewares/jwt");

const Service = require("./service");
const User = require("../../../repositories/user/pg");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify

    this.service = new Service(fastify)
    this.user = new User(fastify)
  }

  async login(payload) {
    let result

    const where = { email: payload.email }
    const user = await this.user.findOne([], where)
    if (validate.isEmpty(user)) {
      throw httpError.BadRequest(`Surel atau kata sandi anda salah`)
    }

    const isValid = await bcrypt.compareSync(payload.password, user.password)
    if (!isValid) {
      throw httpError.BadRequest(`Surel atau kata sandi anda salah`)
    }
    
    const token = await jwt.generateToken(this.fastify, user.id)
    const refreshToken = await this.service.generateRefreshToken(user.id, uuid())

    result = {
      id: user.id,
      accessToken: token,
      refreshToken: refreshToken
    }

    return send(result)
  }

  async refreshToken(payload) {
    let result
    const key = `refresh-token-${payload.refreshToken}`
    const redis = await this.fastify.redis.get(key)
    if (validate.isEmpty(redis)) {
      throw httpError.BadRequest(`refresh token tidak daoat digunakan`)
    }
    await this.fastify.redis.del(key)

    const data = JSON.parse(redis)
    const user = await this.user.findOne([], { id: data.aud })
    if (validate.isEmpty(user)) {
      throw httpError.BadRequest(`Pengguna tidak ditemukan`)
    }

    const token = await jwt.generateToken(this.fastify, user.id)
    const refreshToken = await this.service.generateRefreshToken(user.id, uuid())

    result = {
      id: user.id,
      accessToken: token,
      refreshToken: refreshToken  
    }

    return send(result)
  }

  async register(payload) {
    let result;

    const where = { $or:[
      { email: payload.email },
      { username: payload.username }, 
      { phoneNumber: payload.phoneNumber }
    ] }
    const user = await this.user.findOne([], where)
    if (!validate.isEmpty(user)) {
      if (user.email === payload.email) {
        throw httpError.Conflict('Surel telah digunakan')
      }
      if (user.username === payload.username) {
        throw httpError.Conflict('Username telah digunakan')
      }
      if (user.phoneNumber == payload.phoneNumber) {
        throw httpError.Conflict('Nomor telepon telah digunakan')
      }
    }

    const role = await this.service.getUserRole()
    const status = await this.service.getUserStatus()
    const userId = uuid();
    const now = new Date(Date.now()).toISOString()
    const salt = bcrypt.genSaltSync(12);
    const body = {
      ...payload,
      id: userId,
      status: status.notVerified,
      role: role.school,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
      password: bcrypt.hashSync(payload.password, salt)
    }
    result = await this.user.insert(body)

    return send(result)
  }

  async getDetail(payload) {
    let result
    const { id } = payload
    result = await this.user.findOne([], { id })
    if (validate.isEmpty(result)) {
      throw httpError.NotFound('Pengguna tidak ditemukan')
    }
    result.phoneNumber = `0${result.phoneNumber}`

    return send(result)
  }
 }