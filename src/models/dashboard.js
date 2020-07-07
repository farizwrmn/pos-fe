import moment from 'moment'
import { getDashboards } from '../services/dashboard'

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

export default {
  namespace: 'dashboard',
  state: {
    typeText: '',
    modalPeriod: false,
    sales: [],
    data: [],
    numbers: [],
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    ipAddress: [],
    cpu: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dashboard' || location.pathname === '/') {
          dispatch({
            type: 'query',
            payload: {
              start: moment().add(-6, 'days').format('YYYY-MM-DD'),
              to: moment().format('YYYY-MM-DD'),
              typeText: 'Weekly'
            }
          })
        }
      })
    }
  },
  effects: {
    * query ({ payload = {} }, { call, put }) {
      const last7day = payload.start
      const today = payload.to
      const params = {
        from: last7day,
        to: today
      }
      const data = yield call(getDashboards, params)
      const formatData = construct(data.saTles, last7day, today)
      formatData.sort((left, right) => {
        return moment.utc(moment(left.title, 'MM/DD/YYYY').format('YYYY-MM-DD')).diff(moment.utc(moment(right.title, 'MM/DD/YYYY').format('YYYY-MM-DD')))
      })
      yield put({ type: 'querySuccess', payload: { data: formatData, ...payload } })
    }
  },
  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}
