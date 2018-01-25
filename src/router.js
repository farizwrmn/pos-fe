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
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'login',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'master/employee',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/master/jobposition'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/employee/'))
            }, 'master-employee')
          },
        }, {
          path: 'master/customer',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/master/customertype'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/customer/customer/'))
            }, 'master-customer')
          },
        }, {
          path: 'master/customergroup',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customergroup'))
              cb(null, require('./routes/master/customer/customergroup/'))
            }, 'master-customergroup')
          },
        }, {
          path: 'master/customertype',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customertype'))
              cb(null, require('./routes/master/customer/customertype/'))
            }, 'master-customertype')
          },
        }, {
          path: 'master/customerunit',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customerunit'))
              registerModel(app, require('./models/master/customer'))
              cb(null, require('./routes/master/customer/customerunit/'))
            }, 'customerunit')
          },
        }, {
          path: 'master/supplier',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/supplier/'))
            }, 'master-supplier')
          },
        }, {
          path: 'master/product/brand',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/master/product/brand/'))
            }, 'brand')
          },
        }, {
          path: 'master/product/category',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/master/product/category/'))
            }, 'master-product-category')
          },
        }, {
          path: 'master/product/stock',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/master/product/stock/'))
            }, 'master-product-stock')
          },
        }, {
          path: 'master/service',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/service'))
              cb(null, require('./routes/master/service/'))
            }, 'service')
          },
        }, {
          path: 'master/city',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/city/'))
            }, 'city')
          },
        }, {
          path: 'transaction/pos',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/master/customertype'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/sequence'))
              cb(null, require('./routes/transaction/pos/'))
            }, 'transaction-pos')
          },
        }, {
          path: 'transaction/pos/payment',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/transaction/pos/payment/'))
            }, 'transaction-pos-payment')
          },
        }, {
          path: 'transaction/pos/history',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/transaction/savedPayment/'))
            }, 'transaction-pos-history')
          },
        }, {
          path: 'transaction/purchase/add',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase/'))
            }, 'transaction-purchase-add')
          },
        }, {
          path: 'transaction/purchase/edit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase/edit/'))
            }, 'transaction-purchase-add')
          },
        }, {
          path: 'transaction/adjust',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/adjust'))
              cb(null, require('./routes/transaction/adjust/'))
            }, 'transaction-adjust')
          },
        }, {
          path: 'transaction/booking',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction/booking'))
              cb(null, require('./routes/transaction/booking/'))
            }, 'transaction-booking')
          },
        }, {
          path: 'report/pos/summary',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/pos'))
              cb(null, require('./routes/report/pos/summary/'))
            }, 'report-pos-summary')
          },
        }, {
          path: 'report/pos/service',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/pos'))
              cb(null, require('./routes/report/pos/posservice'))
            }, 'report-pos-service')
          },
        }, {
          path: 'report/pos/unit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/pos'))
              cb(null, require('./routes/report/pos/posserviceunit'))
            }, 'report-pos-service')
          },
        }, {
          path: 'report/purchase/summary',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/purchase'))
              cb(null, require('./routes/report/purchase/summary/'))
            }, 'report-purchase-summary')
          },
        }, {
          path: 'report/service/summary',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/service'))
              cb(null, require('./routes/report/service/summary/'))
            }, 'report-service-summary')
          },
        }, {
          path: 'report/adjust/in',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/in/'))
            }, 'report-purchase-summary-trans')
          },
        }, {
          path: 'report/adjust/out',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/out/'))
            }, 'report-purchase-summary-trans')
          },
        }, {
          path: 'report/fifo/summary',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/summary/'))
            }, 'report-purchase-summary-trans')
          },
        }, {
          path: 'report/fifo/balance',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/balance/'))
            }, 'report-purchase-summary-balance')
          },
        }, {
          path: 'report/fifo/value',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/value/'))
            }, 'report-purchase-summary-value')
          },
        }, {
          path: 'report/fifo/card',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/stockcard/'))
            }, 'report-purchase-summary-card')
          },
        }, {
          path: 'maintenance',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/maintenance'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/maintenance/'))
            }, 'maintenance')
          },
        }, {
          path: 'setting/user',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/setting/user'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/setting/userRole'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/setting/user/'))
            }, 'setting-user')
          },
        }, {
          path: 'setting/user/:id',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/detail/user'))
              cb(null, require('./routes/setting/user/detail/'))
            }, 'setting-user-detail')
          },
        }, {
          path: 'inventory/transfer/in',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transferIn'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/inventory/transfer/in'))
            }, 'setting-misc')
          },
        }, {
          path: 'inventory/transfer/out',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/inventory/transfer/out'))
            }, 'setting-misc')
          },
        }, {
          path: 'setting/misc',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/setting/misc/'))
            }, 'setting-misc')
          },
        }, {
          path: 'setting/configure',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/configure'))
              cb(null, require('./routes/setting/configure/'))
            }, 'setting-misc')
          },
        }, {
          path: 'setting/periods',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/period'))
              cb(null, require('./routes/setting/periode/'))
            }, 'setting-misc')
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
