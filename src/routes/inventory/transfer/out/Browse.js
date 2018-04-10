import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProductLock'
import ListInvoice from './ListInvoice'

const Browse = ({ modalInvoiceVisible, modalProductVisible, listInvoice, tmpInvoiceList, onInvoiceHeader, onChooseInvoice, location, pos, loading, DeleteItem, onChooseItem, totalItem, onChangeTotalItem, ...modalProps }) => {
  const { listProduct, itemPayment, itemService, modalType, isMotion } = pos
  const width = '80%'
  const modalOpts = {
    ...modalProps
  }
  let listProductLock = listProduct.filter(el => el.count > 0)
  const listProps = {
    dataSource: modalInvoiceVisible ? listInvoice : listProductLock,
    loading: loading.effects[(
      modalType === 'browseProductLock' || modalType === 'browseProductFree' ? 'pos/getProducts'
        : 'pos/queryMember'
    )],
    location,
    item: modalType === 'modalPayment' ? itemPayment : {},
    itemService: modalType === 'modalService' ? itemService : {},
    isMotion,
    totalItem,
    onInvoiceHeader,
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
