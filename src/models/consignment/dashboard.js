import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { queryChart, querySummary } from 'services/consignment/sales'
import { getConsignmentId } from 'utils/lstorage'
import { query as queryBox } from 'services/consignment/boxes'
import { cancelRentRequest } from 'services/consignment/rentRequest'
import { message } from 'antd'
import { pageModel } from '../common'

const construct = (dataSales, startDate, toDate) => {
  const diffDay = moment(startDate, 'YYYY-MM-DD').diff(moment(toDate, 'YYYY-MM-DD'), 'days') + 1
  const start = moment(toDate, 'YYYY-MM-DD').add(diffDay - 1, 'days')
  const end = moment(toDate, 'YYYY-MM-DD')
  const date = moment(toDate, 'YYYY-MM-DD').add(diffDay - 1, 'days')
  let formatSales = (dataSales || [])
  for (let key = 0; key <= end.diff(start, 'days'); key += 1) {
    const dateExists = (e) => {
      return formatSales.some((el) => {
        return el.title === e
      })
    }
    if (!dateExists(date.format('L'))) {
      formatSales.push({
        name: date.format('DD/MM'),
        title: date.format('L'),
        Sales: 0,
        Service: 0
      })
    }
    date.add(1, 'days')
  }
  return formatSales
}

const constructRemoveDuplicate = (dataSales) => {
  let title = '0'
  let Sales = 0
  let name = '0'
  let newDataSales
  newDataSales = dataSales.map((record) => {
    if (title !== '0') {
      if (title === record.title) {
        Sales += record.Sales
        return null
      }
      const result = {
        title,
        Sales,
        name
      }
      title = record.title
      Sales = record.Sales
      name = record.name
      return result
    }
    title = record.title
    Sales = record.Sales
    name = record.name
    return null
  })

  newDataSales = newDataSales.filter(record => record !== null)

  return newDataSales
}

export default modelExtend(pageModel, {
  namespace: 'consignmentDashboard',

  state: {
    typeText: '',
    modalPeriod: false,
    modalRange: false,
    modalDetail: false,
    start: null,
    to: null,

    activeKey: '0',
    consignmentId: getConsignmentId(),

    list: [],

    boxList: [],

    salesData: [],
    salesSummary: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/dashboard') {
          dispatch({
            type: 'queryChart',
            payload: {
              start: moment().add(-29, 'days').format('YYYY-MM-DD'),
              to: moment().format('YYYY-MM-DD'),
              typeText: 'Last 30 Days'
            }
          })
          dispatch({
            type: 'queryBox',
            payload: {}
          })
          dispatch({
            type: 'querySalesSummary',
            payload: {}
          })
          if (location.query && location.query.activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: location.query.activeKey
              }
            })
          } else {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: '0'
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * queryChart ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const last7day = payload.start
        const today = payload.to
        const params = {
          from: last7day,
          to: today,
          outletId: consignmentId
        }
        const data = yield call(queryChart, params)
        const formatData = construct(data.data, last7day, today)
        formatData.sort((left, right) => {
          return moment.utc(moment(left.title, 'MM/DD/YYYY').format('YYYY-MM-DD')).diff(moment.utc(moment(right.title, 'MM/DD/YYYY').format('YYYY-MM-DD')))
        })
        const newFormatData = constructRemoveDuplicate(formatData)
        yield put({ type: 'querySuccess', payload: { salesData: newFormatData, consignmentId, ...payload } })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: [],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 0
            }
          }
        })
      }
    },
    * queryBox ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        payload = {
          outletId: consignmentId
        }
        const data = yield call(queryBox, payload)
        yield put({ type: 'querySuccess', payload: { boxList: data.data, consignmentId, ...payload } })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            boxList: []
          }
        })
      }
    },
    * querySalesSummary ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        payload = {
          outletId: consignmentId
        }
        const data = yield call(querySummary, payload)
        yield put({ type: 'querySuccess', payload: { salesSummary: data.data, consignmentId, ...payload } })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            salesSummary: []
          }
        })
      }
    },
    * cancelRentRequest ({ payload = {} }, { call, put }) {
      const response = yield call(cancelRentRequest, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'queryBox',
          payload: {}
        })
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    updateState (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
