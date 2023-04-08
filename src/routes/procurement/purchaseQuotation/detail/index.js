import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ purchaseQuotation, app, dispatch, loading, location }) => {
  const { modalType, listSupplierDetail, currentItem } = purchaseQuotation
  const { user, storeInfo } = app

  const listItemProps = {
    dataSource: listSupplierDetail,
    listItem: listSupplierDetail,
    pagination: false,
    item: currentItem,
    loading: loading.effects['purchaseQuotation/queryRequisitionDetail']
  }

  const printProps = {
    user,
    storeInfo,
    item: currentItem
  }

  const formProps = {
    modalType,
    listItemProps,
    printProps,
    item: currentItem,
    listSupplierDetail,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (transNo, data) {
      dispatch({
        type: 'purchaseQuotation/add',
        payload: {
          transId: currentItem.id,
          transNo,
          data
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
        type: 'purchaseQuotation/updateState',
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
  purchaseQuotation: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseQuotation, loading, app }) => ({ purchaseQuotation, loading, app }))(Counter)
