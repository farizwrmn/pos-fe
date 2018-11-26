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
              registerModel(app, require('./models/misc'))
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
              registerModel(app, require('./models/master/customerunit'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/marketing/social'))
              registerModel(app, require('./models/marketing/customerSocial'))
              registerModel(app, require('./models/setting/store'))
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
          path: 'marketing/loyalty',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/loyaltySetting'))
              cb(null, require('./routes/master/customer/loyaltySetting/'))
            }, 'marketing-loyalty-setting')
          }
        }, {
          path: 'marketing/social',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/social'))
              cb(null, require('./routes/marketing/social'))
            }, 'marketing-social-media')
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
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/specificationStock'))
              registerModel(app, require('./models/master/specification'))
              registerModel(app, require('./models/master/variantStock'))
              registerModel(app, require('./models/master/variant'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/master/product/stock/'))
            }, 'master-product-stock')
          }
        }, {
          path: 'master/product/sticker',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/master/product/printSticker/'))
            }, 'master-product-sticker')
          }
        }, {
          path: 'master/product/variant',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/variant'))
              cb(null, require('./routes/master/product/variant/'))
            }, 'master-product-variant')
          }
        }, {
          path: 'master/product/specification',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/specification'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/master/product/specification/'))
            }, 'master-product-specification')
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
          path: 'master/counter',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/counter'))
              cb(null, require('./routes/master/counter/'))
            }, 'master-counter')
          }
        }, {
          path: 'master/shift',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/shift'))
              cb(null, require('./routes/master/shift/'))
            }, 'master-shift')
          }
        }, {
          path: 'master/account',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/accountCode'))
              cb(null, require('./routes/master/accountCode/'))
            }, 'master-account')
          }
        }, {
          path: 'master/cash-type',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/cashEntryType'))
              cb(null, require('./routes/master/cashEntryType/'))
            }, 'master-cash-type')
          }
        }, {
          path: 'master/bank',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/bank'))
              cb(null, require('./routes/master/bank/'))
            }, 'master-bank')
          }
        }, {
          path: 'master/paymentoption',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/paymentOption'))
              cb(null, require('./routes/master/paymentOption/'))
            }, 'master-payment-option')
          }
        }, {
          path: 'master/car/brand',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/car'))
              cb(null, require('./routes/master/car/brand/'))
            }, 'master-car-brand')
          }
        }, {
          path: 'master/car/model',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/car'))
              cb(null, require('./routes/master/car/model/'))
            }, 'master-car-model')
          }
        }, {
          path: 'master/car/type',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/car'))
              cb(null, require('./routes/master/car/type/'))
            }, 'master-car-type')
          }
        }, {
          path: 'master/work-order/custom-fields',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/workOrder'))
              cb(null, require('./routes/master/workOrder/CustomFields/'))
            }, 'master-category-work-order')
          }
        }, {
          path: 'master/work-order/category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/workOrder'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/master/workOrder/Category/'))
            }, 'master-category-work-order')
          }
        }, {
          path: 'transaction/pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/transaction/pospromo'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/master/counter'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/marketing/promo'))
              registerModel(app, require('./models/marketing/bundling'))
              registerModel(app, require('./models/marketing/bundlingRules'))
              registerModel(app, require('./models/marketing/bundlingReward'))
              registerModel(app, require('./models/master/customerunit'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/sequence'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/master/customertype'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/misc'))
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
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/transaction/pos'))
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
          path: 'report/purchaseinvoice/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/purchaseinvoice'))
              cb(null, require('./routes/report/purchaseinvoice/'))
            }, 'transaction-purchase-invoice-summary')
          }
        }, {
          path: 'transaction/work-order',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/customerunit'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/master/customertype'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/transaction/workOrder'))
              cb(null, require('./routes/transaction/workOrder/'))
            }, 'transaction-work-order')
          }
        }, {
          path: 'report/pos/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              // registerModel(app, require('./models/report/woReport'))
              registerModel(app, require('./models/dashboard'))
              registerModel(app, require('./models/setting/cashier'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/report/pos/summary/'))
            }, 'report-pos-summary')
          }
        }, {
          path: 'chart/pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              // registerModel(app, require('./models/report/woReport'))
              registerModel(app, require('./models/dashboard'))
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/chart/pos/summary'))
            }, 'report-pos-summary')
          }
        }, {
          path: 'report/pos/service',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/report/pos/posservice'))
            }, 'report-pos-service')
          }
        }, {
          path: 'report/pos/unit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/report/pos/posserviceunit'))
            }, 'report-pos-unit')
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
              registerModel(app, require('./models/master/supplier'))
              cb(null, require('./routes/report/purchase/summary/'))
            }, 'report-purchase-summary')
          }
        }, {
          path: 'report/service/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/service'))
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/report/service/summary/'))
            }, 'report-service-summary')
          }
        }, {
          path: 'transaction/pos/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/history'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/history/'))
            }, 'transaction-pos-history')
          }
        }, {
          path: 'transaction/purchase/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/history'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/history/'))
            }, 'transaction-purchase-history')
          }
        },
        // {
        //   path: 'transaction/history',
        //   getComponent (nextState, cb) {
        //     require.ensure([], (require) => {
        //       registerModel(app, require('./models/transaction/history'))
        //       registerModel(app, require('./models/transaction/pos'))
        //       registerModel(app, require('./models/payment'))
        //       registerModel(app, require('./models/purchase'))
        //       cb(null, require('./routes/transaction/history/'))
        //     }, 'transaction-history')
        //   }
        // },
        {
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
              registerModel(app, require('./models/master/productstock'))
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
              registerModel(app, require('./models/report/inventory/transfer'))
              cb(null, require('./routes/report/inventory/transfer'))
            }, 'report-inventory-transfer')
          }
        }, {
          path: 'report/inventory/sellprice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/inventory/sellprice'))
              cb(null, require('./routes/report/inventory/sellprice'))
            }, 'report-inventory-sellprice')
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
          path: 'report/accounts/payable',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounts'))
              registerModel(app, require('./models/master/customergroup'))
              cb(null, require('./routes/report/accounts/payable'))
            }, 'report-account-summary')
          }
        }, {
          path: 'report/cashentry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/cashEntryReport'))
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/report/accounts/cashentry'))
            }, 'report-account-summary')
          }
        }, {
          path: 'report/marketing/followup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/marketingReport'))
              cb(null, require('./routes/report/marketing'))
            }, 'report-marketing-followup')
          }
        }, {
          path: 'report/marketing/promo',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/marketing/promo'))
              cb(null, require('./routes/report/marketing/promo'))
            }, 'report-marketing-promo')
          }
        }, {
          path: 'accounts/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/accounts/detail/payableDetail'))
              registerModel(app, require('./models/accounts/accountPayment'))
              cb(null, require('./routes/accounts/summary'))
            }, 'accounts-payment')
          }
        }, {
          path: 'cash-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/cashentry'))
              registerModel(app, require('./models/master/accountCode'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/master/counter'))
              registerModel(app, require('./models/transaction/pos'))
              cb(null, require('./routes/accounts/cashentry/'))
            }, 'accounts-payment')
          }
        }, {
          path: 'bank-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              registerModel(app, require('./models/master/accountCode'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/bank'))
              registerModel(app, require('./models/master/accountCode'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/supplier'))
              cb(null, require('./routes/accounts/bankentry/'))
            }, 'finance-bank-entry')
          }
        },
        {
          path: 'tools/maintenance/inventoryproduct',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/transferOut'))
              cb(null, require('./routes/tools/maintenance/'))
            }, 'tools-maintenance')
          }
        }, {
          path: 'tools/maintenance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              cb(null, require('./routes/tools/maintenance/'))
            }, 'tools-maintenance')
          }
        }, {
          path: 'tools/maintenance/posheader',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              cb(null, require('./routes/tools/maintenance/'))
            }, 'tools-maintenance-posheader')
          }
        }, {
          path: 'tools/maintenance/inventory',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/transferOut'))
              cb(null, require('./routes/tools/Inventory/'))
            }, 'tools-maintenance-inventory')
          }
        }, {
          path: 'tools/maintenance/customerunit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/customerunit'))
              cb(null, require('./routes/tools/customerunit/'))
            }, 'tools-maintenance-customerunit')
          }
        }, {
          //   path: 'tools/maintenance/beginning',
          //   getComponent (nextState, cb) {
          //     require.ensure([], (require) => {
          //       registerModel(app, require('./models/tools/maintenance'))
          //       registerModel(app, require('./models/transaction/pos'))
          //       registerModel(app, require('./models/transferOut'))
          //       cb(null, require('./routes/tools/maintenance/'))
          //     }, 'tools-maintenance')
          //   }
          // }, {
          path: 'tools/sellprice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/tools/sellprice'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/tools/sellprice'))
            }, 'tools-sellprice')
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
          path: 'setting/sequence',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/sequence'))
              cb(null, require('./routes/setting/sequence/'))
            }, 'setting-sequence')
          }
        }, {
          path: 'setting/cashier',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/cashier'))
              registerModel(app, require('./models/setting/user'))
              cb(null, require('./routes/setting/cashier/'))
            }, 'setting-cashier')
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
              registerModel(app, require('./models/transaction/pos'))
              cb(null, require('./routes/accounts/components/payment/detail/'))
            }, 'setting-payment-detail')
          }
        }, {
          path: 'accounts/payable/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/detail/payableDetail'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/supplierBank'))
              registerModel(app, require('./models/master/bank'))
              cb(null, require('./routes/accounts/components/payable/detail/'))
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
              registerModel(app, require('./models/master/customertype'))
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
          path: 'setting/store',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/master/counter'))
              registerModel(app, require('./models/master/city'))
              cb(null, require('./routes/setting/store/'))
            }, 'setting-store')
          }
        }, {
          path: 'setting/role',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/permission/permission'))
              registerModel(app, require('./models/role'))
              cb(null, require('./routes/setting/role/'))
            }, 'setting-role')
          }
        }, {
          path: 'setting/template',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/template'))
              cb(null, require('./routes/setting/template/'))
            }, 'setting-template')
          }
        }, {
          path: 'monitor/service/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/customerunit'))
              cb(null, require('./routes/monitor/service/history'))
            }, 'service-history')
          }
        }, {
          path: 'monitor/cashier/periods',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/cashier'))
              registerModel(app, require('./models/setting/store'))
              cb(null, require('./routes/monitor/cashier/periods'))
            }, 'cashier-periods')
          }
        }, {
          path: 'monitor/cashier/close',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/cashier'))
              registerModel(app, require('./models/setting/store'))
              cb(null, require('./routes/monitor/cashier/close'))
            }, 'cashier-periods-close')
          }
        }, {
          path: 'marketing/promo',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/marketing/bundling'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/service'))
              registerModel(app, require('./models/master/variant'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/specification'))
              cb(null, require('./routes/marketing/bundling'))
            }, 'marketing-bundling')
          }
        }, {
          path: 'monitor/cashier/request',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/monitor/cashier/request'))
            }, 'cashier-periods-request')
          }
        }, {
          path: 'monitor/cashier/approve',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/monitor/cashier/approve'))
            }, 'cashier-periods-approve')
          }
        }, {
          path: 'monitor/purchase',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/monitor/purchase'))
            }, 'purchase-history')
          }
        }, {
          path: 'monitor/followup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/followUp'))
              registerModel(app, require('./models/marketing/promo'))
              registerModel(app, require('./models/marketing/bundlingRules'))
              registerModel(app, require('./models/marketing/bundlingReward'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/service'))
              cb(null, require('./routes/monitor/followUp'))
            }, 'follow-up')
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
