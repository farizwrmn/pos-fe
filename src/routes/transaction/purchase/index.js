import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import PurchaseForm from './PurchaseForm'
import PurchaseList from './PurchaseList'

const Purchase = ({ location, dispatch, purchase, loading }) => {
  const {
    item, supplierInformation, listProduct, rounding, dataBrowse, listSupplier, tmpSupplierData, date, datePicker, modalProductVisible,
    modalPurchaseVisible, discPRC, discNML, curDiscPercent, curDiscNominal,
  } = purchase

  const purchaseProps = {
    date: date,
    datePicker: datePicker,
    item: item ? item : '',
    tempo: 0,
    rounding,
    dataBrowse: dataBrowse,
    curDiscPercent: curDiscPercent,
    curDiscNominal: curDiscNominal,
    listSupplier: listSupplier,
    modalProductVisible: modalProductVisible,
    modalPurchaseVisible: modalPurchaseVisible,
    supplierInformation: supplierInformation ? supplierInformation : null,
    tmpSupplierData: tmpSupplierData,
    dataSource: listProduct,
    location: location,
    loading: loading,
    purchase: purchase,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'purchase/add',
        payload: data,
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
    onChangeDatePicker (e) {
      dispatch({
        type: 'purchase/chooseDatePicker',
        payload: e,
      })
    },
    onChangeDate (e) {
      dispatch({
        type: 'purchase/chooseDate',
        payload: e,
      })
    },
    onSearchSupplier (data, e) {
      dispatch({
        type: 'purchase/onSupplierSearch',
        payload: {
          searchText: data,
          tmpSupplierData: e,
        },
      })
    },
    onChooseSupplier (data) {
      dispatch({
        type: 'purchase/onChooseSupplier',
        payload: data,
      })
    },
    onDiscPercent (data) {
      dispatch({ type: 'purchase/onDiscPercent', payload: data })
      dispatch({ type: 'purchase/editPurchase', payload: { value: data, kodeUtil: 'discountPercent', effectedRecord: 0 } })
    },
    onDiscNominal (data) {
      dispatch({ type: 'purchase/onDiscNominal', payload: data })
      dispatch({ type: 'purchase/editPurchase', payload: { value: data, kodeUtil: 'discountNominal', effectedRecord: 0 } })
    },
    onChangePPN (data) {
      localStorage.setItem('taxType', data)
      dispatch({ type: 'purchase/editPurchase', payload: { value: 0, kodeUtil: data, effectedRecord: 0 } })
    },
    onChooseItem (data) {
      dispatch({ type: 'purchase/editPurchase', payload: { value: data.VALUE, effectedRecord: data.Record, kodeUtil: data.Detail } })
    },
    onResetBrowse () {
      dispatch({ type: 'purchase/resetBrowse' })
    },
    onGetSupplier () {
      dispatch({ type: 'purchase/querySupplier' })
    },
    onDelete (e) {
      dispatch({ type: 'purchase/deleteList', payload: e })
    },
    onCancel () {
      dispatch({ type: 'purchase/modalEditHide' })
      dispatch({ type: 'purchase/hideProductModal' })
    },
    onChooseItemItem (e) {
      let listByCode = (localStorage.getItem('product_detail') ? localStorage.getItem('product_detail') : [] )
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
        ket: '',
        total: 0,
      })
      localStorage.setItem('product_detail', JSON.stringify(arrayProd))
      dispatch({ type: 'purchase/querySuccessByCode', payload: { listByCode: item } })
      dispatch({ type: 'purchase/hideProductModal' })
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
  purchase: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ purchase, loading }) => ({ purchase, loading }))(Purchase)
