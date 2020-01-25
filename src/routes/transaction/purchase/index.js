import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal } from 'antd'
import PurchaseForm from './PurchaseForm'
import PurchaseList from './PurchaseList'

const Purchase = ({ location, dispatch, purchase, loading }) => {
  const {
    item,
    paginationSupplier,
    supplierInformation,
    pagination,
    listProduct,
    rounding,
    dataBrowse,
    listSupplier,
    tmpSupplierData,
    date,
    datePicker,
    modalProductVisible,
    modalPurchaseVisible,
    searchText,
    searchTextSupplier,
    discPRC,
    discNML,
    curDiscPercent,
    curDiscNominal,
    curHead,
    listPurchaseLatestDetail
  } = purchase

  const purchaseProps = {
    date,
    datePicker,
    listPurchaseLatestDetail,
    loadingPurchaseLatest: loading.effects['purchase/getPurchaseLatestDetail'],
    searchTextSupplier,
    paginationSupplier,
    item: item || '',
    curHead,
    tempo: 0,
    pagination,
    rounding,
    dataBrowse,
    curDiscPercent,
    curDiscNominal,
    listSupplier,
    modalProductVisible,
    modalPurchaseVisible,
    supplierInformation: supplierInformation || null,
    tmpSupplierData,
    dataSource: listProduct,
    location,
    disableButton: loading.effects['purchase/add'],
    loading,
    purchase,
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'purchase/add',
        payload: data
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
        type: 'purchase/getProducts',
        payload: {
          active: 1
        }
      })

      dispatch({
        type: 'purchase/showProductModal',
        payload: {
          modalType: 'browseProduct'
        }
      })
    },
    onChangeDatePicker (e) {
      dispatch({
        type: 'purchase/chooseDatePicker',
        payload: e
      })
    },
    onChangeDate (e) {
      dispatch({
        type: 'purchase/chooseDate',
        payload: e
      })
    },
    onSearchSupplier (data) {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          searchTextSupplier: data
        }
      })
      dispatch({
        type: 'purchase/querySupplier',
        payload: {
          q: data
        }
      })
    },
    onSearchSupplierData (data) {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          searchTextSupplier: data.q
        }
      })
      dispatch({
        type: 'purchase/querySupplier',
        payload: {
          ...data
        }
      })
    },
    onChooseSupplier (data) {
      dispatch({
        type: 'purchase/onChooseSupplier',
        payload: data
      })
    },
    onDiscPercent (x, data) {
      dispatch({ type: 'purchase/returnState', payload: { dataBrowse: x, curHead: data } })
    },
    // onChangePPN (data) {
    //   localStorage.setItem('taxType', data)
    //   dispatch({ type: 'purchase/editPurchase', payload: { value: 0, kodeUtil: data, effectedRecord: 0 } })
    // },
    onChooseItem (data, head) {
      dispatch({ type: 'purchase/editPurchaseList', payload: { data, head } })
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
          ket: '',
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
    modalShow (data) {
      dispatch({
        type: 'purchase/modalEditShow',
        payload: {
          data
        }
      })
      dispatch({
        type: 'purchase/getPurchaseLatestDetail',
        payload: {
          productId: data.code
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
  purchase: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ purchase, loading }) => ({ purchase, loading }))(Purchase)
