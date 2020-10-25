import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProduct'
import ListInvoice from './ListInvoice'

const Browse = ({
  searchText,
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
  ...modalProps
}) => {
  const { listInvoice } = purchase
  const { listProduct } = returnPurchase
  const width = '80%'
  const modalOpts = {
    ...modalProps
  }

  const listProps = {
    purchase,
    dataSource: modalInvoiceVisible ? listInvoice : listProduct,
    loading: loading.effects['purchase/getInvoiceHeader']
      || loading.effects['purchase/queryHistory']
      || loading.effects['returnPurchase/getInvoiceDetailPurchase'],
    loadingProduct: loading,
    pagination: null,
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
