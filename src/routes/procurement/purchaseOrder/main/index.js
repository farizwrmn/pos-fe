import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ModalQuotation from './ModalQuotation'
import Form from './Form'
import ModalEdit from './ModalEdit'

const Counter = ({ purchaseOrder, purchase, loading, dispatch, location }) => {
  const {
    listQuotationTrans,
    listQuotationSupplier,
    modalQuotationVisible,
    currentItem,
    listItem,
    modalEditVisible,
    modalEditItem
  } = purchaseOrder

  const {
    listSupplier,
    listPurchaseLatestDetail
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
    onModalVisible (record, header) {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalEditItem: record,
          modalEditVisible: true,
          modalEditHeader: header
        }
      })
      dispatch({
        type: 'purchase/getPurchaseLatestDetail',
        payload: {
          productId: record.productId
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
    listItem,
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseOrder/add',
        payload: {
          data,
          listItem,
          reset
        }
      })
    },
    onChangeTotalData (header, listItem) {
      dispatch({
        type: 'purchaseOrder/changeTotalData',
        payload: {
          header, listItem
        }
      })
    },
    onGetProduct () {
      dispatch({ type: 'purchaseOrder/queryProduct', payload: {} })
    },
    onGetQuotation () {
      dispatch({ type: 'purchaseOrder/queryCount', payload: {} })
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          currentItem: {
            transNo: currentItem.transNo
          },
          listItem: [],
          modalQuotationVisible: true
        }
      })
      dispatch({ type: 'purchaseOrder/querySequence' })
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

  const modalEditProps = {
    visible: modalEditVisible,
    loading,
    currentItem,
    item: currentItem,
    listPurchaseLatestDetail,
    loadingPurchaseLatest: loading.effects['purchase/getPurchaseLatestDetail'],
    currentItemList: modalEditItem,
    onOk (data) {
      dispatch({
        type: 'purchaseOrder/editItem',
        payload: {
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalEditItem: {},
          modalEditVisible: false,
          modalEditHeader: {}
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
      {modalQuotationVisible && <ModalQuotation {...modalQuotationProps} />}
      {modalEditVisible && <ModalEdit {...modalEditProps} />}
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
