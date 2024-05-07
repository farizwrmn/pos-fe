import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/dashboard'))
          registerModel(app, require('./models/app'))
          registerModel(app, require('./models/transaction/pos'))
          registerModel(app, require('./models/report/fifo'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          }
        }, {
          path: 'marketing/incentive-item',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/incentiveItem'))
              cb(null, require('./routes/marketing/incentiveItem'))
            }, 'marketing-incentive-item')
          }
        }, {
          path: 'marketing/incentive-member',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/incentiveMember'))
              cb(null, require('./routes/marketing/incentiveMember'))
            }, 'marketing-incentive-member')
          }
        }, {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/error/'))
            }, 'error')
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object
}

export default Routers
