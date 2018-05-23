/**
 * Created by Veirry on 25/04/2018.
 */
import moment from 'moment'
import {
  query as queryReport,
  queryTrans,
  queryAll,
  queryTransCancel,
  queryPosDaily,
  queryPOS,
  queryPOSDetail,
  queryTurnOver,
  queryPOSCompareSvsI
} from '../../services/report/pos'

export default {
  namespace: 'posReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
    listPOS: [],
    listPOSDetail: [],
    listPOSCompareSvsI: [],
    fromDate: '',
    toDate: '',
    paramDate: [ new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date() ],
    diffDay: 0,
    category: 'ALL CATEGORY',
    brand: 'ALL BRAND',
    productCode: 'ALL TYPE',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if ((location.pathname === '/report/pos/service' && location.query.from) || (location.pathname === '/report/pos/unit' && location.query.from)) {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryTransAll',
            payload: location.query
          })
        } else if (location.pathname === '/report/pos/service' || location.pathname === '/report/pos/unit' || location.pathname === '/report/pos/summary' || location.pathname === '/report/pos/turnover') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/pos/monthly') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    }
  },
  effects: {
    * queryPart ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryReport, payload)
      } else {
        data = yield call(queryReport)
      }
      yield put({
        type: 'querySuccessPart',
        payload: {
          list: data.data,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTransAll ({ payload }, { call, put }) {
      const data = yield call(queryAll, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTransCancel ({ payload }, { call, put }) {
      const data = yield call(queryTransCancel, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTrans ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryTrans, payload)
      } else {
        data = yield call(queryTrans)
      }
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          fromDate: payload.from,
          toDate: payload.to
        }
      })
    },
    * queryDaily ({ payload }, { call, put }) {
      let data = yield call(queryPosDaily, payload)
      yield put({
        type: 'querySuccessDaily',
        payload: {
          listDaily: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          ...payload
        }
      })
    },
    * queryPOS ({ payload }, { call, put }) {
      let data = yield call(queryPOS, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPOS',
          payload: {
            listPOS: data.data,
            fromDate: payload.startPeriod,
            toDate: payload.endPeriod
          }
        })
      }
    },
    * queryPOSDetail ({ payload }, { call, put }) {
      let data = yield call(queryPOSDetail, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPOSDetail',
          payload: {
            listPOSDetail: data.data
          }
        })
      } else {
        throw data
      }
    },
    * queryTurnOver ({ payload }, { call, put }) {
      const data = yield call(queryTurnOver, payload)
      if (data.success) {
        let listTrans = []
        const comparer = (otherArray) => {
          return function (current) {
            return otherArray.filter((other) => {
              return other.sort === current.sort && other.categoryName === current.categoryName
            }).length === 0
          }
        }
        let onlyInB = data.dataNext.filter(comparer(data.data))
        for (let key in data.data) {
          const next = data.dataNext.find(o => (o.categoryName === data.data[key].categoryName && o.sort === data.data[key].sort))
          listTrans.push({
            sort: data.data[key].sort,
            categoryId: data.data[key].categoryId,
            categoryParentId: data.data[key].categoryParentId,
            categoryName: data.data[key].categoryName,
            qty: data.data[key].qty,
            DPP: data.data[key].DPP,
            netto: data.data[key].netto,
            costPrice: next ? data.data[key].costPrice : 0,
            qtyNext: next ? next.qty : 0,
            DPPNext: next ? next.DPP : 0,
            nettoNext: next ? next.netto : 0,
            costPriceNext: next ? next.costPrice : 0,
            qtyNextEvo: next ? (((data.data[key].qty - next.qty) / (next.qty > 0 ? next.qty : 1)) * 100) : 0,
            DPPNextEvo: next ? (((data.data[key].DPP - next.DPP) / (next.DPP > 0 ? next.DPP : 1)) * 100) : 0,
            nettoNextEvo: next ? (((data.data[key].netto - next.netto) / (next.netto ? next.netto : 1)) * 100) : 0,
            costPriceNextEvo: next ? (((data.data[key].costPrice - next.costPrice) / (next.costPrice ? next.costPrice : 1)) * 100) : 0
          })
        }
        for (let key in onlyInB) {
          listTrans.push({
            sort: onlyInB[key].sort,
            categoryId: onlyInB[key].categoryId,
            categoryParentId: onlyInB[key].categoryParentId,
            categoryName: onlyInB[key].categoryName,
            qty: 0,
            DPP: 0,
            netto: 0,
            costPrice: 0,
            qtyNext: onlyInB[key].qty,
            DPPNext: onlyInB[key].DPP,
            nettoNext: onlyInB[key].netto,
            costPriceNext: onlyInB[key].costPrice
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            listTrans,
            fromDate: `${payload.period}-${payload.year}`,
            toDate: `${payload.periodNext}-${payload.yearNext}`
          }
        })
      } else {
        throw data
      }
    },
    * queryCompareSalesInventory ({ payload }, { call, put }) {
      let data = yield call(queryPOSCompareSvsI, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPOSCompareSvsI',
          payload: {
            listPOSCompareSvsI: data.data
          }
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    querySuccessPOS (state, { payload }) {
      const { listPOS } = payload

      return {
        ...state,
        listPOS,
        ...payload
      }
    },
    querySuccessPOSDetail (state, { payload }) {
      const { listPOSDetail } = payload

      return {
        ...state,
        listPOSDetail,
        ...payload
      }
    },
    querySuccessPart (state, action) {
      const { list, tmpList } = action.payload

      return {
        ...state,
        list,
        tmpList
      }
    },
    querySuccessDaily (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    querySuccessTrans (state, action) {
      const { listTrans, pagination, tmpList, fromDate, toDate } = action.payload

      return {
        ...state,
        listTrans,
        fromDate,
        toDate,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessPOSCompareSvsI (state, { payload }) {
      console.log('zzz6', state)
      const { listPOSCompareSvsI } = payload

      return {
        ...state,
        listPOSCompareSvsI,
        ...payload
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to, ...action.payload }
    },
    setValue (state, action) {
      console.log('zzz3', action)
      return { ...state,
        fromDate: action.payload.from,
        toDate: action.payload.to,
        paramDate: [ action.payload.from, action.payload.to ],
        diffDay: Math.round((new Date(action.payload.to)-new Date(action.payload.from))/(1000*60*60*24)+1),
        ...action.payload }
    },
    setListNull (state) {
      console.log('aaa2')
      return {
        ...state,
        list: [],
        listTrans: [],
        listDaily: [],
        listPOS: [],
        listPOSDetail: [],
        listPOSCompareSvsI: [],
        diffDay: 0,
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null
        }
      }
    }
  }
}
