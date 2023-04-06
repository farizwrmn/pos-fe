import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import ModalEditCost from './ModalEditCost'
import ModalEditQty from './ModalEditQty'
import ModalEditSupplier from './ModalEditSupplier'
import ModalStock from './ModalStock'

const Counter = ({ purchaseSafetyStock, purchaseRequisition, loading, dispatch, location }) => {
  const {
    currentItemEdit,
    paginationSafety,
    modalEditCostVisible,
    modalEditQtyVisible,
    modalEditSupplierVisible,
    modalStockVisible,

    listSupplier,

    listSupplierHistory,
    listPurchaseHistory,
    listPurchaseOrder,
    listStock,

    modalType,
    currentItem,
    listItem,
    listSafetySupplier,
    listSafetyBrand,
    listSafetyCategory,
    listSafety,
    selectedRowKeysSafety
  } = purchaseRequisition
  const {
    listStore,
    listDistributionCenter
  } = purchaseSafetyStock

  const listSafetyProps = {
    listSafetySupplier,
    listSafetyBrand,
    listSafetyCategory,
    selectedRowKeysSafety,
    dataSource: listSafety,
    pagination: paginationSafety,
    loading: loading.effects['purchaseRequisition/querySafetyStock']
      || loading.effects['purchaseRequisition/queryDetailSafety']
      || loading.effects['purchaseRequisition/querySupplierSafety']
      || loading.effects['purchaseRequisition/queryBrandSafety']
      || loading.effects['purchaseRequisition/queryCategorySafety'],
    location,
    updateSelectedKey (selectedRowKeysSafety) {
      dispatch({
        type: 'purchaseRequisition/updateState',
        payload: {
          selectedRowKeysSafety
        }
      })
    },
    handleSubmitAll () {
      dispatch({
        type: 'purchaseRequisition/addMultiItem',
        payload: {
          selectedRowKeysSafety,
          listItem,
          listSafety
        }
      })
    },
    onChange (page) {
      dispatch({
        type: 'purchaseRequisition/queryDetailSafety',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onFilterChange (data) {
      dispatch({
        type: 'purchaseRequisition/queryDetailSafety',
        payload: {
          ...data,
          page: 1,
          pageSize: 10
        }
      })
      dispatch({
        type: 'purchaseRequisition/updateState',
        payload: {
          filterSafety: data
        }
      })
    }
  }

  const listItemProps = {
    dataSource: listItem,
    listItem,
    pagination: false,
    loading: loading.effects['purchaseRequisition/addMultiItem']
      || loading.effects['purchaseRequisition/addItem']
      || loading.effects['purchaseRequisition/editItem']
      || loading.effects['purchaseRequisition/showModalEditSupplier']
      || loading.effects['purchaseRequisition/showModalEditQty']
      || loading.effects['purchaseRequisition/showModalStock']
      || loading.effects['purchaseRequisition/deleteItem'],
    location,
    onShowModalEditSupplier (currentItemEdit) {
      dispatch({
        type: 'purchaseRequisition/showModalEditSupplier',
        payload: {
          currentItemEdit
        }
      })
      dispatch({
        type: 'purchaseRequisition/querySupplier',
        payload: {
          q: ''
        }
      })
    },
    onShowModalEditCost (currentItemEdit) {
      dispatch({
        type: 'purchaseRequisition/showModalEditCost',
        payload: {
          currentItemEdit
        }
      })
    },
    onShowModalEditQty (currentItemEdit) {
      dispatch({
        type: 'purchaseRequisition/showModalEditQty',
        payload: {
          currentItemEdit
        }
      })
    },
    onShowModalStock (currentItemEdit) {
      dispatch({
        type: 'purchaseRequisition/showModalStock',
        payload: {
          currentItemEdit
        }
      })
    },
    deleteItem (currentItemEdit) {
      dispatch({
        type: 'purchaseRequisition/deleteItem',
        payload: {
          currentItemEdit
        }
      })
    }
  }

  const formProps = {
    listItemProps,
    listSafetyProps,
    modalType,
    item: currentItem,
    listStore,
    listDistributionCenter,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseRequisition/create',
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
        type: 'purchaseRequisition/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  const modalEditCostProps = {
    title: `Edit ${currentItemEdit && currentItemEdit.product ? currentItemEdit.product.productName : ''} from ${currentItemEdit && currentItemEdit.product ? currentItemEdit.desiredSupplier.supplierName : ''}`,
    listPurchaseHistory,
    visible: modalEditCostVisible,
    item: currentItemEdit,
    loading: loading.effects['purchaseRequisition/showModalEditCost'],
    onChangeCost ({
      purchasePrice,
      changingCostMemo
    }) {
      dispatch({
        type: 'purchaseRequisition/editCost',
        payload: {
          currentItemEdit,
          purchasePrice,
          changingCostMemo
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseRequisition/hideModalEditCost'
      })
    }
  }

  const modalEditQtyProps = {
    title: `Edit ${currentItemEdit && currentItemEdit.product ? currentItemEdit.product.productName : ''} from ${currentItemEdit && currentItemEdit.product ? currentItemEdit.desiredSupplier.supplierName : ''}`,
    listStock,
    listPurchaseOrder,
    visible: modalEditQtyVisible,
    item: currentItemEdit,
    loading: loading.effects['purchaseRequisition/showModalEditQty']
      || loading.effects['purchaseRequisition/editQty'],
    onChangeQty ({
      qty,
      notFulfilledQtyMemo
    }) {
      dispatch({
        type: 'purchaseRequisition/editQty',
        payload: {
          currentItemEdit,
          qty,
          notFulfilledQtyMemo
        }
      })
    },
    onOk () {
      dispatch({
        type: 'purchaseRequisition/hideModalEditQty'
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseRequisition/hideModalEditQty'
      })
    }
  }

  const modalEditSupplierProps = {
    title: `Edit ${currentItemEdit && currentItemEdit.product ? currentItemEdit.product.productName : ''} from ${currentItemEdit && currentItemEdit.product ? currentItemEdit.desiredSupplier.supplierName : ''}`,
    listSupplierHistory,
    listSupplier,
    visible: modalEditSupplierVisible,
    item: currentItemEdit,
    loading: loading.effects['purchaseRequisition/showModalEditSupplier']
      || loading.effects['purchaseRequisition/querySupplier'],
    onSearch (query) {
      dispatch({
        type: 'purchaseRequisition/querySupplier',
        payload: {
          q: query
        }
      })
    },
    onChooseSupplier (supplier) {
      dispatch({
        type: 'purchaseRequisition/changeSupplier',
        payload: {
          currentItemEdit,
          supplier
        }
      })
    },
    onOk () {
      dispatch({
        type: 'purchaseRequisition/hideModalEditSupplier'
      })
    },
    onCancel () {
      dispatch({
        type: 'purchaseRequisition/hideModalEditSupplier'
      })
    }
  }

  const modalStockProps = {
    title: `Edit ${currentItemEdit && currentItemEdit.product ? currentItemEdit.product.productName : ''} from ${currentItemEdit && currentItemEdit.product ? currentItemEdit.desiredSupplier.supplierName : ''}`,
    listStock,
    visible: modalStockVisible,
    item: currentItemEdit,
    loading: loading.effects['purchaseRequisition/showModalStock'],
    onCancel () {
      dispatch({
        type: 'purchaseRequisition/hideModalStock'
      })
    }
  }

  return (
    <div className="content-inner">
      {modalEditCostVisible && <ModalEditCost {...modalEditCostProps} />}
      {modalEditQtyVisible && <ModalEditQty {...modalEditQtyProps} />}
      {modalEditSupplierVisible && <ModalEditSupplier {...modalEditSupplierProps} />}
      {modalStockVisible && <ModalStock {...modalStockProps} />}
      <Form {...formProps} />
    </div>
  )
}

Counter.propTypes = {
  purchaseRequisition: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseSafetyStock, purchaseRequisition, loading, app }) => ({ purchaseSafetyStock, purchaseRequisition, loading, app }))(Counter)
