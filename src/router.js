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
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'master/employee',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employee'))
              registerModel(app, require('./models/city'))
              registerModel(app, require('./models/master/jobposition'))
              cb(null, require('./routes/master/employee/'))
            }, 'master-employee')
          },
        }, {
          path: 'employee/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employee/detail'))
              cb(null, require('./routes/master/employee/detail/'))
            }, 'master-employee-detail')
          },
          path: 'master/customer',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/customer'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/employee'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/city'))
              registerModel(app, require('./models/customergroup'))
              registerModel(app, require('./models/customertype'))
              cb(null, require('./routes/master/customer/'))
              cb(null, require('./routes/master/customergroup'))
            }, 'customer')
          },
        }, {
          path: 'master/customergroup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/customergroup'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/customer'))
              registerModel(app, require('./models/sellprice'))
              cb(null, require('./routes/master/customergroup/'))
            }, 'customergroup')
          },
        }, {
          path: 'master/customertype',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/customertype'))
              registerModel(app, require('./models/customergroup'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/customer'))
              registerModel(app, require('./models/sellprice'))
              cb(null, require('./routes/master/customertype/'))
            }, 'customertype')
          },
        }, {
          path: 'master/suppliers',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/suppliers'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/employee'))
              registerModel(app, require('./models/city'))
              registerModel(app, require('./models/customer'))
              cb(null, require('./routes/master/suppliers/'))
            }, 'suppliers')
          },
        }, {
          path: 'master/product/brand',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/productBrand'))
              cb(null, require('./routes/master/product/brand/'))
            }, 'master-product-brand')
          },
        }, {
          path: 'master/product/brand/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/detail/productBrand'))
              cb(null, require('./routes/master/product/brand/detail/'))
            }, 'master-product-brand-detail')
          },
        }, {
          path: 'master/product/category',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/productCategory'))
              cb(null, require('./routes/master/product/category/'))
            }, 'master-product-category')
          },
        }, {
          path: 'master/product/category/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/detail/productCategory'))
              cb(null, require('./routes/master/product/category/detail/'))
            }, 'master-product-category-detail')
          },
        }, {
          path: 'master/product/stock',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/stock'))
              registerModel(app, require('./models/productCategory'))
              registerModel(app, require('./models/productBrand'))
              cb(null, require('./routes/master/product/stock/'))
            }, 'master-product-stock')
          },
        }, {
          path: 'transaction/pos',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/member'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/unit'))
              cb(null, require('./routes/transaction/pos/'))
            }, 'transaction-pos')
          },
        }, {
          path: 'transaction/pos/payment',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/stock'))
              cb(null, require('./routes/transaction/pos/payment/'))
            }, 'transaction-pos-payment')
          },
        }, {
          path: 'transaction/pos/history',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/transaction/savedPayment/'))
            }, 'transaction-pos-history')
          },
        }, {
          path: 'transaction/purchase',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase/'))
            }, 'transaction-purchase')
          },
        }, {
          path: 'transaction/adjust',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/adjust'))
              cb(null, require('./routes/transaction/adjust/'))
            }, 'transaction-adjust')
          },
        }, {
          path: 'setting/user',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/employee'))
              cb(null, require('./routes/setting/user/'))
            }, 'setting-user')
          },
        }, {
          path: 'setting/user/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/detail/user'))
              cb(null, require('./routes/setting/user/detail/'))
            }, 'setting-user-detail')
          },
        }, {
          path: 'master/service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/service'))
              registerModel(app, require('./models/servicetype'))
              cb(null, require('./routes/master/service'))
            }, 'service')
          },
        }, {
          path: 'master/city',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/city'))
              cb(null, require('./routes/master/city'))
            }, 'city')
          },
        }, {
          path: 'setting/misc',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/setting/misc/'))
            }, 'setting-misc')
          },
        }, {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
