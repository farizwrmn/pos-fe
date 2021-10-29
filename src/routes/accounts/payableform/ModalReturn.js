import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListReturn from './ListReturn'

const Browse = ({
  listInvoice,
  visible,
  location,
  dispatch,
  loading,
  onChooseInvoice,
  onInvoiceHeader,
  modalType
}) => {
  const modalOpts = {
    visible,
    onCancel () {
      dispatch({ type: 'purchase/modalEditHide' })
      dispatch({ type: 'purchase/hideProductModal' })
      dispatch({
        type: 'returnPurchase/updateState',
        payload: {
          modalReturnVisible: false,
          listInvoice: []
        }
      })
    }
  }
  const listProps = {
    dataSource: listInvoice,
    listInvoice,
    loading: loading.effects['returnPurchase/getInvoice'],
    location,
    onInvoiceHeader (period) {
      onInvoiceHeader(period)
    },
    onChooseInvoice (item) {
      onChooseInvoice(item)
    }
  }

  return (
    <Modal {...modalOpts} width={'70%'} height="80%" footer={null}>
      {(modalType === 'browseReturn') && <ListReturn {...listProps} />}
    </Modal>
  )
}

Browse.propTypes = {
  location: PropTypes.isRequired,
  loading: PropTypes.isRequired,
  onChooseItemItem: PropTypes.func.isRequired,
  onRestoreVoid: PropTypes.func.isRequired,
  onChooseInvoice: PropTypes.func.isRequired,
  onInvoiceHeader: PropTypes.func
}

export default Browse
