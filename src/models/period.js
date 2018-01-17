/**
 * Created by Veirry on 22/09/2017.
 */
import moment from 'moment'
import { Modal } from 'antd'
import { query as queryAllPeriod, create as createPeriod, queryLastCode as lastCode, queryLastActive, update as updatePeriod } from '../services/period'
import { queryModeName as miscQuery } from '../services/misc'
import { queryFifo } from '../services/report/fifo'
import { query as querySequence, increase as increaseSequence } from '../services/sequence'
import { lstorage } from 'utils'
import { invalid } from 'antd/node_modules/moment';

export default {
  namespace: 'period',

  state: {
    list: [],
    accountNumber: '',
    accountActive: '',
    periodDate: {},
    searchVisible: false,
    currentItem: {},
    modalType: 'add',
    modalVisible: false,
    modalEndVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/periods') {
          dispatch({
            type: 'queryPeriod',
            payload: location.query,
          })
        }
      })
    },
  },
  effects: {
    * queryPeriod ({ payload = {} }, { call, put }) {
      const format = yield call(miscQuery, { code: 'FORMAT', name: 'PERIODE' })
      const data = yield call(queryAllPeriod)
      const invoice = {
        seqCode: 'PRD',
        type: lstorage.getCurrentUserStore()
      }
      const transNo = yield call(querySequence, invoice)
      // const last = yield call(lastCode)
      // const lastAccount = last.data[0].transNo
      // let datatrans = `${format.data.miscVariable}/${moment().format('YYYYMMDD')}/0000`
      // function pad(n, width, z) {
        // z = z || '0'
        // n = n + ''
        // return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
      // }
      // let lastNo = lastAccount.replace(/[^a-z0-9]/gi, '')
      // let newMonth = lastNo.substr(format.data.miscVariable.length, 8)
      // let lastTransNo = lastNo.substr(lastNo.length - 4)
      // let sendTransNo = parseInt(lastTransNo, 10) + 1
      // let padding = pad(sendTransNo, 4)
      // let transNo = ''
      // if (newMonth === `${moment().format('YYYYMMDD')}`) {
        // transNo = `${format.data.miscVariable}/${moment().format('YYYYMMDD')}/${padding}`
      // } else {
        // transNo = `${format.data.miscVariable}/${moment().format('YYYYMMDD')}/0001`
      // }
      const activeAccount = yield call(queryLastActive)
      if (transNo.success) {
        yield put({
          type: 'querySuccessPeriod',
          payload: {
            list: data.data,
            accountActive: {
              accountActive: transNo.data,
              startPeriod: activeAccount.data.length === 0 ? {} : activeAccount.data[0].startPeriod,
            },
            lastAccountNumber: transNo,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      } else {
        Modal.error({
          title: 'Something went wrong',
          content: 'Try restart transaction'
        })
      }
    },
    * addPeriod ({ payload }, { call, put }) {
      const invoice = {
        seqCode: 'PRD',
        type: lstorage.getCurrentUserStore()
      }

      const misc = yield call(miscQuery, { code: 'FORMAT', name: 'PERIODE' })
      const { miscVariable: formatType } = (misc.data)
      const dateFormat = moment(moment(payload.endPeriod).add(1, 'days')).format('YYYYMMDD')
      const formatAccount = `${formatType}/${dateFormat}/0001`
      payload.accountNumber = formatAccount
      payload.active = 1
      payload.storeId = lstorage.getCurrentUserStore()
      payload.startPeriod = moment(moment(payload.endPeriod).add(1, 'days')).format('YYYY-MM-DD')
      payload.endPeriod = moment(payload.startPeriod).endOf('month')
      const data = yield call(createPeriod, { id: payload.accountNumber, data: payload })
      if (data.success) {
        yield call(increaseSequence, invoice)
        // yield put({ type: 'modalHide' })
        yield put({ type: 'queryPeriod' })
        Modal.info({
          title: 'New period',
          content: 'New period has been opened',
        })
      } else {
        throw data
      }
    },
    * end ({ payload }, { call, put }) {
      payload.storeid = lstorage.getCurrentUserStore()
      const period = moment(payload.endPeriod).format('M')
      const year = moment(payload.endPeriod).format('YYYY')
      const check = yield call(queryFifo, { period: period, year: year })
      const dataCheck = check.data.filter(el => el.count < 0)
      console.log(dataCheck)
      if (dataCheck.length > 0) {
        Modal.warning({
          title: 'Inventory Error',
          content: 'Please Check Inventory before Closed transaction',
        })
      } else if (dataCheck.length === 0) {
        const data = yield call(updatePeriod, { id: payload.accountNumber, data: payload })
        if (data.success) {
          yield put({ type: 'addPeriod', payload })
        } else {
          Modal.error({
            title: 'Something went wrong',
            content: 'Try restart transaction'
          })
        }
        if (data.statusCode === 200) {
          yield put({ type: 'modalCloseHide' })
          yield put({ type: 'queryPeriod' })
          Modal.info({
            title: 'Last period',
            content: 'Last period has been closed',
          })
        } else {
          throw data
        }
      }
    },
  },
  reducers: {
    querySuccessPeriod (state, action) {
      const { list, lastAccountNumber, accountActive, pagination } = action.payload

      return { ...state,
        list,
        accountNumber: lastAccountNumber,
        accountActive,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to}
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true}
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    modalCloseShow (state, { payload }) {
      return { ...state, ...payload, modalEndVisible: true}
    },
    modalCloseHide (state) {
      return { ...state, modalEndVisible: false }
    },
  },
}
