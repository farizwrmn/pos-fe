import pathToRegexp from 'path-to-regexp'
import { query } from '../../services/employees'

export default {

  namespace: 'employeeDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/master/employee/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { employeeId: match[1] } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const queryArray = (array, key, keyAlias = 'key') => {
        if (!(array instanceof Array)) {
          return null
        }
        let data

        for (let item of array) {
          if (item[keyAlias] === key) {
            data = item
            break
          }
        }

        if (data) {
          return data
        }
        return null
      }

      const data = yield call(query, payload)
      let newData = data.data
      const data2 = queryArray(newData, payload.employeeId, 'employeeId')
      // const { success, message, status, ...other } = data
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data2,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
