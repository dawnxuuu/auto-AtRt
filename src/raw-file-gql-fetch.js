import env from 'env'
import requestUrl from 'apis/request/request-url'
import https from './https'

const fromsystems = {
  ios: '24',
  android: '23'
}

export default class GqlFetch extends https {
  constructor (requestContext) {
    super(requestContext)
    this.requestContext.method = 'POST'
    this.baseUrl = env.gqlUrlV670
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
    const { path, body = {} } = this.requestContext
    const data = {
      query: 'query ($path: String, $params: Raw!) { proxy(path: $path, params: $params)}',
      variables: {
        path: requestUrl[path],
        params: body
      }
    }
    return JSON.stringify(data)
  }

  // 需要退出登录的code
  checkExit (code) {
    return (code >= 10001 && code <= 10009) || code === 401
  }

  // 踢出登录
  checkKickOutExit (code) {
    return code === 603 || code === 2014 || code === 2021
  }

  // 冻结code
  checkFrozen (code) {
    return code === 2006
  }

  getResponse (resp) {
    const response = resp.data.proxy
    return Object.assign({
      traceId: resp.traceId
    }, response)
  }

  getFromsystem () {
    try {
      return fromsystems[(weex.config.env.osName || 'ios').toLowerCase()]
    } catch (error) {
      return fromsystems.android
    }
  }

  getClientType () {
    try {
      return weex.config.env.osName.slice(0, 1).toLowerCase()
    } catch (error) {
      return 'a'
    }
  }
}
