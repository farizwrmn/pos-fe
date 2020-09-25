import { message } from 'antd'
import moment from 'moment'
import { configMain, lstorage } from 'utils'
import {
  queryByDate
} from 'services/report/pos'
import { getDashboards } from '../services/dashboard'
import {
  queryFifoCategory
} from '../services/report/fifo'
import { numberFormatter } from '../utils/numberFormat'

const { prefix } = configMain

const onCopy = (endpoint) => {
  let textarea = document.createElement('textarea')
  textarea.id = 'temp_element'
  textarea.style.height = 0
  document.body.appendChild(textarea)
  textarea.value = endpoint
  let selector = document.querySelector('#temp_element')
  selector.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  message.success('Success to key to clipboard')
}

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
    listSalesCategory: [],
    listStockByCategory: [],
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
              start: moment().add(-29, 'days').format('YYYY-MM-DD'),
              to: moment().format('YYYY-MM-DD'),
              typeText: 'Last 30 Days'
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
      const formatData = construct(data.sales, last7day, today)
      formatData.sort((left, right) => {
        return moment.utc(moment(left.title, 'MM/DD/YYYY').format('YYYY-MM-DD')).diff(moment.utc(moment(right.title, 'MM/DD/YYYY').format('YYYY-MM-DD')))
      })
      yield put({ type: 'querySuccess', payload: { data: formatData, ...payload } })
    },
    * querySalesCategory ({ payload = {} }, { call, put }) {
      let copiedText = ''

      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const listUserStores = lstorage.getListUserStores()
      const responseStock = yield call(queryFifoCategory, {
        from: storeInfo.startPeriod,
        to: payload.to,
        category: '117,118,121,122,125'
      })
      const responseSales = yield call(queryByDate, {
        from: payload.from,
        to: payload.to
      })
      if (responseSales && responseSales.success) {
        for (let key in listUserStores) {
          const dataItem = listUserStores[key]
          if (dataItem) {
            copiedText += `${dataItem.label}\n`
          }
          const record = responseSales
            .data
            .filter(filtered => filtered.storeId === dataItem.value)
          copiedText += record
            .map(item => (`${item.categoryName}\t${numberFormatter(item.netto)}`))
            .toString()
            .replace(/,/g, '\n')
          copiedText += `\nTotal\t${numberFormatter(record.reduce((prev, next) => prev + parseFloat(next.netto), 0))}`
          // .toString()
          // .replace(/,/g, '\n')
          copiedText += '\n\n'
        }
      }
      if (responseStock && responseStock.success) {
        for (let key in listUserStores) {
          const dataItem = listUserStores[key]
          if (dataItem) {
            copiedText += `UPDATE STOCK SEPEDA ${moment().format('DD MMMM YYYY')}\n${dataItem.label}\n\n`
          }
          copiedText += responseStock
            .data
            .filter(filtered => filtered.count)
            .filter(filtered => filtered.storeId === dataItem.value)
            .map(item => (`${item.productName}(${item.productCode})\t${item.count}x${numberFormatter(item.sellPrice)}`))
            .toString()
            .replace(/,/g, '\n')
          copiedText += '\n\n'
        }
      }
      onCopy(copiedText)
      // const responseSales = yield call(queryFifoCategory, {
      //   from: '',
      //   to: '',
      //   category: '183'
      // })
      yield put({
        type: 'querySuccess',
        payload: {
          listSalesCategory: responseSales.data,
          listStockByCategory: responseStock.data
        }
      })
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
