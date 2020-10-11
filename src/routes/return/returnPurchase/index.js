import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { lstorage } from 'utils'
import Form from './Form'
import Browse from './Browse'
import ModalItem from './Modal'
// import ListTransfer from './ListTransferOut'
// import FilterTransfer from './FilterTransferOut'

// const { getCashierTrans } = lstorage

const ReturnSales = ({ location, returnPurchase, purchase, app, dispatch, loading }) => {
  const {
    list: listReturnSales,
    // listInvoice,
    // tmpInvoiceList,
    // isChecked,
    // listProducts,
    // listTransOut,
    modalInvoiceVisible,
    modalProductVisible,
    listItem,
    currentItem,
    // currentItemList,
    modalEditItemVisible,
    modalConfirmVisible,
    // formType,
    // display,
    // activeKey,
    currentItemList
    // filter,
    // sort,
    // showPrintModal
  } = returnPurchase
  // const { modalProductVisible, listProductData, searchText } = purchase
  const { user, storeInfo } = app
  // const filterProps = {
  //   display,
  //   filter: {
  //     ...location.query
  //   },
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'returnPurchase/query',
  //       payload: {
  //         userName: value.cityName,
  //         ...value
  //       }
  //     })
  //   },
  //   switchIsChecked () {
  //     dispatch({
  //       type: 'returnPurchase/switchIsChecked',
  //       payload: `${isChecked ? 'none' : 'block'}`
  //     })
  //   }
  // }

  const listProps = {
    dataSource: listItem,
    loading: loading.effects['returnPurchase/query'],
    pagination: false,
    location,
    onChange (page) {
      dispatch({
        type: 'returnPurchase/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          currentItemList: record,
          modalEditItemVisible: true
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'returnPurchase/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'returnPurchase/query'
      })
    }
  }

  const modalProductProps = {
    location,
    loading,
    purchase,
    returnPurchase,
    modalProductVisible,
    modalInvoiceVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (/* event */) { },
    showProductQty (data) {
      dispatch({
        type: 'purchase/showProductQty',
        payload: {
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'purchase/hideProductModal'
      })
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalInvoiceVisible: false,
          modalProductVisible: false
        }
      })
    },
    onChooseItem (item) {
      dispatch({
        type: 'returnPurchase/addItem',
        payload: {
          item
        }
      })
    },
    onInvoiceHeader (period) {
      dispatch({
        type: 'purchase/queryHistory',
        payload: {
          ...period
        }
      })
    },
    onChooseInvoice (item) {
      dispatch({
        type: 'returnPurchase/getInvoiceDetailPurchase',
        payload: item
      })
    }
  }

  const handleProductBrowse = () => {
    dispatch({
      type: 'returnPurchase/updateState',
      payload: {
        modalProductVisible: true
      }
    })
  }

  const formEditProps = {
    visible: modalEditItemVisible,
    item: currentItem,
    listStore: lstorage.getListUserStores(),
    currentItemList,
    modalProductProps,
    handleProductBrowse,
    onOkList (item) {
      dispatch({
        type: 'returnPurchase/editItem',
        payload: {
          item
        }
      })
    },
    onCancelList () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          currentItemList: {},
          modalEditItemVisible: false
        }
      })
    },
    onDeleteItem (item) {
      dispatch({
        type: 'returnPurchase/deleteItem',
        payload: {
          item
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          currentItemList: {},
          modalEditItemVisible: false
        }
      })
    }
  }

  const formConfirmProps = {
    visible: modalConfirmVisible,
    modalConfirmVisible,
    itemPrint: currentItem,
    user,
    storeInfo,
    onShowModal () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
    listProps,
    formConfirmProps,
    modalConfirmVisible,
    listTrans: listReturnSales,
    listItem,
    listStore: lstorage.getListUserStores(),
    item: currentItem,
    modalProductVisible,
    modalInvoiceVisible,
    loadingButton: loading,
    purchase,
    loading: loading.effects['returnPurchase/querySequence'],
    disabled: false,
    button: 'Add',
    onSubmit (data, listItem, resetFields) {
      dispatch({
        type: 'returnPurchase/add',
        payload: {
          data,
          detail: listItem,
          resetFields
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          formType: 'add',
          currentItem: {},
          currentItemList: {}
        }
      })
    },
    handleProductBrowse,
    handleInvoiceBrowse () {
      dispatch({
        type: 'purchase/queryHistory',
        payload: {
          startPeriod: moment().startOf('month').format('YYYY-MM-DD'),
          endPeriod: moment().endOf('month').format('YYYY-MM-DD')
        }
      })
      dispatch({
        type: 'purchase/updateState',
        payload: {
          modalType: 'modalInvoice'
        }
      })
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalInvoiceVisible: true
        }
      })
      let startPeriod = moment().startOf('month').format('YYYY-MM-DD')
      let endPeriod = moment().endOf('month').format('YYYY-MM-DD')
      const period = {
        startPeriod,
        endPeriod
      }
      dispatch({
        type: 'purchase/getInvoiceHeader',
        payload: {
          ...period
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      {modalEditItemVisible && <ModalItem {...formEditProps} />}
      {modalProductVisible && <Browse {...modalProductProps} />}
      {modalInvoiceVisible && <Browse {...modalProductProps} />}
    </div>
  )
}

ReturnSales.propTypes = {
  returnPurchase: PropTypes.object,
  purchase: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ returnPurchase, purchase, app, loading }) => ({ returnPurchase, purchase, app, loading }))(ReturnSales)
