import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ purchaseSafetyStock, purchaseRequisition, loading, dispatch, location }) => {
  const {
    paginationSafety,
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
      || loading.effects['purchaseRequisition/editItem'],
    location,
    onShowModalEditSupplier (currentItemEdit) {
      dispatch({
        type: 'purchaseRequisition/showModalEditSupplier',
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

  return (
    <div className="content-inner">
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
