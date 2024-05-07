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
          path: 'user_profile',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/profile/'))
            }, 'user_profile')
          }
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/login/'))
            }, 'login')
          }
        }, {
          path: 'transaction/pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/planogram/planogram'))
              registerModel(app, require('./models/transaction/fingerEmployee'))
              registerModel(app, require('./models/notification/salesDiscount'))
              registerModel(app, require('./models/notification/requestCancelPos'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/finance/pettyCashDetail'))
              registerModel(app, require('./models/balance/balance'))
              registerModel(app, require('./models/transaction/pospromo'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/paymentOption/cost'))
              registerModel(app, require('./models/master/paymentOption/edc'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/counter'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/marketing/promo'))
              registerModel(app, require('./models/marketing/bundling'))
              registerModel(app, require('./models/marketing/bundlingRules'))
              registerModel(app, require('./models/marketing/bundlingReward'))
              registerModel(app, require('./models/master/customerunit'))
              registerModel(app, require('./models/marketing/customerSocial'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/sequence'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/master/customertype'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/product/bookmarkGroup'))
              registerModel(app, require('./models/product/bookmark'))
              registerModel(app, require('./models/login'))
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/transaction/pos/'))
            }, 'transaction-pos')
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
