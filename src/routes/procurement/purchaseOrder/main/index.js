import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ModalQuotation from './ModalQuotation'
import Form from './Form'
import ModalProduct from './ModalProduct'
import ModalEdit from './ModalEdit'
import ModalAddProduct from './ModalAddProduct'

const Counter = ({ app, purchaseSafetyStock, purchaseOrder, productbrand, productcategory, purchase, loading, dispatch, location }) => {
  const { user, storeInfo } = app
  const {
    listQuotationTrans,
    listQuotationSupplier,
    modalQuotationVisible,
    currentItem,
    listItem,
    modalEditVisible,
    modalEditItem,
    modalAddProductVisible,
    modalProductVisible
  } = purchaseOrder

  const {
    listStore,
    listDistributionCenter
  } = purchaseSafetyStock

  const { listCategory } = productcategory

  const { listBrand } = productbrand

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
    dispatch,
    user,
    storeInfo,
    item: currentItem,
    listStore: listDistributionCenter.concat(listStore),
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
    onGetProduct (header) {
      dispatch({ type: 'purchaseOrder/showModalProduct' })
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          active: 1
        }
      })
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalProductVisible: true,
          modalEditHeader: header
        }
      })
    },
    onProductAdd (header) {
      dispatch({ type: 'purchaseOrder/showModalAddProduct' })
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalAddProductVisible: true,
          modalEditHeader: header
        }
      })
    },
    onOpenHistory () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          currentItem: {
            transNo: currentItem.transNo
          },
          listItem: []
        }
      })
      dispatch(routerRedux.push('/transaction/procurement/order-history'))
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

  const modalAddProductProps = {
    listCategory,
    listBrand,
    visible: modalAddProductVisible,
    loading,
    onOk (data, reset) {
      dispatch({
        type: 'purchaseOrder/addStagingProduct',
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseOrder/updateState',
        payload: {
          modalAddProductVisible: false
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
        type: 'purchaseOrder/addItem',
        payload: record
      })
    },
    onOk (data, reset) {
      dispatch({
        type: 'purchaseOrder/addStagingProduct',
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseOrder/updateState',
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
      {modalAddProductVisible && <ModalAddProduct {...modalAddProductProps} />}
      {modalQuotationVisible && <ModalQuotation {...modalQuotationProps} />}
      {modalEditVisible && <ModalEdit {...modalEditProps} />}
    </div>
  )
}

Counter.propTypes = {
  purchaseSafetyStock: PropTypes.object,
  purchaseOrder: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseSafetyStock, purchaseOrder, productcategory, productbrand, purchase, loading, app }) => ({ purchaseSafetyStock, purchaseOrder, productcategory, productbrand, purchase, loading, app }))(Counter)
