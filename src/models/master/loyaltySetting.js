import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message, Row, Col, Modal } from 'antd'
import { query, queryActive, add, edit, remove } from '../../services/master/loyaltySetting'
import { pageModel } from './../common'

const success = () => {
  message.success('Loyalty Program has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'loyaltySetting',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listAccountCode: [],
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
        if (pathname === '/marketing/loyalty') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          } else {
            dispatch({ type: 'queryActive' })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listAccountCode: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * editItem ({ payload = {} }, { put }) {
      const { item, pathname } = payload
      yield put({
        type: 'updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item
        }
      })
      yield put(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },

    * queryActive (payload, { call, put, select }) {
      const modalType = yield select(({ loyaltySetting }) => loyaltySetting.modalType)
      if (modalType === 'add') {
        const data = yield call(queryActive)
        if (data.success) {
          if (data.data) {
            yield put({
              type: 'updateState',
              payload: {
                modalType: 'edit',
                currentItem: data.data || {}
              }
            })
          } else {
            yield put({
              type: 'updateState',
              payload: {
                currentItem: {}
              }
            })
          }
        }
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
      console.log('data', data)
      if (data.success) {
        success()
        yield put({
          type: 'queryActive'
        })
      } else {
        if (data.statusCode === 409) {
          Modal.warning({
            title: `Loyalty ${data.data.startDate} to ${data.data.expirationDate} conflict other program`,
            content: <Row>
              <Col span={8}>
                <p>Spending</p>
                <p>New Member</p>
                <p>Start From</p>
                <p>Expiration</p>
                <p>Min</p>
                <p>Max</p>
              </Col>
              <Col span={1}>
                <p>:</p>
                <p>:</p>
                <p>:</p>
                <p>:</p>
                <p>:</p>
                <p>:</p>
              </Col>
              <Col span={15}>
                <p>{data.data.setValue}</p>
                <p>{data.data.newMember}</p>
                <p>{data.data.startDate}</p>
                <p>{data.data.expirationDate}</p>
                <p>{data.data.minPayment}</p>
                <p>{data.data.maxDiscount}</p>
              </Col>
            </Row>
          })
        }
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
      const id = yield select(({ loyaltySetting }) => loyaltySetting.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
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
          type: 'queryActive'
        })
      } else {
        if (data.statusCode === 409) {
          Modal.warning({
            title: `Loyalty ${data.data.startDate} to ${data.data.expirationDate} conflict other program`,
            content: <Row>
              <Col span={8}>
                <p>Spending</p>
                <p>New Member</p>
                <p>Start From</p>
                <p>Expiration</p>
                <p>Min</p>
                <p>Max</p>
              </Col>
              <Col span={1}>
                <p>:</p>
                <p>:</p>
                <p>:</p>
                <p>:</p>
                <p>:</p>
                <p>:</p>
              </Col>
              <Col span={15}>
                <p>{data.data.setValue}</p>
                <p>{data.data.newMember}</p>
                <p>{data.data.startDate}</p>
                <p>{data.data.expirationDate}</p>
                <p>{data.data.minPayment}</p>
                <p>{data.data.maxDiscount}</p>
              </Col>
            </Row>
          })
        }
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
      const { listAccountCode, pagination } = action.payload
      return {
        ...state,
        listAccountCode,
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
    }
  }
})
