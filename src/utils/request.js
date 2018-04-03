import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import pathToRegexp from 'path-to-regexp'
import lodash from 'lodash'
import { message } from 'antd'
// import { YQL, CORS } from './config'
import { getDomainBE, getPortBE, removeItemKey } from './lstorage'
import { apiPrefix } from '../utils/config.rest'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
    headers
  } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  // if (fetchType === 'JSONP') {
  //   return new Promise((resolve, reject) => {
  //     jsonp(url, {
  //       param: `${qs.stringify(data)}&callback`,
  //       name: `jsonp_${new Date().getTime()}`,
  //       timeout: 4000,
  //       headers
  //     }, (error, result) => {
  //       if (error) {
  //         reject(error)
  //       }
  //       resolve({ statusText: 'OK', status: 200, data: result })
  //     })
  //   })
  // } else if (fetchType === 'YQL') {
  //   url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
  //   data = null
  // }

  switch (method.toLowerCase()) {
  case 'get':
    return axios.get(url, {
      params: cloneData,
      headers
    })
  case 'delete':
    return axios.delete(url, {
      data: cloneData,
      headers
    })
  case 'post':
    return axios.post(url, cloneData, { headers })
  case 'put':
    return axios.put(url, cloneData, { headers })
  case 'patch':
    return axios.patch(url, cloneData, { headers })
  default:
    return axios(options)
  }
}

const getAPIURL = () => {
  const BEURL = getDomainBE()
  const BEPORT = getPortBE()
  let APIHOST
  if (!BEURL.match(/^[0-9a-z.]+$/)) {
    removeItemKey('cdi')
    APIHOST = 'localhost'
  } else {
    APIHOST = BEURL
  }
  let APIPORT
  if (!BEPORT.match(/^[0-9a-z]+$/)) {
    APIPORT = 5557
  } else {
    APIPORT = BEPORT
  }
  const APIURL = `http://${APIHOST}:${APIPORT}`
  return APIURL
}

export default function request (options) {
  const APIURL = getAPIURL()
  options.usage = options.usage|| 'store'
  if (options.usage === 'store') {
    options.url = APIURL + apiPrefix + options.url
  }
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    // if (window.location.origin !== origin) {
    //   if (CORS && CORS.indexOf(origin) > -1) {
    //     options.fetchType = 'CORS'
    //   } else if (YQL && YQL.indexOf(origin) > -1) {
    //     options.fetchType = 'YQL'
    //   } else {
    //     options.fetchType = 'JSONP'
    //   }
    // }
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    if (data instanceof Array) {
      data = {
        list: data
      }
    }

    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      if (Object.prototype.hasOwnProperty.call(error, 'message')) {
        msg = error.message || 'Network Error'
      } else {
        msg = error
      }
    }
    return { success: false, statusCode, message: msg }
  })
}
