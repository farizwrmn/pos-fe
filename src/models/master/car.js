import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd'
import {
  queryBrandsOfCars, addBrandOfCars, updateBrandOfCars, deleteBrandOfCars,
  queryModelsOfCars, addModelOfCars, updateModelOfCars, deleteModelOfCars,
  queryTypesOfCars, addTypeOfCars, updateTypeOfCars, deleteTypeOfCars
} from '../../services/master/car'

const success = (module) => {
  message.success(`${module} has been saved`)
}

export default {
  namespace: 'car',

  state: {
    currentItem: {},
    formType: 'add',
    activeKey: '0',
    listBrand: [],
    listModel: [],
    listType: [],
    listPrintAllBrands: [],
    listPrintAllModels: [],
    listPrintAllTypes: [],
    showPrintModal: false,
    printType: '',
    changed: false,
    queryLoading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: 0
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        dispatch({
          type: 'updateState',
          payload: {
            activeKey: activeKey || '0'
          }
        })
        if (location.pathname === '/master/car/brand') {
          if (activeKey === '1') dispatch({ type: 'queryBrandsOfCars', payload: other })
        } else if (location.pathname === '/master/car/model') {
          dispatch({ type: 'queryModelsOfCars', payload: other })
        } else if (location.pathname === '/master/car/type') {
          dispatch({ type: 'queryTypesOfCars', payload: other })
        }
      })
    }
  },

  effects: {
    * checkLengthOfBrands ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryBrandsOfCars, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllBrands', payload: { type: 'all' } })
        }
      }
    },

    * queryAllBrands ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryBrandsOfCars, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllBrands: data.data,
            changed: true
          }
        })
      }
    },

    * queryBrandsOfCars ({ payload = {} }, { select, call, put }) {
      const active = yield select(({ car }) => car.activeKey)
      let data
      if (active === '1') {
        data = yield call(queryBrandsOfCars, payload)
        if (data.success) {
          yield put({
            type: 'querySuccessBrands',
            payload: {
              listBrand: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.total
              }
            }
          })
        } else {
          throw data
        }
      } else {
        return false
      }
    },

    * addBrandOfCars ({ payload = {} }, { call, put }) {
      const data = yield call(addBrandOfCars, payload)
      if (data.success) {
        success('Brand')
        yield put({ type: 'saveSuccess' })
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

    * updateBrandOfCars ({ payload = {} }, { call, put }) {
      const data = yield call(updateBrandOfCars, payload)
      if (data.success) {
        success('Brand')
        yield put({ type: 'updateSuccess' })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
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

    * deleteBrandOfCars ({ payload = {} }, { select, call, put }) {
      const data = yield call(deleteBrandOfCars, payload)
      const { listBrand, pagination } = yield select(_ => _.car)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listBrand: listBrand.filter(_ => _.id !== payload.id),
            pagination: {
              total: pagination.total - 1
            }
          }
        })
      } else {
        throw data
      }
    },

    * checkLengthOfModels ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryModelsOfCars, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllModels', payload: { type: 'all' } })
        }
      }
    },

    * queryAllModels ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryModelsOfCars, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllModels: data.data,
            changed: true
          }
        })
      }
    },

    * queryModelsOfCars ({ payload = {} }, { select, call, put }) {
      const active = yield select(({ car }) => car.activeKey)
      let data
      if (active === '0' && location.pathname === '/master/car/model') {
        data = yield call(queryBrandsOfCars, { type: 'all' })
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              listBrand: data.data
            }
          })
        } else {
          throw data
        }
      } else if (active === '1') {
        data = yield call(queryModelsOfCars, payload)
        if (data.success) {
          yield put({
            type: 'querySuccessModels',
            payload: {
              listModel: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.total
              }
            }
          })
        } else {
          throw data
        }
      } else {
        return false
      }
    },

    * addModelOfCars ({ payload = {} }, { call, put }) {
      const data = yield call(addModelOfCars, payload)
      if (data.success) {
        success('Model')
        yield put({ type: 'saveSuccess' })
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

    * updateModelOfCars ({ payload = {} }, { call, put }) {
      const data = yield call(updateModelOfCars, payload)
      if (data.success) {
        success('Model')
        yield put({ type: 'updateSuccess' })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
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

    * deleteModelOfCars ({ payload = {} }, { select, call, put }) {
      const data = yield call(deleteModelOfCars, payload)
      const { listModel, pagination } = yield select(_ => _.car)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listModel: listModel.filter(_ => _.id !== payload.id),
            pagination: {
              total: pagination.total - 1
            }
          }
        })
      } else {
        throw data
      }
    },

    * checkLengthOfTypes ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryTypesOfCars, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllTypes', payload: { type: 'all' } })
        }
      }
    },

    * queryAllTypes ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(queryTypesOfCars, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllTypes: data.data,
            changed: true
          }
        })
      }
    },

    * queryTypesOfCars ({ payload = {} }, { select, call, put }) {
      const active = yield select(({ car }) => car.activeKey)
      let data
      if (active === '0' && location.pathname === '/master/car/type') {
        data = yield call(queryModelsOfCars, { type: 'all' })
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              listModel: data.data
            }
          })
        } else {
          throw data
        }
      } else if (active === '1') {
        data = yield call(queryTypesOfCars, payload)
        if (data.success) {
          yield put({
            type: 'querySuccessTypes',
            payload: {
              listType: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.total
              }
            }
          })
        } else {
          throw data
        }
      } else {
        return false
      }
    },

    * addTypeOfCars ({ payload = {} }, { call, put }) {
      const data = yield call(addTypeOfCars, payload)
      if (data.success) {
        success('Type')
        yield put({ type: 'saveSuccess' })
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

    * updateTypeOfCars ({ payload = {} }, { call, put }) {
      const data = yield call(updateTypeOfCars, payload)
      if (data.success) {
        success('Type')
        yield put({ type: 'updateSuccess' })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
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

    * deleteTypeOfCars ({ payload = {} }, { select, call, put }) {
      const data = yield call(deleteTypeOfCars, payload)
      const { listType, pagination } = yield select(_ => _.car)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listType: listType.filter(_ => _.id !== payload.id),
            pagination: {
              total: pagination.total - 1
            }
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    saveSuccess (state) {
      return { ...state, currentItem: {}, formType: 'add' }
    },

    updateSuccess (state) {
      return { ...state, currentItem: {}, formType: 'add', activeKey: '1' }
    },

    querySuccessBrands (state, { payload }) {
      const { listBrand, pagination } = payload
      return {
        ...state,
        listBrand,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessModels (state, { payload }) {
      const { listModel, pagination } = payload
      return {
        ...state,
        listModel,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessTypes (state, { payload }) {
      const { listType, pagination } = payload
      return {
        ...state,
        listType,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
}
