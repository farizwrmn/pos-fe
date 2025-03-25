import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { prefix } from 'utils/config.main'
import { query as querySequence } from 'services/sequence'
import moment from 'moment'
import FormData from 'form-data'
import { queryFifo } from 'services/report/fifo'
import { uploadProductImage } from 'services/utils/imageUploader'
import { queryProductByCode } from 'services/consignment/products'
import { query as queryProductCost } from 'services/product/productCost'
import { query as queryStockPickingLine, add as addStockPickingLine, remove as removeStockPickingLine } from 'services/pickingLine/stockPickingLine'
import { query as queryPickingLine } from 'services/pickingLine/pickingLine'
import { query as queryStorePrice } from 'services/storePrice/stockExtraPriceStore'
import { queryActive } from 'services/marketing/bundling'
import { lstorage } from 'utils'
import { query, queryById, add, edit, queryPOSproduct, queryPOSproductStore, remove } from '../../services/master/productstock'
import { pageModel } from './../common'


const success = (messages) => {
  message.success(messages)
}

export default modelExtend(pageModel, {
  namespace: 'productstock',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    lastTrans: '',
    activeKey: '0',
    disable: '',
    searchText: '',
    advancedForm: true,
    show: 1,
    showModal: false,
    showModalProduct: false,
    modalGrabmartItem: {},
    modalGrabmartCampaignVisible: false,
    modalProductType: '',
    listPrintAllStock: [],
    listStockPickingLine: [],
    listPickingLine: [],
    tmpProductData: [],
    productInformation: {},
    filteredInfo: {},
    modalVariantVisible: false,
    modalSpecificationVisible: false,
    modalProductVisible: false,
    listItem: [],
    listSticker: [],
    update: false,
    selectedSticker: {},
    modalStorePriceItem: {},
    modalStorePriceVisible: false,
    period: [],
    showPDFModal: false,
    mode: '',
    inventoryMode: null,
    changed: false,
    stockLoading: false,
    countStoreList: [],
    modalQuantityVisible: false,
    aliases: {
      check1: true,
      check2: false,
      price1: 'sellPrice',
      price2: 'distPrice01',
      alias1: 'RETAIL PRICE',
      alias2: ''
    },
    pagination: {
      current: 1,
      showSizeChanger: true
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, mode, ...other } = location.query
        const { pathname } = location
        switch (pathname) {
          case '/integration/marketplace-product':
          case '/master/store-price':
          case '/report/fifo/history':
          case '/report/fifo/card':
            dispatch({ type: 'query' })
            break
          default:
        }
        if (pathname === '/inventory/transfer/auto-replenish') {
          dispatch({
            type: 'productstock/queryPickingLine'
          })
        }
        if (pathname === '/stock') {
          dispatch({ type: 'queryLastAdjust' })
          dispatch({ type: 'loadDataValue' })
          if (!activeKey) dispatch({ type: 'refreshView' })
          dispatch({
            type: 'updateState',
            payload: {
              listStockPickingLine: []
            }
          })
          dispatch({
            type: 'productstock/queryPickingLine'
          })
          if (activeKey === '1') {
            if (mode === 'inventory') {
              dispatch({
                type: 'queryInventory',
                payload: {
                  period: moment().format('MM'),
                  year: moment().format('YYYY')
                }
              })
            } else {
              dispatch({
                type: 'query',
                payload: {
                  ...other,
                  stockQuery: true
                }
              })
            }
          }
          dispatch({
            type: 'updateState',
            payload: {
              changed: false,
              activeKey: activeKey || '0',
              listSticker: [],
              listItem: [],
              inventoryMode: mode
            }
          })
        } else if (pathname === '/master/product/sticker') {
          if (!activeKey) dispatch({ type: 'refreshView' })
        }
      })
    }
  },

  effects: {
    * queryPickingLine (payload, { select, call, put }) {
      const listPickingLine = yield select(({ productstock }) => productstock.listPickingLine)
      if (listPickingLine && listPickingLine.length > 0) {
        return
      }
      const response = yield call(queryPickingLine, { type: 'all' })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPickingLine: response.data
          }
        })
      } else {
        throw response
      }
    },
    * queryStockPickingLine ({ payload = {} }, { call, put }) {
      const response = yield call(queryStockPickingLine, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listStockPickingLine: response.data
          }
        })
      }
    },
    * addStockPickingLine ({ payload = {} }, { call, put }) {
      const response = yield call(addStockPickingLine, payload.data)
      if (response.success) {
        yield put({
          type: 'queryStockPickingLine',
          payload: {
            storeId: lstorage.getCurrentUserStore(),
            productId: payload.data.productId
          }
        })
      } else {
        throw response
      }
    },
    * deleteStockPickingLine ({ payload }, { call, put }) {
      const response = yield call(removeStockPickingLine, payload.id)
      if (response.success) {
        yield put({
          type: 'queryStockPickingLine',
          payload: {
            storeId: lstorage.getCurrentUserStore(),
            productId: payload.productId
          }
        })
      } else {
        throw response
      }
    },

    * hideModalStorePrice (payload, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalStorePriceVisible: false,
          modalStorePriceItem: {}
        }
      })
    },

    * showModalStorePrice ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalStorePriceVisible: false,
          modalStorePriceItem: {}
        }
      })

      const listStorePrice = yield call(queryStorePrice, {
        productId: payload.modalStorePriceItem.id,
        storeId: lstorage.getCurrentUserStore()
      })

      if (listStorePrice && listStorePrice.data && listStorePrice.data.length > 0) {
        const item = listStorePrice.data[0]
        payload.modalStorePriceItem.sellPrice = item.sellPrice
        payload.modalStorePriceItem.distPrice01 = item.distPrice01
        payload.modalStorePriceItem.distPrice02 = item.distPrice02
        payload.modalStorePriceItem.distPrice03 = item.distPrice03
        payload.modalStorePriceItem.distPrice04 = item.distPrice04
        payload.modalStorePriceItem.distPrice05 = item.distPrice05
        payload.modalStorePriceItem.distPrice06 = item.distPrice06
        payload.modalStorePriceItem.distPrice07 = item.distPrice07
        payload.modalStorePriceItem.distPrice08 = item.distPrice08
        payload.modalStorePriceItem.distPrice09 = item.distPrice09
      }

      const productCost = yield call(queryProductCost, {
        productId: payload.modalStorePriceItem.id,
        storeId: lstorage.getCurrentUserStore()
      })

      if (productCost && productCost.data && productCost.data[0]) {
        const item = productCost.data[0]
        payload.modalStorePriceItem.costPrice = item.costPrice
      }

      payload.modalStorePriceItem.productId = payload.modalStorePriceItem.id
      payload.modalStorePriceItem.storeId = lstorage.getCurrentUserStore()
      payload.modalStorePriceItem.storeName = lstorage.getCurrentUserStoreName()

      yield put({
        type: 'updateState',
        payload: {
          modalStorePriceVisible: true,
          modalStorePriceItem: payload.modalStorePriceItem
        }
      })
    },

    * hideGrabmartCampaign (payload, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalGrabmartCampaignVisible: false
        }
      })
    },

    * queryLastAdjust ({ payload = {} }, { call, put }) {
      const invoice = {
        seqCode: 'ST',
        type: 1,
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const transNo = data.data
      yield put({ type: 'SuccessTransNo', payload: transNo })
    },

    * queryItem ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessItem',
          payload: data.data
        })
      }
    },

    * queryConsignmentBarcodeForPriceTag ({ payload = {} }, { call, put, select }) {
      const { productCode } = payload
      const response = yield call(queryProductByCode, { productCode: productCode ? productCode.trim() : null })
      const listSticker = yield select(({ productstock }) => productstock.listSticker)
      if (response.success && response.data) {
        const newListSticker = listSticker.concat([
          {
            info: {
              productCode: response.data.product_code,
              productName: response.data.product_name,
              barCode01: response.data.barcode,
              categoryColor: '#FFCCFF',
              brandName: 'CONSIGNMENT',
              sellPrice: response.data.stock.price
            },
            name: response.data.product_name,
            qty: Number(payload.qty)
          }
        ])
        yield put({
          type: 'updateState',
          payload: {
            listSticker: newListSticker
          }
        })
        const { resetChild, resetChildShelf, resetChildLong } = payload
        if (resetChild) {
          resetChild(newListSticker)
        }
        if (resetChildShelf) {
          resetChildShelf(newListSticker)
        }
        if (resetChildLong) {
          resetChildLong(newListSticker)
        }
      } else {
        throw response
      }
    },

    * queryInventory ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date
      })
      yield put({
        type: 'setNull',
        payload: date
      })
      const data = yield call(queryFifo, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data && data.data.length > 0
              ? data.data
                .filter(filtered => filtered.count > 0)
                .sort((a, b) => b.count - a.count)
              : [],
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            pagination: undefined
          }
        })
      } else {
        throw data
      }
    },

    * checkLengthOfData ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllStock', payload: { type: 'all' } })
        }
      }
    },

    * queryAllStock ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllStock: data.data,
            changed: true
          }
        })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const { stockQuery, ...otherPayload } = payload
      const data = yield call(query, otherPayload)
      if (data && data.data) {
        if (data.data.length > 0) {
          const productCost = yield call(queryProductCost, {
            productId: data.data.map(item => item.id),
            storeId: lstorage.getCurrentUserStore()
          })
          if (productCost && productCost.data && productCost.data.length > 0) {
            data.data = data.data.map((item) => {
              const filteredProduct = productCost.data.filter(filtered => filtered.productId === item.id)
              if (filteredProduct && filteredProduct[0]) {
                item.storeSupplierCode = filteredProduct[0].supplierCode
                item.storeSupplierName = filteredProduct[0].supplierName
                item.costPrice = filteredProduct[0].costPrice
              }
              return item
            })
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
        if (stockQuery) {
          yield put({
            type: 'showProductQty',
            payload: {
              data: data.data
            }
          })
        }
      }
    },

    * showProductQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data && data.map(x => x.id)

      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        for (let n = 0; n < (listProductData.data || []).length; n += 1) {
          data = data && data.map((x) => {
            if (x.id === listProductData.data[n].id) {
              const { count, ...other } = x
              return {
                ...other,
                ...listProductData.data[n]
              }
            }
            return x
          })
        }

        yield put({
          type: 'querySuccess',
          payload: {
            list: data,
            pagination: {}
          }
        })
      } else {
        throw listProductData
      }
    },

    * showProductStoreQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data && data.map(x => x.id)

      const listProductData = yield call(queryPOSproductStore, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        yield put({
          type: 'updateState',
          payload: {
            countStoreList: listProductData.data,
            modalQuantityVisible: true
          }
        })
      } else {
        throw listProductData
      }
    },

    * queryItemById ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data
          }
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(models => models.productstock)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query', payload: { stockQuery: true } })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length <= 5) {
        for (let key in payload.data.productImage.fileList) {
          const item = payload.data.productImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadProductImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      if (uploadedImage && uploadedImage.length) {
        payload.data.productImage = uploadedImage
      } else {
        payload.data.productImage = '["no_image.png"]'
      }
      // End - Upload Image
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        if (payload.reset) {
          payload.reset()
        }
        if (payload.data.pickingLineId) {
          const productId = data.stock.id
          yield put({
            type: 'addStockPickingLine',
            payload: {
              data: {
                storeId: lstorage.getCurrentUserStore(),
                productId,
                pickingLineId: payload.data.pickingLineId
              }
            }
          })
        }
        // yield put({ type: 'query' })
        success('Stock Product has been saved')
        yield put({
          type: 'updateState',
          payload: {
            listStockPickingLine: [],
            activeKey: '1',
            modalType: 'add',
            currentItem: {}
          }
        })
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: 1,
            activeKey: '1'
          }
        }))
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * editItem ({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          currentItem: payload.item
        }
      })
      yield put({
        type: 'showGrabmartCampaign',
        payload: {
          productId: payload.item.id
        }
      })
    },

    * edit ({ payload }, { select, call, put }) {
      // Start - Upload Image
      const productImage = yield select(({ productstock }) => productstock.currentItem.productImage)
      let uploadedImage = []
      if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length <= 5) {
        for (let key in payload.data.productImage.fileList) {
          const item = payload.data.productImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadProductImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImage.push(item.name)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      } else if (productImage
        && productImage != null
        && productImage !== '["no_image.png"]'
        && productImage !== '"no_image.png"'
        && productImage !== 'no_image.png') {
        uploadedImage = JSON.parse(productImage)
      }
      // End - Upload Image

      const id = yield select(({ productstock }) => productstock.currentItem.productCode)
      const { location } = payload
      const newProductStock = { data: payload.data, id }
      if (uploadedImage && uploadedImage.length > 0) {
        newProductStock.data.productImage = uploadedImage
      } else {
        newProductStock.data.productImage = '["no_image.png"]'
      }
      const data = yield call(edit, newProductStock)
      if (payload.data.pickingLineId) {
        const productId = yield select(({ productstock }) => productstock.currentItem.id)
        yield put({
          type: 'addStockPickingLine',
          payload: {
            data: {
              storeId: lstorage.getCurrentUserStore(),
              productId,
              pickingLineId: payload.data.pickingLineId
            }
          }
        })
      }
      if (data.success) {
        if (payload.reset) {
          payload.reset()
        }
        success('Stock Product has been saved')
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            listStockPickingLine: [],
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: 1,
            activeKey: '1'
          }
        }))
        yield put({ type: 'query', payload: { stockQuery: true } })
      } else {
        throw data
      }
    },

    * printStickerActive ({ payload = {} }, { call, put }) {
      const { resetChild, resetChildShelf, resetChildLong } = payload
      const params = { storeId: lstorage.getCurrentUserStore() }
      const response = yield call(queryActive, params)
      if (response.success) {
        const listSticker = response.data.map(item => ({
          info: item,
          name: item.productName,
          qty: 1
        }))
        yield put({
          type: 'updateState',
          payload: {
            listSticker
          }
        })
        if (resetChild) {
          resetChild(listSticker)
        }
        if (resetChildShelf) {
          resetChildShelf(listSticker)
        }
        if (resetChildLong) {
          resetChildLong(listSticker)
        }
      } else {
        throw response
      }
    },

    * addSticker ({ payload }, { select, put }) {
      let listSticker = yield select(({ productstock }) => productstock.listSticker)
      const { sticker, resetChild, resetChildShelf, resetChildLong } = payload
      listSticker.push(sticker)
      yield put({
        type: 'updateState',
        payload: {
          listSticker
        }
      })
      if (resetChild) {
        resetChild(listSticker)
      }
      if (resetChildShelf) {
        resetChildShelf(listSticker)
      }
      if (resetChildLong) {
        resetChildLong(listSticker)
      }
    },

    * deleteSticker ({ payload }, { select, put }) {
      let listSticker = yield select(({ productstock }) => productstock.listSticker)
      const { sticker, resetChild, resetChildShelf, resetChildLong } = payload
      listSticker = listSticker.filter(x => x.name !== sticker.name)
      yield put({
        type: 'updateState',
        payload: {
          listSticker
        }
      })
      if (resetChild) {
        resetChild(listSticker)
      }
      if (resetChildShelf) {
        resetChildShelf(listSticker)
      }
      if (resetChildLong) {
        resetChildLong(listSticker)
      }
    },

    * updateSticker ({ payload }, { select, put }) {
      let listSticker = yield select(({ productstock }) => productstock.listSticker)
      const { selectedRecord, changedRecord, resetChild, resetChildShelf, resetChildLong } = payload
      let selected = listSticker.findIndex(x => x.info.id === selectedRecord.info.id)
      listSticker[selected] = changedRecord

      yield put({
        type: 'updateState',
        payload: {
          listSticker
        }
      })
      if (resetChild) {
        resetChild(listSticker)
      }
      if (resetChildShelf) {
        resetChildShelf(listSticker)
      }
      if (resetChildLong) {
        resetChildLong(listSticker)
      }
    }
  },

  reducers: {

    SuccessTransNo (state, action) {
      return { ...state, lastTrans: action.payload }
    },

    showLoading (state) {
      return {
        ...state,
        stockLoading: true
      }
    },

    hideLoading (state) {
      return {
        ...state,
        stockLoading: false
      }
    },

    querySuccessItem (state, { payload }) {
      return { ...state, listItem: payload }
    },

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    pushSticker (state, { payload }) {
      state.listSticker.push()
      return { ...state, ...payload }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    resetProductStockList (state) {
      return { ...state, list: [], pagination: { total: 0 } }
    },

    getAutoText (state, action) {
      const { data, text } = action.payload
      const reg = new RegExp(text, 'gi')
      let productNames
      if (text.length > 0) {
        productNames = data && data.map((record) => {
          const match = record.productName.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record
          }
        }).filter(record => !!record)
      } else {
        productNames = []
      }
      return { ...state, auto: productNames }
    },

    refreshView (state) {
      return {
        ...state,
        activeKey: '0',
        modalType: 'add',
        currentItem: {}
      }
    }

  }
})
