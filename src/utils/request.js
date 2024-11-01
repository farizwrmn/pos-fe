import axios from 'axios'
// import qs from 'qs'
// import jsonp from 'jsonp'
import pathToRegexp from 'path-to-regexp'
import cloneDeep from 'lodash/cloneDeep'
import { message } from 'antd'
// import { YQL, CORS } from './config'
import { apiPrefix } from './config.rest'
// import crypt from './crypt'
import { getAPIURL, getAPIURLAlt } from './variables'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    // fetchType,
    url = '',
    timeout = 30000,
    fullUrl,
    headers
  } = options

  let cloneData = cloneDeep(data)

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

  if (options.usage === 'form') {
    cloneData = data
  }
  if (fullUrl) {
    url = fullUrl
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
      return axios.post(url, cloneData, { headers, timeout })
    case 'put':
      return axios.put(url, cloneData, { headers })
    case 'patch':
      return axios.patch(url, cloneData, { headers })
    default:
      return axios(options)
  }
}

export default function request (options) {
  let APIURL = getAPIURL()
  if (options.alt) {
    APIURL = getAPIURLAlt()
  }
  options.usage = options.usage || 'store'
  if (options.usage === 'store' || options.usage === 'form') {
    options.url = APIURL + apiPrefix + options.url
  }
  if (options.url && options.url.indexOf('//') > -1) {
    // const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
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
  axios.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date() }
    return config
  }, (error) => {
    return Promise.reject(error)
  })
  // axios.interceptors.response.use((response) => {
  //   response.config.metadata.endTime = new Date()
  //   response.duration = response.config.metadata.endTime - response.config.metadata.startTime
  //   console.log(response.config.url, `${(response.duration / 1000)} seconds`, response)
  //   return response
  // }, (error) => {
  //   return Promise.reject(error)
  // })
  // console.log('axios', myInterceptor)
  // axios.interceptors.request.eject(myInterceptor)
  return fetch(options).then((response) => {
    response.config.metadata.endTime = new Date()
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    if (data instanceof Array) {
      data = {
        list: data
      }
    }
    const getLocation = (href) => {
      let l = document.createElement('a')
      l.href = href
      return l
    }
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime
    if (getLocation(response.config.url).pathname.substr(0, 14) === '/api/v1/report') {
      // const apiHeaderToken = crypt.apiheader()
      // request({
      //   url: '/log/report',
      //   method: 'post',
      //   data: {
      //     url: response.config.url,
      //     params: JSON.stringify(response.config.params),
      //     duration: response.duration
      //   },
      //   headers: apiHeaderToken
      // })
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
    let dat
    let statusCode
    let detail = ''
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      detail = data && data.detail
      msg = (data || { message: 'Network Error' }).message || statusText
      dat = data && data.data ? data.data : {}
    } else {
      statusCode = 600
      if (Object.prototype.hasOwnProperty.call(error, 'message')) {
        msg = error.message || 'Network Error'
      } else {
        msg = error
      }
    }
    return { success: false, detail, statusCode, message: msg, data: dat }
  })
}
