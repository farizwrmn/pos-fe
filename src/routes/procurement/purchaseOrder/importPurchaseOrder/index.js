import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ importPurchaseOrder, loading, dispatch, location, app }) => {
  const { list, pagination, modalType, currentItem } = importPurchaseOrder
  const { user, storeInfo } = app

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['importPurchaseOrder/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'importPurchaseOrder/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'importPurchaseOrder/delete',
        payload: id
      })
    }
  }

  const formProps = {
    listProps,
    user,
    dispatch,
    storeInfo,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `importPurchaseOrder/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'importPurchaseOrder/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Counter.propTypes = {
  importPurchaseOrder: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ importPurchaseOrder, loading, app }) => ({ importPurchaseOrder, loading, app }))(Counter)
