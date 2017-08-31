import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import PurchaseForm from './PurchaseForm'
import PurchaseList from './PurchaseList'
import { Col, Row, Icon, Button } from 'antd'

const Purchase = ({ location, dispatch, purchase, loading }) => {
  const {
    item, supplierInformation, listProduct, listSupplier, pagination, date, datePicker,modalVisible, searchVisible, modalProductVisible,
    modalPurchaseVisible, modalType, selectedRowKeys, disableMultiSelect, curQty, curDiscPercent, curDiscNominal
  } = purchase

  const modalProps = {
    closable: false,
    loading: loading.effects['purchase/query'],
    width: 950,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['purchase/edit'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `purchase/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'purchase/modalHide',
      })
    },
    onDeleteUnit (id) {
      dispatch({
        type: 'units/delete',
        payload: {
          id,
        },
      })
    },
    onChooseItem (data) {
      dispatch({
        type: 'purchase/chooseEmployee',
      })
    },
  }

  const modalPurchaseProps = {
    location: location,
    loading: loading,
    purchase: purchase,
    visible: modalPurchaseVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
  }

  const purchaseProps = {
    date: date,
    datePicker: datePicker,
    item: item ? item : '',
    tempo: 0,
    curDiscPercent: curDiscPercent,
    curDiscNominal: curDiscNominal,
    listSupplier: listSupplier,
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
    onOk(data) {
      dispatch({
        type: 'purchase/add',
        payload: data,
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
    onChangeDate (date) {
      dispatch({
        type: 'purchase/chooseDate',
        payload: date,
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
    onChooseSupplier(data) {
      dispatch({
        type: 'purchase/onChooseSupplier',
        payload: data,
      })
    },
    onDiscPercent (data) {
      dispatch({ type: 'purchase/onDiscPercent', payload:data })
    },
    onDiscNominal (data) {
      dispatch({ type: 'purchase/onDiscNominal', payload:data })
    },
    onChangePPN (data) {
      dispatch({ type: 'purchase/editPurchase', payload:{ value: 0, kodeUtil: data, effectedRecord: 0 } })
    },
    onChooseItem (data) {
      dispatch({ type: 'purchase/editPurchase', payload:{ value: data.VALUE, effectedRecord: data.Record, kodeUtil: data.Detail } })
    },
    onGetSupplier () {
      dispatch({ type: 'purchase/querySupplier' })
    },
    onCancel () { dispatch({ type: 'purchase/modalEditHide'}), dispatch({ type: 'purchase/hideProductModal' }) },
    onChooseItemItem (item) {
      var listByCode = (localStorage.getItem('product_detail') ? localStorage.getItem('product_detail') : [] )
      var arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        'no': arrayProd.length + 1,
        'code': item.id,
        'productCode': item.productCode,
        'name': item.productName,
        'qty': null,
        'price': item.costPrice,
        'discount': 0,
        'disc1': 0,
        'dpp': 0,
        'ppn': 0,
        'ket': '',
        'total': null,
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

  const modalProductProps = {
    dataSource: listProduct,
    location: location,
    loading: loading,
    purchase: purchase,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () { dispatch({ type: 'purchase/hideProductModal' }) },
    onChooseItem (item) {
      var listByCode = (localStorage.getItem('product_detail') ? localStorage.getItem('product_detail') : [] )
      var arrayProd
      if ( JSON.stringify(listByCode) == "[]" ) {
        arrayProd = listByCode.slice()
      }
      else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      arrayProd.push({
        'no': arrayProd.length + 1,
        'code': item.productCode,
        'name': item.productName,
        'qty': curQty,
        'price': item.costPrice,
        'total': curQty * item.sellPrice
      })
      console.log('arrayProd', arrayProd)
      localStorage.setItem('product_detail', JSON.stringify(arrayProd))
      dispatch({ type: 'purchase/querySuccessByCode', payload: { listByCode: item } })
      dispatch({ type: 'purchase/hideProductModal' })
    },
  }

  return (
    <div className="content-inner">
      <Row gutter={24}>
        <Row span={'100%'}>
          <PurchaseForm {...purchaseProps} />
          <PurchaseList {...purchaseProps}/>
        </Row>
      </Row>
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
