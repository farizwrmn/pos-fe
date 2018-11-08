import modelExtend from 'dva-model-extend'
// import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query as queryPermission, queryRole, queryList, edit } from '../../services/permission'
import { pageModel } from './../common'

const success = () => {
  message.success('Permission has been updated')
}

export default modelExtend(pageModel, {
  namespace: 'permission',

  state: {
    currentItem: [],
    roleId: null,
    modalType: 'add',
    activeKey: '0',
    listPermission: [],
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
        if (pathname === '/master/account') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listPermission: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

    * queryCurrentPermission ({ payload = {} }, { call, put }) {
      const { role } = payload
      let roleIdData = yield call(queryRole, { name: role })
      if (roleIdData.success && roleIdData.data.length > 0) {
        roleIdData = roleIdData.data[0]
      }
      if (roleIdData.id) {
        const permission = yield call(queryPermission, { roleId: roleIdData.id })

        let arrayProd = []
        permission.data.map((x) => {
          arrayProd[x['Permission.permissionCode']] = Boolean(parseInt(x.allow, 10))
          return x['Permission.permissionCode']
        })

        yield put({
          type: 'updateState',
          payload: {
            currentItem: arrayProd,
            roleId: roleIdData.id
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: [],
            roleId: null
          }
        })
      }
    },

    // * add ({ payload }, { call, put }) {
    //   const data = yield call(add, payload)
    //   if (data.success) {
    //     success()
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         modalType: 'add',
    //         currentItem: {}
    //       }
    //     })
    //     yield put({
    //       type: 'query'
    //     })
    //   } else {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         currentItem: payload
    //       }
    //     })
    //     throw data
    //   }
    // },

    * edit ({ payload }, { call, put }) {
      const data = yield call(edit, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: [],
            roleId: null
          }
        })
        yield put({
          type: 'role/updateState',
          payload: {
            modalPermissionVisible: false
          }
        })
        success()
      } else {
        throw data
      }
    }

    // * edit ({ payload }, { select, call, put }) {
    //   const id = yield select(({ accountCode }) => accountCode.currentItem.id)
    //   const newCounter = { ...payload, id }
    //   const data = yield call(edit, newCounter)
    //   if (data.success) {
    //     success()
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         modalType: 'add',
    //         currentItem: {},
    //         activeKey: '1'
    //       }
    //     })
    //     const { pathname } = location
    //     yield put(routerRedux.push({
    //       pathname,
    //       query: {
    //         activeKey: '1'
    //       }
    //     }))
    //     yield put({ type: 'query' })
    //   } else {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         currentItem: payload
    //       }
    //     })
    //     throw data
    //   }
    // }
  },

  reducers: {
    querySuccess (state, action) {
      const { listPermission, pagination } = action.payload
      return {
        ...state,
        listPermission,
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
