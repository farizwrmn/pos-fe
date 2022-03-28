import moment from 'moment'
import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { query as querySequence } from 'services/sequence'
import { queryById, query, queryId, add, edit, remove, payment } from 'services/transfer/transferInvoice'
import { query as queryDetail } from 'services/transfer/transferInvoiceDetail'
import { queryDetail as queryTransferDetail, queryLov, queryCost } from 'services/transferStockOut'
import { pageModel } from '../common'

const success = () => {
  message.success('Transfer Invoice has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'transferInvoice',

  state: {
    data: {},
    listDetail: [],
    listTransGroup: [],
    listStore: [],
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    modalItemType: 'add',
    modalPaymentVisible: false,
    inputType: null,
    activeKey: '0',
    list: [],
    modalVisible: false,
    listItem: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, edit, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/inventory/transfer/invoice/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/inventory/transfer/invoice') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: {
                startDate: moment().startOf('month').format('YYYY-MM-DD'),
                endDate: moment().endOf('month').format('YYYY-MM-DD'),
                ...other
              }
            })
          }

          if (activeKey === '2') {
            dispatch({
              type: 'query',
              payload: {
                ...other,
                forPayment: 1
              }
            })
          }

          if (activeKey === '3') {
            dispatch({
              type: 'query',
              payload: {
                startDate: moment().startOf('month').format('YYYY-MM-DD'),
                endDate: moment().endOf('month').format('YYYY-MM-DD'),
                ...other,
                forHistory: 1
              }
            })
          }

          if (edit && edit !== '' && edit !== '0') {
            dispatch({
              type: 'setEdit',
              payload: {
                edit
              }
            })
          } else {
            dispatch({ type: 'querySequence' })
          }
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { purchase, transferInvoiceDetail, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: transferInvoiceDetail
          }
        })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const { edit, ...other } = payload
      const data = yield call(query, other)
      if (data) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'TINV',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ transferInvoice }) => transferInvoice.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            storeId: lstorage.getCurrentUserStore(),
            transNo
          },
          listStore: lstorage.getListUserStores()
        }
      })
    },

    * addItem ({ payload }, { select, call, put }) {
      if (payload.data && payload.data.deliveryOrderNo) {
        const listTransfer = yield call(queryLov, {
          deliveryOrderNo: payload.data.deliveryOrderNo,
          storeId: lstorage.getCurrentUserStore()
        })
        if (listTransfer.success && listTransfer.data && listTransfer.data.length > 0) {
          const checkValid = listTransfer.data.filter(filtered => !filtered.posting)
          if (checkValid && checkValid[0]) {
            Modal.warning({
              title: 'Transfer Out is not posting',
              content: `Please posting ${checkValid[0].transNo}`
            })
          } else {
            for (let key in listTransfer.data) {
              const item = listTransfer.data[key]
              const listItem = yield select(({ transferInvoice }) => transferInvoice.listItem)
              const data = yield call(queryDetail, {
                transferId: item.id
              })
              const transferDetail = yield call(queryTransferDetail, {
                transNo: item.transNo,
                storeId: item.storeId
              })
              const cost = yield call(queryCost, {
                transNo: item.transNo,
                storeId: item.storeId,
                storeIdReceiver: item.storeIdReceiver
              })
              if (!cost.success) {
                throw cost
              }
              if (!transferDetail.success) {
                throw transferDetail
              }
              if (data.success) {
                if (data.data.length === 0) {
                  const newListItem = ([]).concat(listItem)
                  let amount = 0
                  amount = transferDetail.mutasi ? transferDetail.mutasi
                    .reduce(
                      (prev, next) => prev + (parseFloat(next.purchasePrice) * parseFloat(next.qty)),
                      0) : 0
                  if (amount === 0) {
                    amount = cost.data ? cost
                      .data
                      .reduce(
                        (prev, next) => prev + (parseFloat(next.purchasePrice) * parseFloat(next.qty)),
                        0) : 0
                  }
                  if (amount === 0) {
                    throw new Error('Transfer total is 0')
                  }
                  if (item && item.deliveryOrderNo) {
                    newListItem.push({
                      ...item,
                      no: (listItem || []).length + 1,
                      chargePercent: 0,
                      chargeNominal: 0,
                      amount,
                      amountTransfer: 0
                    })
                  } else {
                    newListItem.push({
                      ...item,
                      no: (listItem || []).length + 1,
                      chargePercent: 0,
                      chargeNominal: 0,
                      amount,
                      amountTransfer: amount
                    })
                  }
                  yield put({
                    type: 'updateState',
                    payload: {
                      listLovVisible: false,
                      modalVisible: false,
                      modalItemType: 'add',
                      listItem: newListItem,
                      currentItemList: {}
                    }
                  })
                } else {
                  message.warning('transfer already used')
                }
              } else {
                throw data
              }
            }
            message.success('success add item')
          }
        }
        yield put({
          type: 'groupListItem'
        })
      } else if (payload.data && !payload.data.deliveryOrderNo) {
        yield put({
          type: 'addItemNormal',
          payload
        })
      }
    },

    * addItemNormal ({ payload }, { select, call, put }) {
      const listItem = yield select(({ transferInvoice }) => transferInvoice.listItem)
      const data = yield call(queryDetail, {
        transferId: payload.data.id
      })
      const transferDetail = yield call(queryTransferDetail, {
        transNo: payload.data.transNo,
        storeId: payload.data.storeId
      })
      const cost = yield call(queryCost, {
        transNo: payload.data.transNo,
        storeId: payload.data.storeId,
        storeIdReceiver: payload.data.storeIdReceiver
      })
      if (!cost.success) {
        throw cost
      }
      if (!transferDetail.success) {
        throw transferDetail
      }
      if (data.success) {
        if (data.data.length === 0) {
          const newListItem = ([]).concat(listItem)
          let amount = 0
          amount = transferDetail.mutasi ? transferDetail.mutasi
            .reduce(
              (prev, next) => prev + (parseFloat(next.purchasePrice) * parseFloat(next.qty)),
              0) : 0
          if (amount === 0) {
            amount = cost.data ? cost
              .data
              .reduce(
                (prev, next) => prev + (parseFloat(next.purchasePrice) * parseFloat(next.qty)),
                0) : 0
          }
          if (amount === 0) {
            throw new Error('Transfer total is 0')
          }
          newListItem.push({
            ...payload.data,
            no: (listItem || []).length + 1,
            chargePercent: 0,
            chargeNominal: 0,
            amount,
            amountTransfer: amount
          })
          yield put({
            type: 'updateState',
            payload: {
              listLovVisible: false,
              modalVisible: false,
              modalItemType: 'add',
              listItem: newListItem,
              currentItemList: {}
            }
          })
          message.success('success add item')
          yield put({
            type: 'groupListItem'
          })
        } else {
          message.warning('transfer already used')
        }
      } else {
        throw data
      }
    },

    * groupListItem (payload, { select, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listTransGroup: []
        }
      })
      const listItem = yield select(({ transferInvoice }) => transferInvoice.listItem)
      let listTransGroup = []
      const listTransDelivery = listItem.filter(filtered => filtered.deliveryOrderNo)
      const listTransNormal = listItem.filter(filtered => !filtered.deliveryOrderNo)
      for (let key in listTransDelivery.filter(filtered => filtered.deliveryOrderNo)) {
        const item = {
          ...listTransDelivery[key]
        }
        const filteredExists = listTransGroup.filter(filtered => filtered.deliveryOrderNo === item.deliveryOrderNo)
        if (filteredExists && filteredExists.length === 0) {
          item.amountTransfer = listTransDelivery
            .filter(filtered => filtered.deliveryOrderNo === item.deliveryOrderNo)
            .reduce((prev, next) => prev + next.amount, 0)
          listTransGroup.push(item)
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          listTransGroup: listTransNormal.concat(listTransGroup)
        }
      })
    },

    * setEdit ({ payload }, { call, put }) {
      const data = yield call(queryId, { id: payload.edit, relationship: 1 })
      if (data.success) {
        const { transferInvoiceDetail, ...currentItem } = data.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem,
            listStore: lstorage.getListUserStores(),
            modalType: 'edit',
            listItem: transferInvoiceDetail ?
              transferInvoiceDetail.map((item, index) => ({
                no: index + 1,
                amountTransfer: item.amount,
                ...item
              }))
              : []
          }
        })
        yield put({
          type: 'groupListItem'
        })
      } else {
        throw data
      }
    },

    * editModalItem (payload, { put }) {
      yield put({
        type: 'transferInvoice/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem: payload.listItem,
          currentItemList: {}
        }
      })
      yield put({
        type: 'groupListItem'
      })
    },

    * deleteModalItem ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem: payload.listItem,
          currentItemList: {}
        }
      })
      yield put({
        type: 'groupListItem'
      })
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload = {} }, { call, put }) {
      const { oldValue } = payload
      yield put({
        type: 'updateState',
        payload: {
          currentItem: oldValue
        }
      })
      const data = yield call(add, payload)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
            listTransGroup: []
          }
        })
        yield put({ type: 'querySequence' })
        yield put({ type: 'query' })
        Modal.success({
          title: 'Transaction success',
          content: 'Transaction has been saved'
        })
      } else {
        throw data
      }
    },

    * payment ({ payload }, { select, call, put }) {
      const id = yield select(({ transferInvoice }) => transferInvoice.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(payment, newCounter)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
            activeKey: payload.forPayment ? '2' : '1'
          }
        })
        const { pathname } = location
        if (payload.forPayment) {
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '2'
            }
          }))
          yield put({
            type: 'updateState',
            payload: {
              modalPaymentVisible: false
            }
          })
          yield put({
            type: 'query',
            payload: {
              forPayment: 1
            }
          })
        } else {
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '1'
            }
          }))
          yield put({ type: 'query' })
        }
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ transferInvoice }) => transferInvoice.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
            activeKey: payload.forPayment ? '2' : '1'
          }
        })
        const { pathname } = location
        if (payload.forPayment) {
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '2'
            }
          }))
          yield put({
            type: 'updateState',
            payload: {
              modalPaymentVisible: false
            }
          })
          yield put({
            type: 'query',
            payload: {
              forPayment: 1
            }
          })
        } else {
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '1'
            }
          }))
          yield put({ type: 'query' })
        }
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateCurrentItem (state, { payload }) {
      const { currentItem } = state
      return { ...state, currentItem: { ...currentItem, ...payload } }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
