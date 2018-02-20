import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import { browserHistory } from 'dva/router'
import { message, notification } from 'antd'

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError (error) {
    if (error) {
      if (error.message instanceof Object) {
        notification.config({ placement: 'bottomRight', duration: 3 })
        for (let i = 0; i < error.message.errors.length; i++) {
          notification.open({
            type: 'error',
            message: error.message.message,
            description: error.message.errors[i].message,
          })
        }
      } else {
        if (error.success) {
          message.info(error.message)
        } else {
          if (error.hasOwnProperty('detail')) {
            if (error.detail.substring(0,5) === 'Login') {
              message.info(error.message)
            } else {
              message.error(error.message)
            }
          } else {
            message.error(error.message)
          }
        }
      }
    }
  },
})

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')