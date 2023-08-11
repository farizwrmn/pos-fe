import modelExtend from 'dva-model-extend'
import {
  message
} from 'antd'
import {
  query,
  queryFilename,
  bulkInsert,
  queryPosPayment,
  updatePayment,
  submitBcaRecon
} from 'services/master/importBcaRecon'
import {
  queryImportLog,
  insertImportLog
} from 'services/master/importBcaReconLog'
import {
  pageModel
} from 'common'

const success = () => {
  message.success('File has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importBcaRecon',

  state: {
    currentItem: {},
    currentMerchant: {},
    modalType: 'add',
    modalVisible: false,
    list: [],
    listRecon: [],
    listPosPayment: [],
    listSortPayment: [],
    listReconNotMatch: [],
    listSettlementAccumulated: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { ...other } = location.query
        const { pathname } = location
        if (pathname === '/accounting/bca-recon') {
          dispatch({ type: 'queryBcaRecon', payload: other })
        }
        if (pathname === '/accounting/bca-recon-import') {
          dispatch({ type: 'queryImportLog', payload: other })
        }
      })
    }
  },

  effects: {
    * sortNullMdrAmount ({ payload }, { call, put }) {
      const posPaymentData = yield call(queryPosPayment, payload.payment)
      const paymentImportBcaData = yield call(query, payload.paymentImportBca)
      if (posPaymentData.success && paymentImportBcaData.success
        && posPaymentData.data && paymentImportBcaData.data) {
        // list sorting mdrAmount equal null sort the list to top
        let sortDataPayment = []
        for (let key in posPaymentData.data) {
          let tablePayment = posPaymentData.data[key]
          const filteredPaymentImportBcaData = paymentImportBcaData.data
            .filter(filtered => Number(filtered.edcBatchNumber) === Number(tablePayment.batchNumber)
              && filtered.grossAmount === tablePayment.amount)
          if (filteredPaymentImportBcaData && filteredPaymentImportBcaData.length > 0) {
            paymentImportBcaData.data = paymentImportBcaData.data.map((item) => {
              if (item.id === filteredPaymentImportBcaData[0].id) {
                return { ...item, match: true }
              }
              return item
            })

            sortDataPayment.push({
              id: tablePayment.id,
              amount: tablePayment.amount,
              csvId: filteredPaymentImportBcaData[0].id,
              matchMdr: filteredPaymentImportBcaData[0].mdrAmount,
              transDate: tablePayment.transDate,
              batchNumber: tablePayment.batchNumber,
              match: true
            })
          } else {
            sortDataPayment.push({
              id: tablePayment.id,
              amount: tablePayment.amount,
              matchMdr: null,
              transDate: tablePayment.transDate,
              batchNumber: tablePayment.batchNumber,
              match: false
            })
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            listSortPayment: sortDataPayment.sort((a, b) => a.matchMdr - b.matchMdr),
            list: paymentImportBcaData.data.sort((a, b) => Number(a.match || 0) - Number(b.match || 0))
          }
        })
      } else if (!posPaymentData.success) {
        throw posPaymentData
      } else if (!paymentImportBcaData.success) {
        throw paymentImportBcaData
      }
    },
    * updateList ({ payload = {} }, { put, select }) {
      const list = yield select(({ importBcaRecon }) => importBcaRecon.list)
      const listSortPayment = yield select(({ importBcaRecon }) => importBcaRecon.listSortPayment)
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          list: list.map((item) => {
            if (item.id === payload.csvId) {
              return {
                ...item,
                match: true
              }
            }
            return {
              ...item
            }
          }),
          listSortPayment: listSortPayment.map((item) => {
            if (item.id === payload.id) {
              return {
                id: payload.id,
                csvId: payload.csvId,
                matchMdr: payload.mdrAmount,
                match: true,
                amount: item.amount,
                transDate: item.transDate,
                batchNumber: item.batchNumber
              }
            }
            return {
              ...item
            }
          })
        }
      })
    },
    * updatePayment ({ payload = {} }, { call, put }) {
      const data = yield call(updatePayment, { payload })
      if (data.success) {
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
    * getListReconNotMatch ({ payload = {} }, { put, select }) {
      payload.updated = 1
      // const data = state.list.filter(filtered => filtered.match === false)
      const list = yield select(({ importBcaRecon }) => importBcaRecon.list)
      const filterList = list.filter(filtered => !filtered.match)
      yield put({
        type: 'updateState',
        payload: {
          listReconNotMatch: filterList
        }
      })
    },
    * openModalInputMdrAmount ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({ type: 'getListReconNotMatch' })
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          currentItem: payload
        }
      })
    },
    * closeModalInputMdrAmount ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        let mapData = data.data.map((item) => { return { ...item, match: 1 } })
        yield put({
          type: 'querySuccess',
          payload: {
            list: mapData,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryPosPayment ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(queryPosPayment, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPosPayment: data.data
          }
        })
      } else {
        throw data
      }
    },

    * queryBcaRecon ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listRecon: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryFilename ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(queryFilename, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listFilename: data.data
          }
        })
      }
    },
    * submitBcaRecon ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(submitBcaRecon, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listSettlementAccumulated: data.data
          }
        })
      }
    },

    * bulkInsert ({ payload }, { call, put }) {
      let dataExist = yield call(queryImportLog, {
        filename: payload.filename
      })
      if (dataExist && dataExist.data && dataExist.data.length > 0) {
        message.error('file already uploaded')
        return
      }
      const data = yield call(bulkInsert, payload)
      if (data.success) {
        yield put({
          type: 'queryImportLog'
        })
        yield call(insertImportLog, {
          filename: payload.filename
        })
        success()
        yield put({
          type: 'query',
          payload
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },
    * queryImportLog ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(queryImportLog, {
        order: '-id'
      })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listFilename: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * insertImportLog ({ payload }, { call, put }) {
      const data = yield call(insertImportLog, payload)
      if (data.success) {
        success()
        yield put({
          type: 'queryImportLog'
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },
    * getListAccumulatedAmount ({ payload }, { call, put }) {
      const data = yield call(insertImportLog, payload)
      if (data.success) {
        success()
        yield put({
          type: 'queryImportLog'
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },
    * resetListImportCSVAndPayment ({ payload }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          list: [],
          listSortPayment: [],
          listReconNotMatch: [],
          listSettlementAccumulated: []
        }
      })
    }
  },

  reducers: {
    querySuccess (state, action) {
      const {
        list,
        pagination
      } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, {
      payload
    }) {
      return {
        ...state,
        ...payload
      }
    }
  }
})
