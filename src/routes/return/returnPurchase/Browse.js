import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProduct'
import ListInvoice from './ListInvoice'

const Browse = ({
  showProductQty,
  modalInvoiceVisible,
  modalProductVisible,
  tmpInvoiceList,
  onInvoiceHeader,
  onChooseInvoice,
  location,
  purchase,
  loading,
  onChooseItem,
  totalItem,
  returnPurchase,
  dispatch,
  ...modalProps
}) => {
  const { listInvoice } = purchase
  const {
    searchText,
    listProduct,
    pagination
  } = returnPurchase
  const width = '80%'
  const modalOpts = {
    ...modalProps
  }

  console.log('listProduct', listProduct)

  const listProps = {
    purchase,
    dataSource: modalInvoiceVisible ? listInvoice : (listProduct.map(item => ({ ...item, DPP: item.dpp }))),
    loading: loading.effects['purchase/getInvoiceHeader']
      || loading.effects['purchase/queryHistory']
      || loading.effects['returnPurchase/getInvoiceDetailPurchase'],
    loadingProduct: loading,
    loadingQty: loading,
    dispatch,
    pagination: modalInvoiceVisible ? null : (pagination && pagination.current > 0 ? pagination : null),
    tmpInvoiceList,
    searchText,
    location,
    totalItem,
    onInvoiceHeader,
    // onChange (e) {
    //   if (modalType === 'browseProductLock' || modalType === 'browseProductFree') {
    //     onChange(e)
    //   }
    // },
    onChange (e) {
      if (modalProductVisible && pagination && pagination.current > 0) {
        dispatch({
          type: 'returnPurchase/queryProduct',
          payload: {
            q: searchText === '' ? null : searchText,
            active: 1,
            page: Number(e.current),
            pageSize: Number(e.pageSize)
          }
        })
      }
    },
    showProductQty (id) {
      showProductQty(id)
    },
    onChooseItem (item) {
      onChooseItem(item)
    },
    onChooseInvoice (item) {
      onChooseInvoice(item)
    }
  }
  return (
    <Modal {...modalOpts} width={width} height="80%" footer={null}>
      {modalProductVisible && <ListProduct {...listProps} />}
      {modalInvoiceVisible && <ListInvoice {...listProps} />}
    </Modal >
  )
}

Browse.propTypes = {
  purchase: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
  onChangeTotalItem: PropTypes.func.isRequired,
  DeleteItem: PropTypes.func.isRequired,
  onChooseItem: PropTypes.func.isRequired,
  totalItem: PropTypes.string
}

export default Browse
