const { send } = require("../../../helpers/utils/wrapper");
const httpError = require("http-errors");
const validate = require("validate.js");

const School = require("../../../repositories/school/pg");

module.exports = class {
  constructor (fastify) {
    this.fastify = fastify

    this.school = new School(fastify)
  }

  async insert(payload, opts) {
    let result

    const schoolData = await this.school.findOne(['id', 'npsn'], { $or: [
      { userId: opts.id },
      { npsn: payload.npsn },
    ] })
    if (schoolData) {
      if (schoolData.userId === opts.id) {
        throw httpError.InternalServerError('Anda telah mendaftarkan sekolah anda')
      }
      if (schoolData.npsn === payload.npsn) {
        throw httpError.InternalServerError('NPSN telah digunakan')
      }
    }

    const status = JSON.parse(await this.fastify.redis.get('schoolStatuses'))
    const subscription = JSON.stringify({
      end: '',
      status: status.pending,
      start: ''
    })
    const insertData = {
      ...payload,
      subscription,
      userId: opts.id,
      zone: JSON.stringify(payload.zone),
      image: JSON.stringify(payload.image),
      document: JSON.stringify(payload.document),
      createdBy: opts.id,
      updatedBy: opts.id
    }
    result =  await this.school.insert(insertData)

    return send(result)
  }

  async update(payload, opts) {
    let result
    const { id, ...payloadProperties } = payload

    const schoolData = await this.school.findOne([], { id })
    if (validate.isEmpty(schoolData)) {
      throw httpError.NotFound('Sekolah tidak ditemukan')
    }

    const payloadKeys = Object.keys(payloadProperties).filter(elm => ['zone', 'image', 'subscription', 'document'].includes(elm))
    if (!validate.isEmpty(payloadKeys)) {
      payloadKeys.forEach(elm => {
        const data = {
          ...schoolData[elm],
          ...payloadProperties[elm]
        }
        payloadProperties[elm] = JSON.stringify(data) 
      })
    }

    const data = {
      ...payloadProperties,
      updatedBy: opts.id
    }
    await this.school.update({ id }, data)

    result = { id } 
    return send(result)
  }

  async delete(payload, _) {
    const { id } = payload

    await this.school.delete({ id })

    return send('Sekolah berhasil di hapus')
  }

  async list(payload, _) {
    let result = []

    const count = await this.school.count(payload.where)
    if (count > 0) {
      const offset = payload.limit * (payload.page - 1)
      result = await this.school.pagination(
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
    result = await this.school.findOne([], { id });


    return send(result)
  }
 }
 