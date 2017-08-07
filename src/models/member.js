import * as memberService from '../services/member'
import * as stockService from '../services/stock'
import { parse } from 'qs'
import { Modal } from 'antd'

const { queryByCode } = memberService
const { stockByCode = stockService.queryByCode } = stockService

export default {
  namespace: 'member',
  state: {
    list: [],
    memberInformation: [],
    selectedRowKeys: [],
  },

  subscriptions: {

  },

  effects: {
    *getMember ({ payload }, { call, put }) {
      const data = yield call(queryByCode, payload.memberCode)
      let newData = data.members
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var arrayProd = dataPos.slice()
      if ( data.success ) {
        if ( JSON.stringify(arrayProd) != "[]" ) {
          for (var i in arrayProd) {
            const dataStock = yield call(stockByCode, arrayProd[i].barcode)
            let newDataStock = dataStock.stocks
            arrayProd[i].price = newDataStock.memberPrice
            arrayProd[i].total = arrayProd[i].qty * newDataStock.memberPrice
          }

          localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
        }

        yield put({
          type: 'querySuccessByCode',
          payload: {
            memberInformation: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!',
        })

        setTimeout(() => modal.destroy(), 1000)

        //throw data
      }
    },
  },


  reducers: {
    querySuccessByCode (state, action) {
      const { memberInformation } = action.payload

      return { ...state,
        memberInformation, }
    },
  }
}
