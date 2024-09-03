import modelExtend from 'dva-model-extend'
import { query, queryById } from 'services/transaction/posCustomerOrder'
import { pageModel } from 'models/common'
import { directPrinting } from 'services/payment'
import moment from 'moment'
import pesananDiterima from '../../../public/mp3/diterima_orderan.mp3'

export default modelExtend(pageModel, {
  namespace: 'posCashierOrder',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    orders: [],
    orderDetail: { data: [], detail: {} },
    pagination: {
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
      const response = yield call(query, payload)
      if (response.success) {
        if (response.data && response.data.length > 0) {
          try {
            // eslint-disable-next-line no-undef
            const audio = new Audio(pesananDiterima)
            audio.play()
          } catch (error) {
            console.log('Error on audio', error)
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            orders: response.data
          }
        })
      }
    },

    * orderDetail({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload);
      if (response.success) {
        yield put({
          type: "updateState",
          payload: {
            orderDetail: response,
          },
        });
      }
    },

    * printInvoice ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload)
      console.log('response', response)
      let listDetail = []
      for (let key in response.data) {
        const item = response.data[key]
        listDetail = listDetail.concat([
          {
            alignment: 'two', style: 'subtitle', text: item.productName, rightText: ''
          },
          {
            alignment: 'two', style: 'subtitle', text: item.productCode, rightText: ''
          }
        ])
        if (item.memo != null && item.memo !== '') {
          const listMemo = item.memo.split(';')
          for (let keyMemo in listMemo) {
            listDetail = listDetail.concat([
              {
                alignment: 'two', style: 'subtitle', text: `${listMemo[keyMemo]}`.trim(), rightText: ''
              }
            ])
          }
        }
        listDetail = listDetail.concat([
          {
            alignment: 'two', style: 'subtitle', text: 'Qty: 1', rightText: ''
          },
          {
            alignment: 'line', text: ''
          }
        ])
      }

      yield put({
        type: 'directPrinting',
        payload: {
          url: 'http://localhost:8080/api/message?printerName=KASIR&paperWidth=58',
          data: ([
            {
              alignment: 'two', style: 'subtitle', text: '', rightText: ''
            },
            {
              style: 'title', alignment: 'left', text: 'K3EXPRESS'
            },
            {
              alignment: 'line', text: ''
            }
          ]).concat([

            {
              alignment: 'two', style: 'subtitle', text: `No: ${response.detail.transNo}`, rightText: ''
            },
            {
              alignment: 'two', style: 'subtitle', text: `Date: ${moment(response.detail.createdAt).format('YYYY-MM-DD, HH:mm')}`, rightText: ''
            },
            {
              alignment: 'line', text: ''
            },
            {
              alignment: 'two', style: 'subtitle', text: 'Item', rightText: ''
            },
            {
              alignment: 'line', text: ''
            }
          ]).concat(listDetail).concat([
            {
              alignment: 'two', style: 'subtitle', text: `Total: ${response.data.reduce((prev, next) => prev + next.qty, 0)}`, rightText: ''
            },
            {
              style: 'title', alignment: 'center', text: response.detail.orderShortNumber
            }])
        }
      })
    },

    * directPrinting ({ payload }, { call }) {
      try {
        console.log('directPrinting', payload)
        yield call(directPrinting, payload)
      } catch (error) {
        throw error
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
    },

    resetOrderDetail(state) {
      return {
        ...state,
        orderDetail: {
          data: [],
          detail: {},
        },
      };
    },
  }
})
