import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ModalQuotation from './ModalQuotation'
import Form from './Form'

const Counter = ({ purchaseOrder, purchase, loading, dispatch, location }) => {
  const {
    listQuotationTrans,
    listQuotationSupplier,
    modalQuotationVisible,
    currentItem,
    listItem
  } = purchaseOrder

  const {
    listSupplier
  } = purchase

  const listItemProps = {
    dataSource: listItem,
    listItem,
    loading: loading.effects['purchaseOrder/query'],
    pagination: false,
    location,
    onChange (page) {
      dispatch({
        type: 'purchaseOrder/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          currentItemList: record,
          modalEditItemVisible: true
        }
      })
      dispatch({
        type: 'purchase/getPurchaseLatestDetail',
        payload: {
          productId: record.id
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'purchaseOrder/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'purchaseOrder/query'
      })
    }
  }

  const formProps = {
    item: currentItem,
    listSupplier,
    listItemProps,
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseOrder/add',
        payload: {
          data,
          reset
        }
      })
    },
    onGetProduct () {
      dispatch({ type: 'purchaseOrder/queryProduct', payload: {} })
    },
    onGetQuotation () {
      dispatch({ type: 'purchaseOrder/queryCount', payload: {} })
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
        type: 'purchaseOrder/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  const modalQuotationProps = {
    visible: modalQuotationVisible,
    loading,
    listTrans: listQuotationTrans,
    listSupplier: listQuotationSupplier,
    onGetDataSupplier (transId) {
      dispatch({
        type: 'purchaseOrder/querySupplierCount',
        payload: {
          transId
        }
      })
    },
    onChooseSupplier (transId, supplierId) {
      dispatch({
        type: 'purchaseOrder/chooseQuotation',
        payload: {
          transId,
          supplierId
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalQuotationVisible: false
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {modalQuotationVisible && <ModalQuotation {...modalQuotationProps} />}
    </div>
  )
}

Counter.propTypes = {
  purchaseOrder: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseOrder, purchase, loading, app }) => ({ purchaseOrder, purchase, loading, app }))(Counter)
