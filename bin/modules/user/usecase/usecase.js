const { send } = require("../../../helpers/utils/wrapper");
const { v4: uuid } = require('uuid');
const httpError = require("http-errors");
const validate = require("validate.js");
const bcrypt = require('bcryptjs');
const jwt = require("../../../middlewares/jwt");
const service = require("./service");
const mail = require("../../../helpers/mail");

const User = require("../../../repositories/user/pg");
const School = require("../../../repositories/school/pg");
const Employee = require("../../../repositories/employee/pg");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify

    this.user = new User(fastify)
    this.school = new School(fastify)
    this.employee = new Employee(fastify)
  }

  async login(payload, _) {
    let result

    const where = { email: payload.email }
    const user = await this.user.findOne([], where)
    if (validate.isEmpty(user)) {
      throw httpError.BadRequest(`Surel atau kata sandi anda salah`)
    }
    
    const isValid = await bcrypt.compareSync(payload.password, user.password)
    if (!isValid) {
      throw httpError.Unauthorized(`Surel atau kata sandi anda salah`)
    }
    delete user.password
    
    const status = JSON.parse(await this.fastify.redis.get('userStatus'))
    if (user.status === status.notActive) {
      throw httpError.Forbidden(`Akun anda tidak aktif`)
    }

    result = {
      id: user.id,
    }
    if (user.status != status.notVerified) {
      const role = JSON.parse(await this.fastify.redis.get('userRole'))
      const data = { ...user }
      let filter = { userId: user.id }
      let filterSchool = filter
      if (user.role === role.employee) {
        const employee = await this.employee.findOne([], filter );
        if (!validate.isEmpty(employee)) {
          data.employee = employee
          filterSchool = { id: employee.schoolId }
        }  
      }

      const school = await this.school.findOne([], filterSchool );
      if (!validate.isEmpty(school)) {
        data.school = school
      }
    
      const userKey = await service.generateUserData(this.fastify, data, uuid());
      const token = await jwt.generateToken(this.fastify, { sub: userKey, role: user.role })
      const refreshToken = await service.generateRefreshToken(this.fastify, user.id, uuid())

      result = {
        ...result,
        accessToken: token,
        refreshToken: refreshToken
      }
    }

    return send(result)
  }

  async refreshToken(payload, _) {
    let result
    const key = `refresh-token-${payload.refreshToken}`
    const redis = await this.fastify.redis.get(key)
    if (validate.isEmpty(redis)) {
      throw httpError.BadRequest(`refresh token tidak daoat digunakan`)
    }
    await this.fastify.redis.del(key)

    const data = JSON.parse(redis)
    const user = await this.user.findOne([], { id: data.userId })
    if (validate.isEmpty(user)) {
      throw httpError.BadRequest(`Pengguna tidak ditemukan`)
    }

    const userKey = await service.generateUserData(this.fastify, user, uuid());
    const token = await jwt.generateToken(this.fastify, { sub: userKey, role: user.role })
    const refreshToken = await service.generateRefreshToken(this.fastify, user.id, uuid())

    result = {
      id: user.id,
      accessToken: token,
      refreshToken: refreshToken  
    }

    return send(result)
  }

  async register(payload, _) {
    let result;

    const where = { $or:[
      { email: payload.email },
      { phoneNumber: payload.phoneNumber }
    ] }
    const user = await this.user.findOne(['email', 'phoneNumber'], where)
    if (!validate.isEmpty(user)) {
      if (user.email === payload.email) {
        throw httpError.Conflict('Surel telah digunakan')
      }
      if (user.phoneNumber == payload.phoneNumber) {
        throw httpError.Conflict('Nomor telepon telah digunakan')
      }
    }

    const role = JSON.parse(await this.fastify.redis.get('userRole'))
    const status = JSON.parse(await this.fastify.redis.get('userStatus'))

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

  async sendVerify(payload, _) {
    const userVerify = JSON.parse(await this.fastify.redis.get(`user-verify-${payload.id}`))
    if (userVerify) {
      throw httpError.UnprocessableEntity('Silahkan tunggu kurang lebih 5 menit, untuk mengirim email lagi')
    }

    const status = JSON.parse(await this.fastify.redis.get('userStatus'))
    const userData = await this.user.findOne(['id', 'status', 'email'], { id: payload.id })
    if (validate.isEmpty(userData)) {
      throw httpError.NotFound('Akun tidak ditemukan')
    }
    if (userData.status != status.notVerified) {
      throw httpError.InternalServerError('Akun anda telah diverifikasi')
    }

    const verifyId = uuid()
    const data = JSON.stringify({ userId: userData.id })
    const minute = 1 * 60;
    await this.fastify.redis.set(`varify-${verifyId}`, data, `EX`, minute * 10)
    await this.fastify.redis.set(`user-verify-${userData.id}`, 1, `EX`, minute * 5)

    // Send Email
    await mail.sendMail(
      userData.email, 
      '[Marijar] Varifikasi Email', 
      { html: `verify.html`, data: { url: `google.com/${verifyId}` } })

    return send('Silahkan periksa email anda')
  }

  async verify(payload, _) {
    const key = `varify-${payload.verifyId}`
    const user = JSON.parse(await this.fastify.redis.get(key))
    if (validate.isEmpty(user)) {
      throw httpError.InternalServerError('Tautan verifikasi telah kadaluarsa')
    }
    await this.fastify.redis.del(key)

    const status = JSON.parse(await this.fastify.redis.get('userStatus'))
    await this.user.update({ id: user.userId }, { status: status.active })

    return send('Akun anda berhasil diverifikasi, silahkan login')
  }

  async logout(payload, opts) {
    await this.fastify.redis.del(`refresh-token-${payload.refreshToken}`)
    await this.fastify.redis.del(`user-data-${opts.sub}`)

    return send('Anda berhasil logout')
  }

  async getDetail(payload, _) {
    let result
    const { id } = payload
    result = await this.user.findOne([], { id })
    if (validate.isEmpty(result)) {
      throw httpError.NotFound('Pengguna tidak ditemukan')
    }
    result.phoneNumber = `0${result.phoneNumber}`

    return send(result)
  }

  async getProfile(_, opts) {
    return send(opts)
  }
 }