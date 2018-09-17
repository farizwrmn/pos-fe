import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal } from 'antd'
import PurchaseForm from './PurchaseForm'
import PurchaseList from './PurchaseList'

const Purchase = ({ location, dispatch, purchase, loading }) => {
  const {
    item, supplierInformation, searchText, listProduct, pagination, curHead, rounding, dataBrowse, listSupplier, date, datePicker, modalProductVisible,
    modalPurchaseVisible, discPRC, discNML, transNo, curDiscPercent, curDiscNominal } = purchase

  const purchaseProps = {
    date,
    datePicker,
    pagination,
    item: item || '',
    curHead,
    tempo: 0,
    rounding,
    transNo,
    dataBrowse,
    curDiscPercent,
    curDiscNominal,
    listSupplier,
    modalProductVisible,
    modalPurchaseVisible,
    supplierInformation: supplierInformation || {},
    tmpSupplierData: listSupplier,
    dataSource: listProduct,
    location,
    disableButton: loading.effects['purchase/update'],
    loading,
    purchase,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk (id, data, dataVoid, e) {
      dispatch({
        type: 'purchase/update',
        payload: {
          id,
          data,
          dataVoid,
          e
        }
      })
    },
    onChange (e) {
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          page: e.current,
          pageSize: e.pageSize,
          q: searchText === '' ? null : searchText
        }
      })
    },
    onChangeRounding (e) {
      dispatch({
        type: 'purchase/changeRounding',
        payload: e
      })
    },
    onChangeTotalItem (data) {
      dispatch({
        type: 'purchase/setTotalItem',
        payload: data
      })
    },
    handleBrowseProduct () {
      dispatch({
        type: 'purchase/getProducts'
      })

      dispatch({
        type: 'purchase/showProductModal',
        payload: {
          modalType: 'browseProduct'
        }
      })
    },
    handleBrowseVoid () {
      let voidList = localStorage.getItem('purchase_void') ? JSON.parse(localStorage.getItem('purchase_void')) : null
      if (voidList === null) {
        Modal.warning({
          title: 'No Void in storage',
          content: 'void list is empty'
        })
      } else {
        dispatch({
          type: 'purchase/showProductModal',
          payload: {
            modalType: 'browseVoid',
            listVoid: voidList
          }
        })
      }
    },
    onInvoiceHeader (period) {
      dispatch({
        type: 'purchase/getInvoiceHeader',
        payload: {
          ...period
        }
      })
    },
    handleBrowseInvoice () {
      dispatch({
        type: 'purchase/getProducts',
        payload: {
          modalType: 'browseInvoice'
        }
      })

      dispatch({
        type: 'purchase/showProductModal',
        payload: {
          modalType: 'browseInvoice'
        }
      })
    },
    onChooseItem (data, head) {
      // console.log('confirm', data)
      // dispatch({ type: 'purchase/checkQuantityEditProduct', payload: {data} })
      dispatch({ type: 'purchase/editPurchaseList', payload: { data, head } })
    },
    onDiscPercent (x, data) {
      dispatch({ type: 'purchase/returnState', payload: { dataBrowse: x, curHead: data } })
    },
    onVoid (data) {
      console.log('void')
      let dataVoid = localStorage.getItem('purchase_void') ? JSON.parse(localStorage.getItem('purchase_void')) : []
      data.count = dataVoid.length + 1
      dispatch({ type: 'purchase/voidPurchaseList', payload: data })
      dispatch({ type: 'purchase/editPurchaseList', payload: { data, head: transNo } })
    },
    onRestoreVoid (e) {
      transNo.taxType = localStorage.getItem('taxType')
      dispatch({ type: 'purchase/deleteVoidList', payload: e })
      dispatch({ type: 'purchase/editPurchaseList', payload: { data: e, head: transNo } })
      dispatch({ type: 'purchase/hideProductModal' })
    },
    onDelete (data) {
      dispatch({ type: 'purchase/deleteList', payload: data })
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
      const checkExists = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')).filter(el => el.productCode === e.productCode) : []
      if (checkExists.length === 0) {
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
          total: 0
        })
        localStorage.setItem('product_detail', JSON.stringify(arrayProd))
        dispatch({ type: 'purchase/querySuccessByCode', payload: { listByCode: item } })
        dispatch({ type: 'purchase/hideProductModal' })
      } else {
        Modal.warning({
          title: 'Cannot add product',
          content: 'Already Exists in list'
        })
      }
    },
    onChooseInvoice (e) {
      dispatch({
        type: 'purchase/getInvoiceDetail',
        payload: e
      })
    },
    modalShow (data) {
      dispatch({
        type: 'purchase/modalEditShow',
        payload: {
          data
        }
      })
    }
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
  loading: PropTypes.isRequired
}


export default connect(({ purchase, loading }) => ({ purchase, loading }))(Purchase)
