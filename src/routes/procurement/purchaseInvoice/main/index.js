import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import ModalProduct from './ModalProduct'
import ModalEdit from './ModalEdit'

const Counter = ({ purchaseInvoice, purchase, loading, dispatch, location }) => {
  const {
    currentItem,
    listItem,
    modalEditVisible,
    modalEditItem,
    modalProductVisible
  } = purchaseInvoice

  const {
    listSupplier,
    listPurchaseLatestDetail,
    searchText,
    listProduct,
    pagination
  } = purchase

  const listItemProps = {
    dataSource: listItem,
    listItem,
    loading: loading.effects['purchaseInvoice/query'],
    pagination: false,
    location,
    onChange (page) {
      dispatch({
        type: 'purchaseInvoice/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onModalVisible (record, header) {
      dispatch({
        type: 'purchaseInvoice/updateState',
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
        type: 'purchaseInvoice/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'purchaseInvoice/query'
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
        type: 'purchaseInvoice/add',
        payload: {
          data,
          listItem,
          reset
        }
      })
    },
    onChangeTotalData (header, listItem) {
      dispatch({
        type: 'purchaseInvoice/changeTotalData',
        payload: {
          header, listItem
        }
      })
    },
    onGetReceive (header) {
      dispatch({ type: 'purchaseInvoice/showModalReceive' })
      dispatch({
        type: 'purchaseInvoice/queryReceive'
      })
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          listItem: [],
          modalReceiveVisible: true,
          modalEditHeader: header
        }
      })
      dispatch({ type: 'purchaseOrder/querySequence' })
    },
    onGetProduct (header) {
      dispatch({ type: 'purchaseInvoice/showModalProduct' })
      if (currentItem && !currentItem.addProduct) {
        dispatch({
          type: 'purchaseInvoice/updateState',
          payload: {
            listItem: []
          }
        })
      }
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          active: 1
        }
      })
      dispatch({
        type: 'purchaseInvoice/updateState',
        payload: {
          modalProductVisible: true,
          modalEditHeader: header
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
        type: 'purchaseInvoice/updateState',
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
    listPurchaseLatestDetail,
    loadingPurchaseLatest: loading.effects['purchase/getPurchaseLatestDetail'],
    currentItemList: modalEditItem,
    onOk (data) {
      dispatch({
        type: 'purchaseInvoice/editItem',
        payload: {
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseInvoice/updateState',
        payload: {
          modalEditItem: {},
          modalEditVisible: false,
          modalEditHeader: {}
        }
      })
    },
    onDeleteItem (item) {
      dispatch({
        type: 'purchaseInvoice/deleteItem',
        payload: {
          item
        }
      })
    }
  }

  const modalProductProps = {
    visible: modalProductVisible,
    searchText,
    dataSource: listProduct,
    loading: loading.effects['purchase/getProducts'],
    loadingProduct: loading,
    location,
    pagination,
    handleChange (e) {
      const { value } = e.target

      dispatch({
        type: 'purchase/updateState',
        payload: {
          searchText: value
        }
      })
    },
    handleSearch () {
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          page: 1,
          pageSize: pagination.pageSize,
          q: searchText
        }
      })
    },
    handleReset () {
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          page: 1,
          pageSize: pagination.pageSize,
          q: null
        }
      })
      dispatch({
        type: 'purchase/updateState',
        payload: {
          searchText: null
        }
      })
    },
    onChange (e) {
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          page: e.current,
          pageSize: e.pageSize,
          active: 1,
          q: searchText === '' ? null : searchText
        }
      })
    },
    onChooseItem (record) {
      dispatch({
        type: 'purchaseInvoice/addItem',
        payload: record
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseInvoice/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {modalProductVisible && <ModalProduct {...modalProductProps} />}
      {modalEditVisible && <ModalEdit {...modalEditProps} />}
    </div>
  )
}

Counter.propTypes = {
  purchaseInvoice: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseInvoice, purchase, loading, app }) => ({ purchaseInvoice, purchase, loading, app }))(Counter)
