import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from '../../services/master/specificationStock'
import { query as querySpecification } from '../../services/master/specification'
import { pageModel } from './../common'

const success = () => {
  message.success('specificationStock has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'specificationStock',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    typeInput: 'edit',
    listSpecificationCode: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/product/variant') {
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
                field: 'id,name,createdBy,createdAt,updatedBy,updatedAt'
              }
            })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listSpecificationCode: []
        }
      })
      const data = yield call(query, payload)
      if (data.success) {
        if (data.data.length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              typeInput: 'edit'
            }
          })
          yield put({
            type: 'querySuccessCounter',
            payload: {
              listSpecificationCode: data.data,
              pagination: {
                current: Number(data.page) || 1,
                pageSize: Number(data.pageSize) || 10,
                total: data.total
              }
            }
          })
        } else {
          const dataSpecification = yield call(querySpecification, { categoryId: payload.categoryId })
          if (dataSpecification.success && (dataSpecification.data || []).length > 0) {
            yield put({
              type: 'updateState',
              payload: {
                typeInput: 'add'
              }
            })
            yield put({
              type: 'querySuccessCounter',
              payload: {
                listSpecificationCode: dataSpecification.data,
                pagination: {
                  current: Number(dataSpecification.page) || 1,
                  pageSize: Number(dataSpecification.pageSize) || 10,
                  total: dataSpecification.total
                }
              }
            })
          } else {
            yield put({
              type: 'updateState',
              payload: {
                typeInput: 'edit'
              }
            })
          }
        }
      } else {
        throw data
      }
    },

    * queryLov ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listSpecificationCode: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
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
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query',
          payload: {
            type: 'all',
            field: 'id,name,createdBy,createdAt,updatedBy,updatedAt'
          }
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ specificationStock }) => specificationStock.currentItem.id)
      const newCounter = { ...payload, id }
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
    querySuccessCounter (state, action) {
      const { listSpecificationCode, pagination } = action.payload
      return {
        ...state,
        listSpecificationCode,
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
