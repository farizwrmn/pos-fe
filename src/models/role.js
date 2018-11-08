import modelExtend from 'dva-model-extend'
import { arrayToTree } from 'utils'
import { query, add, edit, remove } from '../services/role'
import { query as queryMenu } from '../services/menu'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'role',

  state: {
    listRole: [],
    roles: [],
    originalMenus: [],
    originalRoles: [],
    editRole: '',
    addRole: false,
    modalPermissionVisible: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/role') {
          dispatch({ type: 'query' })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      let menus = yield call(queryMenu, payload)
      if (menus.success) {
        menus = menus.data.map((x) => {
          return { id: x.id, menuId: x.menuId, name: x.name, bpid: x.bpid, mpid: x.mpid }
        })
        yield put({
          type: 'updateState',
          payload: {
            originalMenus: menus
          }
        })
      }
      let roles = yield call(query, payload)
      if (roles.success) {
        roles = roles.data.map((x) => {
          return { miscName: x.miscName, miscDesc: x.miscDesc, miscVariable: x.miscVariable }
        })
        yield put({
          type: 'sort',
          payload: {
            roles
          }
        })
      }
      yield put({
        type: 'setRole',
        payload: {
          menus,
          roles
        }
      })
    },

    * modifyRole ({ payload }, { put }) {
      let { item, roles, originalMenus, editRole } = payload
      let tempRoles = roles.filter(x => x.miscDesc !== item.name)
      roles = roles.find(x => x.miscDesc === item.name)
      let variable = roles.miscVariable
      if (item.checked) {
        if (!variable) {
          variable = item.value
        } else {
          variable += (`,${item.value}`)
        }
      } else {
        let index = variable.split(',').indexOf(item.value)
        if (index > -1) {
          variable = variable.split(',').filter(x => x !== item.value).join()
        }
      }
      tempRoles.push({ miscName: editRole, miscDesc: item.name, miscVariable: variable })
      yield put({
        type: 'sort',
        payload: {
          roles: tempRoles
        }
      })
      yield put({
        type: 'setRole',
        payload: {
          menus: originalMenus,
          roles: tempRoles
        }
      })
    },

    * setRole ({ payload }, { put }) {
      let { menus, roles } = payload
      let data = []
      if (menus && roles) {
        if (menus.length && roles.length) {
          let check = {}
          for (let m in menus) {
            for (let r in roles) {
              check[roles[r].miscDesc] = menus[m].menuId
            }
            data.push(Object.assign({}, menus[m], check))
          }
          let tempData = data
          let sortArrayNullAsc = []
          data = arrayToTree(tempData.filter(_ => _.mpid !== '-1'), 'menuId', 'mpid')
          for (let key in data) sortArrayNullAsc.push(data[key])
          data = arrayToTree(tempData.filter(_ => _.mpid === '-1'), 'menuId', 'mpid')
          for (let key in data) sortArrayNullAsc.push(data[key])
          sortArrayNullAsc.sort((x, y) => x.menuId - y.menuId)
          yield put({
            type: 'updateState',
            payload: {
              listRole: sortArrayNullAsc,
              roles
            }
          })
        }
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            addRole: false
          }
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            editRole: ''
          }
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * updateRole ({ payload }, { call, put }) {
      const data = yield call(edit, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            editRole: ''
          }
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }
  },

  reducers: {
    sort (state, { payload }) {
      const { roles } = payload
      roles.sort((x, y) => ((x.miscDesc > y.miscDesc) ? 1 : ((y.miscDesc > x.miscDesc) ? -1 : 0)))
      return { ...state, roles }
    }
  }
})
