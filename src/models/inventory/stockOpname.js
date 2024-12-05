import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query, queryActive, queryById, insertEmployee, updateFinishBatch2, queryListEmployeePhaseTwo, queryListEmployeeOnCharge, addBatch, updateFinishLine, queryListDetail, add, edit, remove, queryReportOpname, queryListDetailHistory, queryDetailReportOpname } from 'services/inventory/stockOpname'
import { query as queryEmployee } from 'services/master/employee'
import { pageModel } from 'models/common'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Stock Opname has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'stockOpname',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    modalAddEmployeeVisible: false,
    modalPhaseOneVisible: false,
    modalPhaseTwoVisible: false,
    list: [],
    listReport: [],
    listEmployee: [],
    listEmployeeOnCharge: [],
    listActive: [],
    listDetail: [],
    listDetailFinish: [],
    listEmployeePhase2: [],
    detailData: {},
    modalEditVisible: false,
    modalEditItem: {},
    detailHistory: [],
    queryDetailHistory: '',
    listDetailHistory: [],
    finishPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    detailPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    detailHistoryPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/stock-opname/:id').exec(location.pathname) || pathToRegexp('/stock-opname-partial/:id').exec(location.pathname) || pathToRegexp('/stock-opname-detail-history/:id')
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
          dispatch({
            type: 'queryListDetailHistory',
            payload: {
              transId: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
          dispatch({
            type: 'queryDetailReport',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
          dispatch({
            type: 'queryDetailHistoryReport',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/stock-opname'
          || pathname === '/stock-opname-partial' || pathname === '/stock-opname-detail-history'
        ) {
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
                ...other,
                order: '-id'
              }
            })
          } else {
            dispatch({
              type: 'queryActive'
            })
          }
        }
      })
    }
  },

  effects: {
    * updateFinishBatch2 ({ payload = {} }, { call, put }) {
      const { detailData } = payload
      const response = yield call(updateFinishBatch2, {
        transId: detailData.id,
        batchId: detailData.activeBatch.id,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success && payload.detailData) {
        yield put({
          type: 'queryDetail',
          payload: {
            id: payload.detailData.id,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        yield put({
          type: 'queryDetailReport',
          payload: {
            id: payload.detailData.id,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        yield put({
          type: 'queryDetailHistoryReport',
          payload: {
            id: payload.detailData.id,
            storeId: lstorage.getCurrentUserStore()
          }
        })
      } else {
        throw response
      }
    },

    * insertEmployee ({ payload = {} }, { call, put }) {
      const { data, detailData, reset } = payload
      const response = yield call(insertEmployee, {
        userId: data.userId,
        transId: detailData.id,
        batchId: detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 1 && !detailData.activeBatch.status
          ? detailData.activeBatch.id : null
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalAddEmployeeVisible: false
          }
        })
        yield put({
          type: 'queryEmployeeOnCharge',
          payload: {
            transId: detailData.id,
            batchId: detailData && detailData.activeBatch && detailData.activeBatch.id ? detailData.activeBatch.id : null
          }
        })
        if (reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * finishLine ({ payload = {} }, { select, call, put }) {
      const listDetail = yield select(({ stockOpname }) => stockOpname.listDetail)
      yield put({
        type: 'updateState',
        payload: {
          modalEditItem: {},
          modalEditVisible: false,
          listDetail: listDetail.filter(filtered => filtered.productCode !== payload.productCode)
        }
      })
      const response = yield call(updateFinishLine, payload)
      if (response.success) {
        yield put({
          type: 'queryDetail',
          payload: {
            id: payload.transId,
            storeId: lstorage.getCurrentUserStore()
          }
        })
      } else {
        throw response
      }
    },

    * queryListDetailHistory ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const { detailData, ...other } = payload
      const data = yield call(queryListDetail, other)
      const response = yield call(queryListDetailHistory, payload)
      if (response.success && data.success && data.data) {
        const dataMap = data.data.map((item) => {
          const matchingLocations = response.data.filter(history => history.productCode === item.productCode).map(history => history.locationName)

          const matchingQtyLocation = response.data
            .filter(history => history.productCode === item.productCode)
            .map(history => history.qtyLocation)

          // const totalQtyLocation = matchingQtyLocation.reduce((total, qty) => total + qty, 0)
          return {
            ...item,
            locationName: matchingLocations.join(', '),
            qtyLocation: matchingQtyLocation.join(', ')
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            detailHistoryPagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total,
              showSizeChanger: true,
              showQuickJumper: true
            },
            // detailHistory: response.data
            detailHistory: dataMap
          }
        })
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { detail, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            detailData: other
          }
        })
        if (other && other.activeBatch && other.activeBatch.id) {
          if (other && other.activeBatch && other.activeBatch.id && other.activeBatch.batchNumber === 2) {
            yield put({
              type: 'queryEmployeePhaseTwo',
              payload: {
                transId: other.transId || other.id,
                batchId: other && other.activeBatch && other.activeBatch.id ? other.activeBatch.id : null
              }
            })
          }
          yield put({
            type: 'queryDetailData',
            payload: {
              page: 1,
              pageSize: 20,
              status: other && other.batch && other.activeBatch && other.activeBatch.batchNumber === 1 && !other.activeBatch.status ?
                ['CONFLICT'] : ['MISS'],
              order: '-updatedAt',
              batchNumber: other && other.batch && other.activeBatch && other.activeBatch.batchNumber === 1 && !other.activeBatch.status ?
                1 : 2,
              transId: other.id,
              storeId: other.storeId,
              batchId: other.activeBatch.id,
              detailData: other
            }
          })
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            detailData: {}
          }
        })
        throw data
      }
    },

    * queryDetailReport ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { detail, ...other } = data.data
        yield put({ type: 'queryEmployee' })
        if (other && other.activeBatch && other.activeBatch.id && other.activeBatch.batchNumber === 1) {
          yield put({
            type: 'queryEmployeeOnCharge',
            payload: {
              transId: other.transId || other.id,
              batchId: other && other.activeBatch && other.activeBatch.id ? other.activeBatch.id : null
            }
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            detailData: other
          }
        })
        if (other && other.activeBatch) {
          const response = yield call(queryReportOpname, {
            batchId: other.activeBatch.id
          })
          if (response.success) {
            yield put({
              type: 'updateState',
              payload: {
                listReport: response.data
              }
            })
          } else {
            throw response
          }
        }
      } else {
        throw data
      }
    },

    * queryDetailHistoryReport ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { detail, ...other } = data.data
        if (other && other.activeBatch) {
          const response = yield call(queryDetailReportOpname, {
            batchId: other.activeBatch.id
          })
          console.log(response)
          if (response.success) {
            yield put({
              type: 'updateState',
              payload: {
                listDetailHistory: response.data
              }
            })
          } else {
            throw response
          }
        }
      } else {
        throw data
      }
    },

    * queryEmployee ({ payload = {} }, { call, put }) {
      const data = yield call(queryEmployee, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            listEmployee: data.data
          }
        })
      } else {
        throw data
      }
    },

    * queryEmployeePhaseTwo ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listEmployeePhase2: []
        }
      })
      const data = yield call(queryListEmployeePhaseTwo, payload)
      if (data && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            listEmployeePhase2: data.data.map((item, index) => ({ no: index + 1, ...item }))
          }
        })
      } else {
        throw data
      }
    },

    * queryEmployeeOnCharge ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listEmployeeOnCharge: []
        }
      })
      const data = yield call(queryListEmployeeOnCharge, payload)
      if (data && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            listEmployeeOnCharge: data.data.map((item, index) => ({ no: index + 1, ...item }))
          }
        })
      } else {
        throw data
      }
    },

    * insertBatchTwo ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalPhaseOneVisible: false,
          modalPhaseTwoVisible: false
        }
      })
      const response = yield call(addBatch, {
        transId: payload.transId,
        storeId: payload.storeId,
        userId: payload.userId,
        batchNumber: payload.batchNumber,
        description: payload.description
      })
      if (response && response.success) {
        yield put({
          type: 'queryDetail',
          payload: {
            id: payload.transId || payload.id,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        yield put({
          type: 'queryDetailReport',
          payload: {
            id: payload.transId || payload.id,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * queryDetailData ({ payload = {} }, { call, put }) {
      const { detailData, ...other } = payload
      const data = yield call(queryListDetail, other)
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetail: data.data.map((item, index) => ({ ...item, no: index + 1 })),
            detailPagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total,
              showSizeChanger: true,
              showQuickJumper: true
            }
          }
        })
        yield put({
          type: 'queryDetailDataFinished',
          payload: {
            ...other,
            status: detailData && detailData.batch && detailData.activeBatch && detailData.activeBatch.batchNumber === 1 && !detailData.activeBatch.status ?
              ['MISS', 'DIFF', 'FINISHED'] : ['DIFF', 'CONFICT', 'FINISHED']
          }
        })
      } else {
        throw data
      }
    },

    * queryDetailDataFinished ({ payload = {} }, { call, put }) {
      const data = yield call(queryListDetail, payload)
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetailFinish: data.data.map((item, index) => ({ ...item, no: index + 1 })),
            finishPagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total,
              showSizeChanger: true,
              showQuickJumper: true
            }
          }
        })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryActive ({ payload = {} }, { call, put }) {
      const data = yield call(queryActive, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listActive: data.data
          }
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'queryActive'
        })
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
        if (payload.reset) {
          payload.reset()
        }
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ stockOpname }) => stockOpname.currentItem.id)
      const newCounter = { ...payload.data, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
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
