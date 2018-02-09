import * as positionService from '../services/positions'

const { query } = positionService

export default {
  namespace: 'position',
  state: {
    listPosition: []
  },
  effects: {
    * lov ({ payload }, { put, call }) {
      const data = yield call(query, payload)
      let newData = data.data

      let DICT_FIXED = (function () {
        let fixed = []
        for (let id in newData) {
          if ({}.hasOwnProperty.call(newData, id)) {
            fixed.push({
              value: newData[id].positionId,
              label: newData[id].positionName
            })
          }
        }

        return fixed
      }())

      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listPosition: DICT_FIXED
          }
        })
      }
    }
  },
  reducers: {
    querySuccess (state, action) {
      const { listPosition } = action.payload
      return {
        ...state,
        listPosition
      }
    }
  }
}
