import env from 'env'
import https from './https'

const fromsystems = {
  ios: '24',
  android: '23'
}

export default class AppGqlFetch extends https {
  constructor (requestContext) {
    super(requestContext)
    this.requestContext.method = requestContext.requestMethod || 'POST'
    this.baseUrl = env.appGqlUrl
  }

  async getHeaders () {
    const {
      at = '', version = '', rt = '', deviceId = '', fromsystem = this.getFromsystem(), departmentId = '0', refer, clientType = this.getClientType()
    } = this.fetchNativeUser
    const header = {
      'x-zp-at': at,
      'x-zp-rt': rt,
      'x-zp-business-system': fromsystem,
      'x-zp-device-id': deviceId,
      'x-zp-version': version,
      'x-zp-departmentid': departmentId.toString(),
      'x-zp-client-id': deviceId,
      'x-zp-client-type': clientType,
      'x-zp-user-agent': '',
      'x-zp-channel': refer,
      'Content-Type': 'application/json'
    }
    return header
  }

  getBody () {
    const { body: variables = {} } = this.requestContext
    const data = {
      query: this.requestContext.query,
      variables
    }
    return JSON.stringify(data)
  }

  // 需要退出登录的code
  checkExit (code) {
    return (code >= 10001 && code <= 10009) || code === 401
  }

  // 踢出登录
  checkKickOutExit (code) {
    return code === 603 || code === 2021
  }

  getFromsystem () {
    return fromsystems[(weex.config.env.osName || 'ios').toLowerCase()]
  }

  getClientType () {
    return weex.config.env.osName.slice(0, 1).toLowerCase()
  }
}
