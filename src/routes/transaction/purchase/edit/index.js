import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import PurchaseForm from './PurchaseForm'
import PurchaseList from './PurchaseList'

const Purchase = ({ location, dispatch, purchase, loading }) => {
  const {
    item, supplierInformation, listProduct, rounding, dataBrowse, listSupplier, date, datePicker, modalProductVisible,
    modalPurchaseVisible, discPRC, discNML, transNo } = purchase

  const purchaseProps = {
    date: date,
    datePicker: datePicker,
    item: item ? item : '',
    tempo: 0,
    rounding,
    transNo,
    dataBrowse: dataBrowse,
    modalProductVisible: modalProductVisible,
    modalPurchaseVisible: modalPurchaseVisible,
    supplierInformation: supplierInformation ? supplierInformation : null,
    tmpSupplierData: listSupplier,
    dataSource: listProduct,
    location: location,
    loading: loading,
    purchase: purchase,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk (id, data, e) {
      dispatch({
        type: 'purchase/update',
        payload: {
          id,
          data,
          e,
        },
      })
    },
    onChangeRounding (e) {
      dispatch({
        type: 'purchase/changeRounding',
        payload: e,
      })
    },
    handleBrowseProduct () {
      dispatch({
        type: 'purchase/getProducts',
      })

      dispatch({
        type: 'purchase/showProductModal',
        payload: {
          modalType: 'browseProduct',
        },
      })
    },
    handleBrowseInvoice () {
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          modalType: 'browseInvoice',
        },
      })

      dispatch({
        type: 'purchase/showProductModal',
        payload: {
          modalType: 'browseInvoice',
        },
      })
    },
    onChooseItem (data) {
      dispatch({ type: 'purchase/editPurchase', payload: { value: data.VALUE, effectedRecord: data.Record, kodeUtil: data.Detail } })
    },
    onResetBrowse () {
      dispatch({ type: 'purchase/resetBrowse' })
    },
    onCancel () {
      dispatch({ type: 'purchase/modalEditHide' })
      dispatch({ type: 'purchase/hideProductModal' })
    },
    onChooseItemItem (e) {
      let listByCode = (localStorage.getItem('product_detail') ? localStorage.getItem('product_detail') : [])
      let arrayProd
      if (JSON.stringify(listByCode) === '[]') {
        arrayProd = listByCode.slice()
      } else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        no: arrayProd.length + 1,
        code: e.id,
        productCode: e.productCode,
        name: e.productName,
        qty: 0,
        price: e.costPrice,
        discount: discNML,
        disc1: discPRC,
        dpp: 0,
        ppn: 0,
        ket: 'add',
        total: 0,
      })
      localStorage.setItem('product_detail', JSON.stringify(arrayProd))
      dispatch({ type: 'purchase/querySuccessByCode', payload: { listByCode: item } })
      dispatch({ type: 'purchase/hideProductModal' })
    },
    onChooseInvoice (e) {
      dispatch({
        type: 'purchase/getInvoiceDetail',
        payload: e,
      })
    },
    modalShow (data) {
      dispatch({
        type: 'purchase/modalEditShow',
        payload: {
          data: data,
        },
      })
    },
  }

  return (
    <div className="content-inner">
      <PurchaseForm {...purchaseProps} />
      <PurchaseList {...purchaseProps} />
    </div>
  )
}

Purchase.propTypes = {
  purchase: PropTypes.isRequired,
  location: PropTypes.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.isRequired,
}


export default connect(({ purchase, loading }) => ({ purchase, loading }))(Purchase)
