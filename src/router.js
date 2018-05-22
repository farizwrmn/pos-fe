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
              cb(null, require('./routes/login/'))
            }, 'login')
          }
        }, {
          path: 'nps/01',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/nps'))
              cb(null, require('./routes/nps/'))
            }, 'nps')
          }
        }, {
          path: 'nps/02',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/nps'))
              cb(null, require('./routes/nps/'))
            }, 'nps')
          }
        }, {
          path: 'nps/03',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/nps'))
              cb(null, require('./routes/nps/'))
            }, 'nps')
          }
        }, {
          path: 'userprofile',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userProfile'))
              cb(null, require('./routes/setting/user/profile/'))
            }, 'user-profile')
          }
        }, {
          path: 'master/employee',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/master/jobposition'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/employee/'))
            }, 'master-employee')
          }
        }, {
          path: 'master/customer',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/master/customertype'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/customer/customer/'))
            }, 'master-customer')
          }
        }, {
          path: 'master/customergroup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customergroup'))
              cb(null, require('./routes/master/customer/customergroup/'))
            }, 'master-customergroup')
          }
        }, {
          path: 'master/customertype',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customertype'))
              cb(null, require('./routes/master/customer/customertype/'))
            }, 'master-customertype')
          }
        }, {
          path: 'master/customerunit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customerunit'))
              registerModel(app, require('./models/master/customer'))
              cb(null, require('./routes/master/customer/customerunit/'))
            }, 'master-customerunit')
          }
        }, {
          path: 'master/supplier',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/supplier/'))
            }, 'master-supplier')
          }
        }, {
          path: 'master/product/brand',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/master/product/brand/'))
            }, 'master-product-brand')
          }
        }, {
          path: 'master/product/category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/master/product/category/'))
            }, 'master-product-category')
          }
        }, {
          path: 'master/product/stock',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/master/product/stock/'))
            }, 'master-product-stock')
          }
        }, {
          path: 'master/service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/service'))
              cb(null, require('./routes/master/service/'))
            }, 'master-service')
          }
        }, {
          path: 'master/city',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/master/city/'))
            }, 'master-city')
          }
        }, {
          path: 'transaction/pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
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
          }
        }, {
          path: 'transaction/pos/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/transaction/pos/payment/'))
            }, 'transaction-pos-payment')
          }
        }, {
          path: 'transaction/pos/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/transaction/savedPayment/'))
            }, 'transaction-pos-history')
          }
        }, {
          path: 'transaction/purchase/add',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase/'))
            }, 'transaction-purchase-add')
          }
        }, {
          path: 'transaction/purchase/edit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase/edit/'))
            }, 'transaction-purchase-add')
          }
        }, {
          path: 'transaction/adjust',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adjust'))
              cb(null, require('./routes/transaction/adjust/'))
            }, 'transaction-adjust')
          }
        }, {
          path: 'transaction/booking',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/booking'))
              cb(null, require('./routes/transaction/booking/'))
            }, 'transaction-booking')
          }
        }, {
          path: 'transaction/booking/:id/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/bookinghistory'))
              cb(null, require('./routes/transaction/booking/history/'))
            }, 'transaction-booking-history-detail')
          }
        }, {
          path: 'report/pos/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/report/pos/summary/'))
            }, 'report-pos-summary')
          }
        }, {
          path: 'report/pos/service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              cb(null, require('./routes/report/pos/posservice'))
            }, 'report-pos-service')
          }
        }, {
          path: 'report/pos/unit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              cb(null, require('./routes/report/pos/posserviceunit'))
            }, 'report-pos-service')
          }
        }, {
          path: 'report/pos/analyst',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              registerModel(app, require('./models/master/service'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/report/pos/analyst'))
            }, 'report-pos-analyst')
          }
        }, {
          path: 'report/purchase/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/purchase'))
              cb(null, require('./routes/report/purchase/summary/'))
            }, 'report-purchase-summary')
          }
        }, {
          path: 'report/service/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/service'))
              cb(null, require('./routes/report/service/summary/'))
            }, 'report-service-summary')
          }
        }, {
          path: 'report/purchaseinvoice/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/purchaseinvoice'))
              cb(null, require('./routes/report/purchaseinvoice/'))
            }, 'report-purchaseinvoice-summary')
          }
        }, {
          path: 'report/service/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/service'))
              registerModel(app, require('./models/master/service'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/report/service/history/'))
            }, 'report-service-history')
          }
        }, {
          path: 'report/adjust/in',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/in/'))
            }, 'report-purchase-summary-trans')
          }
        }, {
          path: 'report/adjust/out',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/out/'))
            }, 'report-purchase-summary-trans')
          }
        }, {
          path: 'report/fifo/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/summary/'))
            }, 'report-purchase-summary-trans')
          }
        }, {
          path: 'report/fifo/balance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/fifo'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/report/fifo/balance/'))
            }, 'report-purchase-summary-balance')
          }
        }, {
          path: 'report/fifo/value',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/value/'))
            }, 'report-purchase-summary-value')
          }
        }, {
          path: 'report/fifo/card',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/fifo'))
              cb(null, require('./routes/report/fifo/stockcard/'))
            }, 'report-purchase-summary-card')
          }
        }, {
          path: 'report/customer/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/customer'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/service'))
              cb(null, require('./routes/report/customer/'))
            }, 'report-customer-history')
          }
        }, {
          path: 'report/product/stock/quantity-alerts',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/productstock'))
              cb(null, require('./routes/report/notification/stockquantityalert'))
            }, 'report-product-stock-qty-alerts')
          }
        }, {
          path: 'report/product/stock-in-transit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/productstock'))
              cb(null, require('./routes/report/notification/stockintransit'))
            }, 'report-product-stock-in-transit')
          }
        }, {
          path: 'report/inventory/transfer',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/inventory'))
              cb(null, require('./routes/report/inventory/'))
            }, 'report-account-payment')
          }
        }, {
          path: 'report/accounts/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounts'))
              registerModel(app, require('./models/master/customergroup'))
              cb(null, require('./routes/report/accounts/summary'))
            }, 'report-account-summary')
          }
        }, {
          path: 'accounts/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/maintenance'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/accounts/payment'))
            }, 'accounts-payment')
          }
        }, {
          path: 'maintenance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/maintenance'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/maintenance/'))
            }, 'maintenance')
          }
        }, {
          path: 'setting/user',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/user'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/setting/userRole'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/setting/user/'))
            }, 'setting-user')
          }
        }, {
          path: 'setting/user/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/detail/user'))
              cb(null, require('./routes/setting/user/detail/'))
            }, 'setting-user-detail')
          }
        }, {
          path: 'accounts/payment/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/detail/paymentDetail'))
              registerModel(app, require('./models/payment/paymentOpts'))
              cb(null, require('./routes/accounts/payment/detail/'))
            }, 'setting-payment-detail')
          }
        }, {
          path: 'inventory/transfer/in',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transferIn'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/inventory/transfer/in'))
            }, 'inventory-transfer')
          }
        }, {
          path: 'inventory/transfer/in/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/detail/in'))
              registerModel(app, require('./models/transferIn'))
              cb(null, require('./routes/inventory/transfer/in/detail'))
            }, 'inventory-transfer-in')
          }
        }, {
          path: 'inventory/transfer/out',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/inventory/transfer/out'))
            }, 'setting-misc')
          }
        }, {
          path: 'inventory/transfer/out/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/detail/out'))
              registerModel(app, require('./models/transferOut'))
              cb(null, require('./routes/inventory/transfer/out/detail'))
            }, 'inventory-transfer-out')
          }
        }, {
          path: 'setting/misc',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/setting/misc/'))
            }, 'setting-misc')
          }
        }, {
          path: 'setting/configure',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/configure'))
              cb(null, require('./routes/setting/configure/'))
            }, 'setting-misc')
          }
        }, {
          path: 'setting/periods',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/period'))
              cb(null, require('./routes/setting/periode/'))
            }, 'setting-misc')
          }
        }, {
          path: 'setting/menu',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/menu'))
              cb(null, require('./routes/setting/menu/'))
            }, 'setting-menu')
          }
        }, {
          path: 'setting/role',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/role'))
              cb(null, require('./routes/setting/role/'))
            }, 'setting-role')
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
