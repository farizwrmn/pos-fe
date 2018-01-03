import modelExtend from 'dva-model-extend'
import { query, add } from '../services/transferStockOut'
import { pageModel } from './common'

export default modelExtend(pageModel, {
    namespace: 'transferIn',
    state: {
        listTrans: [],
        listItem: [],        
        currentItem: {},
        addItem: {},
        modalVisible: false,
        searchVisible: false,
        formType: 'add',
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `Total ${total} Records`,
            current: 1,
            total: null,
        },
    },

    subscriptions: {
        // setup({ dispatch, history }) {
        //     history.listen((location) => {
        //         if (location.pathname === '/master/suppliers') {
        //             dispatch({
        //                 type: 'query',
        //                 payload: location.query,
        //             })
        //         }
        //     })
        // },
    },

    effects: {

        * query({ payload = {} }, { call, put }) {
            const data = yield call(query, payload)
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        listTrans: data.data,
                        pagination: {
                            current: Number(payload.page) || 1,
                            pageSize: Number(payload.pageSize) || 5,
                            total: data.total,
                        },
                    },
                })
            }
        },
        * add({ payload }, { call, put }) {
            const data = yield call(add, payload)
            if (data.success) {
                yield put({ type: 'modalHide' })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },
        // * delete({ payload }, { call, put, select }) {
        //     const data = yield call(remove, { id: payload })
        //     const { selectedRowKeys } = yield select(_ => _.suppliers)
        //     if (data.success) {
        //         yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        //         yield put({ type: 'query' })
        //     } else {
        //         throw data
        //     }
        // },
        // * deleteBatch({ payload }, { call, put }) {
        //     const data = yield call(remove, payload)
        //     if (data.success) {
        //         yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        //         yield put({ type: 'query' })
        //     } else {
        //         throw data
        //     }
        // },
        // * edit({ payload }, { select, call, put }) {
        //     const supplierCode = yield select(({ suppliers }) => suppliers.currentItem.supplierCode)
        //     const newSupplier = { ...payload, supplierCode }
        //     const data = yield call(edit, newSupplier)
        //     if (data.success) {
        //         yield put({ type: 'modalHide' })
        //         yield put({ type: 'query' })
        //     } else {
        //         throw data
        //     }
        // },

    },

    reducers: {

        querySuccess(state, action) {
            const { listSuppliers, pagination } = action.payload
            return {
                ...state,
                listSuppliers,
                pagination: {
                    ...state.pagination,
                    ...pagination,
                }
            }
        },
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    },
})
