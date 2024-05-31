import modelExtend from 'dva-model-extend'
import {
  message
} from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import {
  query,
  bulkInsert,
  queryPosPayment,
  updateMatchPaymentAndRecon,
  getDataPaymentMachine,
  queryTransaction,
  queryMappingStore,
  queryBalance,
  queryErrorLog,
  queryReconLog,
  queryImportLog,
  deleteReconLog
} from 'services/master/importBcaRecon'
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
    currentItemSettlement: {},
    modalType: 'add',
    modalVisible: false,
    modalStoreVisible: false,
    modalSettlementVisible: false,
    list: [],
    listRecon: [],
    listReconLog: [],
    listErrorLog: [],
    listPosPayment: [],
    listSortPayment: [],
    listReconNotMatch: [],
    listPaymentMachine: [],
    listSettlementAccumulated: [],
    paginationListReconLog: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    reconLogId: 0,
    storeName: '',
    storeId: 0,
    submitLoading: false,
    transDate: ''
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { ...other } = location.query
        const { pathname } = location
        if (pathname === '/accounting/bca-recon') {
          dispatch({ type: 'queryReconLog', payload: other })
        }
        if (pathname === '/accounting/bca-recon-import') {
          dispatch({ type: 'queryImportLog', payload: other })
        }
      })
    }
  },

  effects: {
    // eslint-disable-next-line no-unused-vars
    * processChangeStore ({ payload }, { put, select }) {
      const user = yield select(({ app }) => app.user)
      let storeId = yield select(({ importBcaRecon }) => importBcaRecon.storeId)
      let transDate = yield select(({ importBcaRecon }) => importBcaRecon.transDate)
      const { query, pathname } = payload.location
      const { ...other } = query
      if (storeId !== lstorage.getCurrentUserStore()) {
        const loginTimeDiff = lstorage.getLoginTimeDiff()
        const localId = lstorage.getStorageKey('udi')
        const listUserStores = lstorage.getListUserStores()
        const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
        const dataUdi = [
          localId[1],
          localId[2],
          [storeId],
          localId[4],
          moment(new Date(serverTime)),
          localId[6],
          listUserStores.filter(filtered => filtered.value === storeId)[0].consignmentId ? listUserStores.filter(filtered => filtered.value === storeId)[0].consignmentId.toString() : null
        ]
        lstorage.putStorageKey('udi', dataUdi, localId[0])
        localStorage.setItem('newItem', JSON.stringify({ store: false }))
        localStorage.removeItem('cashier_trans')
        localStorage.removeItem('queue')
        localStorage.removeItem('member')
        localStorage.removeItem('workorder')
        localStorage.removeItem('memberUnit')
        localStorage.removeItem('mechanic')
        localStorage.removeItem('service_detail')
        localStorage.removeItem('consignment')
        localStorage.removeItem('bundle_promo')
        localStorage.removeItem('cashierNo')
        yield put({ type: 'app/query', payload: { userid: user.userid, role: storeId } })
      }

      yield put({ type: 'closeModalStore' })
      yield put({
        type: 'sortNullMdrAmount',
        payload: {
          other,
          payment: { storeId, transDate: moment(transDate).format('YYYY-MM-DD') },
          paymentImportBca: {
            transactionDate: moment(transDate).format('YYYY-MM-DD'),
            recordSource: ['TC', 'TD', 'TQ', 'PC', 'PD', 'PQ'],
            storeId,
            type: 'all'
          }
        }
      })
      yield put(routerRedux.push({
        pathname,
        query: {
          ...query,
          storeId,
          transDate
        }
      }))
    },
    * sortNullMdrAmount ({ payload }, { call, put }) {
      const data = yield call(getDataPaymentMachine, { transDate: payload.payment.transDate })
      const dataTransaction = yield call(queryTransaction, { transDate: payload.payment.transDate })
      const dataBalance = yield call(queryBalance, { transDate: payload.payment.transDate })
      const dataMappingStore = yield call(queryMappingStore)
      const listReconLog = yield call(queryReconLog, {
        ...payload.other,
        order: 'storeId'
      })
      // update list Total Transfer
      yield put({
        type: 'queryErrorLog',
        payload: { transDate: payload.payment.transDate }
      })

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
              typeCode: tablePayment.typeCode,
              transNo: tablePayment.transNo,
              match: true,
              editState: true
            })
          } else {
            sortDataPayment.push({
              id: tablePayment.id,
              amount: tablePayment.amount,
              matchMdr: null,
              transDate: tablePayment.transDate,
              batchNumber: tablePayment.batchNumber,
              typeCode: tablePayment.typeCode,
              transNo: tablePayment.transNo,
              match: false,
              editState: false
            })
          }
        }
        for (let key in sortDataPayment) {
          const tablePayment = sortDataPayment[key]
          if (!tablePayment.match) {
            const filteredPaymentImportBcaData = paymentImportBcaData.data
              .filter(filtered => !filtered.match
                && filtered.grossAmount === tablePayment.amount)

            if (filteredPaymentImportBcaData && filteredPaymentImportBcaData.length === 1) {
              paymentImportBcaData.data = paymentImportBcaData.data.map((item) => {
                if (item.id === filteredPaymentImportBcaData[0].id) {
                  return { ...item, match: true }
                }
                return item
              })

              sortDataPayment[key] = {
                ...sortDataPayment[key],
                csvId: filteredPaymentImportBcaData[0].id,
                matchMdr: filteredPaymentImportBcaData[0].mdrAmount,
                match: true,
                editState: true
              }
            }
          }
        }
        // console.log('dataBalance', dataBalance)
        if (listReconLog.success) {
          yield put({
            type: 'updateState',
            payload: {
              listReconLog: listReconLog.data
            }
          })
        }
        // validation import bank ?
        // mengecek data di tbl balance dan transaction ada storeId dan transDate
        const Transaction = dataTransaction.length > 0
        const Balance = dataBalance.data.length > 0
        const MappingStore = dataMappingStore.data.length > 0
        const isDataValid = Balance || Transaction
        if (isDataValid) {
          yield put({ type: 'deleteReconLog', payload: { transDate: moment(payload.payment.transDate).format('YYYY-MM-DD') } })
          message.error('Already Recon')
          return
        }

        if (!MappingStore) {
          message.error('Mapping store not setup yet')
          return
        }

        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              listPaymentMachine: data.data
            }
          })
        }

        yield put({
          type: 'updateState',
          payload: {
            listSortPayment: sortDataPayment,
            list: paymentImportBcaData.data
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
                paymentId: payload.id,
                match: true,
                editState: true
              }
            }
            return {
              ...item,
              editState: false
            }
          }),
          listSortPayment: listSortPayment.map((item) => {
            if (item.id === payload.id) {
              return {
                id: payload.id,
                csvId: payload.csvId,
                matchMdr: payload.mdrAmount,
                transNo: payload.transNo,
                typeCode: payload.typeCode,
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
    * submitRecon ({ payload = {} }, { call, put, select }) {
      payload.update = 1
      const list = yield select(({ importBcaRecon }) => importBcaRecon.list)
      const listPaymentMachine = yield select(({ importBcaRecon }) => importBcaRecon.listPaymentMachine)
      const listSortPayment = yield select(({ importBcaRecon }) => importBcaRecon.listSortPayment)
      let filterListLength = list && list.length > 0 && list.filter(filtered => !!filtered.match).length === list.length
      let filterListSortPaymentLength = listSortPayment && listSortPayment.length > 0 && listSortPayment.filter(filtered => !!filtered.match).length === listSortPayment.length
      if (!filterListLength && !filterListSortPaymentLength) {
        message.error('some data not match')
        return
      }

      const mappingListWithPaymentId = list.reduce((acc, item, index) => {
        const payment = listSortPayment.find(({ csvId }) => csvId === item.id)
        if (payment) {
          acc[index] = { ...item, merchantId: Number(item.merchantId), paymentId: payment.id }
        } else {
          acc[index] = item
        }
        return acc
      }, [])
      const requestData = {
        transDate: payload.transDate ? payload.transDate.format('YYYY-MM-DD') : null,
        accumulatedTransfer: listPaymentMachine.map(({ id, merchantPaymentDate, nettAmount, accountId, accountIdReal }) => ({ id, merchantPaymentDate, nettAmount, accountId, accountIdReal })),
        csvData: mappingListWithPaymentId.map(item => ({ id: item.id, paymentId: item.paymentId })),
        paymentData: listSortPayment.map(item => ({ id: item.id, matchMdr: item.matchMdr, csvId: item.csvId }))
      }
      if (requestData.accumulatedTransfer.length === 0
        && requestData.csvData.length === 0) {
        message.error('Data From Bank Not Found')
        return
      }
      const data = yield call(updateMatchPaymentAndRecon, requestData)
      if (data.success) {
        message.success('Success reconcile this account')
        yield put({ type: 'deleteReconLog', payload: { transDate: moment(payload.transDate).format('YYYY-MM-DD') } })
        yield put({
          type: 'updateState',
          payload: {
            list: [],
            listSortPayment: [],
            listReconNotMatch: [],
            listPaymentMachine: [],
            listSettlementAccumulated: []
          }
        })
        yield put({ type: 'resetListImportCSVAndPayment', payload: { location: payload.location } })
        // delete recon targeted recon log
      } else {
        throw data
      }
    },
    * deleteReconLog ({ payload = {} }, { put, call }) {
      const data = yield call(deleteReconLog, { transDate: payload.transDate, storeId: lstorage.getCurrentUserStore() })
      if (data.success) {
        // message.success('Success delete')
        yield put({ type: 'queryReconLog', payload: { page: 1 } })
        // delete recon targeted recon log
      } else {
        throw data
      }
    },
    * getListReconNotMatch ({ payload = {} }, { put, select }) {
      payload.updated = 1
      const list = yield select(({ importBcaRecon }) => importBcaRecon.list)
      const filterList = list.filter(filtered => !filtered.match)
      yield put({
        type: 'updateState',
        payload: {
          listReconNotMatch: filterList
        }
      })
    },
    * closeModalStore ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalStoreVisible: false
        }
      })
    },
    * openModalInputMdrAmount ({ payload = {} }, { select, put }) {
      payload.updated = 0
      const list = yield select(({ importBcaRecon }) => importBcaRecon.list)
      const listSortPayment = yield select(({ importBcaRecon }) => importBcaRecon.listSortPayment)
      const updateList = list.map((item) => {
        if (item.id === payload.csvId) {
          return {
            ...item,
            match: false
          }
        }
        return { ...item }
      })

      const updateListSortPayment = listSortPayment.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            matchMdr: null,
            match: false
          }
        }
        return { ...item }
      })

      const filterList = updateList.filter(filtered => !filtered.match)
      yield put({
        type: 'updateState',
        payload: {
          list: updateList,
          listSortPayment: updateListSortPayment,
          listReconNotMatch: filterList,
          modalVisible: true,
          currentItem: payload
        }
      })
    },
    * closeModal ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          modalSettlementVisible: false
        }
      })
    },
    * query ({ payload = {} }, { call, put }) {
      // get data bank
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
    * queryErrorLog ({ payload = {} }, { call, put }) {
      const data = yield call(queryErrorLog, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listErrorLog: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryReconLog ({ payload = {} }, { call, put, select }) {
      const list = yield select(({ importBcaRecon }) => importBcaRecon.list)
      const data = yield call(queryReconLog, {
        ...payload,
        order: '-storeId'
      })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listReconLog: data.data,
            list,
            paginationListReconLog: {
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
      const data = yield call(queryImportLog, {
        ...payload,
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
    * resetListImportCSVAndPayment ({ payload }, { put }) {
      payload.updated = 0
      const { pathname } = payload.location
      yield put(routerRedux.push({ pathname }))
      yield put({
        type: 'updateState',
        payload: {
          list: [],
          listSortPayment: [],
          listReconNotMatch: [],
          listReconLog: [],
          listPaymentMachine: [],
          listSettlementAccumulated: []
        }
      })
    },
    * getDataPaymentMachine ({ payload }, { call, put }) {
      payload.updated = 0
      const data = yield call(getDataPaymentMachine, payload)
      if (data.success) {
        let isDataNull = data.data.some(item => (item.createdAt === null || item.accountIdReal === null || item.accountIdUnreal === null))
        if (isDataNull) {
          message.error('is not settled yet')
        }
        yield put({
          type: 'updateState',
          payload: {
            listPaymentMachine: data.data
          }
        })
      }
    },
    * updateCurrentItemPaymentMachine ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          currentItemSettlement: payload.data
        }
      })
    }
  },

  reducers: {
    querySuccess (state, action) {
      const {
        list,
        listReconLog,
        listErrorLog,
        paginationListReconLog,
        pagination
      } = action.payload
      return {
        ...state,
        list,
        listReconLog,
        listErrorLog,
        paginationListReconLog: {
          ...state.paginationListReconLog,
          ...paginationListReconLog
        },
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
