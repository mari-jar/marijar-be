const { send } = require("../../../helpers/utils/wrapper");
const User = require("../../../repositories/user/pg");
const { v4: uuid } = require('uuid');
const httpError = require("http-errors");
const validate = require("validate.js");
const bcrypt = require('bcryptjs');
const jwt = require("../../../middlewares/jwt");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify
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

    result = {
      id: user.id,
      email: user.email,
      phoneNumber: `0${user.phoneNumber}`,
      accessToken: token
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

    const userId = uuid();
    const now = new Date(Date.now()).toISOString()
    const salt = bcrypt.genSaltSync(12);
    const body = {
      ...payload,
      id: userId,
      status: '',
      role: '',
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
      password: bcrypt.hashSync(payload.password, salt)
    }
    result = await this.user.insert(body)

    return send(result)
  }

  async getUser(payload) {
    const coba = await this.user.findMany()
    
    return send(payload)
  }
 }