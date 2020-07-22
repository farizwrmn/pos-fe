import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProductLock'
import ListInvoice from './ListInvoice'

const Browse = ({ searchText, showProductQty, modalInvoiceVisible, onChange, modalProductVisible, listInvoice, tmpInvoiceList, onInvoiceHeader, onChooseInvoice, location, pos, loading, DeleteItem, onChooseItem, totalItem, onChangeTotalItem, ...modalProps }) => {
  const { listProduct, pagination, itemPayment, itemService, modalType, isMotion } = pos
  const width = '80%'
  const modalOpts = {
    ...modalProps
  }
  let listProductLock = listProduct

  const listProps = {
    dataSource: modalInvoiceVisible ? listInvoice : listProductLock,
    loading: modalType === 'browseProductLock' || modalType === 'browseProductFree' ? loading : loading.effects['transferOut/getInvoiceDetailPurchase'],
    pagination: modalType === 'browseProductLock' || modalType === 'browseProductFree' ? pagination : null,
    tmpInvoiceList,
    searchText,
    location,
    item: modalType === 'modalPayment' ? itemPayment : {},
    itemService: modalType === 'modalService' ? itemService : {},
    isMotion,
    totalItem,
    onInvoiceHeader,
    onChange (e) {
      if (modalType === 'browseProductLock' || modalType === 'browseProductFree') {
        onChange(e)
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
  pos: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
  onChangeTotalItem: PropTypes.func.isRequired,
  DeleteItem: PropTypes.func.isRequired,
  onChooseItem: PropTypes.func.isRequired,
  totalItem: PropTypes.string
}

export default Browse
