import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import ModalEdit from './ModalEdit'

const Counter = ({ purchaseReceive, app, dispatch, loading, location }) => {
  const { modalEditVisible, modalEditItem, modalType, listItem, currentItem } = purchaseReceive
  const { user, storeInfo } = app

  const listItemProps = {
    dataSource: listItem,
    listItem,
    pagination: false,
    item: currentItem,
    loading: loading.effects['purchaseReceive/queryRequisitionDetail']
      || loading.effects['purchaseReceive/add']
      || loading.effects['purchaseReceive/createPurchaseOrder'],
    onModalVisible (modalEditItem) {
      dispatch({
        type: 'purchaseReceive/updateState',
        payload: {
          modalEditItem,
          modalEditVisible: true
        }
      })
    }
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
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseReceive/add',
        payload: {
          transNoId: currentItem.id,
          reference: data.reference,
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
        type: 'purchaseReceive/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  const modalEditProps = {
    visible: modalEditVisible,
    loading,
    currentItem,
    item: currentItem,
    currentItemList: modalEditItem,
    onOk (data) {
      dispatch({
        type: 'purchaseReceive/receive',
        payload: {
          id: currentItem.id,
          productId: data.productId,
          receivedQty: data.receivedQty
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseReceive/updateState',
        payload: {
          modalEditItem: {},
          modalEditVisible: false
        }
      })
    },
    onDeleteItem (item) {
      dispatch({
        type: 'purchaseOrder/deleteItem',
        payload: {
          item
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {modalEditVisible && <ModalEdit {...modalEditProps} />}
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
