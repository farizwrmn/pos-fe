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
          path: 'master/employee',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/contractType'))
              registerModel(app, require('./models/master/division'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/master/jobposition'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/master/employee'))
            }, 'master-employee')
          }
        }, {
          path: 'master/division',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/division'))
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/master/division'))
            }, 'master-division')
          }
        }, {
          path: 'master/contract-type',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/contractType'))
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/master/contractType'))
            }, 'master-contract-type')
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
              registerModel(app, require('./models/setting/customDataTypes'))
              registerModel(app, require('./models/setting/store'))
              cb(null, require('./routes/master/customer/customer/'))
            }, 'master-customer')
          }
        }, {
          path: 'master/customer-migration/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/loyalty/cashbackManagement'))
              cb(null, require('./routes/loyalty/cashbackManagement'))
            }, 'integration-revenue-calculator')
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
              cb(null, require('./routes/master/customer/loyaltySetting'))
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
          path: 'marketing/cms',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/cms'))
              cb(null, require('./routes/marketing/cms'))
            }, 'marketing-cms')
          }
        }, {
          path: 'marketing/target',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/target'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/marketing/target'))
            }, 'marketing-target')
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
          path: 'stock',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/planogram/planogram'))
              registerModel(app, require('./models/grab/grabCategory'))
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/storePrice/stockExtraPriceStore'))
              registerModel(app, require('./models/product/stockLocation'))
              registerModel(app, require('./models/product/productTag'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/specificationStock'))
              registerModel(app, require('./models/k3express/product/productCategory'))
              registerModel(app, require('./models/k3express/product/productBrand'))
              registerModel(app, require('./models/master/specification'))
              registerModel(app, require('./models/master/variantStock'))
              registerModel(app, require('./models/product/productcountry'))
              registerModel(app, require('./models/report/fifo'))
              registerModel(app, require('./models/master/variant'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/master/productSource'))
              registerModel(app, require('./models/master/productSubdepartment'))
              registerModel(app, require('./models/master/productDepartment'))
              registerModel(app, require('./models/master/productDivision'))
              cb(null, require('./routes/master/product/stock'))
            }, 'master-product-stock')
          }
        }, {
          path: 'stock-opname-store-account',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/stockOpname/stockOpnameStoreAccount'))
              cb(null, require('./routes/inventory/stockOpname/stockOpnameStoreAccount'))
            }, 'stock-opname-store-account')
          }
        }, {
          path: 'stock-planogram',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/planogram/planogram'))
              registerModel(app, require('./models/app'))
              registerModel(app, require('./models/grab/grabCategory'))
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/storePrice/stockExtraPriceStore'))
              registerModel(app, require('./models/product/stockLocation'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/specificationStock'))
              registerModel(app, require('./models/k3express/product/productCategory'))
              registerModel(app, require('./models/k3express/product/productBrand'))
              registerModel(app, require('./models/master/specification'))
              registerModel(app, require('./models/master/variantStock'))
              registerModel(app, require('./models/product/productcountry'))
              registerModel(app, require('./models/master/variant'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/master/productSource'))
              registerModel(app, require('./models/master/productSubdepartment'))
              registerModel(app, require('./models/master/productDepartment'))
              registerModel(app, require('./models/master/productDivision'))
              cb(null, require('./routes/master/product/planogram'))
            }, 'planogram-stock')
          }
        }, {
          path: 'picking-line',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/pickingLine/pickingLine'))
              cb(null, require('./routes/pickingLine/pickingLine'))
            }, 'picking-line')
          }
        }, {
          path: 'stock-source',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productSource'))
              cb(null, require('./routes/master/product/productSource'))
            }, 'product-source')
          }
        }, {
          path: 'stock-division',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productDivision'))
              cb(null, require('./routes/master/product/productDivision'))
            }, 'product-division')
          }
        }, {
          path: 'stock-department',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productDepartment'))
              registerModel(app, require('./models/master/productDivision'))
              cb(null, require('./routes/master/product/productDepartment'))
            }, 'product-department')
          }
        }, {
          path: 'stock-subdepartment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productSubdepartment'))
              registerModel(app, require('./models/master/productDepartment'))
              registerModel(app, require('./models/master/productDivision'))
              cb(null, require('./routes/master/product/productSubdepartment'))
            }, 'product-subdepartment')
          }
        }, {
          path: 'integration/subagro/promo',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/suba/promo'))
              cb(null, require('./routes/integration/promo'))
            }, 'suba-promo')
          }
        }, {
          path: 'integration/subagro/target-sales',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/suba/targetSales'))
              cb(null, require('./routes/integration/targetSales'))
            }, 'suba-target-sales')
          }
        }, {
          path: 'integration/subagro/sales-receivable',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/suba/salesReceivable'))
              cb(null, require('./routes/integration/salesReceivable'))
            }, 'suba-sales-receivable')
          }
        }, {
          path: 'integration/subagro/sales-receivable/import',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/suba/importSalesReceivable'))
              cb(null, require('./routes/integration/importSalesReceivable'))
            }, 'suba-sales-receivable-import')
          }
        }, {
          path: 'master/store-price',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/storePrice/stockExtraPriceStore'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/storePrice/stockExtraPriceStore'))
            }, 'store-price')
          }
        }, {
          path: 'master/store-price-upload',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/storePrice/stockPriceUpload'))
              cb(null, require('./routes/storePrice/stockPriceUpload'))
            }, 'store-price-upload')
          }
        }, {
          path: 'master/product/stock/import',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/importstock'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/master/product/import/'))
            }, 'master-product-stock-import')
          }
        }, {
          path: 'master/product/sticker',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/master/product/printSticker'))
            }, 'master-product-sticker')
          }
        }, {
          path: 'stock-tag',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/product/productTag'))
              cb(null, require('./routes/product/productTag'))
            }, 'product-tag')
          }
        }, {
          path: 'stock-tag-schedule',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/product/productTag'))
              registerModel(app, require('./models/product/productTagSchedule'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/product/productTagSchedule'))
            }, 'product-tag-schedule')
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
          path: 'master/product/bookmark',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/product/bookmark'))
              registerModel(app, require('./models/product/bookmarkGroup'))
              cb(null, require('./routes/master/product/bookmark/'))
            }, 'master-product-bookmark')
          }
        }, {
          path: 'master/product/bookmark/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pospromo'))
              registerModel(app, require('./models/marketing/bundlingReward'))
              registerModel(app, require('./models/marketing/bundlingRules'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/marketing/promo'))
              registerModel(app, require('./models/marketing/bundling'))
              registerModel(app, require('./models/detail/productBookmarkDetail'))
              registerModel(app, require('./models/product/bookmark'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/master/product/bookmark/detail/'))
            }, 'master-product-bookmark-detail')
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
          path: 'stock-uom',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/product/productUom'))
              cb(null, require('./routes/master/productUom'))
            }, 'stock-uom')
          }
        }, {
          path: 'master/product/location',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/product/stockLocation'))
              cb(null, require('./routes/product/stockLocation'))
            }, 'master-product-location')
          }
        }, {
          path: 'master/account',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/setting/userRole'))
              registerModel(app, require('./models/misc'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/master/accountCode'))
              registerModel(app, require('./models/master/accountCodeDefault'))
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
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/master/paymentOption'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/master/paymentOption/store'))
              cb(null, require('./routes/master/paymentOption/'))
            }, 'master-payment-option')
          }
        }, {
          path: 'master/paymentoption/edc/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/master/paymentOption/edc'))
              registerModel(app, require('./models/payment/paymentOpts'))
              cb(null, require('./routes/master/paymentOption/edc/'))
            }, 'master-payment-option-edc')
          }
        }, {
          path: 'master/paymentoption/cost/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/paymentOption/cost'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/bank'))
              cb(null, require('./routes/master/paymentOption/cost/'))
            }, 'master-payment-option-cost')
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
          path: 'balance/master/physical-money',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setoran/physicalMoney'))
              cb(null, require('./routes/setoran/physicalMoney'))
            }, 'physical-money')
          }
        }, {
          path: 'balance/dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/balance/balance'))
              registerModel(app, require('./models/balance/balanceDetail'))
              registerModel(app, require('./models/dashboard'))
              registerModel(app, require('./models/app'))
              registerModel(app, require('./models/payment/paymentOpts'))
              cb(null, require('./routes/balance/dashboard/'))
            }, 'balance-dashboard')
          }
        }, {
          path: 'balance/current',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/balance/balance'))
              registerModel(app, require('./models/balance/balanceDetail'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/payment/paymentOpts'))
              cb(null, require('./routes/balance/balance'))
            }, 'balance-current')
          }
        }, {
          path: 'balance/closing',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/balance/balance'))
              registerModel(app, require('./models/balance/balanceDetail'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/detail/user'))
              registerModel(app, require('./models/setoran/physicalMoneyDeposit'))
              registerModel(app, require('./models/setoran/physicalMoney'))
              registerModel(app, require('./models/setoran/posSetoran'))
              cb(null, require('./routes/balance/closing'))
            }, 'balance-closing')
          }
        }, {
          path: 'balance/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/balance/balance'))
              registerModel(app, require('./models/balance/balanceDetail'))
              registerModel(app, require('./models/payment/paymentOpts'))
              cb(null, require('./routes/balance/history/'))
            }, 'balance-history')
          }
        }, {
          path: 'balance/invoice/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setoran/physicalMoneyDeposit'))
              registerModel(app, require('./models/setoran/posSetoran'))
              registerModel(app, require('./models/detail/user'))
              registerModel(app, require('./models/balance/balance'))
              registerModel(app, require('./models/balance/balanceDetail'))
              registerModel(app, require('./models/master/shift'))
              registerModel(app, require('./models/payment/paymentOpts'))
              cb(null, require('./routes/balance/invoice'))
            }, 'balance-invoice-detail')
          }
        }, {
          path: 'sales-discount',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/notification/salesDiscount'))
              cb(null, require('./routes/notification/salesDiscount'))
            }, 'sales-discount')
          }
        }, {
          path: 'request-cancel-pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/notification/requestCancelPos'))
              cb(null, require('./routes/notification/requestCancelPos'))
            }, 'request-cancel-pos')
          }
        }, {
          path: 'return-request',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/notification/returnSales'))
              cb(null, require('./routes/notification/returnSales/'))
            }, 'return-request')
          }
        }, {
          path: 'marketing/incentive-item',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/marketing/incentiveItem'))
              cb(null, require('./routes/marketing/incentiveItem'))
            }, 'marketing-incentive-item')
          }
        },
        {
          path: 'marketing/incentive-member',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/marketing/incentiveMember'))
              cb(null, require('./routes/marketing/incentiveMember'))
            }, 'marketing-incentive-member')
          }
        }, {
          path: 'standard-recipe',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/repacking/standardRecipe'))
              cb(null, require('./routes/repacking/standardRecipe'))
            }, 'repacking-standard-recipe')
          }
        }, {
          path: 'repacking-spk',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/repacking/repackingSpk'))
              cb(null, require('./routes/repacking/repackingSpk'))
            }, 'repacking-spk')
          }
        }, {
          path: 'repacking-spk/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/repacking/repackingSpk'))
              cb(null, require('./routes/repacking/repackingSpk/detail'))
            }, 'repacking-spk-detail')
          }
        }, {
          path: 'repacking-task-list',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/repacking/repackingTaskList'))
              cb(null, require('./routes/repacking/repackingTaskList'))
            }, 'repacking-task-list')
          }
        }, {
          path: 'repacking-task-list/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/repacking/repackingTaskList'))
              cb(null, require('./routes/repacking/repackingTaskList/detail'))
            }, 'repacking-task-list-detail')
          }
        }, {
          path: 'transaction/pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/incentiveAchievement'))
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
        },
        {
          path: 'transaction/pos/customer-view',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              cb(null, require('./routes/transaction/customer-view/'))
            }, 'transaction-pos-customer')
          }
        }, {
          path: 'transaction/pos/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/paymentOption/cost'))
              registerModel(app, require('./models/master/paymentOption/edc'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/transaction/pos/payment/'))
            }, 'transaction-pos-payment')
          }
        }, {
          path: 'transaction/procurement/price',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/product/productUom'))
              registerModel(app, require('./models/procurement/purchasePrice'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/procurement/purchasePrice'))
            }, 'transaction-procurement-price')
          }
        }, {
          path: 'transaction/procurement/order',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/procurement/importPurchaseOrder'))
              registerModel(app, require('./models/procurement/purchaseSafetyStock'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/procurement/purchaseOrder'))
              cb(null, require('./routes/procurement/purchaseOrder/main'))
            }, 'transaction-procurement-order')
          }
        }, {
          path: 'transaction/procurement/order-history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/procurement/purchaseOrder'))
              cb(null, require('./routes/procurement/purchaseOrder/history'))
            }, 'transaction-procurement-order-history')
          }
        }, {
          path: 'transaction/procurement/order/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseOrder'))
              cb(null, require('./routes/procurement/purchaseOrder/detail'))
            }, 'transaction-procurement-order-detail')
          }
        }, {
          path: 'transaction/procurement/requisition',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseRequisition'))
              registerModel(app, require('./models/procurement/purchaseSafetyStock'))
              cb(null, require('./routes/procurement/purchaseRequisition/main'))
            }, 'transaction-procurement-requisition')
          }
        }, {
          path: 'transaction/procurement/requisition/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseRequisition'))
              cb(null, require('./routes/procurement/purchaseRequisition/detail'))
            }, 'transaction-procurement-requisition-detail')
          }
        }, {
          path: 'transaction/procurement/invoice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseInvoice'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/procurement/purchaseInvoice/main'))
            }, 'transaction-procurement-invoice')
          }
        }, {
          path: 'transaction/procurement/invoice/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseInvoice'))
              cb(null, require('./routes/procurement/purchaseInvoice/detail'))
            }, 'transaction-procurement-invoice-detail')
          }
        }, {
          path: 'transaction/procurement/quotation',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseQuotation'))
              cb(null, require('./routes/procurement/purchaseQuotation/main'))
            }, 'transaction-procurement-quotation')
          }
        }, {
          path: 'transaction/procurement/quotation/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseQuotation'))
              cb(null, require('./routes/procurement/purchaseQuotation/detail'))
            }, 'transaction-procurement-quotation-detail')
          }
        }, {
          path: 'transaction/procurement/receive',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseReceive'))
              cb(null, require('./routes/procurement/purchaseReceive/main'))
            }, 'transaction-procurement-receive')
          }
        }, {
          path: 'transaction/procurement/receive/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseReceive'))
              cb(null, require('./routes/procurement/purchaseReceive/detail'))
            }, 'transaction-procurement-receive-detail')
          }
        }, {
          path: 'transaction/procurement/safety',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseSafetyStock'))
              cb(null, require('./routes/procurement/purchaseSafetyStock/main'))
            }, 'transaction-procurement-safety-stock')
          }
        }, {
          path: 'transaction/procurement/safety/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/procurement/purchaseSafetyStock'))
              cb(null, require('./routes/procurement/purchaseSafetyStock/detail'))
            }, 'transaction-procurement-safety-stock-detail')
          }
        }, {
          path: 'transaction/purchase/add',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase'))
            }, 'transaction-purchase-add')
          }
        }, {
          path: 'transaction/purchase/edit',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/purchase/edit'))
            }, 'transaction-purchase-add')
          }
        }, {
          path: 'transaction/purchase/return',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/return/returnPurchase'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/return/returnPurchase'))
            }, 'transaction-return-purchase')
          }
        }, {
          path: 'transaction/purchase/return/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/return/returnPurchase'))
              registerModel(app, require('./models/return/returnPurchaseDetail'))
              cb(null, require('./routes/return/returnPurchase/detail'))
            }, 'transaction-return-purchase-detail')
          }
        }, {
          path: 'transaction/adjust',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/adjustNew'))
              registerModel(app, require('./models/inventory/adjust'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/transaction/adjust'))
            }, 'transaction-adjust')
          }
        }, {
          path: 'transaction/adjust/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/adjustDetail'))
              cb(null, require('./routes/transaction/adjust/detail'))
            }, 'transaction-adjust-detail')
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
          path: 'report/accounting/general-ledger',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/ledger/generalLedger'))
              registerModel(app, require('./models/master/accountCode'))
              cb(null, require('./routes/report/accounting/ledger/generalLedger'))
            }, 'report-accounting-general-ledger')
          }
        }, {
          path: 'report/accounting/consolidation/general-ledger',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/ledger/generalLedger'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/report/accounting/ledger/generalLedger'))
            }, 'report-accounting-general-ledger-consolidation')
          }
        }, {
          path: 'report/accounting/consolidation/trial-balance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/ledger/generalLedger'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounting/ledger/trialBalance/'))
            }, 'report-accounting-trial-balance')
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
              registerModel(app, require('./models/marketing/customerSocial'))
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
              registerModel(app, require('./models/report/woReport'))
              registerModel(app, require('./models/dashboard'))
              registerModel(app, require('./models/setting/cashier'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/report/pos/summary/'))
            }, 'report-pos-summary')
          }
        },
        {
          path: 'report/pos/daily',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              cb(null, require('./routes/report/pos/daily/'))
            }, 'report-pos-daily')
          }
        }, {
          path: 'chart/pos',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              registerModel(app, require('./models/report/woReport'))
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
          path: 'report/pos/work-order',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/pos'))
              registerModel(app, require('./models/setting/cashier'))
              cb(null, require('./routes/report/pos/work-order'))
            }, 'report-pos-work-order')
          }
        }, {
          path: 'report/purchase/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/purchase'))
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/purchase/summary'))
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
              registerModel(app, require('./models/login'))
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/notification/salesDiscount'))
              registerModel(app, require('./models/notification/requestCancelPos'))
              cb(null, require('./routes/transaction/history/'))
            }, 'transaction-pos-history')
          }
        }, {
          path: 'transaction/pos/admin-invoice/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/transaction/posInvoice'))
              cb(null, require('./routes/transaction/invoice/'))
            }, 'transaction-pos-invoice-admin-print')
          }
        }, {
          path: 'transaction/pos/invoice/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/transaction/posInvoice'))
              cb(null, require('./routes/transaction/invoice/'))
            }, 'transaction-pos-invoice-print')
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
        {
          path: 'transaction/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/history'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/purchase'))
              cb(null, require('./routes/transaction/history/'))
            }, 'transaction-history')
          }
        },
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
            }, 'report-adjust-in')
          }
        }, {
          path: 'report/adjust/out',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/out/'))
            }, 'report-adjust-out')
          }
        }, {
          path: 'report/adjust/sales',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/sales/'))
            }, 'report-adjust-sales')
          }
        }, {
          path: 'report/adjust/purchase',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/adjust'))
              cb(null, require('./routes/report/adjustment/purchase/'))
            }, 'report-adjust-purchase')
          }
        }, {
          path: 'report/fifo/summary',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/fifo'))
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/product/productCost'))
              registerModel(app, require('./models/setting/store'))
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
              cb(null, require('./routes/report/fifo/stockcard'))
            }, 'report-stock-summary-card')
          }
        }, {
          path: 'report/fifo/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/fifo'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/report/fifo/stockhistory'))
            }, 'report-purchase-summary-history')
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
          path: 'report/pos/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/report/posPayment'))
              registerModel(app, require('./models/return/returnSalesDetail'))
              cb(null, require('./routes/report/pos/payment'))
            }, 'report-pos-payment')
          }
        }, {
          path: 'report/accounting/profit-loss',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/accountingStatement'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounting/statement'))
            }, 'report-accounting-profit-loss')
          }
        }, {
          path: 'report/accounting/balance-sheet',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/accountingStatement'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounting/statement'))
            }, 'report-accounting-balance-sheet')
          }
        }, {
          path: 'report/accounting/statement/balance-sheet',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/accountingStatementBalanceSheet'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounting/balance-sheet'))
            }, 'report-accounting-statement-balance-sheet')
          }
        }, {
          path: 'report/accounting/statement/profit-loss',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/accountingStatementProfitLoss'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounting/profit-loss'))
            }, 'report-accounting-statement-profit-loss')
          }
        }, {
          path: 'report/accounting/tax-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/taxReport'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounting/taxReport'))
            }, 'report-accounting-tax-report')
          }
        }, {
          path: 'report/accounting/cash-flow',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounting/accountingStatement'))
              cb(null, require('./routes/report/accounting/statement'))
            }, 'report-accounting-cash-flow')
          }
        }, {
          path: 'report/accounts/payment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accounts'))
              registerModel(app, require('./models/master/customergroup'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/report/accounts/summary'))
            }, 'report-account-summary')
          }
        }, {
          path: 'report/accounts/payable',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/accountPayableReport'))
              cb(null, require('./routes/report/accounts/payable'))
            }, 'report-account-payable')
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
          path: 'marketing/advertising',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/advertising'))
              cb(null, require('./routes/marketing/advertising'))
            }, 'marketing-advertising')
          }
        }, {
          path: 'report/marketing/target',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/report/marketingReport'))
              cb(null, require('./routes/report/marketing/target'))
            }, 'report-marketing-target')
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
          path: 'report/hris/employee-checkin',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/master/jobposition'))
              registerModel(app, require('./models/master/city'))
              registerModel(app, require('./models/misc'))
              cb(null, require('./routes/report/hris'))
            }, 'report-employee-checkin')
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
              cb(null, require('./routes/accounts/payment'))
            }, 'accounts-payment')
          }
        }, {
          path: 'accounts/payable',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/unit'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/accounts/detail/payableDetail'))
              registerModel(app, require('./models/accounts/accountPayment'))
              cb(null, require('./routes/accounts/payable'))
            }, 'accounts-payable')
          }
        }, {
          path: 'accounts/payable-form',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/paymentOption/edc'))
              registerModel(app, require('./models/accounts/payableForm'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/bank'))
              registerModel(app, require('./models/purchase'))
              registerModel(app, require('./models/finance/pettyExpense'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/return/returnPurchase'))
              cb(null, require('./routes/accounts/payableform'))
            }, 'accounts-payable-form')
          }
        }, {
          path: 'accounts/payable-form/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/payableForm'))
              cb(null, require('./routes/accounts/payableform/detail'))
            }, 'accounts-payable-form-detail')
          }
        }, {
          path: 'master/product/country',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/product/productcountry'))
              cb(null, require('./routes/product/productcountry'))
            }, 'master-product-country')
          }
        }, {
          path: 'inventory/transfer/invoice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transfer/transferInvoice'))
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/transfer/transferInvoice'))
            }, 'inventory-transfer-invoice')
          }
        }, {
          path: 'inventory/transfer/invoice/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transfer/transferInvoice'))
              cb(null, require('./routes/transfer/transferInvoice/detail'))
            }, 'inventory-transfer-invoice-detail')
          }
        }, {
          path: 'cash-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/cashentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/marketing/customerSocial'))
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/transaction/pos'))
              cb(null, require('./routes/accounts/cashentry/'))
            }, 'accounts-cash-entry')
          }
        }, {
          path: 'integration/consignment/rent-request',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/rentRequest'))
              cb(null, require('./routes/consignment/rentRequest'))
            }, 'consignment/rent/rent-request')
          }
        }, {
          path: 'integration/consignment/dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/dashboard'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/dashboard'))
            }, 'consignment/dashboard')
          }
        }, {
          path: 'integration/consignment/sales-return',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/salesReturn'))
              cb(null, require('./routes/consignment/salesReturn'))
            }, 'consignment/salesReturn')
          }
        }, {
          path: 'integration/consignment/stock-flow',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/stockFlow'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/stockFlow'))
            }, 'consignment/stockFlow')
          }
        }, {
          path: 'integration/consignment/stock-flow/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/stockFlow'))
              cb(null, require('./routes/consignment/stockFlow/detail'))
            }, 'consignment/stockFlowDetail')
          }
        }, {
          path: 'integration/consignment/stock-adjustment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/stockAdjustment'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/stockAdjustment'))
            }, 'consignment/stockAdjustment')
          }
        }, {
          path: 'integration/consignment/users',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/users'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/users'))
            }, 'consignment/users')
          }
        }, {
          path: 'integration/consignment/vendor',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/vendor'))
              registerModel(app, require('./models/consignment/outlet'))
              registerModel(app, require('./models/consignment/category'))
              registerModel(app, require('./models/consignment/vendorCommission'))
              cb(null, require('./routes/consignment/vendor'))
            }, 'consignment/vendor')
          }
        }, {
          path: 'integration/consignment/pending-product',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/pendingProduct'))
              cb(null, require('./routes/consignment/product/pendingProduct'))
            }, 'consignment/pendingProduct')
          }
        }, {
          path: 'integration/consignment/product',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/product'))
              cb(null, require('./routes/consignment/product/product'))
            }, 'consignment/product')
          }
        }, {
          path: 'integration/consignment/product',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/product'))
              registerModel(app, require('./models/consignment/category'))
              cb(null, require('./routes/consignment/product/product'))
            }, 'consignment/product')
          }
        }, {
          path: 'integration/consignment/product/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/product'))
              registerModel(app, require('./models/consignment/category'))
              cb(null, require('./routes/consignment/product/product/detail'))
            }, 'consignment/productDetail')
          }
        }, {
          path: 'integration/consignment/product-category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/category'))
              cb(null, require('./routes/consignment/product/category'))
            }, 'consignment/productCategory')
          }
        }, {
          path: 'integration/consignment/outlet',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/outlet'))
            }, 'consignment/outlet')
          }
        }, {
          path: 'integration/consignment/payments',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/payments'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/payments'))
            }, 'consignment/payments')
          }
        }, {
          path: 'integration/consignment/stock-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/stockReport'))
              registerModel(app, require('./models/consignment/vendor'))
              cb(null, require('./routes/consignment/report/stockReport'))
            }, 'consignment/report/stockReport')
          }
        }, {
          path: 'integration/consignment/stock-flow-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/stockFlowReport'))
              cb(null, require('./routes/consignment/report/stockFlowReport'))
            }, 'consignment/report/stockFlowReport')
          }
        }, {
          path: 'integration/consignment/sales-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/salesReport'))
              cb(null, require('./routes/consignment/report/salesReport'))
            }, 'consignment/report/salesReport')
          }
        }, {
          path: 'integration/consignment/return-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/returnReport'))
              registerModel(app, require('./models/consignment/vendor'))
              cb(null, require('./routes/consignment/report/returnReport'))
            }, 'consignment/report/returnReport')
          }
        }, {
          path: 'integration/consignment/cut-off-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/cutOffReport'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/report/cutOffReport'))
            }, 'consignment/report/cutOffReport')
          }
        }, {
          path: 'integration/consignment/cut-off-period-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/cutOffPeriodReport'))
              cb(null, require('./routes/consignment/report/cutOffPeriodReport'))
            }, 'consignment/report/cutOffPeriodReport')
          }
        }, {
          path: 'integration/consignment/journal-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/journalReport'))
              registerModel(app, require('./models/consignment/outlet'))
              cb(null, require('./routes/consignment/report/journalReport'))
            }, 'consignment/report/journalReport')
          }
        }, {
          path: 'integration/consignment/rent-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/rentReport'))
              cb(null, require('./routes/consignment/report/rentReport'))
            }, 'consignment/report/rentReport')
          }
        }, {
          path: 'integration/consignment/profit-report',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/profitReport'))
              registerModel(app, require('./models/consignment/vendor'))
              cb(null, require('./routes/consignment/report/profitReport'))
            }, 'consignment/report/profitReport')
          }
        }, {
          path: 'integration/consignment/rent-request/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/consignment/rentRequest'))
              cb(null, require('./routes/consignment/rentRequest/detail'))
            }, 'consignment/rent/rent-request-detail')
          }
        }, {
          path: 'k3express/product-brand',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/k3express/product/productBrand'))
              cb(null, require('./routes/k3express/product/productBrand'))
            }, 'k3express/product/k3expressbrand')
          }
        }, {
          path: 'k3express/product-category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/k3express/product/productCategory'))
              cb(null, require('./routes/k3express/product/productCategory'))
            }, 'k3express/product/k3expresscategory')
          }
        }, {
          path: 'k3express/product-consignment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/k3express/product/productConsignment'))
              registerModel(app, require('./models/k3express/product/productCategory'))
              registerModel(app, require('./models/k3express/product/productBrand'))
              cb(null, require('./routes/k3express/product/productConsignment'))
            }, 'k3express/product/k3expressconsignment')
          }
        }, {
          path: 'k3express/kiosk-category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/k3express/kiosk/kioskCategory'))
              cb(null, require('./routes/k3express/kiosk/kioskCategory'))
            }, 'k3express/kiosk/kioskCategory')
          }
        }, {
          path: 'k3express/kiosk-product',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/k3express/kiosk/kioskProduct'))
              cb(null, require('./routes/k3express/kiosk/kioskProduct'))
            }, 'k3express/kiosk/kioskProduct')
          }
        }, {
          path: 'k3express/kiosk-product-properties',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/k3express/kiosk/kioskProductProperties'))
              cb(null, require('./routes/k3express/kiosk/kioskProductProperties'))
            }, 'k3express/kiosk/kioskProductProperties')
          }
        }, {
          path: 'cash-entry/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/cashentry'))
              cb(null, require('./routes/accounts/cashentry/detail'))
            }, 'accounts-cash-entry-detail')
          }
        }, {
          path: 'bank-entry/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              cb(null, require('./routes/accounts/bankentry/detail'))
            }, 'accounts-bank-entry-detail')
          }
        }, {
          path: 'journal-entry/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/journalentry'))
              cb(null, require('./routes/accounts/journalentry/detail'))
            }, 'accounts-journal-entry-detail')
          }
        }, {
          path: 'stock-opname',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/inventory/stockOpname'))
              cb(null, require('./routes/inventory/stockOpname/stockOpname'))
            }, 'stock-opname')
          }
        }, {
          path: 'stock-opname/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/stockOpname'))
              cb(null, require('./routes/inventory/stockOpname/stockOpnameDetail'))
            }, 'stock-opname-detail')
          }
        }, {
          path: 'stock-opname-partial',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/inventory/stockOpname'))
              cb(null, require('./routes/inventory/stockOpname/stockOpname'))
            }, 'stock-opname-partial')
          }
        }, {
          path: 'stock-opname-partial/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/stockOpname'))
              cb(null, require('./routes/inventory/stockOpname/stockOpnameDetail'))
            }, 'stock-opname-partial-detail')
          }
        }, {
          path: 'return-to-dc',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transfer/returnToDc'))
              cb(null, require('./routes/transfer/returnToDc'))
            }, 'return-to-dc')
          }
        }, {
          path: 'journal-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/journalentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/marketing/customerSocial'))
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/transaction/pos'))
              cb(null, require('./routes/accounts/journalentry/'))
            }, 'accounts-journal-entry')
          }
        }, {
          path: 'bank-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/bank'))
              registerModel(app, require('./models/master/customer'))
              registerModel(app, require('./models/master/supplier'))
              cb(null, require('./routes/accounts/bankentry/'))
            }, 'finance-bank-entry')
          }
        }, {
          path: 'transfer-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/accounts/transferentry/'))
            }, 'finance-transfer-entry')
          }
        }, {
          path: 'auto-recon',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              registerModel(app, require('./models/accounts/autorecon'))
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/setting/store'))
              registerModel(app, require('./models/master/bank'))
              cb(null, require('./routes/accounts/autorecon'))
            }, 'finance-bank-auto-recon')
          }
        }, {
          path: 'auto-recon/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/autorecon'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/accounts/autorecon/Detail'))
            }, 'finance-bank-auto-recon-detail')
          }
        }, {
          path: 'bank-recon',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/accounts/bankrecon'))
            }, 'finance-bank-recon')
          }
        }, {
          path: 'accounting-overview',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/accountingOverview'))
              cb(null, require('./routes/accounts/accountingOverview'))
            }, 'accounting-overview-report')
          }
        }, {
          path: 'accounting/bca-recon',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/importBcaRecon'))
              cb(null, require('./routes/accounts/bcaRecon'))
            }, 'bca-recon')
          }
        }, {
          path: 'accounting/bca-recon-import',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/importBcaRecon'))
              cb(null, require('./routes/accounts/bcaReconImport'))
            }, 'bca-recon-import')
          }
        }, {
          path: 'accounting/xendit-recon',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/xenditRecon'))
              cb(null, require('./routes/accounts/xenditRecon'))
            }, 'xendit-recon')
          }
        }, {
          path: 'accounting/xendit-recon/detail/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/xenditRecon'))
              cb(null, require('./routes/accounts/xenditRecon/detail'))
            }, 'xendit-recon-detail')
          }
        }, {
          path: 'bank-history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/bankentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/accounts/bankhistory/'))
            }, 'finance-bank-history')
          }
        }, {
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
          path: 'tools/maintenance/health-checkup',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/healthcheckup'))
              cb(null, require('./routes/tools/health-checkup/'))
            }, 'tools-maintenance-health-checkup')
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
              registerModel(app, require('./models/marketing/customerSocial'))
              registerModel(app, require('./models/master/customerunit'))
              cb(null, require('./routes/tools/customerunit/'))
            }, 'tools-maintenance-customerunit')
          }
        }, {
          path: 'tools/maintenance/beginning',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/tools/maintenance'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/transferOut'))
              cb(null, require('./routes/tools/maintenance/'))
            }, 'tools-maintenance')
          }
        }, {
          path: 'tools/sellprice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/tools/sellprice'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/productcategory'))
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
              cb(null, require('./routes/setting/user'))
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
              registerModel(app, require('./models/master/paymentOption/cost'))
              registerModel(app, require('./models/master/paymentOption/edc'))
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
              registerModel(app, require('./models/master/paymentOption/cost'))
              registerModel(app, require('./models/master/paymentOption/edc'))
              registerModel(app, require('./models/master/supplierBank'))
              registerModel(app, require('./models/master/bank'))
              cb(null, require('./routes/accounts/components/payable/detail/'))
            }, 'setting-payable-detail')
          }
        }, {
          path: 'inventory/transfer/in',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transaction/fingerEmployee'))
              registerModel(app, require('./models/transferIn'))
              registerModel(app, require('./models/master/employee'))
              registerModel(app, require('./models/master/productstock'))
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
          path: 'delivery-order',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/deliveryOrder/deliveryOrder'))
              cb(null, require('./routes/deliveryOrder/deliveryOrder'))
            }, 'inventory-delivery-order')
          }
        }, {
          path: 'delivery-order-detail/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/payment'))
              registerModel(app, require('./models/deliveryOrder/deliveryOrder'))
              cb(null, require('./routes/deliveryOrder/deliveryOrder/detail'))
            }, 'inventory-delivery-order-detail')
          }
        }, {
          path: 'do',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/deliveryOrder/deliveryOrderList'))
              cb(null, require('./routes/deliveryOrder/deliveryOrderList'))
            }, 'inventory-delivery-order-list')
          }
        }, {
          path: 'inventory/transfer/out',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/importTransferOut'))
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/transaction/pos'))
              registerModel(app, require('./models/product/stockLocation'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/employee'))
              cb(null, require('./routes/inventory/transfer/out'))
            }, 'inventory-transfer-out')
          }
        }, {
          path: 'inventory/transfer/out/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/detail/out'))
              registerModel(app, require('./models/transferOut'))
              cb(null, require('./routes/inventory/transfer/out/detail'))
            }, 'inventory-transfer-out-detail')
          }
        }, {
          path: 'delivery-order-packer/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/inventory/detail/out'))
              registerModel(app, require('./models/deliveryOrder/deliveryOrderPacker'))
              registerModel(app, require('./models/deliveryOrder/deliveryOrder'))
              cb(null, require('./routes/deliveryOrder/deliveryOrderPacker'))
            }, 'inventory-delivery-order-packer')
          }
        }, {
          path: 'inventory/transfer/auto-replenish-submission',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transfer/autoReplenishSubmission'))
              cb(null, require('./routes/inventory/transfer/autoReplenishSubmission'))
            }, 'inventory-transfer-out-submission')
          }
        }, {
          path: 'inventory/transfer/auto-replenish-submission/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/deliveryOrder/deliveryOrder'))
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/transfer/autoReplenishSubmission'))
              cb(null, require('./routes/inventory/transfer/autoReplenishDetail'))
            }, 'inventory-transfer-out-transfer')
          }
        }, {
          path: 'inventory/transfer/out-import',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/importTransferOut'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/inventory/transfer/importTransferOut'))
            }, 'inventory-transfer-out-import')
          }
        }, {
          path: 'inventory/transfer/auto-replenish',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/transfer/autoReplenish'))
              registerModel(app, require('./models/transferOut'))
              cb(null, require('./routes/inventory/transfer/autoReplenish'))
            }, 'inventory-transfer-out-auto-replenish')
          }
        }, {
          path: 'inventory/transfer/auto-replenish-import',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/importAutoReplenishBuffer'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/transferOut'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/productcategory'))
              cb(null, require('./routes/inventory/transfer/importAutoReplenishBuffer'))
            }, 'inventory-transfer-out-auto-replenish-import')
          }
        }, {
          path: 'integration/grabmart-compliance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/grab/grabConsignment'))
              registerModel(app, require('./models/grab/grabCategory'))
              cb(null, require('./routes/integration/grabConsignment'))
            }, 'consignment-compliance')
          }
        }, {
          path: 'transaction/return-sales',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/return/returnSales'))
              registerModel(app, require('./models/transaction/pos'))
              cb(null, require('./routes/return/returnSales'))
            }, 'transaction-return-sales')
          }
        }, {
          path: 'transaction/return-sales/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/return/returnSales'))
              cb(null, require('./routes/return/returnSales/detail'))
            }, 'transaction-return-sales-detail')
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
          path: 'integration/grabmart-campaign',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/integration/grabmartCampaign'))
              cb(null, require('./routes/integration/grabmartCampaign'))
            }, 'integration-grabmart-campaign')
          }
        }, {
          path: 'integration/grabmart-campaign/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/integration/grabmartCampaign'))
              cb(null, require('./routes/integration/grabmartCampaign/detail'))
            }, 'integration-grabmart-campaign-detail')
          }
        }, {
          path: 'setting/periods',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/period'))
              cb(null, require('./routes/setting/periode'))
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
              registerModel(app, require('./models/marketing/customerSocial'))
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
              registerModel(app, require('./models/grab/grabCategory'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/marketing/bundling'))
              registerModel(app, require('./models/marketing/bundlingCategory'))
              registerModel(app, require('./models/master/productstock'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              registerModel(app, require('./models/master/service'))
              registerModel(app, require('./models/master/variant'))
              registerModel(app, require('./models/payment/paymentOpts'))
              registerModel(app, require('./models/master/bank'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/specification'))
              cb(null, require('./routes/marketing/bundling'))
            }, 'marketing-bundling')
          }
        }, {
          path: 'marketing/promo-category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/bundlingCategory'))
              cb(null, require('./routes/marketing/bundlingCategory'))
            }, 'marketing-bundling-category')
          }
        }, {
          path: 'marketing/voucher',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/marketing/voucher'))
              cb(null, require('./routes/marketing/voucher'))
            }, 'marketing-voucher')
          }
        }, {
          path: 'tools/transaction/sales',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/sales'))
              registerModel(app, require('./models/taxReport/salesDetail'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/taxReport/sales'))
            }, 'tax-report-sales')
          }
        }, {
          path: 'tools/transaction/purchase',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/purchase'))
              registerModel(app, require('./models/master/supplier'))
              registerModel(app, require('./models/taxReport/purchaseDetail'))
              registerModel(app, require('./models/master/productcategory'))
              registerModel(app, require('./models/master/productbrand'))
              cb(null, require('./routes/taxReport/purchase'))
            }, 'tax-report-purchase')
          }
        }, {
          path: 'tools/transaction/maintenance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/maintenance'))
              cb(null, require('./routes/taxReport/maintenance'))
            }, 'tax-report-maintenance')
          }
        }, {
          path: 'tools/report/profit-loss',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/accountingStatement'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/taxReport/statement'))
            }, 'tax-report-accounting-profit-loss')
          }
        }, {
          path: 'tools/report/balance-sheet',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/accountingStatement'))
              registerModel(app, require('./models/setting/userStore'))
              cb(null, require('./routes/taxReport/statement'))
            }, 'tax-report-accounting-balance-sheet')
          }
        }, {
          path: 'tools/report/general-ledger',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/generalLedger'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/taxReport/generalLedger'))
            }, 'tax-report-accounting-general-ledger-consolidation')
          }
        }, {
          path: 'tools/report/trial-balance',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/generalLedger'))
              cb(null, require('./routes/taxReport/trialBalance'))
            }, 'tax-report-accounting-trial-balance')
          }
        }, {
          path: 'tools/transaction/journal-entry/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/journalentry'))
              cb(null, require('./routes/taxReport/journalentry/detail'))
            }, 'tools-transaction-journal-entry-detail')
          }
        }, {
          path: 'tools/transaction/journal-entry',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/taxReport/journalentry'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/taxReport/journalentry'))
            }, 'tools-transaction-journal-entry')
          }
        }, {
          path: 'balance/finance/petty-cash',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/finance/pettyCash'))
              cb(null, require('./routes/finance/pettyCash'))
            }, 'finance-petty-cash')
          }
        }, {
          path: 'balance/finance/petty-cash/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/finance/pettyCashDetail'))
              cb(null, require('./routes/finance/pettyCash/detail'))
            }, 'finance-petty-cash-detail')
          }
        }, {
          path: 'balance/finance/petty-expense',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/accounts/accountRule'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/finance/pettyCashDetail'))
              registerModel(app, require('./models/finance/pettyExpense'))
              cb(null, require('./routes/finance/pettyExpense'))
            }, 'finance-petty-expense')
          }
        }, {
          path: 'balance/finance/history',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/finance/pettyHistory'))
              registerModel(app, require('./models/setting/userStore'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/finance/pettyHistory'))
            }, 'finance-history')
          }
        }, {
          path: 'marketing/voucher/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketing/voucherdetail'))
              registerModel(app, require('./models/accounts/accountRule'))
              cb(null, require('./routes/marketing/voucher/detail'))
            }, 'marketing-voucher-detail')
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
          path: 'integration/member',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/integration/member'))
            }, 'integration-member')
          }
        }, {
          path: 'integration/consignment',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/integration/consignment'))
            }, 'integration-consignment')
          }
        }, {
          path: 'integration/marketplace',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketplace/marketplace'))
              registerModel(app, require('./models/marketplace/marketplaceGroup'))
              cb(null, require('./routes/marketplace/marketplace'))
            }, 'integration-marketplace')
          }
        }, {
          path: 'integration/marketplace-group',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketplace/marketplaceGroup'))
              cb(null, require('./routes/marketplace/marketplaceGroup'))
            }, 'integration-marketplace-group')
          }
        }, {
          path: 'integration/marketplace-product',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/marketplace/marketplaceProduct'))
              registerModel(app, require('./models/marketplace/marketplace'))
              registerModel(app, require('./models/master/productstock'))
              cb(null, require('./routes/marketplace/marketplaceProduct'))
            }, 'integration-marketplace-product')
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
