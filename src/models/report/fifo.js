/**
 * Created by Veirry on 19/09/2017.
 */
import { Modal } from 'antd'
import moment from 'moment'
import { configMain } from 'utils'
import { queryFifo, queryFifoValue, queryFifoValueAll, queryFifoCard, queryFifoHistory, queryFifoTransfer } from '../../services/report/fifo'

const { prefix } = configMain

export default {
  namespace: 'fifoReport',

  state: {
    tmpListRekap: [],
    listRekap: [],
    period: moment().format('MM'),
    year: moment().format('YYYY'),
    listProduct: [],
    // productCode: [],
    // productName: [],
    activeKey: '0',
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
        if (location.pathname === '/report/fifo/summary') {
          if (location.query.activeKey === '3') {
            dispatch({
              type: 'purchase/querySupplier',
              payload: {
                type: 'all'
              }
            })
          }
        }
        if (location.pathname === '/' || location.pathname === '/dashboard') {
          // dispatch({
          //   type: 'queryFifoValues',
          //   payload: {
          //     period: moment().format('M'),
          //     year: moment().format('YYYY')
          //   }
          // })
        }

        if (location.pathname === '/report/accounting/balance-sheet' && location.query.to) {
          dispatch({
            type: 'queryFifoValuesAll',
            payload: location.query
          })
        }
        if (location.pathname === '/report/fifo/summary' && location.query.activeKey && location.query.period && location.query.year) {
          if (location.query.activeKey ? location.query.activeKey === '0' || location.query.activeKey === '1' : false) {
            dispatch({
              type: 'queryInAdj',
              payload: location.query
            })
          } else if (location.query.activeKey === '2') {
            dispatch({
              type: 'queryTransferFlow',
              payload: location.query
            })
          } else if (location.query.activeKey === '3') {
            dispatch({
              type: 'queryInAdj',
              payload: location.query
            })
          }
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: location.query.activeKey || '0'
            }
          })
        } else if (location.pathname === '/report/fifo/balance' && location.query.activeKey && location.query.period && location.query.year) {
          switch (location.query.activeKey) {
            case '2':
              dispatch({
                type: 'queryFifoValues',
                payload: location.query
              })
              break
            case '3':
              dispatch({
                type: 'queryProductCode',
                payload: location.query
              })
              break
            default:
              dispatch({
                type: 'queryInAdj',
                payload: location.query
              })
              break
          }
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: location.query.activeKey || '0'
            }
          })
        } else if (location.pathname === '/report/fifo/card') {
          // if (location.query.period && location.query.year) {
          //   dispatch({
          //     type: 'queryProductCode',
          //     payload: location.query
          //   })
          // } else {
          //   dispatch({
          //     type: 'queryProductCode',
          //     payload: {
          //       period: moment().format('MM'),
          //       year: moment().format('YYYY')
          //     }
          //   })
          // }
        } else if (location.pathname === '/report/fifo/history') {
          if (location.query.from && location.query.to) {
            dispatch({
              type: 'updateState',
              payload: {
                from: location.query.from,
                to: location.query.to
              }
            })
          }
          // else {
          //   dispatch({
          //     type: 'queryProductCode',
          //     payload: {
          //       period: moment().format('MM'),
          //       year: moment().format('YYYY')
          //     }
          //   })
          // }
        } else if (location.pathname === '/report/fifo/value' && location.query.period && location.query.year) {
          dispatch({
            type: 'queryFifoValues',
            payload: location.query
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: location.query.activeKey || '0'
            }
          })
          dispatch({
            type: 'setNullProduct'
          })
        }
      })
    }
  },
  effects: {
    * queryInAdj ({ payload = {} }, { call, put }) {
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
          type: 'querySuccessTrans',
          payload: {
            tmpListRekap: data.data,
            listRekap: data.data,
            period: payload.period,
            year: payload.year,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            },
            date
          }
        })
      } else {
        throw data
      }
    },
    * queryTransferFlow ({ payload = {} }, { call, put }) {
      const data = yield call(queryFifoTransfer, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listRekap: data.data,
            ...payload
          }
        })
      } else {
        throw data
      }
    },
    * queryFifoValues ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date
      })
      yield put({
        type: 'setNull',
        payload: date
      })
      const data = yield call(queryFifoValue, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listRekap: data.data,
            period: payload.period,
            year: payload.year,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            },
            date
          }
        })
      } else {
        // console.log('no Data')
        // Modal.warning({
        //   title: 'No Data',
        //   content: 'No data inside storage'
        // })
        yield put({ type: 'setNull' })
        throw data
      }
    },
    * queryFifoValuesAll ({ payload = {} }, { call, put }) {
      const { to } = payload
      const period = moment(to, 'YYYY-MM-DD').format('MM')
      const year = moment(to, 'YYYY-MM-DD').format('YYYY')
      const date = {
        period,
        year
      }
      yield put({
        type: 'setPeriod',
        payload: date
      })
      yield put({
        type: 'setNull',
        payload: date
      })
      const data = yield call(queryFifoValueAll, date)
      if (data.success) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listRekap: data.data,
            period: date.period,
            year: date.year,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            },
            date
          }
        })
      } else {
        // console.log('no Data')
        // Modal.warning({
        //   title: 'No Data',
        //   content: 'No data inside storage'
        // })
        yield put({ type: 'setNull' })
        throw data
      }
    },
    * queryCard ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date
      })
      let data
      try {
        data = yield call(queryFifoCard, payload)
        if (data.success === false) {
          Modal.warning({
            title: 'Something Went Wrong',
            content: 'Please Refresh the page or change params'
          })
          console.log(`error Message: ${data.message}`)
        }
      } catch (e) {
        console.log('error', e)
      }
      if (data.success) {
        if (data.data.length > 0) {
          yield put({
            type: 'querySuccessTrans',
            payload: {
              listRekap: data.data,
              period: payload.period,
              year: payload.year,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 5,
                total: data.total
              },
              date
            }
          })
        } else {
          Modal.warning({
            title: 'No Data',
            content: `No data inside storage, ${data.message}`
          })
        }
      }
    },
    * queryHistory ({ payload = {} }, { call, put }) {
      let data
      try {
        const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
        data = yield call(queryFifoHistory, {
          ...payload,
          from: storeInfo.startPeriod,
          fromDate: payload.from
        })
        if (data.success === false) {
          Modal.warning({
            title: 'Something Went Wrong',
            content: 'Please Refresh the page or change params'
          })
          console.log(`error Message: ${data.message}`)
        }
      } catch (e) {
        console.log('error', e)
      }
      if (data.success) {
        console.log('data.data', data.data)
        if (data.data.length > 0) {
          yield put({
            type: 'querySuccessTrans',
            payload: {
              listRekap: data.data,
              from: payload.from,
              to: payload.to,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 5,
                total: data.total
              },
              date: payload
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              listRekap: data.data
            }
          })
        } else {
          Modal.warning({
            title: 'No Data',
            content: `No data inside storage, ${data.message}`
          })
        }
      }
    },
    * queryProductCode ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date
      })
      yield put({
        type: 'setNullProduct',
        payload: date
      })
      const data = yield call(queryFifoValue, payload)
      // const productCode = data.data.map(n => n.productCode)
      // const productName = data.data.map(n => n.productName)
      if (data.success) {
        yield put({
          type: 'queryProductCodeSuccess',
          payload: {
            // productCode,
            // productName,
            listProduct: data.data || [],
            ...payload
          }
        })
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listRekap, tmpListRekap, date, pagination, period, year } = action.payload
      return {
        ...state,
        period,
        year,
        listRekap,
        tmpListRekap: tmpListRekap || [],
        fromDate: date.period,
        toDate: date.year,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    queryProductCodeSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    setPeriod (state, action) {
      return { ...state, period: action.payload.period, year: action.payload.year }
    },
    setNull (state) {
      return { ...state, listRekap: [] }
    },
    setNullProduct (state) {
      return { ...state, listRekap: [], productCode: [], listProduct: [] }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
