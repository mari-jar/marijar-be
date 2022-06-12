const { send } = require("../../../helpers/utils/wrapper");
const { v4: uuid } = require('uuid');
const httpError = require("http-errors");
const validate = require("validate.js");
const bcrypt = require('bcryptjs');
const mail = require("../../../helpers/mail");

const Employee = require("../../../repositories/employee/pg");
const User = require("../../../repositories/user/pg");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify

    this.employee = new Employee(fastify)
    this.user = new User(fastify)
  }

  async insert(payload, opts) {
    let result

    const role = JSON.parse(await this.fastify.redis.get('userRole'))
    if (![role.employee, role.school].includes(opts.role)) {
      throw httpError.Forbidden(`Your account does not have access`)
    }

    let user
    if (payload.isTeacher) {
      user = await this.user.findOne(['email', 'phoneNumber'], { $or: [
        { email: payload.email },
        { phoneNumber: payload.phoneNumber }
      ] })  
    }
    const employeeData = await this.employee.findOne(['nik', 'email', 'phoneNumber'], { $or: [
      { nik: payload.nik },
      { email: payload.email },
      { phoneNumber: payload.phoneNumber }
    ] })
    const temp = user || employeeData 
    if (!validate.isEmpty(temp)) {
      if (temp.nik == payload.nik) {
        throw httpError.Conflict('NIK has been used')
      }
      if (temp.email === payload.email) {
        throw httpError.Conflict('Email has been used')
      }
      if (temp.phoneNumber == payload.phoneNumber) {
        throw httpError.Conflict('Phone number has been used')
      }
    }

    const userId = uuid();
    const now = new Date(Date.now()).toISOString()
    if (payload.isTeacher) {
      const salt = bcrypt.genSaltSync(12);
      const status = JSON.parse(await this.fastify.redis.get('userStatus'))
      const password = `marijar${new Date(now).getMilliseconds()}`
      const dataUser = {
        id: userId,
        status: status.notVerified,
        role: role.employee,
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: bcrypt.hashSync(password, salt),
        createdAt: now,
        createdBy: opts.id,
        updatedAt: now,
        updatedBy: opts.id
      }
      user = await this.user.insert(dataUser)

      // Send Email
      await mail.sendMail(
        payload.email,
        '[Marijar] Pembuatan Akun', 
        { html: `createAcount.html`, data: { email: payload.email, password } })
    }

    const insertData = {
      ...payload,
      id: uuid(),
      userId: userId,
      schoolId: opts.school.id,
      zone: JSON.stringify(payload.zone),
      image: JSON.stringify(payload.image),
      data: JSON.stringify({}),
      createdAt: now,
      updatedAt: now
    }
    result = await this.employee.insert(insertData)

    return send(result)
  }

  async update(payload, opts) {
    let result
    const { id, ...payloadProperties } = payload

    const employeeData = await this.employee.findOne([], { id })
    if (validate.isEmpty(employeeData)) {
      throw httpError.NotFound('Employee not found')
    }

    const payloadKeys = Object.keys(payloadProperties).filter(elm => ['zone', 'image', 'data'].includes(elm))
    if (!validate.isEmpty(payloadKeys)) {
      payloadKeys.forEach(elm => {
        const data = {
          ...employeeData[elm],
          ...payloadProperties[elm]
        }
        payloadProperties[elm] = JSON.stringify(data) 
      })
    }

    const now = new Date(Date.now()).toISOString()
    const data = {
      ...payloadProperties,
      updatedAt: now,
      updatedBy: opts.id,
    }
    await this.employee.update({ id }, data)

    result = { id } 
    return send(result)
  }

  async delete(payload, _) {
    const { id } = payload

    await this.employee.delete({ id })

    return send('Employee has been successfully deleted')
  }

  async list(payload, _) {
    let result = []

    const count = await this.employee.count(payload.where)
    if (count > 0) {
      const offset = payload.limit * (payload.page - 1)
      result = await this.employee.pagination(
        [], 
        payload.where, 
        payload.sort, 
        payload.limit,
        offset)
    }

    const meta = {
      page: payload.page || 0,
      quantity: result.length,
      totalPage: Math.ceil(count / payload.limit) || 0,
      totalData: count
    };
    return send(result, meta)
  }

  async detail(payload, _) {
    let result
    const { id } = payload
    result = await this.employee.findOne([], { id });

    return send(result)
  }
 }
 