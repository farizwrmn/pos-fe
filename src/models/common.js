import modelExtend from 'dva-model-extend'
import { configMain } from 'utils'

const { disableMultiSelect } = configMain

const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}

const pageModel = modelExtend(model, {

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: 0,
      pageSizeOptions: ['5', '10', '20', '40']
    },
    disableMultiSelect
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
})


module.exports = {
  model,
  pageModel
}
