import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ purchaseReceive, app, dispatch, loading, location }) => {
  const { modalType, listItem, currentItem } = purchaseReceive
  const { user, storeInfo } = app

  const listItemProps = {
    dataSource: listItem,
    listItem,
    pagination: false,
    item: currentItem,
    loading: loading.effects['purchaseReceive/queryRequisitionDetail']
      || loading.effects['purchaseReceive/add']
      || loading.effects['purchaseReceive/createPurchaseOrder']
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
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    loading: loading.effects['purchaseReceive/add']
      || loading.effects['purchaseReceive/createPurchaseOrder'],
    onSubmit (transNo, data) {
      dispatch({
        type: 'purchaseReceive/add',
        payload: {
          transId: currentItem.id,
          supplierId: currentItem.supplierId,
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
        type: 'purchaseReceive/updateState',
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
  purchaseReceive: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseReceive, loading, app }) => ({ purchaseReceive, loading, app }))(Counter)
